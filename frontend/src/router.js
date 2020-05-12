import Vue from 'vue'
import Router from 'vue-router'
import { isAuthenticated } from './services/AuthStorage'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('./views/Home.vue')
        },
        {
            path: "/login",
            name: 'Login',
            component: () => import('./views/Login.vue')
        },
        {
            path: "/users",
            name: 'Usuários',
            component: () => import('./views/Users.vue')
        },
        {
            path: "/import",
            name: 'Importar dados',
            component: () => import('./views/Import.vue')
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' && !isAuthenticated()) next({ name: 'Login' })
    // if the user is not authenticated, `next` is called twice
    next()

   
  })

export default router  