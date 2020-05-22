<template>
     <v-row 
        v-show="show"
        align="center"
        justify="center"
        class="fill-height"
        >
            <v-col
            align="center"
            justify="center">
                <v-progress-circular
                indeterminate
                color="primary"
                ></v-progress-circular>
            </v-col>    
    </v-row>  
</template>

<script>
export default {
     name: 'LoadingPage',
      props: {
        show:{
           type: Boolean,
           description: "Show or not",
       }
   },
}
</script>