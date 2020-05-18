import api from './api'

export default {
    index: (page) => {
        return api.get('setores', page)
    },

    store: (setor) => {
        return api.post('setores', setor)
    },

    update: (id, setor) => {
        return api.post(`setores/${id}`, setor)
    },

    show: (id) => {
        return api.get(`setores/${id}`)
    }
}