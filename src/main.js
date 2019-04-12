// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
// create Vuex store
import store from './store'
import FirebaseAuthPlugin from './FirebaseAuthPlugin'
import App from './App'
import router from './router'
import 'babel-polyfill'

// import Bootstrap vue component and css
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// import Bootstrap Toast plugin
import VueBootstrapToasts from 'vue-bootstrap-toasts'

// import FontAwesome components
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'
import { faPlus, faPlusCircle, faPlusSquare, faMinusCircle, faQuestion, faQuestionCircle, faExclamationCircle, faTrash, 
	faTrashRestore, faBookOpen, faPlayCircle, faUsers, faBars, faMale, faUserCircle, faPuzzlePiece, faChessBoard, 
	faClock, faExternalLinkAlt, faLocationArrow} from '@fortawesome/free-solid-svg-icons'

// import and connect to the concept server-side with websocket thanks to Vue Socket IO
import VueSocketio from 'vue-socket.io-extended'
import $socket from './websocket-instance'

Vue.use(Vuex)
Vue.use(VueSocketio, $socket, { store })

Vue.use(BootstrapVue)
Vue.use(VueBootstrapToasts)

Vue.use(FirebaseAuthPlugin)

// font-awsome need to add each icon to the library
library.add(faPlus, faPlusCircle, faMinusCircle, faQuestionCircle, faExclamationCircle, faTrash, faPlayCircle, faTrashRestore, faBookOpen, faPlusSquare,
  faUsers, faBars, faMale, faUserCircle, faPuzzlePiece, faQuestion, faChessBoard, faClock, faExternalLinkAlt, faLocationArrow)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
