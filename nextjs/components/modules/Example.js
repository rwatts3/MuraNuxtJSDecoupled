import Mura from 'mura.js'
import React from 'react'

export default class Example extends React.Component {

	render() {
		this.props.myvar=this.props.myvar || 'Enter example variable in configurator';
    return(
      <div>
          <h3>{this.props.myvar}</h3>
      </div>
     )
  }
}
