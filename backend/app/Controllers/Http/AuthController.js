'use strict'

class AuthController {
   
    async authenticate({ request, response, auth }){
        const { username, password } = request.all()
        
        try{
            const user = response.user
            
            const token = await auth.attempt(username, password, { nome: user.nome,
                                                                  sobrenome: user.sobrenome, 
                                                                  isAdmin: user.isAdmin,
                                                                  isSupplier: user.isSupplier,
                                                                  isActive: user.isActive })
            
            Object.assign(user, token)
            
            return user            

        }catch(err){
            if(err.code == 'E_MISSING_DATABASE_ROW')
                return response.status(401).json({ message: 'Usuário não encontrado', error: err})
            else if(err.code == 'E_PASSWORD_MISMATCH')
                return response.status(401).json({ message: 'Senha incorreta', error: err})
            else
                return response.status(500).json({ message: 'Ocorreu um erro interno', error: err})
        }
    }


    async getUserId({ auth, response }) {
        try {
            const { id } = await auth.getUser()
            return id
        }
        catch(err) {
            response.status(401).json({ message: 'Você não está logado', name:'UserNotLoggedIn', error: err})
        }
    }

   
   
}

module.exports = AuthController
