import {Module,ActionContext} from 'vuex'
import {State} from '../index'

export interface AccountState {
    isLogin:boolean
}

interface LoginParams {
    account:string
    password:any
} 

export const account:Module<AccountState,State> = {
    state:()=>({
        isLogin:false
    }),
    mutations:{
        setLoginState(state,status:boolean){
            state.isLogin = status
        }
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