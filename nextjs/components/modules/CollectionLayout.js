import Mura from 'mura.js'
import React from 'react'
import ReactDOM from 'react-dom'
import Link from 'next/link'

export default class CollectionLayout extends React.Component {

	render() {
		let rendered=''
		let instanceid=this.props.instanceid;
		if(this.state.collection){
			rendered=(
				<div>
				<ul>
				{this.state.collection.get('items').map(function(item, i){
					return <li><Link key={item.get('contentid').toString()} href="/" as={'/' + item.get('filename')}>
					<a>{item.get('menutitle')}</a>
					</Link></li>;
				})}
			</ul>
			{(() => {
				if(this.state.collection.has('first')){
					return <button onClick={()=>this.goToPage('first')}>First</button>
				}
      })()}
			{(() => {
				if(this.state.collection.has('previous')){
					return <button onClick={()=>this.goToPage('previous')}>Previous</button>
				}
      })()}
			{(() => {
				if(this.state.collection.has('next')){
					return <button onClick={()=>this.goToPage('next')}>Next</button>
				}
			})()}
			{(() => {
				if(this.state.collection.has('last')){
					return <button onClick={()=>this.goToPage('last')}>Last</button>
				}
			})()}
			</div>
		);
		} else {
			rendered='';
		}
		return (
			rendered
		);
	}

	constructor(props) {
    super(props);
    this.state = {
	    collection: props.collection
	  };
  }

	goToPage(link){
		link=link || 'missing';
		if(this.state.collection && this.state.collection.has(link)){
			this.state.collection.get(link).then((collection)=>{
				this.setState({collection:collection});
			})
		}
	}

}
