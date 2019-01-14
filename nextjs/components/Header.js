import Link from 'next/link'
import Mura from 'mura.js'
import React from 'react'

const linkStyle = {
	marginRight: 15
}

export default class Header extends React.Component {

	render() {

		var data = this.props.primaryNavData;
		return(
			<div>
				{data.map((object, i)=>{
					return <Link key={object.contentid} href="/" as={'/' + object.filename}>
					<a style={linkStyle}>{object.menutitle}</a>
					</Link>;
				})}
			</div>
		);
	}

}
