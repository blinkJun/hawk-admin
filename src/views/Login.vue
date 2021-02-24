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
                    <el-button type="primary" class="login-btn" long size="large" @click="submit">登录</el-button>
                </el-form>
            </el-card>
        </div>
       
    </div>
</template>

<script lang="ts" >
import { ElFormContext } from 'element-plus/lib/el-form'
import {defineComponent,getCurrentInstance} from 'vue'
import {useStore} from '../store/index'
import router from '../routes/index'
export default defineComponent ({
    data: () => ({
        form: {
            username: '',
            password: '',
            remember: true
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
        return {
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
                router.push('/')
                // await this.login({
                //     username: this.form.username,
                //     password: this.form.password,
                //     remember: this.form.remember
                // })
                // await this.$store.dispatch('getNav')
                // if (this.$route.query.redirect_url) {
                //     this.$router.replace(this.$route.query.redirect_url)
                // } else {
                //     this.$router.replace('/')
                // }
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
