/*
 * @Author liangjun
 * @LastEditors liangjun
 * @Date 2021-03-03 14:42:08
 * @LastEditTime 2021-03-03 17:13:10
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
        id:number
        name:string
        password:string
        head_pic:string
        role_id:string
        dept_id:string
        phone_number:number,
        email:string
    }
    export interface List {
        count:number,
        rows:Item[]
    }
}

// 获取列表
export async function getAdminList (params:Admin.ListParams):Promise<Admin.List> {
    const {status,request,data} = await httpClient.get('/admins/list',{
        params:params
    })
    if(status!==200){
        throw new Error(request.statusText)
    }
    if (data.code===0) {
        return data.data
    } else {
        const errMsg = `获取管理员列表失败：${decodeURIComponent(data.msg)}`
        throw new Error(errMsg)
    }
}

// 创建
export async function createAdmin (params:Admin.Item):Promise<void> {
    const {status,request,data} = await httpClient.post('/admins/create',params)
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
    const {status,request,data} = await httpClient.post('/admins/update',params)
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
    const {status,request,data} = await httpClient.post('/admins/delete',{
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