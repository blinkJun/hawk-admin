<template>
    <div class="menu-left" :class="{collapse}" >
        <router-link tag="div" class="el-menu-header" to="/">
            <img src="/images/logo.png" class="logo" alt="" />
            <transition name="el-fade-in-linear"  >
                <p v-show="!collapse">{{ systemName }}</p>
            </transition>
        </router-link>
        <el-menu 
            class="menu" 
            :collapse="collapse" 
            :router="true"
            :default-active="focusSideMenuPath"
            :default-openeds="focusSideOpenMenuList"
        >
            <el-submenu index="1">
                <template #title>
                    <i class="el-icon-location"></i>
                    <span>导航一</span>
                </template>
                <!-- <el-menu-item-group>
                    <template #title>分组一</template>
                    <el-menu-item index="1-1">选项1</el-menu-item>
                    <el-menu-item index="1-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                    <el-menu-item index="1-3">选项3</el-menu-item>
                </el-menu-item-group> -->
                <el-menu-item index="1-4-1"><span>导航一</span></el-menu-item>
                <el-menu-item index="1-4-2"><span>导航一</span></el-menu-item>
                <el-menu-item index="1-4-3"><span>导航一</span></el-menu-item>
            </el-submenu>
            <el-menu-item index="/login"  >
                <i class="el-icon-menu"></i>
                <template #title>登录</template>
            </el-menu-item>
            <el-menu-item index="3" disabled>
                <i class="el-icon-document"></i>
                <template #title>导航三</template>
            </el-menu-item>
            <el-menu-item index="/">
                <i class="el-icon-setting"></i>
                <template #title>主页</template>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script lang="ts" >
import { defineComponent, ref, computed } from "vue";
import { useStore } from "../store/index";
export default defineComponent({
    data() {
        return {
            systemName: "Hawk Admin",
        };
    },
    setup() {
        const store = useStore();
        return {
            focusSideMenuPath:'',
            focusSideOpenMenuList:[],
            collapse: computed(() => store.state.collapse),
        };
    },
});
</script>

<style lang="scss" >
.menu-left {
    height: 100vh;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    background-color: #fff;
    box-shadow: 5px 5px 8px 0 rgba(29, 35, 41, 0.05);
    transition: all 0.3s ease-in-out;
    width:$menu-left-open-width;
    overflow-x:hidden;
    &.collapse{
        width:$menu-left-shrink-width;
    }
    .el-menu-header {
        background-color: #fff;
        width:$menu-left-open-width;
        height: 60px;
        line-height: 45px;
        padding-left: 20px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        cursor: pointer;
        overflow: hidden;
        .logo {
            width: 36px;
            object-fit: contain;
        }
        p {
            color: #666;
            font-size: 15px;
            margin-left: 10px;
            font-weight: bold;
        }
    }
    > .el-menu {
        border-right: 0;
        height: calc(100vh - 60px);
        box-sizing: border-box;
        overflow-y: auto;
        &::-webkit-scrollbar {
            width: 0px !important;
        }
        // 选中颜色
        .el-menu-item.is-active {
            background: #f0faff !important;
            // 左侧线条
            &::before {
                content: "";
                width: 3px;
                height: 100%;
                position: absolute;
                left: 0;
                background: $primary-color;
            }
        }
        // 鼠标移入背景色
        .el-submenu__title:hover,
        .el-submenu .el-menu-item:hover {
            color: $primary-color !important;
            background: #f0faff !important;
        }
        // 鼠标移入图标颜色
        .el-submenu__title:hover i,
        .el-submenu .el-menu-item:hover i {
            color: $primary-color !important;
        }
        // 展开宽度
        &:not(.el-menu--collapse) {
            width: $menu-left-open-width;
        }
        // 折叠后宽度
        &.el-menu--collapse {
            width: $menu-left-shrink-width;
        }
        // 左边距
        .el-submenu__title,
        > .el-menu-item,.el-submenu__title,
        > .el-menu-item>div {
            padding-left: 25px !important;
        }
        // 设置文字与图标的距离
        .el-submenu__title span {
            margin-left: 10px;
        }
        .el-submenu .el-menu-item span {
            margin-left: 23px;
        }
        > .el-menu-item > i {
            margin-right: 15px;
        }
        // 箭头加粗
        .el-submenu__icon-arrow {
            font-weight: bold;
        }
    }
}
</style>