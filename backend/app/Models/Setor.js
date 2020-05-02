'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Setor extends Model {
    static get table () {
        return 'setores'
    }

    consumo () {
        return this.hasMany('App/Models/Consumo')
    }
}

module.exports = Setor
