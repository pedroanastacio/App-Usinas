'use strict'

const User = use('App/Models/User')

class AuthController {
   
    async authenticate({ request, response, auth }){
        const { username, password } = request.all()
        
        try{
            const user = response.user
            
            const token = await auth.attempt(username, password)
            
            Object.assign(user, token)
            
            return user

            /*const user = await User.find(1)

            console.log(user)*/

        }catch(err){
            if(err.code == 'E_MISSING_DATABASE_ROW')
                return response.status(401).json({ message: 'Usuário não existe'})
            else if(err.code == 'E_PASSWORD_MISMATCH')
                return response.status(401).json({ message: 'Senha incorreta'})
            else
                return response.status(500).json({ message: 'Ocorreu um erro interno'})
        }
    }


    async getUserId({ auth, response }) {
        try {
            const { id } = await auth.getUser()
            return id
        }
        catch(err) {
            response.status(401).json({ message: 'Você não está logado'})
        }
    }

   
   
}

module.exports = AuthController
