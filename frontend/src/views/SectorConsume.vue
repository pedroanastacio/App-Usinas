<template>
    <DrawerToolbar :routeName="$route.meta.title"/>

</template>

<script>
import DrawerToolbar from '../components/DrawerToolbar'

export default {
    components:{
        DrawerToolbar,
       
    },
}
</script>