<template>
    <v-container>
        <div class="col-sm-9">
            <v-file-input placeholder="Selecionar arquivo" @change="loadCSV" accept=".csv"/>
            <v-btn @click="uploadFile" class="primary">Importar
               <v-icon right>mdi-arrow-up-bold-circle</v-icon>
            </v-btn>
        </div>

         
    </v-container>
</template>

<script>
import Consumo from '../services/Consumo'

export default {
    data: () => ({
        file: ''
    }),

    methods: {
        loadCSV(file) {
            this.file = file
            
        }, 
        
        async uploadFile(){
            let formData = new FormData()
            formData.append('file', this.file)
            try{
                const response = await Consumo.store(formData) 
                console.log(response.data.status)
            }catch(err){
                console.log(err.response.data.status)
            }
          
        }
    }

}
</script>

<style>

</style>