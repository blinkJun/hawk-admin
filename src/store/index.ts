import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { InjectionKey } from 'vue'

// modules
import { menu, MenuState } from './modules/menu';
import { account, AccountState } from './modules/account';
import { depts, DepartmentState } from './modules/department';
import { role, RoleState } from './modules/role';

export interface State {
    collapse: boolean
}

export interface AllState extends State {
    menu: MenuState,
    account: AccountState,
    depts:DepartmentState,
    role:RoleState
}

// define injection key
export const key: InjectionKey<Store<AllState>> = Symbol()

const store = createStore<State>({
    state() {
        return {
            collapse: false
        }
    },
    modules: {
        menu,
        account,
        depts,
        role
    },
    mutations: {
        setCollapseState(state: State, collapse: boolean) {
            state.collapse = collapse
        }
    }
})

export const useStore = () => {
    return baseUseStore<AllState>(key)
}

export default store