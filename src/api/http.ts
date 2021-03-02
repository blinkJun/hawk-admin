import axios from 'axios'
import { ElMessage } from 'element-plus'

import config from '../config'
import router from '../routes/index'
import store from '../store/index'

export interface NomalizeRes {
    code:-1 | 0,
    data?:any,
    msg:string
}

const httpClient = axios.create({
    baseURL: config.apiHost,
    timeout: config.timeoutMax,
    headers: {
        post: {
            'Content-Type': 'application/json'
        }
    }
})

// 请求预处理
httpClient.interceptors.request.use(function (reqConfig) {
    return reqConfig
}, function (error) {
    return Promise.reject(error)
})

// 处理请求结果
httpClient.interceptors.response.use(function (response) {
    // token过期
    const { status } = response
    if (status === 401) {
        ElMessage.error('你的登录状态已过期，请重新登录')
        store.commit('clearLocalUserState')
        router.push('/login')
    }
    return response
}, function (error) {
    const response = error.response

    return response
})

// 封装http模块
export default httpClient
