import {Router,createRouter,createWebHistory} from 'vue-router'

// pages
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'


const router:Router = createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/',
            component:Home,
            children:[
                {
                    path:'/login',
                    component:Login,
                    meta:{
                        title:'登录'
                    }
                }
            ],
            meta:{
                title:'主页'
            }
        }
    ]
})

export default router