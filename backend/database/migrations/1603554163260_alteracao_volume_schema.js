'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlteracaoVolumeSchema extends Schema {
  up () {
    this.table('consumos', (table) => {
      this.raw(`ALTER TABLE consumos 
      ALTER COLUMN litros TYPE DECIMAL(9,3);`
      )

      this.raw(`ALTER TABLE consumos 
        RENAME litros TO volume;`
      )        
    })
  }

  down () {
    this.table('consumos', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AlteracaoVolumeSchema
