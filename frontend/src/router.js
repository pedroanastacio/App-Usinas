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
            redirect: '/login'
        },
        {
            path: "/login",
            name: 'Login',
            component: () => import('./views/Login.vue')
        },{
            path: "/import",
            name: 'Import',
            component: () => import('./views/Import.vue')
        },{
            path: "/users",
            name: 'Users',
            component: () => import('./views/Users.vue')
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' && !isAuthenticated()) next({ name: 'Login' })
    // if the user is not authenticated, `next` is called twice
    next()
  })

export default router  