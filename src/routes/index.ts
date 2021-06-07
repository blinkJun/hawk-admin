import { Router, createRouter, createWebHistory,createWebHashHistory } from 'vue-router'
import store,{AllState} from '../store/index'
import {validateAuthCodeAsync} from '../directives/permissions'
import config from '../config'
import {ElMessage} from 'element-plus'

// pages
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import NoAuth from '../views/No-Auth.vue'

// menus
import { systemRoutes } from './childrens/system'

const router: Router = createRouter({
    history: config.routeMode==='history'?createWebHistory():createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: Home,
            children: [
                ...systemRoutes
            ],
            meta: {
                title: '主页',
                authCode:'system'
            }
        },
        {
            path: '/login',
            component: Login,
            meta: {
                title: '登录',
                authCode:'system'
            }
        },
        {
            path: '/no-auth',
            component: NoAuth,
            meta: {
                title: '暂无权限',
                authCode:'system'
            }
        }
    ]
})


router.beforeEach(async (route, from, next) => {
    const state = store.state as AllState
    const isLoginPage = route.path === '/login'
    const isLogin = state.account.isLogin

    // 无登录信息时跳转到登录页
    if (!isLoginPage && !isLogin) {
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

    // 检查非登录页面权限
    if (!isLoginPage && isLogin) {
        try {
            // 查询此路由权限
            const authCode = route.meta.authCode as string
            const validateAuthCodeResult = await validateAuthCodeAsync(authCode)
            if (!authCode || !validateAuthCodeResult) {
                ElMessage.error('暂无权限')
                const isNoAuth = route.path === '/no-auth'
                if (isNoAuth) {
                    next(false)
                } else {
                    next({
                        path: '/no-auth',
                        query: {
                            redirect_url: route.fullPath
                        },
                        replace: true
                    })
                }
                return false
            }
        } catch (err) {
            console.log('获取路由权限失败:'+err.message)
        }
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