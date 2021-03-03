/*
 * @Author liangjun
 * @LastEditors liangjun
 * @Date 2021-03-03 14:42:08
 * @LastEditTime 2021-03-03 14:55:15
 * @Description 管理员相关接口
 */

import httpClient from '../http'


namespace Admin {
    export interface ListParams {
        page:number,
        limit:number,
        name?:string | number
    }
    interface Item {
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



// 获取管理员列表
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