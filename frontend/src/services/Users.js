import api from './api'

export default {
    index: (paginationParams) => {
        return api.get('users', { params: { 
            page: paginationParams.page,
            itemsPerPage: paginationParams.itemsPerPage,
            orderBy: paginationParams.orderBy,
            sortDesc: paginationParams.sortDesc
        }}) 
    },

    store: (user) => {
        return api.post('users', user)
    },

    update: (id, user) => {
        return api.post(`users/${id}`, user)
    },

    show: (id) => {
        return api.get(`users/${id}`)
    }
}