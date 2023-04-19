import { createApp } from 'vue'
// TypeScript error? Run VSCode command
// TypeScript: Select TypeScript version - > Use Workspace Version
import App from './App.vue'

// ui
import ElementPlus from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn'
import './style/app.scss';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// router
import router from './routes/index'

// store
import { createPinia } from 'pinia'

// permissions
import permissions from './directives/permissions'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ElementPlus,{ size: 'default', zIndex: 1000 , locale })
app.use(permissions)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')
