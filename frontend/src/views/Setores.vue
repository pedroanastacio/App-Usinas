<template>
    <div> 
    
            <v-row 
            align="center"
            justify="center"
            >             
                <v-col
                cols="12"
                sm="14"
                md="6"               
                >
                    <v-card class="elevation-12 mt-5">
                       
                        <v-data-table                        
                            :headers="headers"                       
                            :items="sectors"
                            :items-per-page="5"
                            class="elevation-10"                                                                       
                        >                       
                            <template v-slot:item.isActive="{ item }" >
                                <v-layout justify-center>
                                    <v-icon color="light-green darken-4" v-model="item.isActive" 
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
                        

                        <v-card-actions class="justify-left text-right">
                                <v-btn type="submit" v-on:click="newSector" class="px-4" color="primary">                         
                                    <v-icon left medium>mdi-plus-circle</v-icon>
                                    Novo Setor 
                                </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>   
                     
    </div> 
</template>

<script>
export default {

    data: () => ({
        headers:[
            
            {
                text: 'Nome',
                align: 'center',
                sortable: false,
                value:'nome',               
            },
            
            {text: 'Ativo', value: 'isActive', align:'center'},
            {text: '', value: 'id'}
            
        ],
        sectors:[

            {
                nome: 'Setor A',
                isActive: true,
                id: 1
            },
            {
                nome: 'Setor B',
                isActive: false,
                id: 2
            },         

        ]
    }),
    methods:{
        newSector(){
            this.$router.replace("/NewSector");
        }
    }
 }
</script>