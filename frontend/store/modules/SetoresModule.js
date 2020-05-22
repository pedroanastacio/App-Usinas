import SetoresService from '../../src/services/Setores'

export const setores = {
    namespaced: true,
    state: {
        pagination: {
            page: '',
            rowsPerPage: '',
            totalItems: '',
        },
        setoresData: [],
    },

    actions: {
        async getSetores({ commit }, paginationParams) { 
            try{
                const response = await SetoresService.index(paginationParams)
                commit('getSetoresSuccess', response.data)
                return Promise.resolve()
            }
            catch(err){
                return Promise.reject(err)
            }
        },

        async searchSetores({ commit }, searchParams) {
            try{
                const response = await SetoresService.search(searchParams)
                commit('getSetoresSuccess', response.data)
                return Promise.resolve()
            }
            catch(err){
                return Promise.reject(err)
            }
        }
    },

    mutations: {
        getSetoresSuccess(state, response) {
            state.pagination = {
                totalItems: parseInt(response.total),
                rowsPerPage: response.perPage,
                page: response.page,
                lastPage: response.lastPage,
            }
            state.setoresData = response.data
        },
    }
}