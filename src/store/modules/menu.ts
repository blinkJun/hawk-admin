import { Module } from 'vuex'
import { RouteRecordNormalized } from 'vue-router'
import { toTree } from '../../plugins/utils'
import { State } from '../index'
import { systemRouteConfig, systemRoutes } from '../../routes/childrens/system'
import config from '../../config'

export interface MenuState {
    leftMenu: any[],
    focusSideMenuPath: string,
    routerHistory: any[],
    menusSelect:any[],
    menusList:any[],
    levelList:any[]
}
interface RemoveRoute {
    type: string,
    route: RouteRecordNormalized
}

export const menu: Module<MenuState, State> = {
    state: () => ({
        leftMenu: [
            {
                ...systemRouteConfig,
                routes: systemRoutes
            }
        ],
        focusSideMenuPath: '',
        routerHistory: [],
        menusList: [],
        menusSelect: [],
        levelList:[
            { text: '目录', value: 1 },
            { text: '菜单', value: 2 },
            { text: '按钮', value: 3 }
        ]
    }),
    mutations: {
        // 定位当前所在菜单
        changeFocusMenu(state: MenuState, route: RouteRecordNormalized) {
            const path = route.path

            // 设置侧边栏选中
            state.focusSideMenuPath = path
        },
        // 保存当前跳转记录
        saveRouteHistory(state: MenuState, route:RouteRecordNormalized) {

            // 不保存需要忽略的菜单
            if (config.menus.ignore.includes(route.path)) {
                return false
            }

            const routeHistoryIndex = state.routerHistory.map(item => item.path).indexOf(route.path)

            // 同一个路由就进行更新
            if (routeHistoryIndex > -1) {
                state.routerHistory.splice(routeHistoryIndex, 1, route)
            } else {
                state.routerHistory.push(route)
            }
        },
        // 删除跳转记录
        removeRouteHistory(state: MenuState, toRemoveConfig: RemoveRoute) {
            const { type, route } = toRemoveConfig
            if (type === 'current') {
                for (let i = 0; i < state.routerHistory.length; i++) {
                    const routeItem = state.routerHistory[i]
                    if (routeItem.path === route.path) {
                        state.routerHistory.splice(i, 1)
                    }
                }
            }


            if (type === 'left') {
                const currentRoutePath = route.path
                while (state.routerHistory[0].path !== currentRoutePath) {
                    state.routerHistory.shift()
                }
            }

            if (type === 'right') {
                const currentRoutePath = route.path
                while (state.routerHistory[state.routerHistory.length - 1].path !== currentRoutePath) {
                    state.routerHistory.pop()
                }
            }

            if (type === 'other') {
                state.routerHistory = [route]
            }

            if (type === 'all') {
                state.routerHistory = []
            }
        },
        // 设置菜单树
        setMenusSelect: (state, data) => {
            state.menusSelect = toTree(data, 'id', 0,'parent_id')
        },
        setMenusList: (state, data) => {
            state.menusList = toTree(data, 'id', 1,'parent_id')
        }
    }
}