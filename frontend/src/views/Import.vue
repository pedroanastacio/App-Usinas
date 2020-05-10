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
                if(response.data.message == 'Invalid file extension png. Only csv is allowed')
                    console.log('Extensão do arquivo é invalida. Apenas CSV é aceito')
                else
                    console.log(response.data.message)    
            }catch(err){
                console.log(err.response.data.message)
            }
          
        }
    }

}
</script>

<style>

</style>