import { createApp } from 'vue'
// TypeScript error? Run VSCode command
// TypeScript: Select TypeScript version - > Use Workspace Version
import App from './App.vue'

// ui
import ElementPlus from 'element-plus';
import './style/element-variables.scss';
import './style/app.scss';

// router
import router from './routes/index'

// store
import store,{key} from './store/index'

// 配置
import config from './config'

// 初始化store;
store.commit('initLocalUserState')

const app = createApp(App)

app.use(router)
app.use(store,key)
app.use(ElementPlus,{ size: 'small', zIndex: 1000 })

app.config.globalProperties.$config = config

app.mount('#app')
