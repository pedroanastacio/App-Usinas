<template>
    <div>
        <DrawerToolbar :routeName="$route.meta.title"></DrawerToolbar>
        <v-container
        class="pt-0"
        >
            <v-row justify="center">
                <v-col 
                xs="12"
                sm="6"
                >
                    <v-form @submit.prevent="changePassword">
                        <v-card class="pb-4">
                            <v-card-text>
                                <v-text-field
                                v-model="user.password"
                                label="Senha"
                                :type="show ? 'text' : 'password'"
                                :append-icon="!show ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="show = !show"
                                :error-messages="passwordErrors"
                                required
                                outlined    
                                />     
                                <v-text-field
                                v-model="confirmPassword"
                                label="Confirmar senha"
                                :type="show2 ? 'text' : 'password'"
                                :append-icon="!show2 ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="show2 = !show2"
                                :error-messages="confirmPasswordErrors"
                                required
                                outlined    
                                />     
                            </v-card-text>  

                            <v-card-actions class="mt-0 justify-center text-center">
                                <v-btn type="submit" class="px-4 mt-0" color="primary" :loading="isLoading">
                                    Alterar                          
                                </v-btn>
                            </v-card-actions>  
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
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import DrawerToolbar from '../components/DrawerToolbar'

import Auth from '../services/authentication'
import Users from '../services/Users'

export default {
    components: {
        DrawerToolbar
    },

    data: () => ({
        user: {
            password: ''
        },
        confirmPassword: '',
        show: false,
        show2: false,
        isLoading: false,
        alertData: {
            type: 'success',
            show: false,
            message: ''
        }
    }),

    validations: {
        user: {
            password: {
                required,
                minLength: minLength(6),
                maxLength: maxLength(60)
            }
        },       
        confirmPassword: {
            required,
            minLength: minLength(6),
            maxLength: maxLength(60)
        }
    },

    computed: {
        passwordErrors() {
            const errors = []
            if (!this.$v.user.password.$dirty) return errors
            
            !this.$v.user.password.required && errors.push('Senha é obrigatória')
            !this.$v.user.password.maxLength && errors.push('Senha excedeu o limite de caracteres')
            !this.$v.user.password.minLength && errors.push('Senha deve ter pelo menos 6 caracteres')
            return errors 
        },
        confirmPasswordErrors() {
            const errors = []
            if (!this.$v.confirmPassword.$dirty) return errors
            
            !this.$v.confirmPassword.required && errors.push('Senha é obrigatória')
            !this.$v.confirmPassword.maxLength && errors.push('Senha excedeu o limite de caracteres')
            !this.$v.confirmPassword.minLength && errors.push('Senha deve ter pelo menos 6 caracteres')
            return errors 
        },
    },

    methods: {
        async changePassword() {
            this.isLoading = true
            this.$v.$touch()
            
            if(this.$v.$invalid) {
               this.isLoading = false
            }    
            else if (this.user.password != this.confirmPassword) {
                this.isLoading = false
                this.alertData.message = 'As senhas devem ser iguais'
                this.alertData.type = 'error'
                this.alertData.show = true
            }
            else{
                try {
                    const response = await Auth.getUserId()
                    await Users.update(response.data, this.user)
                    this.isLoading = false
                    this.alertData.message = 'Senha alterada com sucesso'
                    this.alertData.type = 'success'
                    this.alertData.show = true
                }
                catch(err) {
                    console.log(err.response.data)
                    this.isLoading = false
                    this.alertData.message = 'Ocorreu um erro interno'
                    this.alertData.type = 'error'
                    this.alertData.show = true
                }
            }
        }
    },

    
}
</script>

<style>
.importAlert{
    position: fixed;
    bottom: 0;
    right: 0;
}

</style>