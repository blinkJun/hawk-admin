import { defineStore, acceptHMRUpdate } from "pinia";
import { Role } from '../api/system/role'

export const useRoleStore = defineStore('role', {
    state: () => {
        return {
            roleSelectList: [] as Role.Item[]
        }
    },
    actions: {
        setRoleSelectList(list: Role.Item[]) {
            this.roleSelectList = list
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useRoleStore, import.meta.hot))
}