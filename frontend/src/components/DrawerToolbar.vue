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

        <v-navigation-drawer app fixed permanent dark class="primary white--text">
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title">
                        App Usinas
                    </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        </v-navigation-drawer>
    </div>
</template>

<script>
export default {
    name: 'DrawerToolbar',
    data: () => ({
       menuDropdown: [
           { title: 'Sair' }
           ]
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




</style>