import { defineStore, acceptHMRUpdate } from "pinia";
import { toTree } from '../plugins/utils'

export const useDeptStore = defineStore('dept', {
    state: () => {
        return {
            departmentList: [] as string[]
        }
    },
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
    actions: {
        setDepartmentList(data: any[]) {
            this.departmentList = toTree(data, 'id', 1, 'parent_id')
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useDeptStore, import.meta.hot))
}