import { createStore,Store,useStore as baseUseStore } from 'vuex'
import {InjectionKey} from 'vue'

// modules
import {system,SystemState} from './modules/menu';
import {account,AccountState} from './modules/account';

export interface State{
    collapse:boolean
}

export interface AllState extends State {
    system:SystemState,
    account:AccountState
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
        system,
        account
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