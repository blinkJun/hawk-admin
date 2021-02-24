const envApiHost = import.meta.env.VITE_HOST
const publicPath = import.meta.env.VITE_PUBLIC_PATH

export default {
    // 对应环境的apiHost
    apiHost: envApiHost,
    publicPath: publicPath || '/',
    // 请求超时时间
    timeoutMax: 20000
}
