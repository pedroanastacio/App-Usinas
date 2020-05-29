<template>
    <div>
    <DrawerToolbar :routeName="$route.meta.title"/>
    <v-container>
        <v-row>
            <v-col
            xs="12"
            sm="12"
            md="8"
            lg="8"
            xl="8"
            >
                <v-card>
                   <doughnut-chart
                    v-if="loaded"
                    :chartdata="chartdata"
                    />
                </v-card>
            </v-col>
            <v-col
            md="4"
            lg="4"    
            xl="4"
            >
                <v-card>
                    <v-card-title>
                        Consumo Total
                    </v-card-title>
                    <v-card-text>
                        {{totalConsume}}
                    </v-card-text>
                </v-card>    
            </v-col>    
        </v-row>        
    </v-container>
    </div>
</template>

<script>
import DrawerToolbar from '../components/DrawerToolbar'
import DoughnutChart from '../components/ConsumoGeralChart'
import Consumo from '../services/Consumo'

export default {
    components:{
        DrawerToolbar,
        DoughnutChart
    },

    data: () => ({
        chartdata: {
            labels: [],
            datasets: [{
                data: []
            }]
        },
        totalConsume: '',
        loaded: false,

    }),

    async mounted () {
        this.loaded = false
        try {
            const response = await Consumo.generalAllTime()
            
            response.data.consumos.forEach(element => {
                this.chartdata.labels.push(element.setor)
                this.chartdata.datasets[0].data.push(element.litros)
            });
           
            this.totalConsume = response.data.total
            this.loaded = true
        }
        catch (err) {
            console.error(err)
        }
    }
}
</script>

<style>

</style>