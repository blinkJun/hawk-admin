<template>
    <section class="page no-auth">
        <img :src="`${publicPath}images/warning.svg`" alt="" />
        <p class="tips-1">
            暂无此页面权限，请联系管理员添加权限。
            <router-link to="/"> 回到首页</router-link>
        </p>
        <p class="tips-2">
            已获得权限？
            <a href="javascript:void(0)" @click="tryRedirect">重试</a>
        </p>
    </section>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { useAccountStore } from "../store/account";
import config from "@/config";

const publicPath = config.publicPath;
const accountStore = useAccountStore();
const route = useRoute();
const router = useRouter();

const tryRedirect = async () => {
    await accountStore.initUserAuthState();
    const redirectUrl = (route.query.redirect_url as string) || "/";
    router.replace(redirectUrl || "/");
};
</script>

<style lang="scss" scoped>
.no-auth {
    padding: 100px 0;
    text-align: center;
    > img {
        height: 50vh;
    }
    p {
        margin: 10px 0;
    }
    .tips-2 {
        color: #999;
    }
}
</style>
