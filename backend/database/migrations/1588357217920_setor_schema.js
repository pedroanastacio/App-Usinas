'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SetorSchema extends Schema {
  up () {
    this.create('setores', (table) => {
      table.increments()
      table.string('nome', 255).unique().notNullable()
      table.string('slug', 300).notNullable()
      table.boolean('isActive').defaultTo(true).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('setores')
  }
}

module.exports = SetorSchema
