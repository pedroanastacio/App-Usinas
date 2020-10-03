import Vue from 'vue'
import Router from 'vue-router' 
import { isAuthenticated } from './services/AuthStorage'
import store from '../store/index'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path : '*',
            name: '404',
            component: () => import('./views/404Page.vue'), 
            meta: {
                title: "Página não encontrada",
            }
        },
        {
            path: '/',
            name: 'Home',
            component: () => import('./views/Home.vue'),
            meta: {
                title: "Consumo Geral",
            }
        },
        {
            path: "/login",
            name: 'Login',
            component: () => import('./views/Login.vue'),
            meta: {
                title: "Login",
            }
        },
        {
            path: "/users",
            name: 'Usuários',
            component: () => import('./views/Users.vue'),
            meta: {
                title: "Usuários",
                isAdmin: true
            }
        },
        {
            path: "/import",
            name: 'Importar dados',
            component: () => import('./views/Import.vue'),
            meta: {
                title: "Importar dados",
                isSupplier: true
            }
        },
        {
            path: "/user",
            name: 'Novo usuário',
            component: () => import('./views/NewUser.vue'),
            meta: {
                title: "Novo Usuário",
                isAdmin: true
            }
        },
        {
            path: "/user/:id",
            name: 'Editar usuário',
            component: () => import('./views/EditUser.vue'),
            meta: {
                title: "Editar usuário",
                isAdmin: true
            }
        },
        {
            path: "/setores",
            name: 'Setores',
            component: () => import('./views/Setores.vue'),
            meta: {
                title: "Setores",
                isAdmin: true
            }
        },{
            path: "/setor",
            name: 'Novo setor',
            component: () => import('./views/NovoSetor.vue'),
            meta: {
                title: "Novo setor",
                isAdmin: true
            }
        },
        {
            path: "/setor/:id",
            name: 'Editar setor',
            component: () => import('./views/EditSetor.vue'),
            meta: {
                title: "Editar setor",
                isAdmin: true
            }
        },
        {
            path: "/changepassword",
            name: 'Alterar Senha',
            component: () => import('./views/ChangePassword.vue'),
            meta: {
                title: "Alterar senha",
            }
        },
        {
            path: "/listasetores",
            name: 'Lista Setores',
            component: () => import('./views/SectorsList.vue'),
            meta: {
                title: "Setores",
            }
        },
        {
            path: "/consumo/setor/:slug",
            name: 'Consumo Setor',
            component: () => import('./views/SectorConsume.vue'),
            meta: {
                title: "Consumo por setor",
            }
        }
        
    ]
})

router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' && !isAuthenticated()) next({ name: 'Login' })
    // if the user is not authenticated, `next` is called twice
    next()

    if(to.name == 'Login' && isAuthenticated()) next({ name: 'Home' })
    next()

    if(to.matched.some(record => record.meta.isSupplier)) { 
        if(store.state.auth.user != null){
            if(store.state.auth.user.isSupplier)
                next()
            else
                next({ name: 'Home' })
        }
    }

    if(to.matched.some(record => record.meta.isAdmin)) { 
        if(store.state.auth.user != null){
            if(store.state.auth.user.isAdmin)
                next()
            else
                next({ name: 'Home' })
        }
    }


  })

export default router  