'use strict'

const User = use('App/Models/User')

class AuthController {
    async register({ request }){
        const data = request.only(['username', 'email', 'password', 'nome', 'sobrenome', 'isAdmin', 'isSupplier'])
        
        const user = await User.create(data)

        return user
    }

    async authenticate({ request, auth }){
       const { username, password } = request.all()

       const token = auth.attempt(username, password)

       return token
    }

    async update ({  }) {

    }

    async destroy ({  }) {

    }

    async index ({  }) {

    }
}

module.exports = AuthController
