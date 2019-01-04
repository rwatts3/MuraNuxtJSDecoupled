import Mura from 'mura.js'
import Example from './components/modules/Example'

require('mura.js/src/core/ui.reactserver')

//This module is also registered with Mura via the ./static/mura.config.json
Mura.Module.example=Mura.UI.ReactServer.extend({
	component:Example
});
