/*
 * @Author liangjun
 * @LastEditors liangjun
 * @Date 2021-06-07 10:23:22
 * @LastEditTime 2023-04-25 13:58:48
 * @Description 验证权限方法和全局权限指令
 */
import { VNode } from 'vue'
import { useAccountStore } from '../store/account'
import { ElMessage } from 'element-plus'
import * as EventEmitter from 'events'

const safeAuthCode = 'system'

/**
 * @method validateAuthCode
 * @description 验证功能权限
 * @param {String} authCode 授权码  'sys:admins:create'
 * @return {Boolean}
 */
export const validateAuthCode = function (authCode: string): boolean {
    const accountStore = useAccountStore()
    const funcAuth = accountStore.userAuthList
    return authCode === safeAuthCode || (funcAuth && funcAuth.includes(authCode))
}
export const validateAuthCodeAsync = async function (authCode: string, latest?: boolean): Promise<boolean> {
    const accountStore = useAccountStore()
    if (latest || accountStore.userAuthList.length === 0) {
        await accountStore.initUserAuthState()
    }
    return validateAuthCode(authCode)
}

const noAuthMessage = (event:MouseEvent)=>{
    event.stopPropagation()
    ElMessage.error('您没有权限执行此操作！请联系管理员处理')
}
/**
 * @method handleAuthElement
 * @description 对进行权限管理的元素进行处理
 * @param {HTMLElement} el 权限管理元素
 * @param {String} authCode  'sys:admins:create'
 * @return
 */
export const handleAuthElement = function (el: HTMLElement, authCode: string, vnode: VNode, modifiers: any) {
    const del = modifiers.del
    if (validateAuthCode(authCode)) {
        // 移除隐藏元素样式
        if (del) {
            el.classList.remove('is-remove')
        }
        // 移除禁用样式
        el.removeAttribute('disabled')
        el.classList.remove('is-disabled')
        // 移除捕获阶段事件
        el.removeEventListener('click',noAuthMessage)
    } else {
        // 使用样式隐藏元素
        if (del) {
            el.classList.add('is-remove')
        }
        // 添加禁用样式
        el.setAttribute('disabled', 'true')
        el.classList.add('is-disabled')
        // 增加捕获阶段事件
        el.addEventListener('click',noAuthMessage,{
            capture:true
        })
    }
}

export default {
    install: function (app: any) {
        const authElements = new Map()

        // 权限指令 v-auth="sys:admin:create"
        app.directive('auth', function (el: HTMLElement, binding: any, vnode: VNode) {
            const type = binding.arg
            const value = binding.value
            const modifiers = binding.modifiers
            handleAuthElement(el, value, vnode, modifiers)
            authElements.set(vnode.key, {
                type,
                value,
                el,
                vnode,
                modifiers
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
                const { el, value, vnode, modifiers } = item
                if (el) {
                    handleAuthElement(el, value, vnode, modifiers)
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