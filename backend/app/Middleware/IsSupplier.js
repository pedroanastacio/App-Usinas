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
    const user = auth.current.user

    if(!user.isSupplier)
      return response.status(403).json({ message: 'Você precisa ser um fornecedor'})

    await next()
  }
}

module.exports = IsSupplier
