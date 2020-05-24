import api from './api'

export default {
    index: (paginationParams) => {
        return api.get('setores', { params: {
            page: paginationParams.page,
            itemsPerPage: paginationParams.itemsPerPage,
            orderBy: paginationParams.orderBy,
            sortDesc: paginationParams.sortDesc
        }})
    },

    search: (searchParams) => {
        return api.get('setores/search', { params: {
            page: searchParams.page,
            itemsPerPage: searchParams.itemsPerPage,
            orderBy: searchParams.orderBy,
            sortDesc: searchParams.sortDesc,
            term: searchParams.searchText
        }})
    },

    store: (setor) => {
        return api.post('setores', setor)
    },

    update: (id, setor) => {
        return api.put(`setores/${id}`, setor)
    },

    show: (id) => {
        return api.get(`setores/${id}`)
    }
}