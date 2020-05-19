<template>
    <div>
        <DrawerToolbar :routeName="$route.name"/>
        <v-row>             
            <v-col
            cols="12"
            sm="12"
            md="12" 
            lg="12"
            xl="12"
            >
                <v-card class="col-sm-9 pa-5 pt-6 elevation-4 mx-3">
                    <v-file-input
                        label="Selecione um arquivo"
                        placeholder="Arquivo"
                        @change="loadCSV"
                        accept=".csv"
                        outlined/>
                    <v-btn @click="uploadFile" class="success" :loading="importing">Importar
                    <v-icon right>mdi-file-upload</v-icon>
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>

        <v-alert
        type="error"
        v-model="importFailed"
        class="importAlert"
        transition="slide-x-reverse-transition"
        dismissible
        >
            {{message}}
        </v-alert> 
        
        <v-alert
        type="success"
        v-model="importSuccess" 
        class="importAlert"
        transition="slide-x-reverse-transition"
        dismissible
        >
            {{message}}
        </v-alert>
    </div>
</template> 

<script>
import Consumo from '../services/Consumo'
import DrawerToolbar from '../components/DrawerToolbar'

export default {
    components:{
        DrawerToolbar
    },

    data: () => ({
        file: '',
        importFailed: false,
        importSuccess: false,
        message: '',
        importing: false,
    }),

    methods: {
        loadCSV(file) {
            this.file = file
            this.importFailed = false
            this.importSuccess = false
        }, 
        
        async uploadFile(){
            if(this.file == '' ||  typeof this.file === 'undefined'){
                this.message = 'É obrigatório selecionar um arquivo para importar'
                this.importSuccess = false
                this.importFailed = true
            }
            else if(this.file.name.indexOf(".csv") == -1){
                this.importFailed = true
                this.message = 'Extensão do arquivo é inválida. Apenas CSV é aceito'
            }
            else{
                this.importing = true
                let formData = new FormData()
                formData.append('file', this.file)
                try{
                    const response = await Consumo.store(formData) 
                    this.importing = false
                    if(response.data.type == "extname"){
                        this.importSuccess = false
                        this.importFailed = true
                        this.message = 'Extensão do arquivo é inválida. Apenas CSV é aceito'
                        
                    }
                    else if(response.data.description == "invalid id"){
                        this.importSuccess = false
                        this.importFailed = true
                        this.message = response.data.message
                    }
                    else{
                        this.importFailed = false
                        this.importSuccess = true
                        this.message = response.data.message
                    }
                }catch(err){
                    this.importing = false
                    this.importSuccess = false
                    this.importFailed = true
                    this.message = err.response.data.message
                   
                }
            
            }
        },

    }

}
</script>

<style>
.importAlert{
    position: fixed;
    bottom: 0;
    right: 0;
    
}
</style>