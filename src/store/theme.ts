import { defineStore, acceptHMRUpdate } from "pinia";
import {themeKey} from './account'
export const useThemeStore = defineStore('theme', {
    state: () => {
        return {
            collapse: false
        }
    },
    actions: {
        setCollapseState(collapse: boolean) {
            this.collapse = collapse
            this.updateLocalThemeState({collapse})
        },
        updateLocalThemeState(config:object = {}){
            const localThemeConfig = localStorage.getItem(themeKey)
            if(localThemeConfig){
                const themeConfig = JSON.parse(localThemeConfig)
                config = {
                    ...themeConfig,
                    ...config
                }
            }
            localStorage.setItem(themeKey, JSON.stringify(config))
        },
        initLocalThemeState() {
            const localThemeConfig = localStorage.getItem(themeKey)

            if (localThemeConfig) {
                const themeConfig = JSON.parse(localThemeConfig)
                this.collapse = themeConfig.collapse
            }
        },
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useThemeStore, import.meta.hot))
}