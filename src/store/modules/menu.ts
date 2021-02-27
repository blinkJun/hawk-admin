import {Module} from 'vuex'
import {State} from '../index'
import {systemRouteConfig,systemRoutes} from '../../routes/childrens/system'
import config from '../../config'

export interface MenuState {
    leftMenu:any[],
    focusSideMenuPath:string,
    routerHistory:any[]
}
interface RemoveRoute{
    type:string,
    route:any
}

export const menu:Module<MenuState,State> = {
    state:()=>({
        leftMenu:[
            {
                ...systemRouteConfig,
                routes:systemRoutes
            }
        ],
        focusSideMenuPath:'',
        routerHistory:[]
    }),
    mutations:{
        // 定位当前所在菜单
        changeFocusMenu (state:MenuState, route) {
            const path = route.path

            // 设置侧边栏选中
            state.focusSideMenuPath = path
        },
        // 保存当前跳转记录
        saveRouteHistory (state:MenuState, route) {

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
        removeRouteHistory (state:MenuState, toRemoveConfig:RemoveRoute) {
            const {type,route} = toRemoveConfig
            if(type==='current'){
                for (let i = 0; i < state.routerHistory.length; i++) {
                    const routeItem = state.routerHistory[i]
                    if (routeItem.path === route.path) {
                        state.routerHistory.splice(i, 1)
                    }
                }
            }
            
            
            if(type==='left'){
                const currentRoutePath = route.path
                while(state.routerHistory[0].path!==currentRoutePath){
                    state.routerHistory.shift()
                }
            }

            if(type==='right'){
                const currentRoutePath = route.path
                while(state.routerHistory[state.routerHistory.length-1].path!==currentRoutePath){
                    state.routerHistory.pop()
                }
            }

            if(type==='other'){
                state.routerHistory = [route]
            }

            if(type==='all'){
                state.routerHistory = []
            }
        },
    }
}