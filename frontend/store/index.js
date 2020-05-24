import Vue from 'vue'
import Vuex from 'vuex'

import { auth } from './modules/AuthModule'
import { users } from './modules/UsersModule'
import { setores } from './modules/SetoresModule'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
       auth,
       users,
       setores,
    },
})