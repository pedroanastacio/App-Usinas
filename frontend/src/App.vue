<template>
  <v-app>
    <v-btn @click="listarSetores()">Listar Setores</v-btn>
  </v-app>
</template>

<script>
import api from '../src/services/api'


export default {
  name: 'App',

  components: {
   
  },

  data: () => ({
    //
  }),

  
  methods: {
    listarSetores(){
      api.get('setores')
        .then((response) => {
           response.data.forEach(element => {
             console.log(element.nome)
           });
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
  
};
</script>
