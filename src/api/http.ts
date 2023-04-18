import axios from 'axios'
import { ElMessage } from 'element-plus'

import config from '../config'
import router from '../routes/index'
import {useAccountStore} from '../store/account'

export enum Code {
    error = -1,
    susccess = 0
}

export interface NomalizeRes {
    code: Code,
    data?: any,
    msg: string
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
    const accountStore = useAccountStore()
    if (accountStore.isLogin) {
        reqConfig.headers['Authorization'] = `Bearer ${accountStore.token}`
    }
    return reqConfig
}, function (error) {
    return Promise.reject(error)
})

// 处理请求结果
httpClient.interceptors.response.use(function (response) {
    return response
}, function (error) {
    const response = error.response

    // token过期
    const { status } = response
    if (status === 401) {
        const accountStore = useAccountStore()
        ElMessage.error('你的登录状态已过期，请重新登录')
        accountStore.clearLocalUserState()
        router.push('/login')
    }

    return response
})

// 封装http模块
export default httpClient
