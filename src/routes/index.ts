import {Router,createRouter,createWebHistory} from 'vue-router'
import store,{AllState} from '../store/index'

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


router.beforeEach(async (route,from,next)=>{
    const state = store.state as AllState
    const isLoginPage = route.path === '/login'
    const isLogin = state.account.isLogin

    // 无登录信息时跳转到登录页
    if (!isLoginPage&&!isLogin ) {
        next({
            path: '/login',
            query: {
                redirect_url: route.fullPath
            },
            replace: true
        })
        return false
    }

    // 已登录，且跳转到登录页时重定向到主页
    if (isLoginPage && isLogin) {
        next({
            path: '/',
            replace: true
        })
        return false
    }

    next()

    requestAnimationFrame(() => {
        // 自动聚焦当前菜单
        store.commit('changeFocusMenu', route)
    })
    requestAnimationFrame(() => {
        // 保存导航
        store.commit('saveRouteHistory', route)
    })
})

export default router