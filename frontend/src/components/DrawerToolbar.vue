<template>
    <div>
        <v-app-bar app class="elevation-0 primary white--text">
            <h3>{{routeName}}</h3>
            <v-spacer></v-spacer>                
            <small>Usuário</small>
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn
                    small
                    color="primary"
                    slot="activator"
                    class="elevation-0 ml-2 pa-0"
                    v-on="on"
                    >
                    <v-icon small color="white">mdi-chevron-down</v-icon>
                    </v-btn>
                </template>    

                <v-list>
                <v-list-tile
                    v-for="(item, index) in menuDropdown" 
                    :key="index"
                    
                >
                <v-list-tile-title>{{ item.title}}</v-list-tile-title>
                </v-list-tile>
                </v-list>
            </v-menu>
              
        </v-app-bar>

        <v-navigation-drawer 
        app 
        fixed 
        :permanent="!$vuetify.breakpoint.xsOnly"
        dark
        class="primary white--text">
            <v-list>
                <v-list-item>
                    <v-list-item-content align="center" >
                        <v-list-item-title class="title">
                            App Usinas
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                
                <v-divider class="light mx-4"></v-divider>

                <v-list-item
                v-for="item in items"
                :key="item.title"
                link
                >
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>
        
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <v-list class="adminList">
                 <v-list-item>
                    <v-list-item-content align="center" justify="center">
                        <v-list-item-title class="title">
                           Administrador
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
               

            <v-divider class="light mx-4"></v-divider>
                <v-list-item
                    v-for="itemAdmin in itemsAdmin"
                    :key="itemAdmin.title"
                    link
                    >
                    <v-list-item-icon>
                        <v-icon>{{ itemAdmin.icon }}</v-icon>
                    </v-list-item-icon>
        
                    <v-list-item-content>
                        <v-list-item-title>{{ itemAdmin.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
export default {
    name: 'DrawerToolbar',
    data: () => ({
        menuDropdown: [{ title: 'Sair' }],
        items: [
            { title: 'Consumo geral', icon: 'mdi-chart-donut' },
            { title: 'Consumo por setor', icon: 'mdi-chart-line' },
            
        ],
        itemsAdmin: [
            { title: 'Usuários', icon: 'mdi-account' },
            { title: 'Setores', icon: 'mdi-view-dashboard' },
            { title: 'Importar dados', icon: 'mdi-file-upload' },
        ],
        

    }),

   props: {
       routeName:{
           type: String,
           description: "Nome da página",
       }
   }
    
}
</script>

<style>
.adminList{
    position: fixed;
    bottom: 0;
    width: 100%;
}



</style>