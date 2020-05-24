'use strict'

const Consumo = use('App/Models/Consumo')
const Database = use('Database')
const Helpers = use('Helpers')
const csvtojson = require("csvtojson");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with consumos
 */
class ConsumoController {
  /**
   * Show a list of all consumos.
   * GET consumos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    return await Consumo.all()
  }
  /**
   * Render a form to be used for creating a new consumo.
   * GET consumos/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new consumo.
   * POST consumos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const user_id = auth.current.user.id
    
    const uploadedFile = request.file('file', {
      extnames: ['csv']
    })
    
    if(uploadedFile == null)
      return response.status(400).json({ message: 'É obrigatório selecionar um arquivo para importar' })
      
    const fileName = `${Date.now()}_${uploadedFile.clientName}`
    const dir = "uploads/"

    await uploadedFile.move(Helpers.tmpPath(dir), {
      name: fileName,
      overwrite: true
    })
  
    if (!uploadedFile.moved()) {
      return uploadedFile.error()
    }

    const jsonArray = await csvtojson().fromFile('tmp/' + dir + fileName);

    if(!jsonArray[0].setor_id && !jsonArray[0].data && !jsonArray[0].litros){
      return response.status(400).json({ message: 'Não foi possível importar arquivo. Conteúdo inválido'})
    }

    let setoresId = []
    jsonArray.forEach(row => {
      setoresId.push(parseInt(row.setor_id))
      row.user_id = user_id
    })
    
    
    try{ 
      const setoresDB = await Database.select('id').from('setores')
      let newSetoresDB = []
      setoresDB.forEach(setor => {
        newSetoresDB.push(setor.id)
      })
      const csvValid = newSetoresDB.some(id => setoresId.indexOf(id) > 0)

      if(!csvValid)
        return response.status(400).json({ message: 'Não foi possível importar arquivo. Conteúdo inválido', description: 'invalid id'})
     
      await Consumo.createMany(jsonArray)
      return response.status(200).json({ message: 'Importação concluída com sucesso'})
    }
    catch(e){
      console.log(e)
      return response.status(500).json({ message: 'Importação falhou'})
    }
  }

  /**
   * Display a single consumo.
   * GET consumos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing consumo.
   * GET consumos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update consumo details.
   * PUT or PATCH consumos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a consumo with id.
   * DELETE consumos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

  async totalAllTime ({ response }) {
    try {
      const total = await Database
      .from('consumos')
      .sum('litros')
    
      return response.status(200).json({total: total[0].sum})
    }
    catch(err) {
      return response.status(500).json({ error: err })
    }
    
  }

  async totalDay ({ request, response }) {
    const params = request.all()

    try {
      const total = await Database
      .from('consumos')
      .whereRaw(`data::date = '${params.date}'`)
      .sum('litros')

      return response.status(200).json({total: total[0].sum})  
    }
    catch(err) {
      return response.status(500).json({ error: err })
    }
    
  }

  async totalPeriod ({ request, response }) {
    const params = request.all()

    try {
      const total = await Database
        .from('consumos')
        .whereRaw(`data::date between '${params.initialDate}' and '${params.endDate}'`)
        .sum('litros')

      const dates = await Database
        .table('consumos')
        .distinct('data')
        .whereRaw(`data::date between '${params.initialDate}' and '${params.endDate}'`)
      
      const numDates = await Database
        .from('consumos')
        .countDistinct('data')
        .whereRaw(`data::date between '${params.initialDate}' and '${params.endDate}'`)
      
      return response.status(200).json({ total: total[0].sum, dates: dates, numDates: numDates[0].count })  
    }
    catch(err) {
      return response.status(500).json({ error: err })
    }    
    
  }

}

module.exports = ConsumoController
