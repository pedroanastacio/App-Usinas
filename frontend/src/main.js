import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from "./router"
import Vuelidate from 'vuelidate'
import store from '../store/index'
import JsonExcel from 'vue-json-excel'

Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.component('downloadExcel', JsonExcel)


new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
