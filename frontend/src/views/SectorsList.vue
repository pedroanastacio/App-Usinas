<template>
<div>
    <DrawerToolbar :routeName="$route.meta.title"/>
     
    <v-container fluid>
        
       
        <v-row v-show="!gettingSetor && !error">
             <v-col
            cols="12"
            sm="12"
            md="12"
            lg="12"
            xl="12"
            class="my-0 py-0 px-1"
            >  
            <v-card height="100%" class="mx-2 pa-5 pt-5">
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

                <v-switch 
                class="switchBtn mt-0 py-0" 
                v-model="setoresAtivos"
                color="success"
                v-if="setoresAtivos === true"        
                :label="`Ativos`"
                @click:append="setoresAtivos = !setoresAtivos"
                @change="changeStatusSetor"
                />
                  
                <v-switch 
                class="botton mt-2 py-0" 
                v-model="setoresAtivos"        
                v-if="setoresAtivos === false" 
                :label="`Inativos`" 
                @click:append="setoresAtivos = !setoresAtivos"
                @change="changeStatusSetor"
                />                                    
            </v-card>

            <v-col
            cols="12"
            sm="12"
            md="12"
            lg="12"
            xl="12"
            class="my-0 py-0 px-1"
            >
            
            </v-col>

            </v-col>
        </v-row>
    
        <v-row>  
            <v-col
            cols="12"
            xs="6"
            sm="6"
            md="6"
            lg="6"
            xl="4"
                      
            class="my-0 py-0 mt-8"
            v-for="setor in this.storedSetores"
            :key="setor.id"
            fluid
            >   
                <v-hover
                v-slot:default="{ hover }"
                close-delay="200"
                >  
                    
                   <v-card 
                    height="100%"                   
                    :elevation="hover ? 12 : 2" 
                    class="text-center elevation-10 py-0"
                    :loading="isLoading"
                    fluid
                    h-100
                    outlined
                    > 
                    <!--<div 
                    v-if="setor.isActive === true"
                    class="align-center justify-center mx-0 pa-1 ml-0 success">
                    </div>
                    <div 
                    v-if="setor.isActive === false"
                    class="align-center justify-center mx-0 pa-1 ml-0 error">
                    </div>
                    <div class="sectorCard">
                        <v-card-text v-model="setor.nome" class="text-left grey--text text--darken-1 font-weight-bold sectorName">
                            {{setor.nome}}
                        </v-card-text>
                                                        
                        <v-icon 
                        v-if="setor.isActive === true"
                        color="green lighten-2"
                        >
                            mdi-checkbox-marked-circle
                        </v-icon>
                       
                        <v-icon
                        v-if="setor.isActive === false"
                        color="red lighten-2"
                        >
                            mdi-close-circle
                        </v-icon>
                     </div>  --> 

                        <v-list-item>
                            <v-list-item-content class="text-left">
                                <v-list-item-title class="mb-1 grey--text font-weight-bold sectorName">
                                    {{setor.nome}}
                                </v-list-item-title>
                               
                            </v-list-item-content> 

                            <v-chip
                            v-if="setor.isActive === true"
                            x-small
                            class="ma-2"
                            color="green lighten-1"
                            text-color="white"
                            >
                                Ativo
                            </v-chip>

                            <v-chip
                            v-if="setor.isActive === false"
                            x-small
                            class="ma-2"
                            color="red lighten-1"
                            text-color="white"
                            >
                                Inativo
                            </v-chip>

                            <v-list-item-avatar
                            size="40"
                            color="light-blue lighten-4"
                            >
                                <v-btn
                                class="ma-2"
                                tile
                                large
                                color="primary"
                                icon
                                @click="goToSectorConsumePage(setor)"
                                >
                                    <v-icon>mdi-water</v-icon>
                                </v-btn>
                            </v-list-item-avatar>
                        </v-list-item>
                    </v-card>

                                  
                
                </v-hover>
                
            </v-col>
            
        </v-row>

        <v-card
        v-if="vazio"
        class="mt-5">
            <v-card-title class="grey--text">
                {{vazioMessage}}
            </v-card-title>
        </v-card>

        <LoadingPage :show="gettingSetor" />

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

    </v-container>
    </div>
    
</template>


<script>
import DrawerToolbar from '../components/DrawerToolbar'
import LoadingPage from '../components/LoadingPage'
import Setores from '../services/Setores'

export default {
    components:{
        DrawerToolbar,
        LoadingPage
    },
    data:() =>({
        setoresAtivos: true,       
        paginate:{
            page: 1,
        },
        bottom: false,
        storedSetores: [],
        gettingSetor: false,
        searchText: '',
        isSearching: false,
        isLoading: false,
        setor:{
            nome: '',
            isActive:''
        },
        vazio: false,
        vazioMessage: 'Nenhum setor encontrado',
        error: false,
        message: '',
    }),
     computed:{
        searchLabel() {
            return 'Digite o nome do setor' 
        },
    },
    watch: {
        bottom(bottom) {
            if (bottom) {
                
                this.getMoreSetores()
            }
        }
    },
    methods:{

         bottomVisible() {
            const scrollY = window.scrollY
            const visible = document.documentElement.clientHeight
            const pageHeight = document.documentElement.scrollHeight
            const bottomOfPage = visible + scrollY >= pageHeight
            return bottomOfPage || pageHeight < visible
        },

        async getSetores(){
            this.gettingSetor = true
            this.isLoading = true
            this.vazio = false
            try{
                const params ={
                page:this.paginate.page,
                setorStatus:this.setoresAtivos
                } 
                    if(this.isSearching == true) {
                        let searchParams = {
                            searchText: this.searchText
                        }
                        searchParams = Object.assign(searchParams, params)
                        const response = await Setores.searchSetores(searchParams)
                        this.storedSetores = response.data.data
                        
                        if(this.storedSetores.length == 0){
                            this.vazio = true
                            
                        }                          
                    }   
                    else{ 
                        const response = await Setores.list(params)
                        this.storedSetores = response.data.data
                        if(this.storedSetores.length == 0){
                            this.vazio = true
                        }
                        }
                this.isLoading = false
                this.gettingSetor = false
               
            }
            catch(err){
                this.isLoading = false
                this.gettingSetor = false
                this.message = err.response.data.message
                this.error = true
           }            
        },
        async getMoreSetores(){
            this.paginate.page++
            try{
                const params= {
                page:this.paginate.page,
                setorStatus:this.setoresAtivos
                }

                if(this.isSearching == true) {
                    let searchParams = {
                        searchText: this.searchText
                    }
                    searchParams = Object.assign(searchParams, params)
                    const response = await Setores.searchSetores(searchParams)
                    this.storedSetores =[...this.storedSetores, ...response.data.data]
                }
                else {
                    const response = await Setores.list(params)
                    this.storedSetores =[...this.storedSetores, ...response.data.data]
                }                
            }
             catch(err){
                this.isLoading = false
                this.message = err.response.data.message
                this.error = true
           } 
        },
       
        getPage(val) {
            this.paginate.page = val
            this.getSetores()
        },
        tryAgain(){
            this.error = false
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

        changeStatusSetor() {
            this.paginate.page = 1
            this.getSetores()
        },
        
        goToSectorConsumePage(setor) {
            this.$router.push({ name: 'Consumo Setor', params: { slug: setor.slug, nome: setor.nome }})
        }

    },
    mounted() {
        window.addEventListener('scroll', () => {
        this.bottom = this.bottomVisible()
        })
    this.getSetores()
  }
}
</script>

<style>
.sectorName{
    width: 100%;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;  
    
}

.switchBtn{
    float: right;
    position: relative;
}

.sectorCard{
    display: flex;
    padding-right: 10px;
}



</style>