<template>
    <div>
        <v-app-bar app class="elevation-0 primary white--text">
            <v-list-item-title class="routeTitle">{{routeName}}</v-list-item-title>
            <v-list-item-title class="username">{{ currentUser }}</v-list-item-title>
            <v-menu
            transition="slide-y-transition"
            bottom
            >
                <template v-slot:activator="{ on }">
                    <v-btn
                    small
                    color="primary"
                    slot="activator"
                    class="elevation-0  pa-0"
                    v-on="on"
                    >
                    <v-icon small color="white">mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>    

                <v-list
                class="primary dropDownMenu"
                flat
                dark
                >
                    <v-list-item>
                        <v-list-item-content align="left" justify="center">
                            <v-list-item-title>
                                <v-icon class="pt-0" medium>mdi-account</v-icon>
                                Perfil
                            </v-list-item-title>
                            
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item
                    @click="logoutBtn"
                    >
                        <v-list-item-content align="left" justify="center">
                            <v-list-item-title>
                                 <v-icon class="pt-0" medium>mdi-logout-variant</v-icon>
                                Sair
                            </v-list-item-title>
                            
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-menu>
              
        </v-app-bar>

        <v-navigation-drawer 
        app 
        fixed 
        :permanent="!$vuetify.breakpoint.xsOnly"
        dark
        class="primary white--text">
            <v-list flat>
                <v-list-item
                link
                :to="homeLink"
                >
                    <v-list-item-content align="center">
                        <v-list-item-title class="title">
                            App Usinas
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <v-divider class="light mx-4"></v-divider>

            <v-list rounded>
                <v-list-item
                v-for="(item, index) in items"
                :key="index"
                :to="item.link"
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

            <v-list 
            rounded
            class="adminList"
            >
                 <v-list-item>
                    <v-list-item-content align="center" justify="center">
                        <v-list-item-title class="title">
                           Administrador
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
               

            <v-divider class="light mx-4"></v-divider>
                <v-list-item
                    v-for="(itemAdmin, index) in itemsAdmin"
                    :key="index"
                    :to="itemAdmin.link"
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
//import { removeToken } from '../services/AuthStorage'


export default {
    name: 'DrawerToolbar',
    data: () => ({
        homeLink: '/',
        items: [
            { title: 'Consumo geral', icon: 'mdi-chart-donut' },
            { title: 'Consumo por setor', icon: 'mdi-chart-line' },
            
        ],
        itemsAdmin: [
            { title: 'Usuários', icon: 'mdi-account', link: '/users' },
            { title: 'Setores', icon: 'mdi-view-dashboard' },
            { title: 'Importar dados', icon: 'mdi-file-upload', link:'/import' },
        ],
        

    }),

   props: {
       routeName:{
           type: String,
           description: "Nome da página",
       }
   },

   computed: {
        currentUser(){
            if(this.$store.state.auth.user != null)
                return this.$store.state.auth.user.nome + ' ' + this.$store.state.auth.user.sobrenome
            else
                return null    
        }
   },

   methods: {
       async logoutBtn() {
            await this.$store.dispatch('auth/logout')
            this.$router.push({ name: 'Login' })
       }
   },

      
  
}
</script>

<style>
.adminList{
    position: absolute;
    bottom: 0;
    width: 100%;
}

.routeTitle{
    font-size: 1.2rem;
    
}

.username{
    font-size: 0.85rem;
    text-align: end;
}
</style>