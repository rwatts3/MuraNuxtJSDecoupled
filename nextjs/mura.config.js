import Mura from 'mura.js'
import Example from './components/modules/Example'
import React from 'react'
import ReactDOM from 'react-dom'

//This module is also register with Mura via the ./static/mura.config.json
Mura.Module.example=Mura.UI.extend(
 {
	render:function(){
		ReactDOM.render(React.createElement(Example, this.context), this.context.targetEl	);
		this.trigger('afterRender');
	}
});
