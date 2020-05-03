'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class IsSupplier {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response, auth }, next) {
    const user = await auth.getUser()

    if(!user.isSupplier)
      return response.status(403).json({ Error: 'Usuário precisa ser um fornecedor!'})

    await next()
  }
}

module.exports = IsSupplier
