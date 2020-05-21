<template>
    <div class="fill-height" fluid>
     <DrawerToolbar :routeName="$route.meta.title"/>
        <v-container 
        class="fill-height"
        align-start
        fluid>
            <v-row v-show="!gettingUser&&!errorGettingUser">
                <v-col>
                    <v-form @submit.prevent="createUser">
                        <v-card class="elevation-12 pb-1">
                                <v-container fluid class="mt-0 my-5">
                                    <v-card-text class="mb-0 pb-0"> 
                                        <v-card-subtitle class="ma-0 pa-0 title font-weight-bold primary--text">
                                            Dados
                                        </v-card-subtitle>
                                        <v-divider
                                            class="mt-0 my-5"   
                                        />

                                        <v-row>
                                            <v-col
                                            cols="12"
                                            sm="12"
                                            md="6"
                                            lg="6"
                                            xl="6"
                                            class="my-0 py-0"
                                            >
                                                <v-text-field
                                                    outlined
                                                    required
                                                    label="Nome"
                                                    v-model="user.nome"
                                                    name="name"
                                                    type="text"
                                                    :error-messages="nomeErrors"
                                                />
                                            </v-col> 

                                            <v-col
                                            cols="12"
                                            sm="12"
                                            md="6"
                                            lg="6"
                                            xl="6"
                                            class="my-0 py-0"
                                            >   
                                                <v-text-field
                                                    outlined
                                                    required
                                                    label="Sobrenome"
                                                    v-model="user.sobrenome"
                                                    name="surname"
                                                    type="text"
                                                    :error-messages="sobrenomeErrors"
                                                />
                                            </v-col>
                                        </v-row>

                                        <v-card-subtitle class="ma-0 pa-0 title font-weight-bold primary--text">
                                            Conta
                                        </v-card-subtitle>

                                        <v-divider
                                        class="mt-0 my-5"   
                                        ></v-divider>


                                        <v-row >
                                            <v-col
                                            cols="12"
                                            sm="12"
                                            md="6"
                                            lg="6"
                                            xl="6"
                                            class="my-0 py-0"
                                            >
                                                <v-text-field
                                                outlined
                                                required
                                                label="Usuário"
                                                v-model="user.username"
                                                name="username"
                                                type="text"
                                                :error-messages="usernameErrors"
                                                @keydown.space.prevent
                                                />
                                            </v-col>   

                                            <v-col
                                            cols="12"
                                            sm="12"
                                            md="6"
                                            lg="6"
                                            xl="6"
                                            class="my-0 py-0"
                                            >

                                                <v-text-field
                                                v-model="user.password"
                                                label="Senha"
                                                :type="show ? 'text' : 'password'"
                                                :append-icon="!show ? 'mdi-eye' : 'mdi-eye-off'"
                                                @click:append="show = !show"
                                                :error-messages="passwordErrors"
                                                required
                                                outlined    
                                                class="mb-0 pb-0"
                                                :disabled="!changePassword"
                                                />      

                                                <v-checkbox 
                                                type="checkbox" 
                                                class="ma-0 ml-2 pa-0" 
                                                v-model="changePassword"
                                                @click:append="changePassword = !changePassword" 
                                                :label="'Redefinir senha'"
                                                
                                                />
                                            </v-col>
                                        </v-row>                  
                                    </v-card-text>

                                    <v-checkbox 
                                    type="checkbox" 
                                    class="ml-5 mt-2" 
                                    v-model="user.isAdmin"
                                    @click:append="user.isAdmin = !user.isAdmin" 
                                    :label="`Administrador`"
                                    color="amber accent-4"
                                    />

                                    <v-checkbox 
                                    type="checkbox" 
                                    class="ml-5 mt-1"
                                    v-model="user.isSupplier"
                                    @click:append="user.isSupplier = !user.isSupplier" 
                                    :label="`Fornecedor`"
                                    />
                                    

                                    <v-switch color="success" class="ml-5 mt-1" v-model="user.isActive" v-if="user.isActive === true" :label="`Ativo`" @click:append="user.isActive = !user.isActive" ></v-switch>
                                    <v-switch class="ml-5 mt-1" v-model="user.isActive" v-if="user.isActive === false" :label="`Inativo`" @click:append="user.isActive = !user.isActive"></v-switch>                               
                                                                
                                    <v-card-actions class=" mt-0 justify-center text-center">
                                        <v-btn type="submit" class="px-4 mt-0" color="primary" :loading="isLoading">
                                            Editar                          
                                        </v-btn>
                                    </v-card-actions>
                                </v-container>                                        
                        </v-card>
                    </v-form>
                </v-col>
            </v-row>

            <LoadingPage :show="gettingUser" />

            <v-alert
            v-show="errorGettingUser"
            prominent
            type="error"
            transition="slide-x-reverse-transition"
            class="errorGettingUserAlert mt-4"
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
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import Users from '../services/Users'

import DrawerToolbar from '../components/DrawerToolbar'
import LoadingPage from '../components/LoadingPage'

export default {
    components: {
        DrawerToolbar,
        LoadingPage
    },

    data: () => ({
        user: {
            nome: '',
            sobrenome: '',
            username: '',
            password: '',
            isActive: true,
            isAdmin: false,
            isSupplier: false,
        },
        changePassword: false,
        gettingUser: false,
        errorGettingUser: false,
        errorMessage: '',
        show: false,
        isLoading: false,
        alertData: {
            show: false,
            message: '',
            type: 'success'
        }     
    }),

    validations: {
        user: {
            nome:{
                required,
                maxLength: maxLength(150)
            },
            sobrenome:{
                required,
                maxLength: maxLength(150)
            },
            username: {
                required,
                maxLength: maxLength(80)
            },
            password: {
                minLength: minLength(6),
                maxLength: maxLength(60)
            }
        }
    },
    

    computed: {
        nomeErrors(){
            const errors = []
            if (!this.$v.user.nome.$dirty) return errors
            !this.$v.user.nome.required && errors.push('Nome é obrigatório')
            !this.$v.user.nome.maxLength && errors.push('Nome excedeu o limite de caracteres')          
            return errors
        },

        sobrenomeErrors(){
            const errors = []
            if (!this.$v.user.sobrenome.$dirty) return errors
            !this.$v.user.sobrenome.required && errors.push('Sobrenome é obrigatório')
            !this.$v.user.sobrenome.maxLength && errors.push('Sobrenome excedeu o limite de caracteres')          
            return errors
        },

        passwordErrors() {
            const errors = []
            if (!this.$v.user.password.$dirty) return errors
            
            //!this.$v.user.password.required && errors.push('Senha é obrigatória')
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
        }
    },

    methods: {
        async createUser(){
            this.isLoading = true

            await this.removePasswordElement()

            this.$v.$touch()
            
            if(this.$v.$invalid) {
               this.isLoading = false
            }    
            else {
                try {
                    this.user.nome = await this.capitalize(this.user.nome)
                    this.user.sobrenome = await this.capitalize(this.user.sobrenome)
                    this.user.username = await this.normalize(this.user.username)
                                                            
                    await Users.update(this.$route.params.id, this.user)
                    this.isLoading = false
                    this.alertData.message = 'Usuário editado com sucesso'
                    this.alertData.type = 'success'
                    this.alertData.show = true
                    //this.$router.replace({ name: 'Usuários'});
                }
                catch(err) {
                    console.log(err.response.data.error.message)
                    if(err.response.status == 404)
                        this.alertData.message = 'Usuário não encontrado'
                    else if(err.response.data.error.message.includes("users_username_unique"))  
                        this.alertData.message = 'Usuário já existe'  
                    else    
                        this.alertData.message = 'Ocorreu um erro interno'

                    this.isLoading = false
                    this.alertData.type = 'error'
                    this.alertData.show = true
                    
                }
            }
        },

        capitalize(string) {
            return string.toUpperCase()
        },

        normalize(string) {
            return string.toLowerCase()
        },

        setUser(userData) {
            this.user.nome = userData.nome
            this.user.sobrenome = userData.sobrenome
            this.user.username = userData.username
            this.user.isAdmin = userData.isAdmin
            this.user.isSupplier = userData.isSupplier
            this.user.isActive = userData.isActive
            
        },

        checkUserParams() {
            if(typeof this.$route.params.user == undefined || this.$route.params.user == null)
                this.getUser()
            else{
                this.setUser(this.$route.params.user)
            }

        },

        async getUser() {
            this.gettingUser = true
            try{
                    const user = await Users.show(this.$route.params.id)
                    this.setUser(user.data)
                    this.gettingUser = this.errorGettingUser = false
                }
                catch(err){
                    this.gettingUser = false
                    this.errorGettingUser = true
                    
                    if(err.response.status == 404)
                        this.errorMessage = 'Usuário não encontrado'
                    else
                        this.errorMessage = 'Houve um problema ao carregar dados do usuário' 
                }
        },

        tryAgain(){
            this.error = false
            this.getUser()
        },

        removePasswordElement(){
            if(!this.changePassword || this.user.password == ''){
                this.user.password = ''
                delete this.user.password
            } 
        }
    },

    mounted(){
        this.checkUserParams()
    }

}
</script>

<style>
.importAlert{
    position: fixed;
    bottom: 0;
    right: 0;
}

.errorGettingUserAlert{
    width: 100%;
}

</style>
