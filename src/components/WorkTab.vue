<template>
    <div class="worktab">
        <transition-group
            tag="ul"
            mode="out-in"
            name="route-tab"
            class="route-history tabs"
            ref="tabs"
        >
            <li
                :class="{ 'activ-tab': '/' === activeTab }"
                :key="'/'"
                @click="clickWorktab('/')"
            >
                主页
            </li>
            <li
                v-for="(i, index) in worktabs"
                :key="i.path"
                :ref="i.path"
                :class="{ 'activ-tab': i.path === activeTab }"
                @click="clickWorktab(i.path)"
            >
                {{ i.meta.title }}
                <ElIcon
                    class="el-icon-close"
                    @click.stop="closeWorktabCurrent(i)"
                >
                    <Close></Close>
                </ElIcon>
            </li>
        </transition-group>

        <div class="right">
            <el-dropdown @command="closeWorktab">
                <el-icon  class="btn el-icon-arrow-down" >
                    <ArrowDown></ArrowDown>
                </el-icon>
                <template #dropdown>
                    <el-dropdown-menu class="work-tab-setting">
                        <el-dropdown-item
                            icon="arrow-left"
                            command="left"
                        >
                            <span style="menu-txt">关闭左侧</span>
                        </el-dropdown-item>
                        <el-dropdown-item
                            icon="arrow-right"
                            command="right"
                        >
                            <span style="menu-txt">关闭右侧</span>
                        </el-dropdown-item>
                        <el-dropdown-item icon="warning" command="other">
                            <span style="menu-txt">关闭其它</span>
                        </el-dropdown-item>
                        <el-dropdown-item icon="close" command="all">
                            <span style="menu-txt">关闭全部</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute, useRouter, RouteLocationNormalized } from "vue-router";
import { useMenuStore } from "../store/menu";
import { ElIcon } from "element-plus";
const route = useRoute();
const router = useRouter();
const menuStore = useMenuStore();
const activeTab = computed(() => route.path);
const worktabs = computed(() => menuStore.routerHistory);

const closeWorktab = (type: string) => {
    if (activeTab.value === "/") {
        if (type === "left") {
            return false;
        }
        if (type === "right" || type === "other" || type === "all") {
            type = "all";
        }
    }
    menuStore.removeRouteHistory({
        type,
        route: worktabs.value.find((route) => route.path === activeTab.value)!
    })
};

const closeWorktabCurrent = (route: RouteLocationNormalized) => {
    menuStore.removeRouteHistory({
        type: "current",
        route: route,
    })
    if (worktabs.value.length > 0) {
        router.push(worktabs.value[worktabs.value.length - 1].path);
    } else {
        router.push("/");
    }
};

const clickWorktab = (path: string) => {
    router.push(path);
};
</script>

<style lang="scss">
.worktab {
    width: 100%;
    display: flex;
    justify-content: space-between;
    user-select: none;
    padding: 6px 15px;
    box-sizing: border-box;
    background: #eee;
    .tabs {
        flex: 1;
        margin-right: 5px;
        display: flex;
        align-items: center;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        background: transparent !important;
        &::-webkit-scrollbar {
            height: 0px !important;
        }
        li {
            height: 30px;
            line-height: 30px;
            text-align: center;
            color: #808695;
            font-size: 13px;
            padding: 0 12px;
            cursor: pointer;
            border-top: 2px solid transparent;
            background: #fff;
            border-radius: 3px;
            margin-right: 6px;
            &:hover {
                color: #515a6e;
            }
            i {
                color: #808695;
                padding: 2px;
                margin-left: 5px;
                border-radius: 50%;
                &:hover {
                    background:#efefef;
                }
            }
        }
        .activ-tab {
            color: $primary-color !important;
            i {
                color: $primary-color;
            }
        }
    }
    .right {
        .el-dropdown--small {
            height: 30px;
        }
        display: flex;
        align-items: center;
        .btn {
            font-size: 16px;
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            cursor: pointer;
            position: relative;
            top: 0;
            border-left: 1px solid #f2f2f2;
            background: #fff;
            border-radius: 3px;
            box-shadow: 0 0 5px #eee;
            &:hover ul {
                display: inline;
            }
        }
    }
    .tabs li {
        transition: all 0.2s ease;
    }

    .route-tab-enter-from,
    .route-tab-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }
    .route-tab-leave-active {
        position: absolute;
    }
}
.work-tab-setting .el-dropdown-menu__item {
    padding: 3px 15px;
}
</style>
