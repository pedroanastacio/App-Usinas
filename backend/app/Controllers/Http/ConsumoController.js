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
    catch(err){
      return response.status(500).json({ message: 'Importação falhou', error: err})
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

  async consumeAllTime({ response }) {
    try{
      const total = await this.totalConsumeAllTime()
      const consume = await this.generalConsumeAllTime()

      return response.status(200).json({ total: total, consumos: consume.rows })
    }
    catch(err) {
      return response.status(500).json({ error: err })
    }
  }

  async totalConsumeAllTime () {
    try {
      const total = await Database
      .from('consumos')
      .sum('litros')
    
      return Promise.resolve(total[0].sum)
    }
    catch(err) {
      return Promise.reject(err)
    }
  }

  async generalConsumeAllTime() {
    try {
      const consume = await Database
        .raw(`SELECT sum(c.litros) as litros, s.nome as setor
          FROM consumos as c
          INNER JOIN setores as s
          ON c.setor_id = s.id
          GROUP BY s.id`)
      
      return Promise.resolve(consume)  
    }
    catch(err){
      return Promise.reject(err)
    }   
  }

  async consumePerPeriod ({ request, response }) {
    const params = request.all()

    try {
      const total = await this.totalConsumePeriod(params)
      const consume = await this.generalConsumePerPeriod(params)
      
      return response.status(200).json({ total: total, consumos: consume.rows })  
    }
    catch(err) {
      return response.status(500).json({ error: err })
    }    
  }

  async totalConsumePeriod(params) {
    try {
      const total = await Database
        .from('consumos')
        .whereRaw(`data::date between '${params.initialDate}' and '${params.endDate}'`)
        .sum('litros')
      
      return Promise.resolve(total[0].sum)  
    }
    catch(err){
      return Promise.reject(err)
    }   
  }

  async generalConsumePerPeriod(params) {
    try {
      const consume = await Database
        .raw(`SELECT sum(c.litros) as litros, s.nome as setor
          FROM consumos as c
          INNER JOIN setores as s
          ON c.setor_id = s.id
          WHERE data::date BETWEEN '${params.initialDate}' AND '${params.endDate}'
          GROUP BY s.id`)
        /*.table('consumos')
        .distinct('data')
        .whereRaw(`data::date between '${params.initialDate}' and '${params.endDate}'`)*/
      
      return Promise.resolve(consume)  
    }
    catch(err){
      return Promise.reject(err)
    }   
  }

  
  async consumePerYear({ request, response }) {
    const params = request.all()

    try {
      const total = await this.totalConsumePerYear(params)
      const consume = await this.generalConsumePerYear(params)

      return response.status(200).json({ total: total, consumos: consume.rows})  
    }
    catch(err) {
      return response.status(500).json({ error: err })
    }    
  }

  async totalConsumePerYear(params) {
    try {
      const total = await Database
        .from('consumos')
        .whereRaw(`EXTRACT(year FROM data) = '${params.year}'`)
        .sum('litros')
      
      return Promise.resolve(total[0].sum)  
    }
    catch(err){
      return Promise.reject(err)
    }   
  }

  async generalConsumePerYear(params) {
    try {
      const datesAndConsume = await Database
        .raw(`SELECT sum(c.litros) as litros, s.nome as setor
          FROM consumos as c
          INNER JOIN setores as s   
          ON c.setor_id = s.id     
          WHERE EXTRACT(year FROM data) = '${params.year}'
          GROUP BY s.id`)
        
      return Promise.resolve(datesAndConsume)  
    }
    catch(err){
      return Promise.reject(err)
    }   
  }

  async consumeDay ({ request, response }) {
    const params = request.all()

    try {
      const total = await Database
      .from('consumos')
      .whereRaw(`data::date = '${params.date}'`)
      .sum('litros')

      return response.status(200).json({ consumo: total[0].sum })  
    }
    catch(err) {
      return response.status(500).json({ error: err })
    }
  }

  async datesAndConsumePerPeriod(params) {
    try {
      const datesAndConsume = await Database
        .raw(`SELECT TO_CHAR(c.data ,'DD/MM/YYYY') AS data, sum(c.litros) as consumo, s.id as setor
          FROM consumos as c
          INNER JOIN setores as s
          ON c.setor_id = s.id
          WHERE data::date BETWEEN '${params.initialDate}' AND '${params.endDate}'
          GROUP BY c.data, s.id`)
        /*.table('consumos')
        .distinct('data')
        .whereRaw(`data::date between '${params.initialDate}' and '${params.endDate}'`)*/
      
      return Promise.resolve(datesAndConsume)  
    }
    catch(err){
      return Promise.reject(err)
    }   
  }

  async numDatesPerPeriod(params) {
    try {
      const numDates =  await Database
        .from('consumos')
        .countDistinct('data')
        .whereRaw(`data::date between '${params.initialDate}' and '${params.endDate}'`)
         
      return Promise.resolve(numDates[0].count)  
    }
    catch(err){
      return Promise.reject(err)
    }   
  }

  async datesAndConsumePerYear(params) {
    try {
      const datesAndConsume = await Database
        .raw(`SELECT TO_CHAR(data ,'DD/MM/YYYY') AS data, sum(litros) as consumo
          FROM consumos
          WHERE EXTRACT(year FROM data) = '${params.year}'
          GROUP BY data`)
        
      return Promise.resolve(datesAndConsume)  
    }
    catch(err){
      return Promise.reject(err)
    }   
  }

}

module.exports = ConsumoController
