import { Module } from 'vuex'
import { State } from '../index'
import { toTree } from '../../plugins/utils'

export interface DepartmentState {
    departmentList:any[]
}

export const depts: Module<DepartmentState, State> = {
    state: () => ({
        departmentList:[]
    }),
    getters: {
        rootDepartmentList: state => {
            return [
                {
                    label: '一级部门',
                    id: 1,
                    value: 1,
                    name: '一级部门',
                    children: state.departmentList
                }
            ]
        }
    },
    mutations: {
        setDepartmentList (state, data) {
            state.departmentList = toTree(data,'id',1,'parent_id')
        }
    }
}