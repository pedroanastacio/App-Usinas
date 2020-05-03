'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class AccessControl {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response, auth }, next) {
    const user = await auth.getUser()

    if(!user.isAdmin)
      return response.status(403).json({ Error: 'Usuário precisa ser um administrador!'})
 
    await next()
  }
}

module.exports = AccessControl
