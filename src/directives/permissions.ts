/*
 * @Author liangjun
 * @LastEditors liangjun
 * @Date 2021-06-07 10:23:22
 * @LastEditTime 2021-06-07 13:50:55
 * @Description 验证权限方法和全局权限指令
 */
import {VNode} from 'vue'
import store,{AllState} from '../store/index'

const storeState = store.state as AllState

const safeAuthCode = 'system'

/**
 * @method validateAuthCode
 * @description 验证功能权限
 * @param {String} authCode 授权码  'sys:admins:create'
 * @return {Boolean}
 */
 export const validateAuthCode = function (authCode:string):boolean {
    const funcAuth = storeState.account.userAuthList
    return authCode===safeAuthCode||(funcAuth && funcAuth.includes(authCode))
}
export const validateAuthCodeAsync = async function (authCode:string,latest?:boolean):Promise<boolean> {
    if(latest||storeState.account.userAuthList.length===0){
        await store.dispatch('initUserAuthState')
    }
    return validateAuthCode(authCode)
}

/**
 * @method handleAuthElement
 * @description 对进行权限管理的元素进行处理
 * @param {HTMLElement} el 权限管理元素
 * @param {String} authCode  'sys:admins:create'
 * @return
 */
export const handleAuthElement = function (el:HTMLElement, authCode:string) {
    if (validateAuthCode(authCode)) {
        el.removeAttribute('disabled')
        el.classList.remove('is-disabled')
    } else {
        el.setAttribute('disabled', 'true')
        el.classList.add('is-disabled')
    }
}

export default {
    install:function (app:any) {
        const authElements = new Map()

        // 权限指令 v-auth="sys:admin:create"
        app.directive('auth', function (el:HTMLElement, binding:any, vnode:VNode) {
            const type = binding.arg
            const value = binding.value
            handleAuthElement(el, value)
            authElements.set(vnode.key, {
                type,
                value,
                el,
                vnode
            })
        })

        /**
         * @method update
         * @description 更新进行权限控制的元素
         * @param
         * @return
         */
        const update = function () {
            console.log('update auth status')
            authElements.forEach(item => {
                const { el, value } = item
                if (el) {
                    handleAuthElement(el, value)
                }
            })
        }

        app.config.globalProperties.$auth = {
            update,
            validate: validateAuthCode,
            validateAsync: validateAuthCodeAsync
        }
    }
}