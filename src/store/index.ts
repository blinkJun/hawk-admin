import { createStore,Store,useStore as baseUseStore } from 'vuex'
import {InjectionKey} from 'vue'

// modules
import {system,SystemState} from './modules/menu';

export interface State{
    collapse:boolean
}

export interface AllState extends State {
    system:SystemState
}

// define injection key
export const key: InjectionKey<Store<AllState>> = Symbol()

const store = createStore<State>({
    state(){
        return {
            collapse:false
        }
    },
    modules:{
        system
    },
    mutations:{
        setCollapseState(state:State,collapse:boolean){
            state.collapse = collapse
        }
    }
})

export const useStore = ()=>{
    return baseUseStore<AllState>(key)
}

export default store