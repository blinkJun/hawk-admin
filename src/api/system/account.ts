/*
 * @Author liangjun
 * @LastEditors liangjun
 * @Date 2021-03-02 11:00:37
 * @LastEditTime 2021-03-03 14:48:05
 * @Description 
 */

import httpClient,{NomalizeRes} from '../http'


// 登录参数
interface LoginParams {
    account: string
    password: any,
    validateCode:string|number,
    // 验证码hash，获取验证码时可获得
    validateCodeHash:any
}

// 登录完成后获得数据
interface LoginSuccessResult {
    userInfo:any,
    token:string
}
// 验证码接口
interface ValidateCode {
    svg:string,
    validateCodeHash:any
}



// 扩展axios返回的登录结果，可忽略不扩展
interface LoginSuccessRes extends NomalizeRes {
    data:LoginSuccessResult
}



// 登录
export async function login (params:LoginParams):Promise<LoginSuccessResult> {
    const {status,request,data} = await httpClient.post<LoginSuccessRes>('/account/login',params)
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
    const {status,data,request} = await httpClient.get('/account/getValidateCode')
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