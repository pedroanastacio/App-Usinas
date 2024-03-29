import api from './api'

export default {
    store: (file) => {
        return api.post('consumo', file, 
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
    },

    generalAllTime: () => {
        return api.get('consumo/allTime')
    },

    generalPerPeriod: (params) => {
        return api.get('consumo/perPeriod', { params: {
            initialDate: params.initialDate,
            endDate: params.endDate
        }})
    },

    generalPerYear: (params) => {
        return api.get('consumo/perYear', { params: {
            year: params.year
        }})
    },

    generalPerMonth: (params) => {
        return api.get('consumo/PerMonth', { params: {
            month: params.month,
            year: params.year
        }})
    },

    generalPerDay: (params) => {
        return api.get('consumo/PerDay', { params: {
            date: params.date
        }})
    },

    sectorAllTime: (slug) => {
        return api.get(`consumo/sectorAllTime/${slug}`)
    },

    sectorPerPeriod: (params) => {
        return api.get(`consumo/sectorPerPeriod/${params.slug}`, { params: {
            initialDate: params.initialDate,
            endDate: params.endDate
        }})
    },

    sectorPerYear: (params) => {
        return api.get(`consumo/sectorPerYear/${params.slug}`, { params: {
            year: params.year
        }})
    },

    sectorPerMonth: (params) => {
        return api.get(`consumo/sectorPerMonth/${params.slug}`, { params: {
            year: params.year,
            month: params.month
        }})
    },

    sectorPerDay: (params) => {
        return api.get(`consumo/sectorPerDay/${params.slug}`, { params: {
            date: params.date
        }})
    },
}