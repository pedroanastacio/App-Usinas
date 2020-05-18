'use strict'

const User = use('App/Models/User')
const Database = use('Database')

class UserController {
    
    async store({ request }){
        const data = request.only(['username', 'email', 'password', 'nome', 'sobrenome', 'isAdmin', 'isSupplier', 'isActive'])
        
        const user = await User.create(data)

        return user
    }

    async update ({ params, request }) {
        const user = await User.findOrFail(params.id)

        const data = request.only(['username', 'email', 'password', 'nome', 'sobrenome', 'isAdmin', 'isSupplier', 'isActive'])

        user.merge(data)

        await user.save()

        return user
    }

    async index ({ request, response }) {
        //return await User.all()
        const pagination = request.get()
        
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
                .paginate(pagination.page, pagination.itemsPerPage)

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
