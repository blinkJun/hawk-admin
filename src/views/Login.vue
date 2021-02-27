<template>
    <div class="page login" :style="{backgroundImage:`url(${$config.publicPath}images/wallhaven-295371.jpg)`}" >
        <div class="blur-box" >
            <div class="blur-bg" :style="{backgroundImage:`url(${$config.publicPath}images/wallhaven-295371.jpg)`}" ></div>
            <el-card class="login-form" :shadow="'always'" :padding="24" >
                <img class="logo" src="/images/logo.png" alt="">
                <el-form ref="form" :model="form" :rules="ruleValidate" label-position="top" label-width="80px" >
                    <el-form-item prop="username" label="账号" >
                        <el-input
                            type="text"
                            @keyup.native.enter="submit"
                            :autofocus="true"
                            size="medium"
                            v-model="form.username"
                            placeholder="请输入账号"
                        >
                            <i class="el-icon-user-solid" slot="prepend" ></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password" label="密码" >
                        <el-input
                            type="password"
                            size="medium"
                            @keyup.native.enter="submit"
                            v-model="form.password"
                            placeholder="请输入密码"
                        >
                            <i class="el-icon-lock" slot="prepend" ></i>
                        </el-input>
                    </el-form-item>
                    <el-button type="primary" class="login-btn" long size="large" @click="submit" :loading="onLogin" >{{onLogin?'登录中...':'登录'}}</el-button>
                </el-form>
            </el-card>
        </div>
       
    </div>
</template>

<script lang="ts" >
import { ElFormContext } from 'element-plus/lib/el-form'
import {defineComponent,getCurrentInstance,ref} from 'vue'
import {useStore} from '../store/index'
import { ElMessage } from 'element-plus';
export default defineComponent ({
    data: () => ({
        form: {
            username: '',
            password: ''
        },
        ruleValidate: {
            username: [
                {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                }
            ],
            password: [
                {
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }
            ]
        }
    }),
    setup(){
        const {appContext} = getCurrentInstance()!
        const store = useStore()
        const config = appContext.config.globalProperties.$config
        const onLogin = ref(false)
        return {
            store,
            onLogin,
            publicPath:config.publicPath
        }
    },
    methods: {
        async submit () {
            interface ElFormCTX extends ElFormContext {
                validate:()=>Promise<boolean>
            }
            const valid = await (this.$refs.form as ElFormCTX).validate()
            if (valid) {
                this.onLogin = true
                try{
                    await this.store.dispatch('login',{
                        account:this.form.username,
                        password:this.form.password
                    })
                    this.store.commit('updateLocalUserState',{
                        token:'hawk-admin',
                        userName:'admin'
                    });
                    ElMessage.success('登录成功！');
                }catch(err){
                    console.log(err);
                    ElMessage.error(err.message)
                    this.onLogin = false
                    return false
                }
                this.onLogin = false
                
                const redirectUrl = this.$route.query.redirect_url
                if (redirectUrl) {
                    this.$router.replace(redirectUrl as string)
                } else {
                    this.$router.replace('/')
                }
            }
        }
    }
})
</script>

<style lang="scss">
.page.login {
    height: 100vh;
}
.blur-box{
    width:50%;
    min-width:360px;
    height:100%;
    overflow: hidden;
    float:right;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('https://source.unsplash.com/user/erondu') center top no-repeat;
    background-size: cover;
    .blur-bg{
        display: block;
        width:100%;
        height:100%;
        position: absolute;
        z-index: 0;
        top:0;
        left:0;
        transform: scale(1.1);
        transform-origin: 50% 50%;
        filter:blur(30px);
        background-size: cover;
        background-attachment: fixed;
    }
    .login-form{
        width:340px;
        position: relative;
        z-index: 1;
        .el-form-item__label{
            padding-bottom:0!important;
        }
    }
    .login-btn{
        margin-top:15px;
    }
    .logo{
        width:60px;
        height:60px;
        display: block;
        margin:0 auto 10px;
    }
}

</style>
