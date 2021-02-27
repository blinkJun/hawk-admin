import {Module,ActionContext} from 'vuex'
import {State} from '../index'

interface TokenStoreConfig {
    tokenKey:string,
    userInfoKey:string
}

export interface AccountState {
    isLogin:boolean,
    loginConfig:TokenStoreConfig,
    userInfo:any,
    token:string | null
}

interface LoginParams {
    account:string
    password:any
}
interface LoginStateInfo{
    token:string,
    userName:string
}

export const account:Module<AccountState,State> = {
    state:()=>({
        isLogin:false,
        userInfo:null,
        token:null,
        loginConfig:{
            tokenKey:'hawk-admin-token',
            userInfoKey:'hawk-admin-token-user'
        }
    }),
    mutations:{
        setLoginState(state,status:boolean){
            state.isLogin = status
        },
        updateLocalUserState(state,loginStateInfo:LoginStateInfo){
            const {token,userName} = loginStateInfo
            state.token = token
            const loginToken = {
                token,
                userInfo: {
                    userName
                }
            }
            localStorage.setItem(state.loginConfig.tokenKey, JSON.stringify(loginToken))
            state.isLogin = true
        },
        initLocalUserState (state) {
            const localToken = localStorage.getItem(state.loginConfig.tokenKey)
            const token =  localToken

            if (token) {
                const loginStateInfo = JSON.parse(token)
                state.token = loginStateInfo.token
                state.userInfo = {
                    userName:loginStateInfo.userName
                }
                state.isLogin = true
            }else{
                state.isLogin = false
            }
        },
        clearLocalUserState (state) {
            state.isLogin = false
            state.token = null
            state.userInfo = {}

            localStorage.removeItem(state.loginConfig.userInfoKey)
        },
    },
    actions:{
        async login(context:ActionContext<AccountState,State>,params:LoginParams){
            const {account,password} = params
            return new Promise<void>((resolve,reject)=>{
                if(account==='blink'&&password==='admin'){
                    setTimeout(()=>{
                        resolve()
                    },2000)
                }else{
                    reject(new Error('账户密码不正确！'))
                }
            })
        }
    }
}