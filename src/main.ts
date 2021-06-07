import { createApp } from 'vue'
// TypeScript error? Run VSCode command
// TypeScript: Select TypeScript version - > Use Workspace Version
import App from './App.vue'

// ui
import ElementPlus from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn'
import './style/element-variables.scss';
import './style/app.scss';

// router
import router from './routes/index'

// store
import store,{key} from './store/index'

// permissions
import permissions from './directives/permissions'

// 配置
import config from './config'

// 初始化store;
store.commit('initLocalUserState')

const app = createApp(App)

app.use(router)
app.use(store,key)
app.use(ElementPlus,{ size: 'small', zIndex: 1000 , locale })
app.use(permissions)

app.config.globalProperties.$config = config

app.mount('#app')
