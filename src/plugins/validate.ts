/*
 * @Author liangjun
 * @LastEditors liangjun
 * @Date 2020-07-13 14:58:35
 * @LastEditTime 2021-03-03 17:38:58
 * @Description
 */

export const isNotEmpt = (rule:any, value:any|undefined, callback:(error:Error|void)=>void) => {
    if (value === '' || (Array.isArray(value) && value.length === 0)) {
        callback(new Error(rule.message))
    } else {
        callback()
    }
}



export const isPhoneNumber = (rule:any, value:any|undefined, callback:(error:Error|void)=>void) => {
    const pattern = /^1[34578]\d{9}$/;
    if (isNaN(Number(value))|| !pattern.test(value)) {
        callback(new Error(rule.message))
    } else {
        callback()
    }
}