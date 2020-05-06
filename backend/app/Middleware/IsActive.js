'use strict'

const User = use('App/Models/User')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class IsActive {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {
    const { username } = request.all()

    try {
    const user = await User.findByOrFail('username', username)

    if(!user.isActive)
      return response.status(401).json({ Error: 'Usuário desativado'})

    await next()
    }
    catch(err){
      if(err.code == 'E_MISSING_DATABASE_ROW')
        return response.status(401).json({ Error: 'Usuário não existe'})
      else if(err.code == 'E_PASSWORD_MISMATCH')
        return response.status(401).json({ Error: 'Senha incorreta'})
      else{
        return response.status(500).json({ Error: 'Ocorreu um erro interno'})
      }
       
    }
  }
}

module.exports = IsActive
