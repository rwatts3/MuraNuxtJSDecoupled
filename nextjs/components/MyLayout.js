import Header from './Header'

const layoutStyle = {}

const Layout = (props) => (
	<div style={layoutStyle}>
		<Header {...props}/>
		{props.children}
	</div>
)

export default Layout
