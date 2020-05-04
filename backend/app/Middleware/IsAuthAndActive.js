'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class IsAuthAndActive {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response, auth }, next) {
    const user = auth.current.user
        
    if(!user.isActive)
      return response.status(403).json({ Error: 'Usuário desativado!'})

    await next()
  }
}

module.exports = IsAuthAndActive
