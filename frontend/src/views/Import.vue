<template>
    <div>
    <DrawerToolbar :routeName="routeName"/>
    <v-container>
        <div class="col-sm-9">
            <v-file-input
                label="Selecione um arquivo"
                placeholder="Arquivo"
                @change="loadCSV"
                accept=".csv"
                outlined/>
            <v-btn @click="uploadFile" class="success" :loading="importing">Importar
               <v-icon right>mdi-file-upload</v-icon>
            </v-btn>
        </div>

        <v-alert type="error" v-show="importFailed" class="alert" fluid>
            {{message}}
        </v-alert> 
        <v-alert type="success" v-show="importSuccess" class="alert" fluid>
            {{message}}
        </v-alert>
    </v-container>
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
        routeName: 'Importar dados',
        importFailed: '',
        importSuccess: '',
        message: '',
        importing: false,
    }),

    methods: {
        loadCSV(file) {
            this.file = file
            console.log(this.file)
            this.importFailed = ''
            this.importSuccess = ''
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
                    console.log(response)
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
                    console.log(err)
                }
            
            }
        }
    }

}
</script>

<style>
.alert{
    position: fixed;
    bottom: 0;
    right: 0;
    margin-right: 3px;
    
}
</style>