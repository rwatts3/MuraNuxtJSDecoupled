import Link from 'next/link'
import Mura from 'mura.js'

const linkStyle = {
  marginRight: 15
}

import React from 'react'

export default class Header extends React.Component {

  createNav = () => {
    let nav = []

    // Outer loop to create parent
    for (let i = 0; i < this.props.primaryNavData.length; i++) {

      //Create the parent and add the children
      nav.push( <Link key={this.props.primaryNavData[i].contentid} href="/" as={'/' + this.props.primaryNavData[i].filename}>
				 						<a style={linkStyle}>{this.props.primaryNavData[i].title}</a>
			 					</Link>)
    }
    return nav
  }



	render() {

      var _data = this.props.primaryNavData;

      return(
        <div>
            {_data.map(function(object, i){
               return <Link key={object.contentid} href="/" as={'/' + object.filename}>
				 				 					<a style={linkStyle}>{object.menutitle}</a>
				 			 				</Link>;
             })}
        </div>
       );
    }

}
