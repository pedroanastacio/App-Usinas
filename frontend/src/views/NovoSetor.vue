<template>
    <v-container 
            class="fill-height cinza mt-0" 
            fluid        
        >
            <v-row 
            align="center"
            justify="center"
            class="mt-0"
            >
                <v-col
                    cols="12"
                    sm="8"
                    md="6"
                    class="mt-0"
                >
                    <v-form @submit.prevent="createSector">
                        <v-card class="elevation-12 pb-4 mt-0">
                            <v-card-title class="primary white--text">
                                Novo Setor
                            </v-card-title>
                            <v-card-text class="px-8 pl-5 py-0 pt-8"> 
                                <v-text-field
                                    outlined
                                    required
                                    label="Nome do Setor"
                                    v-model="sector.nome"
                                    :error-messages="sectorErrors"
                                    name="name"
                                    type="text"
                                    class="mt-1"
                                />
                            </v-card-text>
                            <v-switch 
                                class="ml-5 mt-0" 
                                v-model="sector.activeSector" 
                                v-if="sector.activeSector === true" 
                                :label="` Setor Ativo`" 
                                @click:append="sector.activeSector = !sector.activeSector">
                            </v-switch>
                            <v-switch 
                                class="ml-5 mt-0" 
                                v-model="sector.activeSector" 
                                v-if="sector.activeSector ===false" 
                                :label="`Setor Inativo`" 
                                @click:append="sector.activeSector = !sector.activeSector">
                            </v-switch>

                            <v-card-actions class=" mt-0 justify-center text-center">
                                <v-btn type="submit" class="px-3 mt-0" color="primary">Criar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-form>
                </v-col>
            </v-row> 
    </v-container>      

</template>


<script>
import {required, maxLength } from 'vuelidate/lib/validators'

export default {
    data: () => ({

        sector:{
            nome: '',
            activeSector: true,
        }
    }),
    validations:{
        sector:{
            nome:{
                required,
                maxLength:maxLength(150)
            }
        }
    },
    computed:{
        sectorErrors(){
            const errors = []
            if (!this.$v.sector.nome.$dirty) return errors
            !this.$v.sector.nome.required && errors.push('Setor é obrigatório')
            !this.$v.sector.nome.maxLength && errors.push('O setor excedeu o limite de caracteres')          
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
                        this.$router.replace("/Sectors");

                    }
                    catch(err) {
                        this.error = err.response.data.error
                    }
                }
          }
    }
}
</script>