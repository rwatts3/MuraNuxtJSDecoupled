//import {withRouter} from 'next/router'
import Layout from '../components/MyLayout.js'
import Link from 'next/link'
import Mura from 'mura.js'
import React from 'react'
import ReactDOM from 'react-dom'

require('../mura.config')

export default class extends React.Component {

	render() {
		var template = '';

		if(this.props.content.contentid){
			template=<Layout {...this.props}>
				<script dangerouslySetInnerHTML={{__html: "window.queuedMuraCmds=[],window.queuedMuraPreInitCmds=[],window.mura=window.m=window.Mura=function(u){window.queuedMuraCmds.push(u)},window.Mura.preInit=function(u){window.queuedMuraPreInitCmds.push(u)};"}}></script>
				<h1>{this.props.content.title}</h1>
				<div dangerouslySetInnerHTML={{__html: this.props.content.body}}></div>
			<div dangerouslySetInnerHTML={{__html: this.props.region.maincontent}}></div>
				<div id="htmlqueues"></div>
			</Layout>
		}

		return (
			<div>
			{template}
			</div>
		)
	}

  static async getInitialProps(context) {
		//Initialize Mura to make api call

		Mura.init({
			rootpath:"http://localhost:8888",
			siteid:"default",
			processMarkup:false,
			response:context.res,
			request:context.req
		})

		//Don't rely on ready event for when to fire
		Mura.holdReady(true);

		//Cleanup React based Mura modules
		if(typeof document != 'undefined'){
			Mura('.mura-object-content').each(function(){
				//try{
					ReactDOM.unmountComponentAtNode(this);
				//} catch(e){}
			})
		}

		async function renderContent(context){
			let query={}
			if(context.browser){
				query=Mura.getQueryStringParams()
			} else if (context.query) {
				query=context.query
			}
			return Mura.renderFilename(context.asPath.split("?")[0],query).then((rendered)=>{
				return rendered
			},(rendered)=>{
				if(!rendered){
					return Mura
						.getEntity('Content')
						.set({
								title:'404',
								menutitle:'404',
								body:'The content that you requested can not be found',
								contentid: Mura.createUUID(),
								isnew:1,
								siteid: Mura.siteid,
								type: 'Page',
								subtype: 'Default',
								contentid: Mura.createUUID(),
								contenthistid: Mura.createUUID(),
								filename:"404"
							})
				} else {
					return rendered
				}

			})
		}

		async function getPrimaryNavData(){
			return Mura.getFeed('content')
				.where()
				.prop('parentid').isEQ('00000000000000000000000000000000001')
				.sort('orderno')
				.getQuery()
				.then(collection=>{
					let tempArray=collection.getAll().items;
					tempArray.unshift({url:"/",menutitle:"Home",title:"Home",filename:"",contentid:"00000000000000000000000000000000001"});
					return tempArray;
				});
		}

		const content=await renderContent(context);
		const primaryNavData=await getPrimaryNavData()
		const regionData={};

		return {
			content:content.getAll(),
			primaryNavData:primaryNavData,
			region:{
				maincontent:content.renderDisplayRegion('maincontent')
			}
		}
	}

	getContent(){
		//This inflates the entity's object back into a Mura.Entity instance
		return Mura.getEntity('content').set(this.props.content)
	}

	contentDidChange(prevProps){

		const content=Mura.getEntity('content').set(this.props.content)

		if(content.get('redirect')){
			location.href=content.get('redirect')
			return
		}

		//The setTimeout was used to prevent mysterious double processing of previous html in element
		setTimeout(
			()=>{
				Mura('#htmlqueues').html(content.get('htmlheadqueue') + content.get('htmlfootqueue'))
			},
			100
		)

		if(content.get('config')){

			//Re-initialize Mura for browser with content node specific details
			//console.log(content.get('config'))

			Mura.init(Mura.extend({queueObjects:false},content.get('config')))

			Mura.holdReady(false);

			Mura.loader()
				.loadcss(Mura.rootpath + '/core/modules/v1/core_assets/css/mura.7.1.min.css')
				.loadcss(Mura.rootpath + '/core/modules/v1/core_assets/css/mura.7.1.skin.css');
		}
	}

	componentDidUpdate(prevProps){
		this.contentDidChange(prevProps)
	}

	componentDidMount(){
		this.contentDidChange()
	}
}
