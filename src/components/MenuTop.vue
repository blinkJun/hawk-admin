<template>
    <el-header class="top-bar" :class="{ collapse: collapse }">
        <div class="menu">
            <div class="nav">
                <i
                    class="el-icon-s-unfold"
                    v-if="collapse"
                    key="unfold"
                    @click="handleCollapse(false)"
                ></i>
                <i
                    class="el-icon-s-fold"
                    v-else
                    key="fold"
                    @click="handleCollapse(true)"
                ></i>
                <i class="el-icon-refresh" @click="reloadPage" ></i>
                <breadcrumb class="breadcrumb" />
            </div>
            <div class="options">
                <i
                    class="el-icon-full-screen"
                    v-if="!onFullScreen"
                    @click="fullScreen"
                ></i>
                <i
                    class="el-icon-copy-document"
                    v-else
                    @click="exitFullScreen"
                ></i>
                <div class="user">
                    <el-dropdown @command="handleUserSettingCommand">
                        <div class="user-preview">
                            <img
                                class="cover"
                                src="/images/logo.png"
                                style="float: left"
                            />
                            <span class="name">admin</span>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu class="user-setting-list" >
                                <el-dropdown-item command="/user/user">
                                    <i class="el-icon-user"></i>
                                    <span class="menu-txt">个人中心</span>
                                </el-dropdown-item>
                                <el-dropdown-item command="loginOut">
                                    <i class="el-icon-switch-button"></i>
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

<script lang="ts" >
import { defineComponent, ref, computed } from "vue";
import { useStore } from "../store/index";
import Breadcrumb from "./Breadcrumb.vue";
import WorkTab from "./WorkTab.vue";
export default defineComponent({
    components: { Breadcrumb, WorkTab },
    setup() {
        let onFullScreen = ref(false);
        const store = useStore();
        return {
            store,
            onFullScreen,
            collapse: computed(() => store.state.collapse),
            handleCollapse: (collapse: boolean) =>
                store.commit("setCollapseState", collapse),
            fullScreen: () => {
                onFullScreen.value = true;
                document.body.requestFullscreen();
            },
            exitFullScreen: () => {
                onFullScreen.value = false;
                document.exitFullscreen();
            },
            reloadPage:()=>{
                location.reload()
            }
        };
    },
    methods:{
        handleUserSettingCommand(command:string){
            if(command==='loginOut'){
                this.store.commit('setLoginState',false)
                this.$router.push('/login')
            }
        }
    }
});
</script>

<style lang="scss" >
.top-bar {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 99;
    transition: all 0.3s ease-in-out;
    background: transparent !important;
    padding: 0;
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
.user-setting-list .el-dropdown-menu__item{
    padding: 5px 15px;
}
</style>