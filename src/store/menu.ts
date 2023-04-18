import { defineStore, acceptHMRUpdate } from "pinia";
import { RouteRecordNormalized,RouteLocationNormalized } from 'vue-router'
import { toTree } from '../plugins/utils'
import { systemRouteConfig, systemRoutes } from '../routes/childrens/system'
import config from '../config'

interface RemoveRoute {
    type: string,
    route: RouteLocationNormalized
}

export const useMenuStore = defineStore('menu', {
    state: () => {
        return {
            leftMenu: [
                {
                    ...systemRouteConfig,
                    routes: systemRoutes
                }
            ],
            focusSideMenuPath: '',
            routerHistory: [] as RouteLocationNormalized[],
            menusList: [] as any[],
            menusSelect: [] as any[],
            levelList: [
                { text: '目录', value: 1 },
                { text: '菜单', value: 2 },
                { text: '按钮', value: 3 }
            ]
        }
    },
    actions: {
        // 定位当前所在菜单
        changeFocusMenu(route: RouteLocationNormalized) {
            const path = route.path

            // 设置侧边栏选中
            this.focusSideMenuPath = path
        },
        // 保存当前跳转记录
        saveRouteHistory(route: RouteLocationNormalized) {

            // 不保存需要忽略的菜单
            if (config.menus.ignore.includes(route.path)) {
                return false
            }

            const routeHistoryIndex = this.routerHistory.map(item => item.path).indexOf(route.path)

            // 同一个路由就进行更新
            if (routeHistoryIndex > -1) {
                this.routerHistory.splice(routeHistoryIndex, 1, route)
            } else {
                this.routerHistory.push(route)
            }
        },
        // 删除跳转记录
        removeRouteHistory(toRemoveConfig: RemoveRoute) {
            const { type, route } = toRemoveConfig
            if (type === 'current') {
                for (let i = 0; i < this.routerHistory.length; i++) {
                    const routeItem = this.routerHistory[i]
                    if (routeItem.path === route.path) {
                        this.routerHistory.splice(i, 1)
                    }
                }
            }


            if (type === 'left') {
                const currentRoutePath = route.path
                while (this.routerHistory[0].path !== currentRoutePath) {
                    this.routerHistory.shift()
                }
            }

            if (type === 'right') {
                const currentRoutePath = route.path
                while (this.routerHistory[this.routerHistory.length - 1].path !== currentRoutePath) {
                    this.routerHistory.pop()
                }
            }

            if (type === 'other') {
                this.routerHistory = [route]
            }

            if (type === 'all') {
                this.routerHistory = []
            }
        },
        // 设置菜单树
        setMenusSelect(data: any[]) {
            this.menusSelect = toTree(data, 'id', 0, 'parent_id')
        },
        setMenusList(data: any[]) {
            this.menusList = toTree(data, 'id', 1, 'parent_id')
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
}