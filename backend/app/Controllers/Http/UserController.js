'use strict'

const User = use('App/Models/User')
const Database = use('Database')


class UserController {
    
    async store({ request, response }){
        const data = request.only(['username', 'password', 'nome', 'sobrenome', 'isAdmin', 'isSupplier', 'isActive'])
        
        try{
            const user = await User.create(data)
            return user
        }
        catch(err) {
            if(err.constraint == 'users_username_unique')
                return response.status(409).json({ message: 'Usuário já existe' })
            else
                return response.status(500).json({ message: 'Ocorreu um erro interno'})    
        }   
        
    }

    async update ({ params, request }) {
        const user = await User.findOrFail(params.id)

        const data = request.all()

        user.merge(data)

        await user.save()
        
        return user
    }

    async index ({ request, response }) {
        const pagination = request.get()

        let page = pagination.page || 1
        let itemsPerPage = pagination.itemsPerPage || 10
        
        if(typeof pagination.orderBy === 'undefined' || pagination.orderBy == 'null')
            pagination.orderBy = 'nome'
        
        if(typeof pagination.sortDesc === 'undefined' || pagination.sortDesc == 'null' || pagination.sortDesc == 'false')
           pagination.sortDesc = 'asc'   
        else 
           pagination.sortDesc = 'desc'    
        
        try{
            const users = await Database
                .from('users')
                .orderBy(pagination.orderBy, pagination.sortDesc)
                .paginate(page, itemsPerPage)

            return response.status(200).json(users)
        }
        catch(err){
            return response.status(500).json({ message: 'Ocorreu um erro interno' })
        }    
    }

    async search ({ request, response }) {
        const search = request.get()

        let page = search.page || 1
        let itemsPerPage = search.itemsPerPage || 10
        
        if(typeof search.orderBy === 'undefined' || search.orderBy == 'null')
            search.orderBy = 'nome'
        
        if(typeof search.sortDesc === 'undefined' || search.sortDesc == 'null' || search.sortDesc == 'false')
           search.sortDesc = 'asc'   
        else 
           search.sortDesc = 'desc'  
           
        try{
            const users = await Database
                .from('users')
                .where(search.column, 'ILIKE', '%'+search.term+'%')
                .orderBy(search.orderBy, search.sortDesc)
                .paginate(page, itemsPerPage)

            return response.status(200).json(users)
        }
        catch(err){
            return response.status(500).json({ message: 'Ocorreu um erro interno' })
        }  
    }


    async show ({ params }) {
        const user = await User.findOrFail(params.id)
       
        return user
    }
}

module.exports = UserController
