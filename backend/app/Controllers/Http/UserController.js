'use strict'

const User = use('App/Models/User')

class UserController {
    
    async store({ request }){
        const data = request.only(['username', 'email', 'password', 'nome', 'sobrenome', 'isAdmin', 'isSupplier'])
        
        const user = await User.create(data)

        return user
    }

    async update ({ params, request }) {
        const user = await User.findOrFail(params.id)

        const data = request.only(['username', 'email', 'password', 'nome', 'sobrenome', 'isAdmin', 'isSupplier'])

        user.merge(data)

        await user.save()

        return user
    }

    async destroy ({ params }) {
        const user = await User.findOrFail(params.id)

        await user.delete()
    }

    async index () {
        return await User.all()
    }

    async show ({ params }) {
        const user = await User.findOrFail(params.id)

        return user
    }
}

module.exports = UserController
