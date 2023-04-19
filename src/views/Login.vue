<template>
    <div
        class="page login"
        :style="{
            backgroundImage: `url(${publicPath}images/bg-login.svg)`,
        }"
    >
        <el-card class="login-form" :shadow="'always'" :padding="24">
            <img class="logo" :src="`${publicPath}images/logo.png`" alt="" />
            <el-form
                ref="formRef"
                :model="form"
                :rules="formRule"
                label-position="top"
                label-width="80px"
            >
                <el-form-item prop="username" label="账号">
                    <el-input
                        type="text"
                        @keyup.native.enter="submit"
                        :autofocus="true"
                        size="default"
                        v-model="form.username"
                        placeholder="请输入账号"
                    >
                        <template #prefix>
                            <el-icon class="el-input__icon"><User /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input
                        type="password"
                        size="default"
                        @keyup.native.enter="submit"
                        v-model="form.password"
                        placeholder="请输入密码"
                    >
                        <template #prefix>
                            <el-icon class="el-input__icon"><Lock /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item
                    prop="validateCode"
                    label="验证码"
                    class="validate-field"
                >
                    <el-input
                        type="text"
                        size="default"
                        @keyup.native.enter="submit"
                        v-model="form.validateCode"
                        placeholder="请输入验证码"
                    ></el-input>
                    <div
                        class="svg"
                        @click="initValidateCode"
                        v-html="validateSVG"
                    ></div>
                </el-form-item>
                <el-button
                    type="primary"
                    class="login-btn"
                    long
                    size="large"
                    @click="submit"
                    :loading="onLogin"
                >
                    {{ onLogin ? "登录中..." : "登录" }}
                </el-button>
            </el-form>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus";
import {
    onMounted,
    reactive,
    ref,
} from "vue";
import { useAccountStore } from "../store/account";
import { ElMessage } from "element-plus";
import { login, getLoginValidateCode } from "../api/index";
import { useRoute, useRouter } from "vue-router";
import config from '@/config'
const route = useRoute();
const router = useRouter();
const accountStore = useAccountStore();

const publicPath = config.publicPath

const onLogin = ref(false);
const validateSVG = ref("");
const formRef = ref<FormInstance>();
const form = reactive({
    username: "",
    password: "",
    validateCode: "",
    validateHash: {},
});
const formRule = reactive<FormRules>({
    username: [
        {
            required: true,
            message: "请输入账号",
            trigger: "blur",
        },
    ],
    password: [
        {
            required: true,
            message: "请输入密码",
            trigger: "blur",
        },
    ],
    validateCode: [
        {
            required: true,
            message: "请输入验证码",
            trigger: "blur",
        },
    ],
});

const submit = async () => {
    const valid = await formRef.value?.validate();
    if (valid) {
        onLogin.value = true;
        try {
            const { token, userInfo } = await login({
                account: form.username,
                password: form.password,
                validateCode: form.validateCode,
                validateCodeHash: form.validateHash,
            });
            accountStore.updateLocalUserState({
                token: token,
                userInfo: userInfo,
            })
            accountStore.initUserAuthState()
            ElMessage.success("登录成功！");
        } catch (err: any) {
            console.log(err);
            ElMessage.error(err.message);
            onLogin.value = false;
            return false;
        }
        onLogin.value = false;

        const redirectUrl = route.query.redirect_url as string;
        if (redirectUrl) {
            router.replace(redirectUrl);
        } else {
            router.replace("/");
        }
    }
};
const initValidateCode = async () => {
    try {
        const { validateCodeHash, svg } = await getLoginValidateCode();
        validateSVG.value = svg;
        form.validateHash = validateCodeHash;
    } catch (err: any) {
        validateSVG.value = "";
        form.validateHash = {};
    }
};
onMounted(() => {
    initValidateCode();
});
</script>

<style lang="scss">
.page.login {
    height: 100vh;
    position: relative;
    background-repeat: no-repeat;
    background-size: auto 60%;
    background-position: 30% center;
    background-color: rgba($primary-color,0.75);
    .login-form {
        width: 340px;
        height: 430px;
        position: absolute;
        left: 60%;
        @extend %ab-center;
        z-index: 1;
        .el-form-item__label {
            padding-bottom: 0 !important;
        }
    }
    .login-btn {
        width:100%;
        margin-top: 15px;
    }
    .logo {
        width: 60px;
        height: 60px;
        display: block;
        margin: 0 auto 10px;
    }
    .validate-field {
        .el-form-item__content {
            display: flex;
        }
        .el-input {
            flex: 1;
        }
        .svg {
            width: 120px;
            margin-left: 10px;
        }
    }

    @media all and (max-width: 900px) {
        background-size: 80% auto;
        background-position: 10% 10%;
        .login-form {
            left: 0;
        }
    }
}
</style>
