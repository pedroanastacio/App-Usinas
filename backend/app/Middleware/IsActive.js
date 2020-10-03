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
      response.user = await User.findByOrFail('username', username)
      
    if(!response.user.isActive)
      return response.status(401).json({ message: 'Usuário desativado'})

    await next()
    }
    catch(err){
      if(err.code == 'E_MISSING_DATABASE_ROW')
        return response.status(404).json({ message: 'Usuário não encontrado'})
      else{
        return response.status(500).json({ message: 'Ocorreu um erro interno'})
      }
       
    }
  }
}

module.exports = IsActive
