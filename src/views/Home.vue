<template>
    <el-container class="home container" :class="{ collapse: collapse }">
        <menu-left />
        <menu-top />
        <el-container class="page-wrap">
            <router-view v-slot="{ Component }">
                <transition name="zoom-fade" mode="out-in">
                    <component :is="Component" v-if="Component" />
                    <div class="welcome" v-else >
                        <img :src="`${publicPath}images/team.svg`" alt="">
                        <p>Welcome !</p>
                    </div>
                </transition>
            </router-view>
        </el-container>
    </el-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import MenuLeft from "../components/MenuLeft.vue";
import MenuTop from "../components/MenuTop.vue";
import { useThemeStore } from "../store/theme";
import config from '@/config'

const publicPath = config.publicPath
const themeStore = useThemeStore();
const collapse = computed(() => themeStore.collapse);
</script>

<style lang="scss" scoped >
.home.container {
    min-height: 100vh;
    padding: 104px 0 10px $menu-left-open-width;
    transition: all 0.3s ease-in-out;
    &.collapse {
        padding-left: $menu-left-shrink-width;
    }
    > .page-wrap {
        padding: 0 15px;
        min-height: calc(100vh - 115px);
        > .page {
            width: 100%;
            > .el-card {
                min-height: 100%;
            }
        }
    }
    .welcome{
        width:100%;
        margin:20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        >img{
            width:350px;
            margin: 40px auto;
            vertical-align: middle;
        }
        >p{
            font-size:18px;
            color:#666;
            text-align: center;
            font-style: italic;
        }
    }
}
</style>
