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

    index: (searchParams) => {
        return api.get('setores', { params: {
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

    update: (slug, setor) => {
        return api.put(`setores/${slug}`, setor)
    },

    show: (slug) => {
        return api.get(`setores/${slug}`)
    }
}