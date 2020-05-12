<template>
    <div>
    <DrawerToolbar :routeName="$route.name"/>
    <v-container>
       
    </v-container>
    </div>
</template>

<script>
import DrawerToolbar from '../components/DrawerToolbar'

export default {
    components:{
        DrawerToolbar
    },

    data: () => ({
       
    }),
}
</script>

<style>

</style>