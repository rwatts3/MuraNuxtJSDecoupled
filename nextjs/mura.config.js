import Mura from 'mura.js'
import Example from './components/modules/Example'
import CollectionLayout from './components/modules/CollectionLayout'

require('mura.js/src/core/ui.reactserver');

//This module is also registered with Mura via the ./static/mura.config.json
Mura.Module.Example=Mura.UI.ReactServer.extend({
	component:Example
});

Mura.Module.NextJSCollectionLayout=Mura.UI.ReactServer.extend({
	component:CollectionLayout
});
