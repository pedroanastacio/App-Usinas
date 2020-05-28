<template>
    <div>
    <DrawerToolbar :routeName="$route.meta.title"/>
    <v-container>
        <v-row>
            <v-col>
                <v-card>
                   <doughnut-chart
                    v-if="loaded"
                    :chartdata="chartdata"
                    />
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
           
            console.log(this.chartdata.datasets[0].data)
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