<template>
    <div class="page login" :style="{backgroundImage:`url(${$config.publicPath}images/bg-login.svg)`}" >
        <el-card class="login-form" :shadow="'always'" :padding="24" >
            <img class="logo" src="/images/logo.png" alt="">
            <el-form ref="form" :model="form" :rules="ruleValidate" label-position="top" label-width="80px" >
                <el-form-item prop="username" label="账号" >
                    <el-input
                        type="text"
                        @keyup.native.enter="submit"
                        :autofocus="true"
                        size="default"
                        v-model="form.username"
                        placeholder="请输入账号"
                    >
                        <template #prefix >
                            <el-icon class="el-input__icon" ><User /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码" >
                    <el-input
                        type="password"
                        size="default"
                        @keyup.native.enter="submit"
                        v-model="form.password"
                        placeholder="请输入密码"
                    >
                        <template #prefix >
                            <el-icon class="el-input__icon" ><Lock /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="validateCode" label="验证码" class="validate-field" >
                    <el-input
                        type="text"
                        size="default"
                        @keyup.native.enter="submit"
                        v-model="form.validateCode"
                        placeholder="请输入验证码"
                    ></el-input>
                    <div class="svg" @click="initValidateCode" v-html="validateSVG" ></div>
                </el-form-item>
                <el-button type="primary" class="login-btn" long size="large" @click="submit" :loading="onLogin" >{{onLogin?'登录中...':'登录'}}</el-button>
            </el-form>
        </el-card>
    </div>
</template>

<script lang="ts" >
import type { FormInstance, FormRules } from 'element-plus'
import {defineComponent,getCurrentInstance,ref} from 'vue'
import {useStore} from '../store/index'
import { ElMessage } from 'element-plus';
import {login,getLoginValidateCode} from '../api/index'
export default defineComponent ({
    data: () => ({
        form: {
            username: '',
            password: '',
            validateCode:'',
            validateHash:{}
        },
        validateSVG:"",
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
            ],
            validateCode: [
                {
                    required: true,
                    message: '请输入验证码',
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
            const valid = await (this.$refs.form as FormInstance).validate()
            if (valid) {
                this.onLogin = true
                try{
                    const {token,userInfo} = await login({
                        account:this.form.username,
                        password:this.form.password,
                        validateCode:this.form.validateCode,
                        validateCodeHash:this.form.validateHash
                    })
                    this.store.commit('updateLocalUserState',{
                        token:token,
                        userInfo:userInfo
                    });
                    this.store.dispatch('initUserAuthState')
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
        },
        async initValidateCode(){
            let validateSVG,validateHash
            try{
                const {validateCodeHash,svg} = await getLoginValidateCode()
                validateSVG = svg
                validateHash = validateCodeHash
            }catch(err){
                validateSVG = ""
                validateHash = {}
            }

            this.validateSVG = validateSVG
            this.form.validateHash = validateHash
        }
    },
    mounted(){
        this.initValidateCode()
    }
})
</script>

<style lang="scss">
.page.login {
    height: 100vh;
    position: relative;
    background-repeat: no-repeat;
    background-size:auto 80%;
    background-position: 30% center;
    background-color: #68e1fd;
    .login-form{
        width:340px;
        height:430px;
        position: absolute;
        left:50%;
        @extend %ab-center;
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
    .validate-field{
        .el-form-item__content{
            display: flex;
        }
        .el-input{
            flex:1;
        }
        .svg{
            width:120px;
            margin-left:10px;
        }
    }

    @media all and (max-width:900px)  {
        background-size:80% auto;
        background-position: 10% 10%;
        .login-form{
            left:0;
        }
    }
}

</style>
