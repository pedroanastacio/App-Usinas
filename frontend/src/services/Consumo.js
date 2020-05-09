import api from './api'

export default {
    store: (file) => {
        return api.post('consumo', file, 
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
    }
}