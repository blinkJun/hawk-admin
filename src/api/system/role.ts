/*
 * @Author liangjun
 * @LastEditors liangjun
 * @Date 2021-03-03 14:42:08
 * @LastEditTime 2021-06-07 10:04:35
 * @Description 角色相关接口
 */

import httpClient from '../http'


export namespace Role {
    export interface ListParams {
        page:number,
        limit:number
    }
    export interface Item {
        id:number | string | null
        name:string
        auth_list:number
        remark:string
    }
    export interface List {
        count:number,
        rows:Item[]
    }
}

const modelPath = '/role'

// 获取列表
export async function getRoleList (params:Role.ListParams):Promise<Role.List> {
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
export async function createRole (params:Role.Item):Promise<void> {
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
export async function updateRole (params:Role.Item):Promise<void> {
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
export async function deleteRole (id:number):Promise<void> {
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