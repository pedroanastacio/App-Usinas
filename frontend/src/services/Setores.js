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

    list: (params) => {
        return api.get('listSetores', {params: {
            page: params.page,
            setorStatus: params.setorStatus
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

    searchSetores: (searchParams) => {
        return api.get('setores/searchSetores', { params: {
            page: searchParams.page,
            setorStatus: searchParams.setorStatus,
            term: searchParams.searchText,
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
    },

    getName: (slug) => {
        return api.get(`setores/getName/${slug}`)
    }
}