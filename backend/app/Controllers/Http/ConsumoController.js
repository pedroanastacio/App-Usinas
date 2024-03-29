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
      return response.status(500).json({ message: 'Importação falhou', error: err})
    }

    const jsonArray = await csvtojson().fromFile('tmp/' + dir + fileName);

    if(!jsonArray[0].setor_id && !jsonArray[0].data && !jsonArray[0].volume){
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
        return response.status(500).json({ message: 'Não foi possível importar arquivo. Conteúdo inválido', error: err, description: 'invalid id'})
      
      return response.status(500).json({ message: 'Importação falhou', error: err})
    }
  }

  async arduinoStore ({request, response }) {
    const data = request.only(['setor_id', 'data', 'volume'])

    const consumo = await Consumo.create(data)

    return consumo
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
     return response.status(500).json({ error: err })
    }
  }

  async totalConsumeAllTime () {
    try {
      const total = await Database
      .from('consumos')
      .sum('volume')
    
      return Promise.resolve(total[0].sum)
    }
    catch(err) {
      return Promise.reject(err)
    }
  }

  async generalConsumeAllTime() {
    try {
      const consume = await Database
        .raw(`SELECT sum(c.volume) as volume, s.nome as setor
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
      return response.status(500).json({ error: err })
    }    
  }

  async totalConsumePeriod(params) {
    try {
      const total = await Database
        .from('consumos')
        .whereRaw(`data::date between '${params.initialDate}' and '${params.endDate}'`)
        .sum('volume')
      
      return Promise.resolve(total[0].sum)  
    }
    catch(err){
      return Promise.reject(err)
    }   
  }

  async generalConsumePerPeriod(params) {
    try {
      const consume = await Database
        .raw(`SELECT sum(c.volume) as volume, s.nome as setor
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
      return response.status(500).json({ error: err })
    }    
  }

  async totalConsumePerYear(params) {
    try {
      const total = await Database
        .from('consumos')
        .whereRaw(`EXTRACT(year FROM data) = '${params.year}'`)
        .sum('volume')
      
      return Promise.resolve(total[0].sum)  
    }
    catch(err){
      return Promise.reject(err)
    }   
  }

  async generalConsumePerYear(params) {
    try {
      const consume = await Database
        .raw(`SELECT sum(c.volume) as volume, s.nome as setor
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
      return response.status(500).json({ error: err })
    }
  }

  async totalConsumePerMonth(params) {
    try {
      const total = await Database
        .from('consumos')
        .whereRaw(`EXTRACT(month FROM data) = '${params.month}' AND EXTRACT(year FROM data) = '${params.year}'`)
        .sum('volume')
      
      return Promise.resolve(total[0].sum)
    }
    catch(err){
      return Promise.reject(err)
    }
  }

  async generalConsumePerMonth(params) {
    try {
      const consume = await Database
        .raw(`SELECT sum(c.volume) as volume, s.nome as setor
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
      return response.status(500).json({ error: err })
    }
  }

  async totalConsumePerDay(params) {
    try {
      const total = await Database
      .from('consumos')
      .whereRaw(`data::date = '${params.date}'`)
      .sum('volume')

      return Promise.resolve(total[0].sum)
    }
    catch(err){
      return Promise.reject(err)
    }
  }

  async generalConsumePerDay(params) {
    try {
      const consume = await Database
        .raw(`SELECT sum(c.volume) as volume, s.nome as setor
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
      return response.status(500).json({ error: err })
    }
  }

  async sectorTotalConsumeAllTime(id) {
    try {
      const total = await Database
        .from('consumos')
        .whereRaw(`setor_id = ${id}`)
        .sum('volume')

      return Promise.resolve(total[0].sum)
    }
    catch(err) {
      return Promise.reject(err)
    }
  }

  async sectorDatesAndConsumeAllTime(id) {
    try {
      const datesAndConsume = await Database
        /*.raw(`SELECT TO_CHAR(data,'YYYY') AS ano, sum(volume) as volume
          FROM consumos
          WHERE setor_id = ${id}
          GROUP BY TO_CHAR(data,'YYYY')
          ORDER BY TO_CHAR(data,'YYYY')
          `)*/
        
        .raw(`WITH cte AS (
          SELECT TO_CHAR(data,'YYYY') AS ano,
          SUM(volume) OVER (PARTITION BY TO_CHAR(data,'YYYY')) AS volume,
          SUM(volume) OVER (ORDER BY TO_CHAR(data,'YYYY')) AS cum_volume,
          ROW_NUMBER() OVER (PARTITION BY TO_CHAR(data,'YYYY')) AS row_num
          FROM consumos
          WHERE setor_id = ${id})
          SELECT ano, volume, cum_volume
          FROM cte
          WHERE row_num = 1
          `)    
            
      return Promise.resolve(datesAndConsume)  
    }
    catch(err){
      return Promise.reject(err)
    }   
  }

//----------------------------------------------------------------------------------------------------------
  async sectorConsumePerPeriod({ request, response, params }) {
    const parameters = request.all()

    const [year, month, day] = parameters.initialDate.split('-')
    const [year2, month2, day2] = parameters.endDate.split('-')

    let groupBy = ''
    let label = ''
    
    if(year != year2) {
      groupBy = 'YYYY'
      label = 'ano'
    }
    else if(month != month2) {  
      groupBy = 'MM/YYYY'
      label = 'mes'
    }  
    else if(day == day2) {
      groupBy = 'HH24'
      label = 'hora'
    }  
    else {
      groupBy = 'DD/MM/YYYY'
      label = 'data'
    }  
    
    try{
      const setor = await Database
        .select('id')
        .from('setores')
        .where('slug', params.slug)
        .first()

      const total = await this.sectorTotalConsumePerPeriod(setor.id, parameters)
      const datesAndConsume = await this.sectorDatesAndConsumePerPeriod(setor.id, parameters, groupBy, label)

      if(groupBy == 'HH24')
        groupBy = 'HH:mm'

      return response.status(200).json({ total: total, periodo: groupBy, consumos: datesAndConsume.rows })
    }
    catch(err) {
      return response.status(500).json({ error: err })
    }
  }

  async sectorTotalConsumePerPeriod(id, parameters) {
    try {
      const total = await Database
      .from('consumos')
      .whereRaw(`setor_id  = ${id} AND data::date between '${parameters.initialDate}' and '${parameters.endDate}'`)
      .sum('volume')

      return Promise.resolve(total[0].sum)
    }
    catch(err){
      return Promise.reject(err)
    }
  }

  async sectorDatesAndConsumePerPeriod(id, parameters, groupBy, label) {   
    try {
      const datesAndConsume = await Database
       /* .raw(`SELECT TO_CHAR(data, '${groupBy}') AS ${label}, sum(volume) as volume
          FROM consumos 
          WHERE setor_id  = ${id} AND data::date BETWEEN '${parameters.initialDate}' AND '${parameters.endDate}'
          GROUP BY TO_CHAR(data, '${groupBy}')
          ORDER BY TO_CHAR(data, '${groupBy}')
          `)*/

        .raw(`WITH cte AS (
          SELECT TO_CHAR(data, '${groupBy}') AS ${label},
          SUM(volume) OVER (PARTITION BY TO_CHAR(data, '${groupBy}')) AS volume,
          SUM(volume) OVER (ORDER BY TO_CHAR(data, '${groupBy}')) AS cum_volume,
          ROW_NUMBER() OVER (PARTITION BY TO_CHAR(data, '${groupBy}')) AS row_num
          FROM consumos
          WHERE setor_id  = ${id} AND data::date BETWEEN '${parameters.initialDate}' AND '${parameters.endDate}')
          SELECT ${label}, volume, cum_volume
          FROM cte
          WHERE row_num = 1
          `)  
      
          if(groupBy == 'HH24'){
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
      return response.status(500).json({ error: err })
    }
  }


  async sectorTotalConsumePerYear(id, parameters) {
    try {
      const total = await Database
      .from('consumos')
      .whereRaw(`setor_id  = ${id} AND EXTRACT(year FROM data) = '${parameters.year}'`)
      .sum('volume')

      return Promise.resolve(total[0].sum)
    }
    catch(err){
      return Promise.reject(err)
    }
  } 

  async sectorDatesAndConsumePerYear(id, parameters) {
    try {
      const datesAndConsume = await Database
        /*.raw(`SELECT TO_CHAR(data, 'MM/YYYY') AS mes, sum(volume) as volume
          FROM consumos
          WHERE setor_id = ${id} AND EXTRACT(year FROM data) = '${parameters.year}'
          GROUP BY TO_CHAR(data, 'MM/YYYY')
          ORDER BY TO_CHAR(data, 'MM/YYYY')
          `)*/

        .raw(`WITH cte AS (
          SELECT TO_CHAR(data, 'MM/YYYY') AS mes,
          SUM(volume) OVER (PARTITION BY TO_CHAR(data, 'MM/YYYY')) AS volume,
          SUM(volume) OVER (ORDER BY TO_CHAR(data, 'MM/YYYY')) AS cum_volume,
          ROW_NUMBER() OVER (PARTITION BY TO_CHAR(data, 'MM/YYYY')) AS row_num
          FROM consumos
          WHERE setor_id = ${id} AND EXTRACT(year FROM data) = '${parameters.year}')
          SELECT mes, volume, cum_volume
          FROM cte
          WHERE row_num = 1
          `)  
        
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
        .sum('volume')

      return Promise.resolve(total[0].sum)  
    }
    catch(err) {
      return Promise.reject(err)
    }
  }

  async sectorDatesAndConsumePerMonth(id, parameters) {
    try{
      const datesAndConsume = await Database
        /*.raw(`SELECT TO_CHAR(data, 'DD/MM/YYYY') AS data, sum(volume) as volume
        FROM consumos
        WHERE setor_id = ${id} AND EXTRACT(year FROM data) = '${parameters.year}' AND EXTRACT(month FROM data) = '${parameters.month}'
        GROUP BY TO_CHAR(data, 'DD/MM/YYYY')
        ORDER BY TO_CHAR(data, 'DD/MM/YYYY')
        `)*/

        .raw(`WITH cte AS (
        SELECT TO_CHAR(data, 'DD/MM/YYYY') AS data,
        SUM(volume) OVER (PARTITION BY TO_CHAR(data, 'DD/MM/YYYY')) AS volume,
        SUM(volume) OVER (ORDER BY TO_CHAR(data, 'DD/MM/YYYY')) AS cum_volume,
        ROW_NUMBER() OVER (PARTITION BY TO_CHAR(data, 'DD/MM/YYYY')) AS row_num
        FROM consumos
        WHERE setor_id = ${id} AND EXTRACT(year FROM data) = '${parameters.year}' AND EXTRACT(month FROM data) = '${parameters.month}')
        SELECT data, volume, cum_volume
        FROM cte
        WHERE row_num = 1
        `)

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
      return response.status(500).json({ error: err })
    }
  }

  async sectorTotalConsumePerDay(id, parameters) {
    try{
      const total = await Database
      .from('consumos')
      .whereRaw(`setor_id  = ${id} AND data::DATE = '${parameters.date}'`)
      .sum('volume')

      return Promise.resolve(total[0].sum)  
    }
    catch(err) {
      return Promise.reject(err)
    }
  }

  async sectorHoursAndConsumePerDay(id, parameters) {
    try{
      const hoursAndConsume = await Database
        /*.raw(`SELECT TO_CHAR(data , 'HH24') AS hora, sum(volume) as volume
        FROM consumos
        WHERE setor_id = ${id} AND data::DATE = '${parameters.date}'
        GROUP BY TO_CHAR(data , 'HH24')
        ORDER BY TO_CHAR(data , 'HH24')
        `)*/

        .raw(`WITH cte AS (
        SELECT TO_CHAR(data , 'HH24') AS hora,
        SUM(volume) OVER (PARTITION BY TO_CHAR(data , 'HH24')) AS volume,
        SUM(volume) OVER (ORDER BY TO_CHAR(data , 'HH24')) AS cum_volume,
        ROW_NUMBER() OVER (PARTITION BY TO_CHAR(data , 'HH24')) AS row_num
        FROM consumos
        WHERE setor_id = ${id} AND data::DATE = '${parameters.date}')
        SELECT hora, volume, cum_volume
        FROM cte
        WHERE row_num = 1
        `)

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
