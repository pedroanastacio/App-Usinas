import Auth from "../../src/services/Auth"
import jwtDecode from 'jwt-decode'
import { setToken, removeToken, getToken } from '../../src/services/AuthStorage'

let user = null
const token = getToken()

if(token != null) {
    const decoded = jwtDecode(token)

    user = {
        "nome": decoded.data.nome,
        "sobrenome": decoded.data.sobrenome,
        "isAdmin": decoded.data.isAdmin,
        "isSupplier": decoded.data.isSupplier,
        "isActive": decoded.data.isActive
    }
}

const initialState = user
  ? { user }
  : { user: null };

  
export const auth = {
    namespaced: true,
    state: initialState,

    actions: {
        async login({ commit }, userData) {
            try{
                const response = await Auth.authenticate(userData)
                const user = {
                    "nome": response.data.nome,
                    "sobrenome": response.data.sobrenome,
                    "isAdmin": response.data.isAdmin,
                    "isSupplier": response.data.isSupplier,
                    "isActive": response.data.isActive
                    /*"type": response.data.type,
                    "token": response.data.token,
                    "refreshToken": response.data.refreshToken*/
                }

                setToken(response.data.token)
                commit('loginSuccess', user)
                return Promise.resolve()

            }catch(err){
                commit('logout')
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
            state.user = user
        },

        logout(state) {
            state.user = null
        }
    }
}