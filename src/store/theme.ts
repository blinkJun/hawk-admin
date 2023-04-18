import { defineStore, acceptHMRUpdate } from "pinia";

export const useThemeStore = defineStore('theme', {
    state: () => {
        return {
            collapse: false
        }
    },
    actions: {
        setCollapseState(collapse: boolean) {
            this.collapse = collapse
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useThemeStore, import.meta.hot))
}