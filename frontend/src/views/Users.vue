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
                    <!--<v-card class="elevation-4 mx-3 mb-2">
                        <v-card-title class="mb-0 pb-0">
                            <v-select
                            :items="searchOptions"
                            label="Pesquisar por"
                            dense
                            outlined
                            @change="searchSelect"
                            v-model="searchBy"
                            ></v-select>
                            
                            <v-text-field
                                v-show="showSearchBar"
                                outlined
                                dense
                                v-model="searchText"
                                append-icon="mdi-magnify"
                                label="Pesquisar"
                                single-line
                                class="ml-2"
                            ></v-text-field>

                            <v-switch 
                            v-show="showSearchSwitch"
                            :label="switchStatus ? 'Active': 'Non-Active'" 
                            v-model="switchStatus"
                            color="primary"
                            @change="changeSwitchStatus">
                            </v-switch>
      
                        </v-card-title>
                    </v-card>-->
                    <v-card class="elevation-4 mx-3">
                        <v-data-table   
                        v-show="!error"
                        :server-items-length="paginate.itemsLength"
                        :options.sync="paginate"                      
                        :headers="headers"   
                        :items="this.$store.state.users.usersData"
                        :loading="isLoading"
                        :footer-props="{
                            'items-per-page-options': [5,10,15,20],
                        }"
                        @update:items-per-page="getItemsPerPage"
                        @update:page="getPage"
                        @update:sort-by="sortByFunc"
                        @update:sort-desc="sortDescFunc"
                        loading-text="Carregando usuários..."
                        class="elevation-1"        
                        locale="pt-BR"  
                        item-key="username"  
                        no-data-text="Nenhum usuário encontrado" 
                        
                        >
                       
                            <template v-slot:item.isAdmin="{ item } ">
                                <v-layout justify-center>
                                <v-icon color="amber accent-4" v-model="item.isAdmin" 
                                v-if="item.isAdmin === true" 
                                medium>
                                    mdi-crown-outline
                                </v-icon>
                                
                                <h1  v-if="item.isAdmin === false">-</h1>
                                </v-layout>                                                             
                            </template>

                            <template v-slot:item.isSupplier="{ item }">
                                <v-layout justify-center>
                                    <v-icon color="blue darken-2" v-model="item.isSupplier" 
                                    v-if="item.isSupplier === true" 
                                    medium>
                                        mdi-database-plus
                                    </v-icon>                                   
                                    <h1  v-if="item.isSupplier === false">-</h1>
                                </v-layout>
                            </template>

                            <template v-slot:item.isActive="{ item }" >
                                <v-layout justify-center>
                                    <v-icon color="light-green darken-1" v-model="item.isActive" 
                                    v-if="item.isActive === true" 
                                    medium>
                                        mdi-checkbox-marked
                                    </v-icon>
                                    <h1 v-if="item.isActive === false">-</h1>
                                </v-layout>                       
                            </template>

                            <!--<template v-slot:item.id="{ item }" >
                                  <v-icon color="grey darken-4" v-model="item.id" medium>
                                    mdi-account-edit
                                </v-icon>
                            </template>-->                         
                      
                        </v-data-table>
                    </v-card>

                   
                </v-col>
            </v-row>   

            <v-alert
            v-show="error"
            prominent
            type="error"
            class="mx-3"
            transition="slide-x-reverse-transition"
            >
                <v-row align="center" >
                    <v-col class="grow">Houve um erro ao carregar a tabela de usuários.</v-col>
                    <v-col class="shrink">
                        <v-btn light class="grey lighten-2" @click="tryAgain">Tentar novamente</v-btn>
                    </v-col>
                </v-row>
            </v-alert>

            <div class="mx-3 mb-3">  
                <v-btn class="px-4" color="success"> 
                    Novo Usuário                         
                    <v-icon right medium>mdi-account-plus</v-icon>
                </v-btn>
            </div>           
    </div> 
</template>

<script>
import DrawerToolbar from '../components/DrawerToolbar'
//import Users from '../services/Users'

export default {
    components: {
        DrawerToolbar
    },

    data: () => ({
        /*searchBy: '',
        searchText: '',
        showSearchBar: false,
        showSearchSwitch: false,
        switchStatus: false,
        searchOptions: [
            {text: 'Nome', value: 'nome'},
            {text: 'Sobrenome', value: 'sobrenome'},
            {text: 'Usuário', value: 'username'},
            {text: 'Administrador', value: 'isAdmin'},
            {text: 'Fornecedor', value: 'isSupplier'},
            {text: 'Atividade', value: 'isActive'},
        ],*/
        paginate: {
            page: 1,
            itemsPerPage: 10,
            itemsLength: 0,
        },
        sortData: {
            orderBy: 'nome',
            sortDesc: false
        },
        isLoading: false,
        error: false,
        headers:
        [
            {text: 'Nome', value:'nome', align: 'left',  class: "light-blue darked-1 white--text tile dark"},
            {text: 'Sobrenome', value: 'sobrenome', align:'left', class: "light-blue darked-1 white--text"},
            {text: 'Usuário', value: 'username', align:'left', class: "light-blue darked-1 white--text"},
            {text: 'Administrador', value: 'isAdmin', align:'center', class: "light-blue darked-1 white--text"},
            {text: 'Fornecedor', value: 'isSupplier', align:'center', class: "light-blue darked-1 white--text"},
            {text: 'Ativo', value: 'isActive', align:'center', class: "light-blue darked-1 white--text"},
            //{text: '', value: 'id'}
            
        ],
        
    }),

       
    methods: {
        async list(){
           this.isLoading = true
           try{
                const paginateParams = {
                    page: this.paginate.page,
                    itemsPerPage: this.paginate.itemsPerPage,
                    orderBy: this.sortData.orderBy,
                    sortDesc: this.sortData.sortDesc
                }
                await this.$store.dispatch('users/getUsers', paginateParams)
                this.paginate.page = this.$store.state.users.pagination.page
                this.paginate.itemsPerPage = this.$store.state.users.pagination.rowsPerPage
                this.paginate.itemsLength = this.$store.state.users.pagination.totalItems

                this.isLoading = false
                this.error = false
           }
           catch(err){
                this.isLoading = false
                this.error = true
           }
           
       },

        
        getItemsPerPage(val) {
           this.paginate.itemsPerPage = val
           this.list()
        },

        getPage(val) {
            this.paginate.page = val
            this.list()
        },

        tryAgain(){
            this.error = false
            this.list()
        },

        sortByFunc(val) {
            this.sortData.orderBy = val[0]
            this.list()
        },

        sortDescFunc(val) {
            this.sortData.sortDesc = val[0]
            this.list()
        }

        /*searchSelect(val) {
            this.searchBy = val

            if(this.searchBy == 'nome' || this.searchBy == 'sobrenome' || this.searchBy == 'username'){
                this.showSearchSwitch = false
                this.showSearchBar = true
            }   
            else {
                this.showSearchBar = false
                this.showSearchSwitch = true
            } 
        },

        changeSwitchStatus() {
            this.switchStatus = !this.switchStatus
        }*/
    },

    mounted(){
        this.list()
        
    }
    
}

</script>

<style>
.textError{
    font-size: 1.2rem;
}
</style>
