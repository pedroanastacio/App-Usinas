'use strict'

const User = use('App/Models/User');

class AuthController {
   
    async authenticate({ request, response, auth }){
        const { username, password } = request.all()

        try{
            const token = await auth.attempt(username, password)

            const user = await User.findByOrFail('username', username)

            Object.assign(user, token)

            return response.status(200).json(user)

        }catch(err){
            return response.status(401).json({ message: 'Usuário não existe'})
        }
        
        
    }

   
   
}

module.exports = AuthController
