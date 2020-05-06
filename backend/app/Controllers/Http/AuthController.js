'use strict'

class AuthController {
   
    async authenticate({ request, auth }){
        const { username, password } = request.all()

        const token = auth.attempt(username, password)

        return token
    }

   
   
}

module.exports = AuthController
