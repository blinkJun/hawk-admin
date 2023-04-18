/*
 * @Author liangjun
 * @LastEditors liangjun
 * @Date 2021-03-03 14:42:08
 * @LastEditTime 2021-03-05 10:40:37
 * @Description 菜单相关接口
 */

import httpClient from '../http'


export namespace Menu {
    export interface ListParams {
        page:number,
        limit:number
    }
    export interface Item {
        id:number | string | null
        name:string
        level:number
        authorize_key:string
        parent_id:number | null
        static:number | null
    }
    export interface List {
        count:number,
        rows:Item[]
    }
}

const modelPath = '/menus'

// 获取列表
export async function getMenuList (params:Menu.ListParams):Promise<Menu.List> {
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
export async function createMenu (params:Menu.Item):Promise<void> {
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
export async function updateMenu (params:Menu.Item):Promise<void> {
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
export async function deleteMenu (id:number):Promise<void> {
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