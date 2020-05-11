import api from './api'

export default {
    index: () => {
        return api.get('users')
    }
}