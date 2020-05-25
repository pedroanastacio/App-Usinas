<template>
    <div> 
    <DrawerToolbar :routeName="$route.meta.title"/>
            <v-row>             
                <v-col>
                <v-card class="elevation-4 mx-3 mb-2 pb-0">
                </v-card>
                    <v-card class="elevation-4 mx-3">
                        <v-card-title 
                        v-show="!error&&!isLoading"
                        class="pb-0 mb-0">
                            <v-col
                            xs="12"
                            sm="12"
                            md="6"
                            lg="6"
                            xl="6"
                            class="my-0 py-0 px-1"
                            >
                                <v-text-field
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
                            :items="this.$store.state.setores.setoresData"
                            :loading="isLoading"
                            :footer-props="{ 'items-per-page-options': [5,10,15,20] }"
                            @update:items-per-page="getItemsPerPage"
                            @update:page="getPage"
                            @update:sort-desc="sortDescFunc"
                            @update:sort-by="sortByFunc"
                            loading-text="Carregando setores..."
                            no-data-text="Nenhum setor encontrado"
                            class="elevation-1"        
                            locale="pt-BR"  
                            item-key="nome"
                            @click:row="handleClickRow"                                                                   > 

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

                            <template  v-slot:item.id="{ item }" >
                                <v-layout justify-end>
                                  <v-icon class="mr-0" color="grey darken-4" v-model="item.id" medium>
                                    mdi-playlist-edit
                                </v-icon>
                                </v-layout>
                            </template>                             
                      
                        </v-data-table>

                    </v-card>
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
                    <div class="mx-3 mt-3 ml-3 mb-3 md-6">  
                        <v-btn class="md-6 px-4" color="success" @click="newSector"> 
                            Novo Setor                         
                        <v-icon right medium>mdi-view-grid-plus</v-icon>
                        </v-btn>
                    </div>  
                </v-col>
            </v-row>
               
                     
    </div> 
</template>

<script>
import DrawerToolbar from '../components/DrawerToolbar'

export default {
     components: {
        DrawerToolbar
    },

    data: () => ({
        searchBy: 'nome',
        searchText: '',
        isLoading: false,
        error: false,
        message: '',
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
        
        headers:[
            {text: 'Setor', align: 'left', value:'nome', 
             class: "light-blue darked-1 white--text"              
            },
            {text: 'Ativo', value: 'isActive', align:'center',class: "light-blue darked-1 white--text"},       
        ],
    }),

    computed:{
        searchLabel() {
            return 'Digite o nome do setor' 
        }
    },

    methods:{
         async getSetores(){
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
                    await this.$store.dispatch('setores/searchSetores', searchParams)
                }    
                else {
                    await this.$store.dispatch('setores/getSetores', paginateParams)
                }
                this.paginate.page = this.$store.state.setores.pagination.page
                this.paginate.itemsPerPage = this.$store.state.setores.pagination.rowsPerPage
                this.paginate.itemsLength = this.$store.state.setores.pagination.totalItems

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
           this.getSetores()
        },

        getPage(val) {
            this.paginate.page = val
            this.getSetores()
        },

        tryAgain(){
            this.error = false
            this.getSetores()
        },

        sortDescFunc(val) {
            this.sortData.sortDesc = val[0]
            this.getSetores()
        },

        sortByFunc(val) {
            this.sortData.orderBy = val[0]
            if(this.sortData.sortDesc)
                return
            this.getSetores()    
        },

        makeSearch() {
            if(this.searchText == null || typeof this.searchText == undefined || this.searchText == '') {
              this.isSearching = false
            }  
            else {
                this.isSearching = true
            }
            this.paginate.page = 1
            this.getSetores()
        },

        clearSearch() {
            this.isSearching = false;
            this.searchText = ''
            this.paginate.page = 1
            this.getSetores()
        },

        newSector(){
            this.$router.push({ name: 'Novo setor' })
        },
        
        handleClickRow(val) {
            this.$router.push({name: 'Editar setor', params: { id: val.id, setor: val }})
        }
    },
     mounted(){
        this.getSetores()
        
    }
 }
</script>