<template>
    <div> 
        <DrawerToolbar :routeName="$route.meta.title"/>
            <v-row>             
                <v-col>
                    <v-card class="mx-3">
                        <v-card-title 
                        v-show="!error&&!isLoading"
                        class="pb-0 mb-0">
                            <v-col
                            cols="12"
                            sm="12"
                            md="6"
                            lg="6"
                            xl="6"
                            class="my-0 py-0 px-1"
                            >
                                <v-select
                                :items="searchOptions"
                                label="Pesquisar por"
                                dense
                                outlined
                                @change="searchSelect"
                                v-model="searchBy"
                                class="pb-0 mb-0"
                                />
                                            
                            </v-col>                
                        
                            <v-col
                            cols="12"
                            sm="12"
                            md="6"
                            lg="6"
                            xl="6"
                            class="my-0 py-0 px-1"
                            >
                                <v-text-field
                                v-show="showSearchBar"
                                v-model="searchText"
                                outlined
                                dense
                                append-icon="mdi-magnify"
                                :label="searchLabel"
                                single-line
                                class="pb-0 mb-0"
                                clearable
                                @click:clear="clearSearch"
                                @click:append="makeSearch"
                                v-on:keyup.enter="makeSearch"
                                
                                />
                            </v-col>                
                        </v-card-title>

                        <v-data-table   
                        v-show="!error"
                        :server-items-length="paginate.itemsLength"
                        :options.sync="paginate"                      
                        :headers="headers"   
                        :items="this.$store.state.users.usersData"
                        :loading="isLoading"
                        :footer-props="{ 'items-per-page-options': [5,10,15,20] }"
                        @update:items-per-page="getItemsPerPage"
                        @update:page="getPage"
                        @update:sort-desc="sortDescFunc"
                        @update:sort-by="sortByFunc"
                        loading-text="Carregando usuários..."
                        class="elevation-1"        
                        locale="pt-BR"  
                        item-key="username"  
                        no-data-text="Nenhum usuário encontrado" 
                        @click:row="handleClickRow"
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
                                    <v-icon color="success" v-model="item.isActive" 
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
                    <v-col class="grow">{{ message }}</v-col>
                    <v-col class="shrink">
                        <v-btn light class="grey lighten-2" @click="tryAgain">Tentar novamente</v-btn>
                    </v-col>
                </v-row>
            </v-alert>

            <div class="mx-3 mb-3">  
                <v-btn class="px-4" color="success" @click="newUser"> 
                    Novo Usuário                         
                    <v-icon right medium>mdi-account-plus</v-icon>
                </v-btn>
            </div>           
    </div> 
</template>

<script>
import DrawerToolbar from '../components/DrawerToolbar'

export default {
    components: {
        DrawerToolbar
    },

    data: () => ({
        searchBy: '',
        searchText: '',
        searchOptions: [
            {text: 'Nome', value: 'nome'},
            {text: 'Sobrenome', value: 'sobrenome'},
            {text: 'Usuário', value: 'username'},
        ],
        isSearching: false,
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
        message: '',
        headers:
        [
            {text: 'Nome', value:'nome', align: 'left',  class: "light-blue darked-1 white--text tile dark"},
            {text: 'Sobrenome', value: 'sobrenome', align:'left', class: "light-blue darked-1 white--text"},
            {text: 'Usuário', value: 'username', align:'left', class: "light-blue darked-1 white--text"},
            {text: 'Administrador', value: 'isAdmin', align:'center', class: "light-blue darked-1 white--text"},
            {text: 'Fornecedor', value: 'isSupplier', align:'center', class: "light-blue darked-1 white--text"},
            {text: 'Ativo', value: 'isActive', align:'center', class: "light-blue darked-1 white--text"},
        ],
        
    }),

    computed: {
        
        showSearchBar() {
            if(this.searchBy == 'nome' || this.searchBy == 'sobrenome' || this.searchBy == 'username') {
                return true
            }   
            else {
                return false
            } 
        },
        searchLabel() {
            if(this.searchBy == 'nome')
                return 'Digite o nome do usuário'
            else if(this.searchBy == 'sobrenome')   
                return 'Digite o sobrenome do usuário' 
            else
                return 'Digite o usuário'    
        }
    },
       
    methods: {
        async getUsers(){
           this.isLoading = true
           try{
                const paginateParams = {
                    page: this.paginate.page,
                    itemsPerPage: this.paginate.itemsPerPage,
                    orderBy: this.sortData.orderBy,
                    sortDesc: this.sortData.sortDesc,
                }

                if(this.isSearching == true) {
                    let searchParams = {
                        searchBy: this.searchBy,
                        searchText: this.searchText
                    }

                    searchParams = Object.assign(searchParams, paginateParams)
                    await this.$store.dispatch('users/searchUsers', searchParams)
                }    
                else {
                    await this.$store.dispatch('users/getUsers', paginateParams)
                }
                this.paginate.page = this.$store.state.users.pagination.page
                this.paginate.itemsPerPage = this.$store.state.users.pagination.rowsPerPage
                this.paginate.itemsLength = this.$store.state.users.pagination.totalItems

                this.isLoading = false
                this.error = false
           }
           catch(err){
                this.isLoading = false
                this.message = err.response.data.message
                this.error = true
           }
           
       },
        
        getItemsPerPage(val) {
           this.paginate.itemsPerPage = val
           this.getUsers()
        },

        getPage(val) {
            this.paginate.page = val
            this.getUsers()
        },

        tryAgain(){
            this.error = false
            this.getUsers()
        },

        sortDescFunc(val) {
            this.sortData.sortDesc = val[0]
            this.getUsers()
        },

        sortByFunc(val) {
            this.sortData.orderBy = val[0]
            if(this.sortData.sortDesc)
                return
            this.getUsers()    
        },

        searchSelect(val) {
            this.searchBy = val
            this.searchText = ''
        },

        makeSearch() {
            if(this.searchText == null || typeof this.searchText == undefined || this.searchText == '') {
              this.isSearching = false
            }  
            else {
                this.isSearching = true
            }
            this.paginate.page = 1
            this.getUsers()
        },

        clearSearch() {
            this.isSearching = false;
            this.searchText = ''
            this.paginate.page = 1
            this.getUsers()
        },

        newUser() {
            this.$router.push({ name: 'Novo usuário' })
        },

        handleClickRow(val) {
            this.$router.push({name: 'Editar usuário', params: { id: val.id, user: val }})
        }
        
    },

    mounted(){
        this.getUsers()
        
    }
    
}

</script>

<style>
.textError{
    font-size: 1.2em;
}


</style>
