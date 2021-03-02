/*
 * @Author liangjun
 * @LastEditors liangjun
 * @Date 2021-03-02 11:00:37
 * @LastEditTime 2021-03-02 15:15:19
 * @Description 
 */

import httpClient,{NomalizeRes} from '../http'

interface LoginParams {
    account: string
    password: any,
    validateCode:string|number,
    validateCodeHash:any
}

// 登录接口
interface LoginData {
    userInfo:any,
    token:string
}
interface LoginDataRes extends NomalizeRes {
    data:LoginData
}

// 验证码接口
interface ValidateCode {
    svg:string,
    validateCodeHash:any
}
interface ValidateCodeRes extends NomalizeRes{
    data:ValidateCode
}

// 登录
export async function login (params:LoginParams):Promise<LoginData> {
    const {status,request,data} = await httpClient.post<LoginDataRes>('/account/login',params)
    if(status!==200){
        throw new Error(request.statusText)
    }
    if (data.code===0) {
        return data.data
    } else {
        const errMsg = `获取h5验证码失败：${decodeURIComponent(data.msg)}`
        throw new Error(errMsg)
    }
}

// 获取验证码
export async function getLoginValidateCode ():Promise<ValidateCode> {
    const {status,data,request} = await httpClient.get<ValidateCodeRes>('/account/getValidateCode')
    if(status!==200){
        throw new Error(request.statusText)
    }
    if (data.code===0) {
        return data.data
    } else {
        const errMsg = `获取h5验证码失败：${decodeURIComponent(data.msg)}`
        throw new Error(errMsg)
    }
}