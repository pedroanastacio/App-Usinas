import UsersService from '../../src/services/Users'

export const users = {
    namespaced: true,
    state: {
        pagination: {
            page: '',
            rowsPerPage: '',
            totalItems: '',
        },
        usersData: [],
        
    },

    actions: {
        async getUsers({ commit }, paginationParams) { 
            try{
                const response = await UsersService.index(paginationParams)
                commit('getUsersSuccess', response.data)
                return Promise.resolve()
            }
            catch(err){
                return Promise.reject(err)
            }
        },

        
    },

    mutations: {
        getUsersSuccess(state, response) {
            state.pagination = {
                totalItems: parseInt(response.total),
                rowsPerPage: response.perPage,
                page: response.page,
                lastPage: response.lastPage,
            }
            state.usersData = response.data
            
        },

       
    }
}

