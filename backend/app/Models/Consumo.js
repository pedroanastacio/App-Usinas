'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Consumo extends Model {
    static get table () {
        return 'consumo'
    }

    setores () {
        return this.belongsTo('App/Models/Setor')
    }

    users () {
        return this.hasOne('App/Models/User')
    }
}

module.exports = Consumo
