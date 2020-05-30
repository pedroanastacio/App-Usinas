<template>
<div>
<DrawerToolbar :routeName="$route.meta.title"/>
    <v-container 
    class="fill-height cinza pt-0" 
    fluid        
    >
        <v-row>
            <v-col>
                <v-form @submit.prevent="createSector">
                    <v-card class="elevation-12 pb-4 mt-0">
                        <v-container fluid class="mt-0 my-2">
                            <v-card-text class="mb-0 pb-0">
                                <v-card-subtitle class="ma-0 pa-0  title font-weight-bold primary--text">
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
                                <v-btn type="submit" class="px-3 mt-0" color="primary">Cadastrar</v-btn>
                            </v-card-actions>
                        </v-container>
                    </v-card>
                </v-form>
            </v-col>
        </v-row> 
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
import {required, maxLength } from 'vuelidate/lib/validators'
import DrawerToolbar from '../components/DrawerToolbar'
import Setores from '../services/Setores'

export default {
    components:{
        DrawerToolbar
    },
    data: () => ({

        setor:{
            nome: '',
            isActive: true,
        },
        show: false,
        isLoading: false,
        alertData: {
            show: false,
            message: '',
            type: 'success'
        } 
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
        },
    },
    methods:{
        async createSector(){
            this.$v.$touch()
                
            if(this.$v.$invalid) {
                return 
            }    
                else {
                    try {
                        this.setor.nome = await this.capitalize(this.setor.nome)

                        await Setores.store(this.setor)
                        this.isLoading = false
                        this.alertData.message = 'Setor cadastrado com sucesso'
                        this.alertData.type = 'success'
                        this.alertData.show = true
                    
                        this.resetForm()
                        //this.$router.replace("/Setores");
                    }
                    catch(err) {
                        this.isLoading = false
                        this.alertData.message = err.response.data.message
                        this.alertData.type = 'error'
                        this.alertData.show = true
                    }
                }
          },

        resetForm() {
            this.setor = {
                nome: '',
                isActive: true,
            }

            this.$v.$reset()
        },

        capitalize(string) {
            return string.toUpperCase()
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