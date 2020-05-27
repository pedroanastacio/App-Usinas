'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('nome', 150).notNullable()
      table.string('sobrenome', 150).notNullable()
      table.boolean('isAdmin').defaultTo(false).notNullable()
      table.boolean('isSupplier').defaultTo(false).notNullable()
      table.boolean('isActive').defaultTo(true).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
