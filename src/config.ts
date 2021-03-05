const envApiHost = import.meta.env.VITE_HOST as string
const publicPath = import.meta.env.VITE_PUBLIC_PATH as string
const routeMode = import.meta.env.VITE_ROUTE_MODE as string

export default {
    // 对应环境的apiHost
    apiHost: envApiHost,
    routeMode,
    publicPath: publicPath || '/',
    // 请求超时时间
    timeoutMax: 20000,
    menus: {
        // 面包屑历史导航忽略的路由
        ignore: ['/', '/login', '/No-Auth']
    }
}
