<template>
    <div>
        <DrawerToolbar :routeName="$route.meta.title"/>
        <v-container
        fluid
        v-if="loaded"
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
                                v-model="period"
                                @change="setDatePickerLabel"
                                ></v-select>
                            </v-col>

                            <v-col 
                            cols="12"
                            sm="4"
                            class="pb-0 mb-0"
                            >
                                <v-menu
                                v-if="period == 'ano'"
                                :close-on-content-click="false"
                                :nudge-right="35"
                                transition="scale-transition"
                                offset-y 
                                max-width="290px"
                                min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                        label="Ano"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        :value="dateSelect"
                                        v-on="on"
                                        outlined
                                        />
                                    </template>
                                    <v-date-picker
                                    locale="pt-br"
                                    v-model="year"
                                    no-title
                                    @input="dateMenu = false"
                                   
                                    />
                                </v-menu>
                               
                                <v-menu
                                v-if="period == 'mes'"
                                :close-on-content-click="false"
                                :nudge-right="35"
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
                                    />
                                </v-menu>
                            

                                <v-menu
                                v-if="period == 'dia' || period == 'intervalo'"
                                :close-on-content-click="false"
                                :nudge-right="35"
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
                                    @change="getDayConsumeData"
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
                                :nudge-right="35"
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
                                    />
                                </v-menu>
                            </v-col>    
                        </v-card-title>    
                    </v-card>
                </v-col>
            </v-row>    
            <v-row>
                <v-col
                xs="12"
                sm="8"
                md="8"
                lg="8"
                xl="8"
                align="center"
                justify="center"
                >
                    <v-card class="pa-4">
                        <doughnut-chart
                        class="doughnut_card"
                        :chartdata="chartdata"
                        :options="options"
                        />
                    </v-card>
                </v-col>
                <v-col
                sm="4"
                md="4"
                lg="4"    
                xl="4"
                >
                    <v-card>
                        <v-card-text class="grey--text">
                            Consumo total
                        </v-card-text>
                        <v-card-title class="cinzaEscuro--text layout justify-center consumo_total">
                            <v-icon large color="primary">mdi-water</v-icon>
                            {{totalConsume}}L
                        </v-card-title>
                    </v-card>    
                </v-col>    
            </v-row>        
        </v-container>
        <LoadingPage :show="!loaded" />
    </div>
</template>

<script>
import DrawerToolbar from '../components/DrawerToolbar'
import DoughnutChart from '../components/ConsumoGeralChart'
import LoadingPage from '../components/LoadingPage'

import Consumo from '../services/Consumo'

export default {
    components:{
        DrawerToolbar,
        DoughnutChart,
        LoadingPage
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
        period: 'mes',
        periodOptions: [
            {text: 'Desde sempre', value: 'sempre'},
            {text: 'Intervalo', value: 'intervalo'},
            {text: 'Ano', value: 'ano'},
            {text: 'Mês', value: 'mes'},
            {text: 'Dia', value: 'dia'},
        ],
        dateMenu: false,
        dateVal: null,
        year: null,
        labelInput1: null,
    }),

    computed: {
        showInput() {
            if(this.period == 'intervalo' || this.period == 'ano' || this.period == 'mes' || this.period == 'dia') {
                return true
            }   
            else {
                return false
            } 
        },

        dateSelect() {
            return this.formatDate(this.dateVal);  
        },

    },

    watch: {
        period() {
            this.dateVal = null
        }
    },

    methods: {
        setDatePickerLabel() {
            if(this.period == 'dia')
                this.labelInput1 = 'Data'   
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
        },

        getMonth(date) {
            const month = date.split('-')
            return `${month[1]}`
        },

        getYear(date) {
            const [year] = date.split('-')
            return `${year}`
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
        },

        getParamsMonthConsume() {
            if(this.dateVal == null){
                let params = {
                    year: new Date().getFullYear(),
                    month: new Date().getMonth()+1,
                }
                return params
            }
            
            let params = {
                year: this.getYear(this.dateVal),
                month: this.getMonth(this.dateVal),
            }
            return params
        },

        dealwithConsumeData(data) {
            data.consumos.forEach(element => {
            this.chartdata.labels.push(element.setor)
            this.chartdata.datasets[0].data.push(element.litros)
            this.chartdata.datasets[0].backgroundColor.push(this.getRandomColor())
            });

            this.totalConsume = data.total
            this.loaded = true
        },

        async getAllTimeConsumeData() {
            this.loaded = false
            this.resetChartData()

            try {
                const response = await Consumo.generalAllTime()
                this.dealwithConsumeData(response.data)
            }
            catch (err) {
                console.error(err)
            }
        },

        async getMonthConsumeData() {
            this.loaded = false
            this.resetChartData()

            try {
                const response = await Consumo.generalPerMonth(this.getParamsMonthConsume())
                this.dealwithConsumeData(response.data)
            }
            catch (err) {
                console.error(err)
            }
        },

        async getDayConsumeData() {
            if(this.period == 'intervalo')
                return
                
            this.loaded = false
            this.resetChartData()

            try {
                let params = {
                    date: this.dateVal
                }
                const response = await Consumo.generalPerDay(params)
                this.dealwithConsumeData(response.data)
            }
            catch (err) {
                console.error(err)
            }
        }
    },

    async mounted () {
       this.getMonthConsumeData()
    }
}
</script>

<style>
.doughnut_card{
    max-width: 370px;
    max-height: 370px;
}

.consumo_total {
    font-size: 1.6em;

}
</style>