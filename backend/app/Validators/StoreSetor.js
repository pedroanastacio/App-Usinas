'use strict'

class StoreSetor {
  get rules () {
    return {
      nome: 'required|max:150'
    }
  }

  get messages () {
    return {
      'nome.required': 'Nome é obrigatório',
      'nome.max': 'Nome excedeu o limite de caracteres',
      
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).json(errorMessages)
  }
}

module.exports = StoreSetor
