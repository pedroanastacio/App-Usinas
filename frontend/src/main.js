import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from "./router"
import Vuelidate from 'vuelidate'
import store from '../store/index'

Vue.config.productionTip = false
Vue.use(Vuelidate)

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
