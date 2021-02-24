<template>
    <div class="worktab">
        <ul class="tabs" ref="tabs">
            <li
                v-for="(i, index) in worktabs"
                :key="i.path"
                :ref="i.path"
                :class="{ 'activ-tab': i.path === activeTab }"
                @click="clickWorktab(i.path)"
            >
                {{ i.title }}
                <i
                    class="el-icon-close"
                    @click.stop="closeWorktab('current', i.path)"
                    v-if="index !== 0"
                ></i>
            </li>
        </ul>

        <div class="right">
            <el-dropdown @command="closeWorktab" >
                <div class="btn el-icon-arrow-down" />
                <template #dropdown>
                    <el-dropdown-menu class="work-tab-setting" >
                        <el-dropdown-item icon="el-icon-arrow-left" command="left">
                            <span style="menu-txt">关闭左侧</span>
                        </el-dropdown-item>
                        <el-dropdown-item
                            icon="el-icon-arrow-right"
                            command="right"
                        >
                            <span style="menu-txt">关闭右侧</span>
                        </el-dropdown-item>
                        <el-dropdown-item icon="el-icon-close" command="other">
                            <span style="menu-txt">关闭其它</span>
                        </el-dropdown-item>
                        <el-dropdown-item icon="el-icon-error" command="all">
                            <span style="menu-txt">关闭全部</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script lang="ts" >
import { defineComponent } from "vue";
export default defineComponent({
    setup() {
        return {
            activeTab:'/',
            worktabs: [
                {
                    path:'/',
                    title:'主页'
                }
            ],
            closeWorktab: () => {},
            clickWorktab: () => {},
        };
    },
});
</script>

<style lang="scss" >
.worktab {
    width: 100%;
    display: flex;
    justify-content: space-between;
    user-select: none;
    padding: 6px 15px;
    box-sizing: border-box;
    background: #eee;
    .tabs {
        flex:1;
        margin-right:5px;
        display:flex;
        align-items: center;
        overflow-x:auto ;
        overflow-y:hidden ;
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
            transition: all 0.1s;
            background: #fff;
            border-radius: 3px;
            margin-right: 6px;
            &:hover {
                color: #515a6e;
                transition: color 0.2s;
            }
            i {
                color: #808695;
                padding: 2px;
                margin-left: 5px;
                border-radius: 50%;
                transition: all 0.2s;
                &:hover {
                    background: #eee;
                }
            }
        }
        .activ-tab {
            color: $primary-color;
        }
    }
    .right {
        .el-dropdown--small{
            height:30px;
        }
        display:flex;
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
}
.work-tab-setting .el-dropdown-menu__item{
    padding: 3px 15px;
}
</style>