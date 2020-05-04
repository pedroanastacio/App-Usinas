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

    const user = await User.findByOrFail('username', username)

    if(!user.isActive)
      return response.status(401).json({ Error: 'Usuário desativado!'})

    await next()
  }
}

module.exports = IsActive
