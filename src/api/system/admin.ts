/*
 * @Author liangjun
 * @LastEditors liangjun
 * @Date 2021-03-03 14:42:08
 * @LastEditTime 2023-04-18 17:21:57
 * @Description 管理员相关接口
 */

import httpClient from '../http'


export namespace Admin {
    export interface ListParams {
        page:number,
        limit:number,
        name?:string | number
    }
    export interface Item {
        id?:number | string | null
        name:string
        password:string
        head_pic:string
        role_id:string | number
        dept_id:string | number
        phone_number:number,
        email:string,
        deptLabel?:string,
        roleLabel?:string
    }
    export interface List {
        count:number,
        rows:Item[]
    }
}

const modelPath = '/admins'

// 获取列表
export async function getAdminList (params:Admin.ListParams):Promise<Admin.List> {
    const {status,request,data} = await httpClient.get(`${modelPath}/list`,{
        params:params
    })
    if(status!==200){
        throw new Error(request.statusText)
    }
    if (data.code===0) {
        return data.data
    } else {
        const errMsg = `获取列表失败：${decodeURIComponent(data.msg)}`
        throw new Error(errMsg)
    }
}

// 创建
export async function createAdmin (params:Admin.Item):Promise<void> {
    const {status,request,data} = await httpClient.post(`${modelPath}/create`,params)
    if(status!==200){
        throw new Error(request.statusText)
    }
    if (data.code===0) {
        return 
    } else {
        const errMsg = `创建失败：${decodeURIComponent(data.msg)}`
        throw new Error(errMsg)
    }
}

// 更新
export async function updateAdmin (params:Admin.Item):Promise<void> {
    const {status,request,data} = await httpClient.post(`${modelPath}/update`,params)
    if(status!==200){
        throw new Error(request.statusText)
    }
    if (data.code===0) {
        return 
    } else {
        const errMsg = `更新失败：${decodeURIComponent(data.msg)}`
        throw new Error(errMsg)
    }
}

// 删除
export async function deleteAdmin (id:number):Promise<void> {
    const {status,request,data} = await httpClient.post(`${modelPath}/delete`,{
        id
    })
    if(status!==200){
        throw new Error(request.statusText)
    }
    if (data.code===0) {
        return 
    } else {
        const errMsg = `删除失败：${decodeURIComponent(data.msg)}`
        throw new Error(errMsg)
    }
}