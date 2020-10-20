'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ConsumoSchema extends Schema {
  up () {
    this.create('consumos', (table) => {
      table.bigIncrements()
      table
        .integer('setor_id')
        .unsigned()
        .references('id')
        .inTable('setores')
        .onUpdate('CASCADE')
        .notNullable()
      table.datetime('data').notNullable()
      table.decimal('litros', 9, 2).notNullable() 
      table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')   
      table.timestamps()
    })
  }

  down () {
    this.drop('consumos')
  }
}

module.exports = ConsumoSchema
