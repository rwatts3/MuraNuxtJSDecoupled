//import {withRouter} from 'next/router'
import Layout from '../components/MyLayout.js'
import Link from 'next/link'
import Mura from 'mura.js'

import React from 'react'

export default class extends React.Component {

	render() {
		return (
			<Layout {...this.props}>
				<script dangerouslySetInnerHTML={{__html: "window.queuedMuraCmds=[],window.queuedMuraPreInitCmds=[],window.mura=window.m=window.Mura=function(u){window.queuedMuraCmds.push(u)},window.Mura.preInit=function(u){window.queuedMuraPreInitCmds.push(u)};"}}></script>
				<h1>{this.props.content.title}</h1>
				<div dangerouslySetInnerHTML={{__html: this.props.content.body}}></div>
				<div className="mura-region-container" data-region="maincontent"></div>
				<div id="htmlqueues"></div>
			</Layout>
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
								body:'The content that you requested can not be found'
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

		return {
			content:content.getAll(),
			primaryNavData:primaryNavData
		}
	}

	getContent(){
		//This inflates the entity's object back into a Mura.Entity instance
		return Mura.getEntity('content').set(this.props.content)
	}

	contentDidChange(){
		const content=this.getContent()

		if(content.get('redirect')){
			location.href=content.get('redirect')
			return
		}

		//The setTimeout was used to prevent mysterious double processing of previous html in element
		setTimeout(
			()=>{
				Mura('#htmlqueues').html(content.get('htmlheadqueue') + content.get('htmlfootqueue'))
			}
		)

		// TODO: make this use a react component
		if(typeof Mura.Module.example == 'undefined'){
			Mura.Module.example=Mura.UI.extend(
			 {
				render:function(){
					this.context.myvar=this.context.myvar || 'Enter example variable in configurator';
					Mura(this.context.targetEl).html('<h3>' + this.context.myvar + '</h3>' )
					this.trigger('afterRender');
				}
			});
		}

		if(!content.get('isnew')){
			Mura('.mura-region-container').each(
			(region)=>{
					region=Mura(region);
					region.html(
						content.renderDisplayRegion(region.data('region'))
					)
				}
			)

			//Re-initialize Mura for browser with content node specific details
			//console.log(content.get('config'))
			Mura.init(content.get('config'))

			Mura.loader()
				.loadcss(Mura.rootpath + '/core/modules/v1/core_assets/css/mura.7.1.min.css')
				.loadcss(Mura.rootpath + '/core/modules/v1/core_assets/css/mura.7.1.skin.css');
		}
	}

	componentDidUpdate(){
		this.contentDidChange()
	}

	componentDidMount(){
		this.contentDidChange()
	}
}
