'use strict'

class Auth {
  get rules () {
    return {
      username: 'required|max:80',
      password: 'required|min:6|max:60'
    }
  }

  get messages () {
    return {
      'username.required': 'Usuário é obrigatório',
      'username.max': 'Usuário excedeu o limite de caracteres',
      'password.required': 'Senha é obrigatória',
      'password.max': 'Senha excedeu o limite de caracteres',
      'password.min': 'Senha deve ter pelo menos 6 caracteres'
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).json(errorMessages)
  }
}

module.exports = Auth
