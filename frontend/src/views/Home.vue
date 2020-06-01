<template>
    <div>
        <DrawerToolbar :routeName="$route.meta.title"/>
        <v-container
        fluid
        class="pt-0"
        >
            <v-row>
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
                                v-if="period == 'mes'"
                                :close-on-content-click="false"
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
                                :close-on-content-click="false"
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
                                :close-on-content-click="false"
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

                        <div  align="center">
                            <doughnut-chart
                            class="doughnut_card"
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
                    <v-card class="pb-4">
                        <v-card-text class="grey--text">
                            Consumo total
                        </v-card-text>
                        <v-card-title class="cinzaEscuro--text layout justify-center consumo_total">
                            <v-icon large color="primary">mdi-water</v-icon>
                            {{totalConsume}} L
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
                    loading-text="Carregando setores..."
                    no-data-text="Nenhum setor encontrado"
                    locale="pt-BR"  
                    item-key="id"
                    :hide-default-footer="true"
                    class="elevation-2"
                    /> 
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
import DoughnutChart from '../components/ConsumoGeralChart'
import LoadingPage from '../components/LoadingPage'
import ErrorAlert from '../components/ErrorAlert'
import Consumo from '../services/Consumo'
import chroma from 'chroma-js'


export default {
    components:{
        DrawerToolbar,
        DoughnutChart,
        LoadingPage,
        ErrorAlert
    },

    data: () => ({
        chartdata: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: []
            }]
        },
        options: {
            legend: {
                position: 'bottom',
            },
        },
        totalConsume: '',
        loaded: false,
        error: false,
        noDataForPeriod: false,
        period: 'mes',
        periodOptions: [
            {text: 'Desde sempre', value: 'sempre'},
            {text: 'Intervalo', value: 'intervalo'},
            {text: 'Ano', value: 'ano'},
            {text: 'Mês', value: 'mes'},
            {text: 'Dia', value: 'dia'},
        ],
        dateVal: new Date().toISOString().substr(0, 7),
        dateVal2: null,
        minDate: '2020-01-01',
        maxDate: new Date().toISOString().substr(0, 10),
        dateMenu: false,
        labelInput1: null,
        consumeData: [],
        headers: [
            {text: 'Setor', align: 'left', value:'setor', class: "primary white--text" },
            {text: 'Litros (L)', align:'left', value: 'litros', class: "primary white--text"}, 
            {text: 'Porcentagem (%)', align: 'left', value: 'percent', class: "primary white--text"}
        ]
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
            if(val == 'mes') {
                this.dateVal = new Date().toISOString().substr(0, 7)
                this.getMonthConsumeData()
            }
            else if(val == 'dia') {
                this.dateVal = new Date().toISOString().substr(0, 10)
                this.getDayConsumeData()
            }
            else if(val == 'ano') {
                this.dateVal = parseInt(new Date().toISOString().substr(0, 4))
                this.getYearConsumeData()
            } 
            else if(val == 'intervalo') {
                this.dateVal = new Date().toISOString().substr(0, 10)
                this.dateVal2 = new Date().toISOString().substr(0, 10)
                this.getIntervalConsumeData()
            } 
            else{
                this.dateVal = 'Desde sempre'
            }
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
        
        formatDate(date) {
            if (!date) return null

            if(this.period == 'dia' || this.period == 'intervalo') {
                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            }
            else if(this.period == 'mes') {
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

        getMonth(date) {
            const month = date.split('-')
            return `${month[1]}`
        },

        getYear(date) {
            const [year] = date.split('-')
            return `${year}`
        },

        getColors(length) {
            return chroma.scale(['#69F0AE','#1565C0', 'red']).colors(length);
        },

        getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },

        resetChartData() {
            this.chartdata = {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: []
            }]
            }

            this.totalConsume = ''
            this.consumeData = []
        },

        getParamsMonthConsume() {
            let params = {
                year: this.getYear(this.dateVal),
                month: this.getMonth(this.dateVal),
            }
            return params
        },

        percentCalculate(total, sectorConsume) {
            return parseFloat((sectorConsume/total)*100).toFixed(2);
        },

                
        handleWithconsumeData(data) {
            //this.consumeData = data.consumos
            
            data.consumos.forEach(element => {
            this.chartdata.labels.push(element.setor)
            this.chartdata.datasets[0].data.push(element.litros)
            this.consumeData.push({
                "setor": element.setor,
                "litros": `${Number(element.litros).toLocaleString('pt-BR')} L`,
                "percent": `${Number(this.percentCalculate(data.total, element.litros)).toLocaleString('pt-BR')}%`
                })
            });

            this.chartdata.datasets[0].backgroundColor = this.getColors(data.consumos.length)

            if(data.consumos.length == 0){
                this.noDataForPeriod = true
            }
           
            this.totalConsume = Number(data.total).toLocaleString('pt-BR')

            this.loaded = true
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

        async getAllTimeConsumeData() {
            this.error = this.loaded = this.noDataForPeriod = false
            this.resetChartData()

            try {
                const response = await Consumo.generalAllTime()
                this.handleWithconsumeData(response.data)
            }
            catch (err) {
                this.handleWithError()
            }
        },

        async getYearConsumeData() {
            this.error = this.loaded = this.noDataForPeriod = false
            this.resetChartData()
            
            try {
                let params = {
                    year: this.dateVal
                }

                const response = await Consumo.generalPerYear(params)
                this.handleWithconsumeData(response.data)
            }
            catch (err) {
                this.handleWithError()
            }
        },

        async getIntervalConsumeData() {
            this.error = this.loaded = this.noDataForPeriod = false
            this.resetChartData()
            
            try {
                let params = {
                    initialDate: this.dateVal,
                    endDate: this.dateVal2
                }
                
                const response = await Consumo.generalPerPeriod(params)
                this.handleWithconsumeData(response.data)
            }
            catch (err) {
                this.handleWithError()
            }
        },

        async getMonthConsumeData() {
            this.error = this.loaded = this.noDataForPeriod = false
            this.resetChartData()
            
            try {
                const response = await Consumo.generalPerMonth(this.getParamsMonthConsume())
                this.handleWithconsumeData(response.data)
            }
            catch (err) {
                console.log(err)
                this.handleWithError()
            }
        },

        async getDayConsumeData() {
            this.error = this.loaded = this.noDataForPeriod = false
            this.resetChartData()

            try {
                let params = {
                    date: this.dateVal
                }
                const response = await Consumo.generalPerDay(params)
                this.handleWithconsumeData(response.data)
            }
            catch (err) {
                this.handleWithError()
            }
        }
    },

    async mounted() {  
       this.getMonthConsumeData()
    }
}
</script>

<style>
.doughnut_card{
    max-width: 350px;
    max-height: 350px;
}

.consumo_total {
    font-size: 1.6em;

}
</style>