<template>
    <div> 
        <DrawerToolbar :routeName="$route.name"/>
            <v-row 
            align="center"
            justify="center"
            >             
                <v-col
                cols="12"
                sm="14"
                md="9"               
                >
                    <v-card class="elevation-4">
                       
                        <v-data-table                           
                            :headers="headers"                           
                            :items="users"
                            
                            class="elevation-1"                                                                       
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
                                    <v-icon color="light-green darken-3" v-model="item.isActive" 
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
                        

                        <v-card-actions class="justify-left text-right bg-transparent">
                                <v-btn type="submit" class="px-4" color="success"> 
                                    Novo Usuário                         
                                    <v-icon right medium>mdi-account-plus</v-icon>
                                </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>   
                     
    </div> 
</template>

<script>
import DrawerToolbar from '../components/DrawerToolbar'
import Users from '../services/Users'

export default {
    components: {
        DrawerToolbar
    },

    data: () => ({
        usersDB: '',
        headers:
        [
            
            {
                text: 'Nome',
                align: 'center',
                sortable: false,
                value:'nome',
                
            },
            {text: 'Sobrenome', value: 'sobrenome', align:'center'},
            {text: 'Usuário', value: 'username', align:'center'},
            {text: 'Admin', value: 'isAdmin', align:'center'},
            {text: 'Fornecedor', value: 'isSupplier', align:'center'},
            {text: 'Ativo', value: 'isActive', align:'center'},
            //{text: '', value: 'id'}
            
        ],
        users:[
            {
                nome: 'José',
                sobrenome: 'Silva',
                username: 'jose.silva',
                isAdmin: true,
                isSupplier: false,
                isActive: true,
                id: 1,
                align:'center'
            },
            {
                nome: 'João',
                sobrenome: 'Gomes',
                username: 'joaogomes',
                isAdmin: false,
                isSupplier: true,
                isActive: false,
                id: 2,
               
            },

        ]
    }),
   
   methods: {
       async list(){
           try{
               this.usersDB = await Users.index()
               console.log(this.usersDB.data)
           }
           catch(err){
               console.log(err.response.data)
           }
           
       },
    },

    mounted(){
       this.list()
   }
    
}

</script>
