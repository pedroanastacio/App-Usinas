import api from './api'

export default {
    authenticate: (user) => {
        return api.post('authenticate', user)
    },

    getUserId: () => {
        return api.get('getUserId')
    }
}