<template>
    <el-header class="top-bar" :class="{ collapse: collapse }">
        <div class="menu">
            <div class="nav">
                <el-icon
                    class="el-icon-s-unfold"
                    v-if="collapse"
                    key="unfold"
                    @click="handleCollapse(false)"
                >
                    <Expand />
                </el-icon>
                <el-icon
                    class="el-icon-s-fold"
                    v-else
                    key="fold"
                    @click="handleCollapse(true)"
                >
                    <Fold />
                </el-icon>
                <el-icon class="el-icon-refresh" @click="reloadPage">
                    <Refresh />
                </el-icon>
                <breadcrumb class="breadcrumb" />
            </div>
            <div class="options">
                <el-icon 
                v-if="!onFullScreen"
                class="el-icon-full-screen" @click="fullScreen">
                    <FullScreen />
                </el-icon>
                <el-icon 
                v-else
                class="el-icon-copy-document" @click="exitFullScreen">
                    <CopyDocument />
                </el-icon>
                <div class="user">
                    <el-dropdown @command="handleUserSettingCommand">
                        <div class="user-preview">
                            <img
                                class="cover"
                                :src="
                                    userInfo
                                        ? userInfo.head_pic
                                        : `${publicPath}images/logo.png`
                                "
                                style="float: left"
                            />
                            <span class="name">{{
                                userInfo ? userInfo.name : "匿名"
                            }}</span>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu class="user-setting-list">
                                <el-dropdown-item command="user">
                                    <el-icon><User /></el-icon>
                                    <span class="menu-txt">个人中心</span>
                                </el-dropdown-item>
                                <el-dropdown-item command="loginOut">
                                    <el-icon><SwitchButton /></el-icon>
                                    <span class="menu-txt">退出登录</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <work-tab />
    </el-header>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useThemeStore } from "../store/theme";
import { useAccountStore } from "../store/account";
import { useRouter } from "vue-router";
import Breadcrumb from "./Breadcrumb.vue";
import WorkTab from "./WorkTab.vue";
import config from '@/config'

const publicPath = config.publicPath
const router = useRouter();
const themeStore = useThemeStore();
const accountStore = useAccountStore();
const onFullScreen = ref(false);
const userInfo = computed(() => accountStore.userInfo);
const collapse = computed(() => themeStore.collapse);
const handleCollapse = (collapse: boolean) => {
    themeStore.setCollapseState(collapse)
};
const fullScreen = () => {
    onFullScreen.value = true;
    document.documentElement.requestFullscreen();
};
const exitFullScreen = () => {
    onFullScreen.value = false;
    document.exitFullscreen();
};
const reloadPage = () => {
    location.reload();
};
const handleUserSettingCommand = (command: string) => {
    if (command === "user") {
        router.push("/system/user");
    }
    if (command === "loginOut") {
        accountStore.clearLocalUserState()
        router.push("/login");
    }
};
</script>

<style lang="scss">
.top-bar {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 99;
    transition: all 0.3s ease-in-out;
    background: transparent !important;
    padding: 0 !important;
    width: calc(100% - #{$menu-left-open-width});
    &.collapse {
        width: calc(100% - #{$menu-left-shrink-width});
    }
    .menu {
        color: #333;
        height: 60px;
        line-height: 60px;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        user-select: none;
        .nav,
        .options {
            display: flex;
            line-height: 60px;
            > i {
                flex: none;
                width: 50px;
                height: 60px;
                line-height: 60px;
                font-size: 18px;
                cursor: pointer;
                text-align: center;
                &:hover {
                    background: #fafafa;
                    color: $primary-color;
                }
            }
        }
        .breadcrumb {
            line-height: 60px;
            padding-left: 15px;
        }
        .user {
            height: 60px;
            line-height: 60px;
            display: flex;
            padding: 0 20px;
            transition: background-color 0.3s;
            &:hover {
                background: #fafafa;
            }
            &:hover ul {
                height: 80px;
            }
            .user-preview {
                height: 60px;
                line-height: 60px;
                outline: none;
            }
            .cover {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: #eee;
                margin: 15px 10px 0 0;
                overflow: hidden;
                cursor: pointer;
            }
            .name {
                font-size: 13px;
                cursor: pointer;
            }
        }
    }
}
.user-setting-list .el-dropdown-menu__item {
    padding: 5px 15px;
}
</style>
