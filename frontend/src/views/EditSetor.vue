<template>
<div>
    <DrawerToolbar :routeName="$route.meta.title"/>
    <v-container 
    class="fill-height pt-0"
    align-start
    fluid
    
    >
        <v-row v-show="!gettingSetor&&!errorGettingSetor">
            <v-col>
                <v-form @submit.prevent="createSector">
                        <v-card class="elevation-12 pb-4 mt-0">
                            <v-container fluid class="mt-0 my-2">
                                <v-card-text class="mb-0 pb-0">
                                    <v-card-subtitle class="ma-0 pa-0 title font-weight-bold primary--text">
                                        Dados
                                    </v-card-subtitle>
                                    <v-divider
                                        class="mt-0 my-5"   
                                    />
                           
                                    <v-text-field
                                        outlined
                                        required
                                        label="Nome do Setor"
                                        v-model="setor.nome"
                                        :error-messages="setorErrors"
                                        name="name"
                                        type="text"
                                        class="mt-1"
                                    />
                                </v-card-text>
                            <v-switch 
                                class="ml-5 mt-0"
                                color="success" 
                                v-model="setor.isActive" 
                                v-if="setor.isActive === true" 
                                :label="`Ativo`" 
                                @click:append="setor.isActive = !setor.isActive">
                            </v-switch>
                            <v-switch 
                                class="ml-5 mt-0" 
                                v-model="setor.isActive" 
                                v-if="setor.isActive === false" 
                                :label="`Inativo`" 
                                @click:append="setor.isActive = !setor.isActive">
                            </v-switch>

                            <v-card-actions class=" mt-0 justify-center text-center">
                                <v-btn type="submit" class="px-3 mt-0" color="primary">Editar</v-btn>
                            </v-card-actions>
                            </v-container>
                        </v-card>
                    </v-form>
            </v-col>
        </v-row>
        <LoadingPage :show="gettingSetor" />

            <v-alert
            v-show="errorGettingSetor"
            prominent
            type="error"
            transition="slide-x-reverse-transition"
            class="errorGettingSetorAlert mt-4"
            >
                <v-row align="center" >
                    <v-col class="grow">{{ errorMessage }}</v-col>
                    <v-col class="shrink">
                        <v-btn light class="grey lighten-2" @click="tryAgain">Tentar novamente</v-btn>
                    </v-col>
                </v-row>
            </v-alert>
    </v-container>
    <v-alert
            :type="alertData.type"
            v-model="alertData.show" 
            class="importAlert elevation-11"
            transition="slide-x-reverse-transition"
            dismissible
            >
                {{alertData.message}}
    </v-alert>
</div>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'
import Setores from '../services/Setores'

import DrawerToolbar from '../components/DrawerToolbar'
import LoadingPage from '../components/LoadingPage'

export default {
    components:{
        DrawerToolbar,
        LoadingPage
    },
    data:() =>({
        setor:{
            nome: '',
            isActive: true,
        },
        errorGettingSetor: false,
        gettingSetor: false,
        show: false,
        isLoading: false,
        errorMessage: '',
        alertData: {
            show: false,
            message: '',
            type: 'success'
        },
    }),

    validations:{
        setor:{
            nome:{
                required,
                maxLength:maxLength(150)
            }
        }
    },
    computed:{
        setorErrors(){
            const errors = []
            if (!this.$v.setor.nome.$dirty) return errors
            !this.$v.setor.nome.required && errors.push('Setor é obrigatório')
            !this.$v.setor.nome.maxLength && errors.push('Setor excedeu o limite de caracteres')          
            return errors
        }
    },
    methods: {
        async createSector(){
            this.isLoading = true
            this.$v.$touch()
            
            if(this.$v.$invalid) {
               this.isLoading = false
            }    
            else {
                try {
                    this.setor.nome = await this.capitalize(this.setor.nome)
                                                            
                    await Setores.update(this.$route.params.id, this.setor)
                    this.isLoading = false
                    this.alertData.message = 'Setor editado com sucesso'
                    this.alertData.type = 'success'
                    this.alertData.show = true
                }
                catch(err) {
                    if(err.response.status == 404)
                        this.alertData.message = 'Setor não encontrado'
                    else if(err.response.data.error.message.includes("setores_nome_unique"))  
                        this.alertData.message = 'Setor já existe'  
                    else    
                        this.alertData.message = 'Ocorreu um erro interno'

                    this.isLoading = false
                    this.alertData.type = 'error'
                    this.alertData.show = true
                    
                }
            }
        },

        setSetor(setorData) {
            this.setor.nome = setorData.nome
            this.setor.isActive = setorData.isActive           
        },

        checkSetorParams() {
            if(typeof this.$route.params.setor == undefined || this.$route.params.setor == null)
                this.getSetor()
            else{
                this.setSetor(this.$route.params.setor)
            }

        },

          async getSetor() {
            this.gettingSetor = true
            try{
                    const setor = await Setores.show(this.$route.params.id)
                    this.setSetor(setor.data)
                    this.gettingSetor = this.errorGettingSetor = false
                }
                catch(err){
                    this.gettingSetor = false
                    this.errorGettingSetor = true
                    
                    if(err.response.status == 404)
                        this.errorMessage = 'Setor não encontrado'
                    else
                        this.errorMessage = 'Houve um problema ao carregar dados do setor' 
                }
        },
        
        capitalize(string) {
            return string.toUpperCase()
        },

        tryAgain(){
            this.error = false
            this.getSetor()
        },
    },

    mounted() {
        this.checkSetorParams()
    }
}
</script>

<style>
.importAlert{
    position: fixed;
    bottom: 0;
    right: 0;
}

.errorGettingSetorAlert{
    width: 100%;
}

</style>
