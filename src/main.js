// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import router from './router'

// import Vuelidate from 'vuelidate'

// import Bootstrap vue component and css
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// import FontAwesome components
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'
import { faPlus, faPlusCircle, faMinusCircle, faQuestionCircle, faExclamationCircle, faTrash, faPlayCircle, faTrashRestore, faBookOpen, faPlusSquare,
  faUsers, faBars, faMale } from '@fortawesome/free-solid-svg-icons'

// import and connect to the concept server-side with websocket thanks to Vue Socket IO
import VueSocketIO from 'vue-socket.io'

// Vue.use(Vuelidate)
Vue.use(BootstrapVue)
Vue.use(VueSocketIO, process.env.SOCKET_IO_URL)


library.add(faPlus, faPlusCircle, faMinusCircle, faQuestionCircle, faExclamationCircle, faTrash, faPlayCircle, faTrashRestore, faBookOpen, faPlusSquare,
  faUsers, faBars, faMale)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // router,
  components: { App },
  template: '<App/>'
})
