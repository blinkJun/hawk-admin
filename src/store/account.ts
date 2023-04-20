import { defineStore, acceptHMRUpdate } from 'pinia'
import { getAccountRoleDetail } from '../api/index'

export const tokenKey = 'token'
export const userInfoKey = 'userinfo'
export const themeKey = 'theme'

export const useAccountStore = defineStore('account', {
    state: () => {
        return {
            isLogin: false,
            userInfo: null as any,
            token: '',
            loginConfig: {
                tokenKey,
                userInfoKey 
            },
            userAuthList: [] as string[]
        }
    },
    actions: {
        setLoginState(status: boolean) {
            this.isLogin = status
        },
        updateLocalUserState(loginStateInfo: {
            token: string,
            userInfo: any
        }) {
            const { token, userInfo } = loginStateInfo
            const loginToken = {
                token,
                userInfo: userInfo
            }
            localStorage.setItem(this.loginConfig.tokenKey, JSON.stringify(loginToken))
            this.token = token
            this.userInfo = userInfo
            this.isLogin = true
        },
        initLocalUserState() {
            const localTokenConfig = localStorage.getItem(this.loginConfig.tokenKey)

            if (localTokenConfig) {
                const loginStateInfo = JSON.parse(localTokenConfig)
                this.token = loginStateInfo.token
                this.userInfo = loginStateInfo.userInfo
                this.isLogin = true
            } else {
                this.isLogin = false
                this.userInfo = null
                this.token = ''
            }
        },
        clearLocalUserState() {
            this.isLogin = false
            this.token = ''
            this.userInfo = null

            localStorage.removeItem(this.loginConfig.tokenKey)
        },
        setUserAuthList(authList: string[]) {
            this.userAuthList = authList
        },
        async initUserAuthState() {
            if (this.isLogin) {
                try {
                    const authList = await getAccountRoleDetail()
                    this.setUserAuthList(authList)
                } catch (err: any) {
                    this.setUserAuthList([])
                }
            }
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot))
}