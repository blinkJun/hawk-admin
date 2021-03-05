import { Module } from 'vuex'
import { State } from '../index'

export interface RoleState {
    roleSelectList:any[]
}

export const role: Module<RoleState, State> = {
    state: () => ({
        roleSelectList:[]
    }),
    mutations: {
        setRoleSelectList (state, list) {
            state.roleSelectList = list
        }
    }
}