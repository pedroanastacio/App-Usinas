import AuthService from "../../src/services/auth"
import { setToken, removeToken, getUser } from '../../src/services/AuthStorage'

const user = JSON.parse(getUser())

const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

  
export const auth = {
    namespaced: true,
    state: initialState,

    actions: {
        async login({ commit }, userData) {
            try{
                
                const response = await AuthService.authenticate(userData)
                const user = {
                    "nome": response.data.nome,
                    "sobrenome": response.data.sobrenome,
                    "isAdmin": response.data.isAdmin,
                    "isSupplier": response.data.isSupplier,
                    "isActive": response.data.isActive,
                    "type": response.data.type,
                    "token": response.data.token,
                    "refreshToken": response.data.refreshToken
                }

                setToken(user)
                commit('loginSuccess', user)
                return Promise.resolve()

            }catch(err){
                commit('loginFailure')
                return Promise.reject(err)
            }
        },

        logout({ commit }) {
            removeToken()
            commit('logout')
        }
    },

    mutations: {
        loginSuccess(state, user) {
            state.status.loggedIn = true
            state.user = user
        },

        loginFailure(state) {
            state.status.loggedIn = false
            state.user = null
        },

        logout(state) {
            state.status.loggedIn = false
            state.user = null
        }
    }
}