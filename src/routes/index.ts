import {Router,createRouter,createWebHistory} from 'vue-router'

// pages
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

// menus
import {systemRoutes} from './childrens/system'

const router:Router = createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/',
            component:Home,
            children:[
                ...systemRoutes
            ],
            meta:{
                title:'主页'
            }
        },
        {
            path:'/login',
            component:Login,
            meta:{
                title:'登录'
            }
        }
    ]
})

export default router