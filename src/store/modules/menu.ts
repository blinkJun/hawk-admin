import {Module} from 'vuex'
import {State} from '../index'
import {systemRouteConfig,systemRoutes} from '../../routes/childrens/system'

export interface SystemState {
    leftMenu:any[]
}

export const system:Module<SystemState,State> = {
    state:()=>({
        leftMenu:[
            {
                ...systemRouteConfig,
                routes:systemRoutes
            }
        ]
    }),
    mutations:{
        // 定位当前所在菜单
        changeFocusMenu (state:SystemState, route) {
            const path = route.path

        },
        // 保存当前跳转记录
        saveRouteHistory (state, route) {
            
        },
        // 删除跳转记录
        removeRouteHistory (state, route) {
            
        },
    }
}