<template>
    <div>
        <DrawerToolbar :routeName="sectorName"/>
         <v-container
        fluid
        class="pt-0"
        >

            <v-row
            v-if="loaded"
            >
                <v-col>
                    <v-card>
                        <v-card-title 
                        class="pb-0 mb-0"
                        >
                            <v-col 
                            cols="12"
                            sm="4"
                            class="pb-0 mb-0"
                            >
                                <v-select
                                :items="periodOptions"
                                label="Período"
                                outlined
                                prepend-icon="mdi-calendar-search"
                                v-model="period"
                                @change="setDatePickerLabel"
                                ></v-select>
                            </v-col>

                            <v-col 
                            cols="12"
                            sm="4"
                            class="pb-0 mb-0"
                            >
                                <v-select
                                v-if="period == 'ano'"
                                :items="years"
                                label="Ano"
                                outlined
                                prepend-icon="mdi-calendar"
                                v-model="dateVal"
                                @change="getYearConsumeData"
                                ></v-select>
                               
                                <v-menu
                                v-if="period == 'mês'"
                                :close-on-content-click="true"
                                :nudge-right="33"
                                :nudge-top="30"
                                transition="scale-transition"
                                offset-y 
                                max-width="290px"
                                min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                        label="Mês"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        :value="dateSelect"
                                        v-on="on"
                                        outlined
                                        />
                                    </template>
                                    <v-date-picker
                                    type="month"
                                    locale="pt-br"
                                    v-model="dateVal"
                                    no-title
                                    @input="dateMenu = false"
                                    @change="getMonthConsumeData"
                                    :min="minDate"
                                    :max="maxDate"
                                    color="primary"
                                    />
                                </v-menu>
                            

                                <v-menu
                                v-if="period == 'dia' || period == 'intervalo'"
                                :close-on-content-click="true"
                                :nudge-right="33"
                                :nudge-top="30"
                                transition="scale-transition"
                                offset-y 
                                max-width="290px"
                                min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                        :label="labelInput1"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        :value="dateSelect"
                                        v-on="on"
                                        outlined
                                        />
                                    </template>
                                    <v-date-picker
                                    locale="pt-br"
                                    v-model="dateVal"
                                    no-title
                                    @input="dateMenu = false"
                                    @change="handleWithDates"
                                    :min="minDate"
                                    :max="maxDate"
                                    color="primary"
                                    />
                                </v-menu>
                            </v-col>    
                                
                            <v-col 
                            cols="12"
                            sm="4"
                            class="pb-0 mb-0"
                            >
                                <v-menu
                                v-if="period == 'intervalo'"
                                :close-on-content-click="true"
                                :nudge-right="33"
                                :nudge-top="30"
                                transition="scale-transition"
                                offset-y 
                                max-width="290px"
                                min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                        label="Data final"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        :value="dateSelect2"
                                        v-on="on"
                                        outlined
                                        />
                                    </template>
                                    <v-date-picker
                                    locale="pt-br"
                                    v-model="dateVal2"
                                    no-title
                                    @input="dateMenu = false"
                                    @change="handleWithDates"
                                    :min="dateVal"
                                    :max="maxDate"
                                    color="primary"
                                    />
                                </v-menu>
                            </v-col>    
                        </v-card-title>    
                    </v-card>
                </v-col>
            </v-row>  

            <v-row
            v-if="loaded&&!error&&!noDataForPeriod"
            >
                <v-col
                xs="12"
                sm="8"
                md="8"
                lg="8"
                xl="8"
                
                justify="center"
                >
                    <v-card 
                    class="pb-4">
                        <v-card-text v-if="period != 'intervalo'" class="grey--text">
                            Consumo - {{dateSelect}}
                        </v-card-text>

                        <v-card-text v-if="period == 'intervalo'" class="grey--text">
                            Consumo - {{dateSelect}} a {{dateSelect2}}
                        </v-card-text>

                        <div align="center">
                            <bar-chart
                            class="bar_card"
                            :chartdata="chartdata"
                            :options="options"
                            />
                        </div>
                    </v-card>             
                </v-col>

                <v-col
                sm="4"
                md="4"
                lg="4"    
                xl="4"
                >
                    <v-card class="pb-4" height="100%">
                        <v-card-text class="grey--text">
                            Consumo total
                        </v-card-text>
                        <v-card-title class="cinzaEscuro--text layout justify-center consumo_total">
                            <v-icon large color="primary">mdi-water</v-icon>
                            {{totalConsume}} m³
                        </v-card-title>                    
                    </v-card>    
                </v-col>    
            </v-row>    

            <v-row 
            v-if="loaded&&!error&&!noDataForPeriod"
            >
                <v-col>
                    <v-data-table
                    v-show="!error"
                    :headers="headers"                       
                    :items="consumeData"
                    :loading="!loaded"
                    loading-text="Carregando dados de consumo..."
                    no-data-text="Nenhum dado encontrado"
                    locale="pt-BR"  
                    :hide-default-footer="true"
                    class="elevation-2"
                    disable-pagination
                    disable-initial-sort
                    /> 
                </v-col>    
            </v-row>  

            <v-row 
            v-if="loaded&&!error&&!noDataForPeriod"
            > 
                <v-col>
                    <v-btn class="px-4" color="success"> 
                        <download-excel
                        :data="consumeData"
                        :name="exportedFileName"
                        :fields="exportedFileFields"
                        >
                        Exportar em XLS
                        </download-excel>
                    </v-btn>
                </v-col>    
            </v-row>  

            <v-row v-show="!loaded&&!error&&!noDataForPeriod">
                <v-col>
                    <LoadingPage :show="!loaded&&!error&&!noDataForPeriod"/>  
                </v-col>    
            </v-row>      

            <v-row v-show="loaded&&error&&!noDataForPeriod">
                <v-col>
                    <ErrorAlert :show="loaded&&error&&!noDataForPeriod" message="Houve um erro ao carregar dados de consumo" />    
                </v-col>    
            </v-row> 

            <v-row v-show="loaded&&!error&&noDataForPeriod">
                <v-col>
                    <v-alert
                    v-show="loaded&&!error&&noDataForPeriod"
                    prominent
                    type="info"
                    transition="slide-x-reverse-transition"
                    class=" mt-2"
                    >
                        <v-row align="center" >
                            <v-col class="grow">Nenhum registro encontrado correspondente a este período</v-col>
                        </v-row>
                    </v-alert> 
                </v-col>    
            </v-row>    

        </v-container>  
    </div>
</template>

<script>
import DrawerToolbar from '../components/DrawerToolbar'
import BarChart from '../components/ConsumoSetorChart'
import LoadingPage from '../components/LoadingPage'
import ErrorAlert from '../components/ErrorAlert'
import Consumo from '../services/Consumo'
import Setores from '../services/Setores'

export default {
    components:{
        DrawerToolbar,
        BarChart,
        LoadingPage,
        ErrorAlert
    },

    data: () => ({
        chartdata: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: "#1565C0",//version >2 useus background color
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        parser: 'DD/MM/YYYY',
                        //tooltipFormat: 'll HH:mm',
                        unit: 'day',
                        unitStepSize: 5,
                        displayFormats: {
                            'day': 'DD/MM/YYYY'
                        }
                    }
                }]
            },
            tooltips: {
                callbacks: {
                label: (item) => `${item.yLabel} m³`,
                },
            },
            legend: {
                display: false
            }
        },
        totalConsume: '',
        loaded: false,
        error: false,
        noDataForPeriod: false,
        period: 'mês',
        periodOptions: [
            {text: 'Desde sempre', value: 'sempre'},
            {text: 'Intervalo', value: 'intervalo'},
            {text: 'Ano', value: 'ano'},
            {text: 'Mês', value: 'mês'},
            {text: 'Dia', value: 'dia'},
        ],
        dateVal: new Date().toISOString().substr(0, 7),
        dateVal2: null,
        minDate: '2020-01-01',
        maxDate: new Date().toISOString().substr(0, 10),
        dateMenu: false,
        labelInput1: null,
        consumeData: [],
        sectorName: '',
        headers: [],
        exportedFileName: '',
        exportedFileFields: {}
    }),

     computed: {
        showInput() {
            if(this.period != 'sempre') {
                return true
            }   
            else {
                return false
            } 
        },

        dateSelect() {
            return this.formatDate(this.dateVal);  
        },

        dateSelect2() {
            return this.formatDate(this.dateVal2);  
        },

        years() {
            const year = new Date().getFullYear()
            return Array.from({length: year - 2019}, (value, index) => 2020 + index)
        }

    },

    watch: {
        period(val) {
            if(val == 'mês') {
                this.dateVal = new Date().toISOString().substr(0, 7)
                this.setExportedFileName()
                this.getMonthConsumeData()
            }
            else if(val == 'dia') {
                this.dateVal = new Date().toISOString().substr(0, 10)
                this.setExportedFileName()
                this.getDayConsumeData()
            }
            else if(val == 'ano') {
                this.dateVal = parseInt(new Date().toISOString().substr(0, 4))
                this.setExportedFileName()
                this.getYearConsumeData()
            } 
            else if(val == 'intervalo') {
                this.dateVal = new Date().toISOString().substr(0, 10)
                this.dateVal2 = new Date().toISOString().substr(0, 10)
                this.setExportedFileName()
                this.getIntervalConsumeData()
            } 
            else{
                this.dateVal = 'Desde sempre'
                this.setExportedFileName()
            }
        },

        dateVal() {
            this.setExportedFileName()
        },

        dateVal2() {
            this.setExportedFileName()
        }
    },

     methods: {
        setDatePickerLabel() {
            if(this.period == 'dia')
                this.labelInput1 = 'Dia'   
            else if (this.period == 'intervalo')
                this.labelInput1 = 'Data inicial'  
            else if (this.period == 'sempre')
                this.getAllTimeConsumeData()
            else
                return
        },

        setExportedFileName() {
            if (this.period == 'sempre')
                this.exportedFileName = `${this.sectorName} - ${this.dateSelect}`
            else if (this.period == 'intervalo')
                this.exportedFileName = `${this.sectorName} - ${this.period} - ${this.dateSelect} a ${this.dateSelect2}`
            else
                this.exportedFileName = `${this.sectorName} - ${this.period} - ${this.dateSelect}`
        },

        setExportedFileFields(period, periodValue) {
           this.exportedFileFields = {} 
           this.exportedFileFields[period] = periodValue
           this.exportedFileFields["Volume (m³)"] = "volume"
        },
        
        formatDate(date) {
            if (!date) return null

            if(this.period == 'dia' || this.period == 'intervalo') {
                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            }
            else if(this.period == 'mês') {
                const [year, month] = date.split('-')
                return `${month}/${year}`
            }
            else {
               return date
            }
        },

        formatDate2(date) {
            const [year, month, day] = date.split('-')
            return `${year},${month},${day}`
        },

        formatDBDate(date) {
            const [day, month, year] = date.split('/')
            return `${year}-${month}-${day}`
        },

        getDaysOfMonth(date) {
            let [year, month, day] = date.split('-')
            day = 0
            return new Date(year, month, day).getDate();
        },

        getMonth(date) {
            const month = date.split('-')
            return `${month[1]}`
        },

        getYear(date) {
            const [year] = date.split('-')
            return `${year}`
        },

        resetChartData() {
            this.chartdata = {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: "#1565C0",
            }]
            }

            this.totalConsume = ''
            this.consumeData = []
        },
        /*
        percentCalculate(total, sectorConsume) {
            return parseFloat((sectorConsume/total)*100).toFixed(2);
        },
        */
        getParamsMonthConsume() {
            let params = {
                slug: this.$route.params.slug,
                year: this.getYear(this.dateVal),
                month: this.getMonth(this.dateVal),
            }
            return params
        },

        handleWithError() {
            this.loaded = this.error = true
            this.noDataForPeriod = false
        },

        handleWithDates() {
            if(this.period == 'intervalo'){
                const date1 = new Date(this.formatDate2(this.dateVal))
                const date2 = new Date(this.formatDate2(this.dateVal2))
              
                if(date1 > date2) 
                    this.dateVal2 = this.dateVal

                this.getIntervalConsumeData()
                return
            }
            
            this.getDayConsumeData()
        },

        handleWithConsumeData(data) {
            if(data.consumos.length == 0){
                this.noDataForPeriod = true
                this.loaded = true
                return
            }

            this.chartdata.datasets[0].label = null

            if(data.periodo == 'YYYY') {
                this.setExportedFileFields("Ano", "ano")

                data.consumos.forEach(element => {
                    this.chartdata.datasets[0].data.push({
                        x: element.ano,
                        y: element.volume
                    })

                    this.consumeData.push({
                        "ano": element.ano,
                        "volume": `${Number(element.volume).toLocaleString('pt-BR')}`,
                        //"percent": `${Number(this.percentCalculate(data.total, element.volume)).toLocaleString('pt-BR')}%`
                    }) 
                })

                this.headers = [
                    {text: 'Ano', align: 'left', value:'ano', class: "primary white--text"},
                    {text: 'Volume (m³)', align:'left', value: 'volume', class: "primary white--text", sortable: false}, 
                    //{text: 'Porcentagem (%)', align: 'left', value: 'percent', class: "primary white--text", sortable: false}
                ]
            }
            else if(data.periodo == 'MM/YYYY') {
                this.setExportedFileFields("Mês", "mês")

                data.consumos.forEach(element => {
                    this.chartdata.datasets[0].data.push({
                        x: element.mes,
                        y: element.volume
                    })

                    this.consumeData.push({
                        "mês": element.mes,
                        "volume": `${Number(element.volume).toLocaleString('pt-BR')}`,
                        //"percent": `${Number(this.percentCalculate(data.total, element.volume)).toLocaleString('pt-BR')}%`
                    }) 
                })

                this.headers = [
                    {text: 'Mês', align: 'left', value:'mês', class: "primary white--text" },
                    {text: 'Volume (m³)', align:'left', value: 'volume', class: "primary white--text", sortable: false}, 
                    //{text: 'Porcentagem (%)', align: 'left', value: 'percent', class: "primary white--text", sortable: false}
                ]
            }
            else if(data.periodo == "HH:mm") {
                this.setExportedFileFields("Horário", "horario")

                data.consumos.forEach(element => {
                    this.chartdata.datasets[0].data.push({
                        x: element.hora,
                        y: element.volume
                    })

                    this.consumeData.push({
                        "horario": element.hora,
                        "volume": `${Number(element.volume).toLocaleString('pt-BR')}`,
                        //"percent": `${Number(this.percentCalculate(data.total, element.volume)).toLocaleString('pt-BR')}%`
                    }) 
                })

                this.headers = [
                    {text: 'Horário', align: 'left', value:'horario', class: "primary white--text"},
                    {text: 'Volume (m³)', align:'left', value: 'volume', class: "primary white--text", sortable: false}, 
                    //{text: 'Porcentagem (%)', align: 'left', value: 'percent', class: "primary white--text", sortable: false}
                ]
            }
            else {
                this.setExportedFileFields("Dia", "dia")    

                data.consumos.forEach(element => {
                    this.chartdata.datasets[0].data.push({
                        x: element.data,
                        y: element.volume
                    })
                    
                    this.consumeData.push({
                        "dia": element.data,
                        "volume": `${Number(element.volume).toLocaleString('pt-BR')}`,
                        //"percent": `${Number(this.percentCalculate(data.total, element.volume)).toLocaleString('pt-BR')}%`
                    }) 
                })

                 this.headers = [
                    {text: 'Dia', align: 'left', value:'dia', class: "primary white--text"},
                    {text: 'Volume (m³)', align:'left', value: 'volume', class: "primary white--text", sortable: false}, 
                   // {text: 'Porcentagem (%)', align: 'left', value: 'percent', class: "primary white--text", sortable: false}
                ]
            }
                     
            this.totalConsume = Number(data.total).toLocaleString('pt-BR')
            this.loaded = true
        },

        handleWithChartOptions(dateFormat) {
            this.options.scales.xAxes[0].type = 'time',
            this.options.scales.xAxes[0].time.parser = dateFormat
        
            if(this.period == 'sempre') {
                this.options.scales.xAxes[0].time.unit = 'year'
                this.options.scales.xAxes[0].time.unitStepSize = 1
                this.options.scales.xAxes[0].time.displayFormats.year = dateFormat
                this.chartdata.labels = ['2020', `${new Date().toISOString().substr(0, 4)}`]
            }
            else if(this.period == 'intervalo') {
                if(dateFormat == 'YYYY') {
                    this.options.scales.xAxes[0].time.unit = 'year'
                    this.options.scales.xAxes[0].time.unitStepSize = 1
                    this.options.scales.xAxes[0].time.displayFormats.year = dateFormat
                    this.chartdata.labels = [`${this.getYear(this.dateVal)}`, `${this.getYear(this.dateVal2)}`]
                }
                else if(dateFormat == 'MM/YYYY') {
                    this.options.scales.xAxes[0].time.unit = 'month'
                    this.options.scales.xAxes[0].time.unitStepSize = 1
                    this.options.scales.xAxes[0].time.displayFormats.month = dateFormat
                    this.chartdata.labels = [`${this.getMonth(this.dateVal)}/${this.getYear(this.dateVal)}`, `${this.getMonth(this.dateVal2)}/${this.getYear(this.dateVal2)}`]
                }
                else if(dateFormat == 'DD/MM/YYYY') {
                    this.options.scales.xAxes[0].time.unit = 'day'
                    this.options.scales.xAxes[0].time.unitStepSize = 2
                    this.options.scales.xAxes[0].time.displayFormats.day = dateFormat
                    this.chartdata.labels = [this.formatDate(this.dateVal), this.formatDate(this.dateVal2)]
                }
                else {
                    this.options.scales.xAxes[0].time.unit = 'hour'
                    this.options.scales.xAxes[0].time.unitStepSize = 2
                    this.options.scales.xAxes[0].time.displayFormats.hour = dateFormat
                    this.chartdata.labels = ['00:00', '23:00']
                }
            }
            else if(this.period == 'ano') {
                this.options.scales.xAxes[0].time.unit = 'month'
                this.options.scales.xAxes[0].time.unitStepSize = 1
                this.options.scales.xAxes[0].time.displayFormats.month = dateFormat
                this.chartdata.labels = [`01/${this.dateVal}`, `12/${this.dateVal}`]
            }
            else if (this.period == 'mês') {
                this.options.scales.xAxes[0].time.unit = 'day'
                this.options.scales.xAxes[0].time.unitStepSize = 4
                this.options.scales.xAxes[0].time.displayFormats.day = dateFormat
                const numDays = this.getDaysOfMonth(this.dateVal)
                this.chartdata.labels = [`01/${this.getMonth(this.dateVal)}/${this.getYear(this.dateVal)}`, `${numDays}/${this.getMonth(this.dateVal)}/${this.getYear(this.dateVal)}`]
            }
            else if(this.period == 'dia') {
                this.options.scales.xAxes[0].time.unit = 'hour'
                this.options.scales.xAxes[0].time.unitStepSize = 2
                this.options.scales.xAxes[0].time.displayFormats.hour = dateFormat
                this.chartdata.labels = ['00:00', '23:00']
            }
            
        },

        async getSectorData() {
            if(this.$route.params.nome != undefined) {
                this.sectorName = this.$route.params.nome
                return
            }
            else if(this.sectorName != '')
                return
           
            try {
                const response = await Setores.getName(this.$route.params.slug)
                this.sectorName = response.data.nome
            }
            catch (err) {
                this.handleWithError()
            }
        },

        async getAllTimeConsumeData() {
            this.error = this.loaded = this.noDataForPeriod = false
            this.resetChartData()
            this.getSectorData()

            try {
                const response = await Consumo.sectorAllTime(this.$route.params.slug)
                this.handleWithChartOptions(response.data.periodo)
                this.handleWithConsumeData(response.data)
            }
            catch (err) {
                this.handleWithError()
            }
        },

        async getYearConsumeData() {
            this.error = this.loaded = this.noDataForPeriod = false
            this.resetChartData()
            this.getSectorData()
            
            try {
                let params = {
                    slug: this.$route.params.slug,
                    year: this.dateVal
                }

                const response = await Consumo.sectorPerYear(params)
                this.handleWithChartOptions(response.data.periodo)
                this.handleWithConsumeData(response.data)
            }
            catch (err) {
                this.handleWithError()
            }
        },

        async getIntervalConsumeData() {
            this.error = this.loaded = this.noDataForPeriod = false
            this.resetChartData()
            this.getSectorData()
            
            try {
                let params = {
                    slug: this.$route.params.slug,
                    initialDate: this.dateVal,
                    endDate: this.dateVal2
                }
                
                const response = await Consumo.sectorPerPeriod(params)
                this.handleWithChartOptions(response.data.periodo)
                this.handleWithConsumeData(response.data)
            }
            catch (err) {
                this.handleWithError()
            }
        },

        async getMonthConsumeData() {
            this.error = this.loaded = this.noDataForPeriod = false
            this.resetChartData()
            this.getSectorData()
            
            try {
                const response = await Consumo.sectorPerMonth(this.getParamsMonthConsume())
                this.handleWithChartOptions(response.data.periodo)
                this.handleWithConsumeData(response.data)
            }
            catch (err) {
                this.handleWithError()
            }
        },

        async getDayConsumeData() {
            this.error = this.loaded = this.noDataForPeriod = false
            this.resetChartData()
            this.getSectorData()

            try {
                let params = {
                    slug: this.$route.params.slug,
                    date: this.dateVal
                }
                const response = await Consumo.sectorPerDay(params)
                this.handleWithChartOptions(response.data.periodo)
                this.handleWithConsumeData(response.data)
            }
            catch (err) {
                this.handleWithError()
            }
        }
    },

    mounted() {
        this.getMonthConsumeData()      
        this.setExportedFileName()
    }
}
</script>

<style>
.consumo_total {
    font-size: 1.6em;
    height: 80%;
}

.bar_card{
    max-width: 360px;
    max-height: 360px;
}
</style>