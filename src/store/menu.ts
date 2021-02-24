import {Module} from 'vuex'
import {State} from './index'
import {systemRouteConfig,systemRoutes} from '../routes/childrens/system'

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
    })
}