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
      return response.status(500).json({ message: 'Importação falhou', data: err})
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
     /* const setoresDB = await Database.select('id').from('setores')
      let newSetoresDB = []
      await setoresDB.forEach(setor => {
        newSetoresDB.push(setor.id)
      })
      const csvValid = newSetoresDB.some(id => setoresId.indexOf(id) > 0)
      if(!csvValid)
        return response.status(400).json({ message: 'Não foi possível importar arquivo. Conteúdo inválido', description: 'invalid id'})
     */
      await Consumo.createMany(jsonArray)
      return response.status(200).json({ message: 'Importação concluída com sucesso'})
    }
    catch(err){
      if(err.constraint == 'consumos_setor_id_foreign')
        return response.status(500).json({ message: 'Não foi possível importar arquivo. Conteúdo inválido', data: err})
      
      return response.status(500).json({ message: 'Importação falhou', data: err})
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
 //----------------------------------------------------------------------------------------------------------

  async consumeAllTime({ response }) {
    try{
      const total = await this.totalConsumeAllTime()
      const consume = await this.generalConsumeAllTime()

      return response.status(200).json({ total: total, consumos: consume.rows })
    }
    catch(err) {
     return response.status(500).json({ data: err })
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
 //----------------------------------------------------------------------------------------------------------

  async consumePerPeriod ({ request, response }) {
    const params = request.all()

    try {
      const total = await this.totalConsumePeriod(params)
      const consume = await this.generalConsumePerPeriod(params)
      
      return response.status(200).json({ total: total, consumos: consume.rows })  
    }
    catch(err) {
      return response.status(500).json({ data: err })
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
//------------------------------------------------------------------------------------------------------
  
  async consumePerYear({ request, response }) {
    const params = request.all()

    try {
      const total = await this.totalConsumePerYear(params)
      const consume = await this.generalConsumePerYear(params)

      return response.status(200).json({ total: total, consumos: consume.rows})  
    }
    catch(err) {
      return response.status(500).json({ data: err })
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
      const consume = await Database
        .raw(`SELECT sum(c.litros) as litros, s.nome as setor
          FROM consumos as c
          INNER JOIN setores as s   
          ON c.setor_id = s.id     
          WHERE EXTRACT(year FROM c.data) = '${params.year}'
          GROUP BY s.id`)
        
      return Promise.resolve(consume)  
    }
    catch(err){
      return Promise.reject(err)
    }   
  }
//----------------------------------------------------------------------------------------------------------

  async consumePerMonth({ request, response }) {
    const params = request.all()

    try {
      const total = await this.totalConsumePerMonth(params)
      const consume = await this.generalConsumePerMonth(params)

      return response.status(200).json({ total: total, consumos: consume.rows })
    }
    catch(err) {
      return response.status(500).json({ data: err })
    }
  }

  async totalConsumePerMonth(params) {
    try {
      const total = await Database
        .from('consumos')
        .whereRaw(`EXTRACT(month FROM data) = '${params.month}' AND EXTRACT(year FROM data) = '${params.year}'`)
        .sum('litros')
      
      return Promise.resolve(total[0].sum)
    }
    catch(err){
      return Promise.reject(err)
    }
  }

  async generalConsumePerMonth(params) {
    try {
      const consume = await Database
        .raw(`SELECT sum(c.litros) as litros, s.nome as setor
          FROM consumos as c
          INNER JOIN setores as s   
          ON c.setor_id = s.id     
          WHERE EXTRACT(month FROM c.data) = '${params.month}' AND EXTRACT(year FROM c.data) = '${params.year}'
          GROUP BY s.id`)
        
      return Promise.resolve(consume) 
    }
    catch(err) {
      return Promise.reject(err)
    }
  }

//----------------------------------------------------------------------------------------------------------

  async consumePerDay ({ request, response }) {
    const params = request.all()

    try {
      const total = await this.totalConsumePerDay(params)
      const consume = await this.generalConsumePerDay(params)

      return response.status(200).json({ total: total, consumos: consume.rows })  
    }
    catch(err) {
      return response.status(500).json({ data: err })
    }
  }

  async totalConsumePerDay(params) {
    try {
      const total = await Database
      .from('consumos')
      .whereRaw(`data::date = '${params.date}'`)
      .sum('litros')

      return Promise.resolve(total[0].sum)
    }
    catch(err){
      return Promise.reject(err)
    }
  }

  async generalConsumePerDay(params) {
    try {
      const consume = await Database
        .raw(`SELECT sum(c.litros) as litros, s.nome as setor
        FROM consumos as c
        INNER JOIN setores as s   
        ON c.setor_id = s.id     
        WHERE c.data::DATE = '${params.date}'
        GROUP BY s.id`)

      return Promise.resolve(consume)
    }
    catch(err){
      return Promise.reject(err)
    }
  }

//----------------------------------------------------------------------------------------------------------
  async sectorConsumeAllTime({ response, params }) {
    try{
      const setor = await Database
        .select('id')
        .from('setores')
        .where('slug', params.slug)
        .first()

      const total = await this.sectorTotalConsumeAllTime(setor.id)
      const datesAndConsume = await this.sectorDatesAndConsumeAllTime(setor.id)
    
      return response.status(200).json({ total: total, periodo: 'YYYY', consumos: datesAndConsume.rows })  
    }
    catch(err) {
      return response.status(500).json({ data: err })
    }
  }

  async sectorTotalConsumeAllTime(id) {
    try {
      const total = await Database
        .from('consumos')
        .whereRaw(`setor_id = ${id}`)
        .sum('litros')

      return Promise.resolve(total[0].sum)
    }
    catch(err) {
      return Promise.reject(err)
    }
  }

  async sectorDatesAndConsumeAllTime(id) {
    try {
      const datesAndConsume = await Database
        .raw(`SELECT TO_CHAR(data,'YYYY') AS ano, sum(litros) as litros
          FROM consumos
          WHERE setor_id = ${id}
          GROUP BY TO_CHAR(data,'YYYY')`)
            
      return Promise.resolve(datesAndConsume)  
    }
    catch(err){
      console.log(err)
      return Promise.reject(err)
    }   
  }

//----------------------------------------------------------------------------------------------------------
  async sectorConsumePerPeriod({ request, response, params }) {
    const parameters = request.all()

    const [year, month, day] = parameters.initialDate.split('-')
    const [year2, month2, day2] = parameters.endDate.split('-')

    let groupBy = ''

    if(year != year2)
      groupBy = 'YYYY'
    else if(month != month2)  
      groupBy = 'MM/YYYY'
    else if(day == day2)
      groupBy = 'fmHH24'
    else 
      groupBy = 'DD/MM/YYYY'

    
    try{
      const setor = await Database
        .select('id')
        .from('setores')
        .where('slug', params.slug)
        .first()

      const total = await this.sectorTotalConsumePerPeriod(setor.id, parameters)
      const datesAndConsume = await this.sectorDatesAndConsumePerPeriod(setor.id, parameters, groupBy)

      if(groupBy == 'fmHH24'){
        groupBy = 'HH:mm'
       }

      return response.status(200).json({ total: total, periodo: groupBy, consumos: datesAndConsume.rows })
    }
    catch(err) {
      return response.status(500).json({ data: err })
    }
  }

  async sectorTotalConsumePerPeriod(id, parameters) {
    try {
      const total = await Database
      .from('consumos')
      .whereRaw(`setor_id  = ${id} AND data::date between '${parameters.initialDate}' and '${parameters.endDate}'`)
      .sum('litros')

      return Promise.resolve(total[0].sum)
    }
    catch(err){
      return Promise.reject(err)
    }
  }

  async sectorDatesAndConsumePerPeriod(id, parameters, groupBy) {
    let label = ''
    
    if(groupBy == 'YYYY')
      label = 'ano'
    else if(groupBy == 'MM/YYYY')  
      label = 'mes' 
    else if(groupBy == 'DD/MM/YYYY')  
      label = 'data'   
    else
      label = 'hora'
       
    try {
      const datesAndConsume = await Database
        .raw(`SELECT TO_CHAR(data, '${groupBy}') AS ${label}, sum(litros) as litros
          FROM consumos 
          WHERE setor_id  = ${id} AND data::date BETWEEN '${parameters.initialDate}' AND '${parameters.endDate}'
          GROUP BY TO_CHAR(data, '${groupBy}')`)
      
          if(groupBy == 'fmHH24'){
           datesAndConsume.rows.forEach(el => {
              el.hora = `${el.hora}:00`
            })
          }
          
      return Promise.resolve(datesAndConsume)  
    }
    catch(err){
      return Promise.reject(err)
    }   
  }

//----------------------------------------------------------------------------------------------------------
  async sectorConsumePerYear({ request, response, params }) {
    const parameters = request.all()

    try{
      const setor = await Database
        .select('id')
        .from('setores')
        .where('slug', params.slug)
        .first()

      const total = await this.sectorTotalConsumePerYear(setor.id, parameters)
      const datesAndConsume = await this.sectorDatesAndConsumePerYear(setor.id, parameters)

      return response.status(200).json({ total: total, periodo: 'MM/YYYY', consumos: datesAndConsume.rows })
    }
    catch(err) {
      return response.status(500).json({ data: err })
    }
  }


  async sectorTotalConsumePerYear(id, parameters) {
    try {
      const total = await Database
      .from('consumos')
      .whereRaw(`setor_id  = ${id} AND EXTRACT(year FROM data) = '${parameters.year}'`)
      .sum('litros')

      return Promise.resolve(total[0].sum)
    }
    catch(err){
      return Promise.reject(err)
    }
  } 

  async sectorDatesAndConsumePerYear(id, parameters) {
    try {
      const datesAndConsume = await Database
        .raw(`SELECT TO_CHAR(data ,'MM/YYYY') AS mes, sum(litros) as litros
          FROM consumos
          WHERE setor_id  = ${id} AND EXTRACT(year FROM data) = '${parameters.year}'
          GROUP BY TO_CHAR(data ,'MM/YYYY')`)
        
      return Promise.resolve(datesAndConsume)  
    }
    catch(err){
      return Promise.reject(err)
    }   
  }

//----------------------------------------------------------------------------------------------------------
  async sectorConsumePerMonth({ request, response, params }) {
    const parameters = request.all()

    try {
      const setor = await Database
        .select('id')
        .from('setores')
        .where('slug', params.slug)
        .first()

      const total = await this.sectorTotalConsumePerMonth(setor.id, parameters)
      const datesAndConsume = await this.sectorDatesAndConsumePerMonth(setor.id, parameters)

      return response.status(200).json({ total: total, periodo: 'DD/MM/YYYY', consumos: datesAndConsume.rows })
    }
    catch(err) {
      return err
    }
  }

  async sectorTotalConsumePerMonth(id, parameters) {
    try{
      
      const total = await Database
        .from('consumos')
        .whereRaw(`setor_id = ${id} AND EXTRACT(year FROM data) = '${parameters.year}' AND EXTRACT(month FROM data) = '${parameters.month}'`)
        .sum('litros')

      return Promise.resolve(total[0].sum)  
    }
    catch(err) {
      return Promise.reject(err)
    }
  }

  async sectorDatesAndConsumePerMonth(id, parameters) {
    try{
      const datesAndConsume = await Database
        .raw(`SELECT TO_CHAR(data ,'DD/MM/YYYY') AS data, sum(litros) as litros
        FROM consumos
        WHERE setor_id = ${id} AND EXTRACT(year FROM data) = '${parameters.year}' AND EXTRACT(month FROM data) = '${parameters.month}'
        GROUP BY TO_CHAR(data ,'DD/MM/YYYY')`)

      return Promise.resolve(datesAndConsume)  
    }
    catch(err) {
      return Promise.reject(err)
    }
  }

//----------------------------------------------------------------------------------------------------------
  async sectorConsumePerDay({ request, response, params }) {
    const parameters = request.all()

    try{
      const setor = await Database
        .select('id')
        .from('setores')
        .where('slug', params.slug)
        .first()

      const total = await this.sectorTotalConsumePerDay(setor.id, parameters)
      const hoursAndConsume = await this.sectorHoursAndConsumePerDay(setor.id, parameters)

      return response.status(200).json({ total: total, periodo: 'HH:mm', consumos: hoursAndConsume.rows })
    }
    catch(err) {
      return response.status(500).json({ data: err })
    }
  }

  async sectorTotalConsumePerDay(id, parameters) {
    try{
      const total = await Database
      .from('consumos')
      .whereRaw(`setor_id  = ${id} AND data::DATE = '${parameters.date}'`)
      .sum('litros')

      return Promise.resolve(total[0].sum)  
    }
    catch(err) {
      return Promise.reject(err)
    }
  }

  async sectorHoursAndConsumePerDay(id, parameters) {
    try{
      const hoursAndConsume = await Database
        .raw(`SELECT TO_CHAR(data , 'fmHH24') AS hora, sum(litros) as litros
        FROM consumos
        WHERE setor_id = ${id} AND data::DATE = '${parameters.date}'
        GROUP BY TO_CHAR(data , 'fmHH24')`)

        hoursAndConsume.rows.forEach(el => {
          el.hora = `${el.hora}:00`
        })

      return Promise.resolve(hoursAndConsume)  
    }
    catch(err) {
      return Promise.reject(err)
    }
  }

}

module.exports = ConsumoController
