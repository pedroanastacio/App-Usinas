<template>
    <v-container 
        class="fill-height cinza" 
        fluid
        
    >
        <v-alert
        class="loginAlert"
        type="error"
        v-show="loginFailed"
        transition="slide-y-transition"
        fluid
        >
            {{error}}
        </v-alert>
        
        <v-row 
        align="center"
        justify="center"
        >
            <v-col
                cols="12"
                sm="8"
                md="4"
            >
                <v-form @submit.prevent="login">
                    <v-card class="elevation-12 pb-4">
                        <v-card-title class="primary justify-center white--text">
                            App Usinas
                        </v-card-title>
                        <v-card-text class="px-8 pl-5 py-4 pt-8">
                            
                                <v-text-field
                                    outlined
                                    required
                                    label="Usuário"
                                    v-model="user.username"
                                    name="username"
                                    type="text"
                                    prepend-icon="mdi-account"
                                    :error-messages="usernameErrors"
                                    @input="loginFailed ? loginFailed = false : null"
                                />
                                
                                <v-text-field
                                    v-model="user.password"
                                    label="Senha"
                                    prepend-icon="mdi-lock"
                                    :type="show ? 'text' : 'password'"
                                    :append-icon="!show ? 'mdi-eye' : 'mdi-eye-off'"
                                    @click:append="show = !show"
                                    :error-messages="passwordErrors"
                                    required
                                    outlined
                                    @input="loginFailed ? loginFailed = false : null"
                                />                  
                           
                        </v-card-text>
                        <v-card-actions class="justify-center text-center">
                            <v-btn type="submit" class="px-4" color="primary" :loading="isLoading">Entrar                           
                                <v-icon right>mdi-login-variant</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>    
               
            </v-col>
        </v-row>
    </v-container>    
</template>

<script>
    import { required, minLength, maxLength } from 'vuelidate/lib/validators'
    

    export default {
        data: () => ({
            user: {
                username: '',
                password: '',
            },
            show: false,
            error: '',
            loginFailed: false,
            isLoading: false,     
        }),

        validations: {
            user: {
                username: {
                    required,
                    maxLength: maxLength(80)
                },
                password: {
                    required,
                    minLength: minLength(6),
                    maxLength: maxLength(60)
                }
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
            usernameErrors() {
                const errors = []
                if (!this.$v.user.username.$dirty) return errors
                
                !this.$v.user.username.required && errors.push('Usuário é obrigatório')
                !this.$v.user.username.maxLength && errors.push('Usuário excedeu o limite de caracteres')
                return errors 
            },
           
        },

        methods: {
            async login(){
                this.isLoading = true
                   
                this.$v.$touch()
                
                if(this.$v.$invalid) {
                     this.isLoading = false
                }    
                else {
                    try {
                        /*const response = await Auth.authenticate(this.user)
                        this.loginFailed = false
                        
                        const user = {
                            "nome": response.data.nome,
                            "sobrenome": response.data.sobrenome,
                            "isAdmin": response.data.isAdmin,
                            "isSupplier": response.data.isSupplier,
                            "isActive": response.data.isActive,
                            "type": response.data.type,
                            "token": response.data.token,
                            "refreshToken": response.data.refreshToken
                        }
                                               
                        login(user)
                        this.$router.push({ name: 'Home'})*/

                        await this.$store.dispatch('auth/login', this.user)
                        this.loginFailed = this.isLoading = false
                        this.$router.push({ name: 'Home'})
                    }
                    catch(err) {
                        if(err.response.status == 400)
                            this.error = err.response.data[0].message
                        else
                            this.error = err.response.data.message
                        this.loginFailed = true
                        this.isLoading = false
                    }
                }
            }                  
    },
    
    
}    
</script>

<style>
.loginAlert{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border-radius: 0px !important;
    display: flex;
    justify-content: center;
    align-items: center;
}


</style>