'use strict'

class StoreUser {
  get rules () {
    return {
      nome: 'required|max:150',
      sobrenome: 'required|max:150',
      username: 'required|max:80',
      password: 'required|min:6|max:60',
      isAdmin: 'required',
      isSupplier: 'required',
      isActive: 'required'
    }
  }

  get messages () {
    return {
      'nome.required': 'Nome é obrigatório',
      'nome.max': 'Nome excedeu o limite de caracteres',

      'sobrenome.required': 'Sobrenome é obrigatório',
      'sobrenome.max': 'Sobrenome excedeu o limite de caracteres',

      'username.required': 'Usuário é obrigatório',
      'username.max': 'Usuário excedeu o limite de caracteres',

      'password.required': 'Senha é obrigatória',
      'password.max': 'Senha excedeu o limite de caracteres',
      'password.min': 'Senha deve ter pelo menos 6 caracteres',

      'isAdmin.required': 'Administrador é obrigatório',
      'isSupplier.required': 'Fornecedor é obrigatório',
      'isActive.required': 'Ativo/Inativo é obrigatório',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).json(errorMessages)
  }
}

module.exports = StoreUser
