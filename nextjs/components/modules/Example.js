import Mura from 'mura.js'
import React from 'react'
import ReactDOM from 'react-dom'

export default class Example extends React.Component {
	render() {
		return(
			<div>
			<h3>{this.props.myvar || 'Enter example variable in configurator'}</h3>
			</div>
		)
	}

}
