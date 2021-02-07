import { createStore,Store,useStore as baseUseStore } from 'vuex'
import {InjectionKey} from 'vue'

export interface State {
    collapse:boolean
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

const store = createStore<State>({
    state(){
        return {
            collapse:false
        }
    },
    mutations:{
        setCollapseState(state:State,collapse:boolean){
            state.collapse = collapse
        }
    }
})

export const useStore = ()=>{
    return baseUseStore(key)
}

export default store