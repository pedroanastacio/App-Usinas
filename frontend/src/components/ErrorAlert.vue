<template>
    <v-alert
    v-show="show"
    prominent
    type="error"
    transition="slide-x-reverse-transition"
    class="errorGettingSetorAlert mt-2"
    >
        <v-row align="center" >
            <v-col class="grow">{{ message }}</v-col>
        </v-row>
    </v-alert>
</template>

<script>
export default {
    name: 'ErrorAlert',
    props: {
        show: {
            type: Boolean
        },
        message : {
            type: String
        }
    }
}
</script>

<style>
.errorGettingSetorAlert{
    width: 100%;
}
</style>