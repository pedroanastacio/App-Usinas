'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Setor extends Model {
    static get table () {
        return 'setores'
    }

    static boot () {
        super.boot()
    
        this.addTrait('@provider:Lucid/Slugify', {
          fields: { slug: 'nome' },
          strategy: 'dbIncrement',
        })
      }

    consumo () {
        return this.hasMany('App/Models/Consumo')
    }
}

module.exports = Setor
