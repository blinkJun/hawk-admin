<template>
    <div class="hawk-table">
        <!-- 表格顶部操作栏 -->
        <div class="table-header-actions">
            <!-- 头部插槽 -->
            <slot name="header-left"></slot>
            <!-- 默认搜索框 -->
            <el-input
                class="table-search-input"
                :class="[searchPosition]"
                v-if="!hideSearch"
                :disabled="searchDisabled"
                :placeholder="searchPlaceholder"
                v-model="search"
                @keyup.native.13="startSearch"
            >
                <slot name="searchSelector" slot="prepend"></slot>
                <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="startSearch"
                ></el-button>
            </el-input>
        </div>

        <!-- 表格内容 -->
        <div class="table-box">
            <el-table
                ref="table"
                stripe
                border
                style="width: 100%"
                :highlight-current-row="highlightRow"
                :data="tableData"
                @select="selectionChange"
                @select-all="selectionAllChange"
                @current-change="changeCurrent"
            >
                <el-table-column
                    v-if="rowKey"
                    type="selection"
                    width="55"
                >
                </el-table-column>
                <slot></slot>
            </el-table>
        </div>

        <!-- 表格底部操作栏 -->
        <div class="table-footer-actions">
            <el-button
                class="clear-checked"
                v-if="rowKey&&selected.length"
                @click="clearChecked"
            >清空勾选</el-button>
            <div class="page-left" >
                <slot name="page-left"></slot>
            </div>
            <el-pagination
                v-if="!hidePagination"
                ref="page"
                :total="total"
                :current-page="currentPage"
                :page-sizes="pageSizeOpts"
                :page-size="limit"
                :layout="pageLayout"
                @current-change="changePage"
                @size-change="changeSize"
            />
        </div>
    </div>
</template>

<script lang="ts" >
import { defineComponent, nextTick, reactive, ref, watch,SetupContext } from "vue"
import {ElTable,ElMessage} from 'element-plus'

export default defineComponent({
    name:'hawk-table',
    props:{
        // 搜索框位置 left,right
        searchPosition: {
            default: 'left'
        },
        // 数据总条数
        total: {
            type: Number,
            required: true
        },
        // 每页数量
        limit: {
            type: Number,
            default: 10
        },
        // 表格数据
        list: {
            type: Array,
            required: true
        },
        // 当前页
        currentPage: {
            type: Number,
            default: 1
        },
        // 是否隐藏搜索框
        hideSearch: {
            type: Boolean,
            default: true
        },
        // 是否禁用搜索功能
        searchDisabled: {
            type:Boolean,
            default:false
        },
        // 搜索框placeholder
        searchPlaceholder: {
            type: String,
            default: '搜索'
        },
        // 每页行数配置
        pageSizeOpts: {
            type: Array,
            default: () => [10,20]
        },
        // 是否隐藏分页
        hidePagination: {
            type: Boolean,
            default: false
        },
        // 高亮行
        highlightRow: {
            type: Boolean,
            default: true
        },
        
        // 行数据唯一键，提供时自动开启多选功能
        rowKey: String,
        // 当前选择项
        checkedList: {
            type: Array,
            default: () => []
        },
        // page分页功能配置
        pageLayout: {
            type: String,
            default: 'total, prev, pager, next, sizes, jumper'
        }
    },
    setup(props,context:SetupContext){
        // el-table的引用
        const tableEl = ref<typeof ElTable | null>(null)
        
        // 当前搜索值
        const search = ref("")
        // 当前选中值
        let selected = ref<any[]>([])

        // 表格数据
        let tableData = ref<any[]>(props.list)

        // 初始化多选状态
        let selectedMap:{
            [prop:string]:any
        } = reactive({})
        if(props.rowKey){
            props.checkedList.forEach((row:any) => {
                const selectedKey = row[props.rowKey as string] as string
                selectedMap[selectedKey] = row
            })
        }

        // 设置勾选中的行
        const setCheckedRow = ()=>{
            const rowKey = props.rowKey
            if (rowKey && tableData.value.length>0) {
                const tableElement = (tableEl.value as typeof ElTable)
                tableData.value.forEach(row => {
                    if (selectedMap[row[rowKey]]) {
                        tableElement.toggleRowSelection(row, true)
                    } else {
                        tableElement.toggleRowSelection(row, false)
                    }
                })
            }
        }

        // 当表格勾选项改变时
        const selectionChange = (selection:any[], row:any)=>{
            const rowKey = props.rowKey
            if (rowKey) {
                if (selection.includes(row)) {
                    selectedMap[row[rowKey]] = row
                } else {
                    delete selectedMap[row[rowKey]]
                }

                selected.value = Object.entries(selectedMap).map(([index, item]) => item)
                context.emit('select', selected)
                context.emit('update:checkedList', selected)
            }
        }

        // 全选时
        const selectionAllChange = (selection:any[])=>{
            const rowKey = props.rowKey
            if (rowKey) {
                if (selection.length > 0) {
                    tableData.value.forEach(row => {
                        selectedMap[row[rowKey]] = row
                    })
                } else {
                    tableData.value.forEach(row => {
                        delete selectedMap[row[rowKey]]
                    })
                }

                selected.value = Object.entries(selectedMap).map(([index, item]) => item)
                context.emit('select', selected)
                context.emit('update:checkedList', selected)
            }
        }

        // 清空勾选时
        const clearChecked = (showClearMessage:boolean)=>{
            selected.value = []
            selectedMap = {}
            const tableElement = (tableEl.value as typeof ElTable)
            tableElement.clearSelection()
            context.emit('select', selected)
            context.emit('update:checkedList', selected)
            showClearMessage && ElMessage.success('已清空所有勾选项')
        }


        // 修改选中行
        const changeCurrent = (currentRow:any)=>{
            context.emit('changeCurrent',currentRow)  
        }

        // 修改当前页码
        const changePage = (val:number)=>{
            context.emit('update',{
                page: val,
                limit: props.limit
            })
        }
        
        // 修改当前每页条数
        const changeSize = (val:number)=>{
            context.emit('update', {
                page: props.currentPage,
                limit: val
            })
        }

        // 更新搜索值
        const startSearch = ()=>{
            context.emit('search',search.value)           
        }

        // 更新表格数据
        watch(()=>props.list,(newTableList:any[])=>{
            tableData.value = newTableList
            nextTick(()=>{
                setCheckedRow()
            })
        })
        // 更新勾选中项
        watch(props.checkedList,(newCheckList:any[])=>{
            if (props.rowKey) {
                if (newCheckList.length > 0) {
                    selectedMap = {}
                    newCheckList.forEach(row => {
                        const keyValue = row[props.rowKey as string]
                        selectedMap[keyValue] = row
                    })
                } else {
                    selectedMap = {}
                }
                nextTick(()=>{
                    setCheckedRow()
                })
            }
        })
        return {
            search,
            selected,
            table:tableEl,
            selectedMap,
            tableData,
            startSearch,
            changePage,
            changeSize,
            selectionChange,
            selectionAllChange,
            changeCurrent,
            clearChecked
        }
    }
})
</script>

<style lang="scss">
.hawk-table{
    padding: 10px 0;
    .table-header-actions{
        @extend %clearfix;
        .clear-checked{
            float:left;
            &:last-of-type{
                margin-right:20px;
            }
        }
    }
    .table-search-input{
        width:250px;
        &.right{
            float:right
        }
    }
    .page-left{
        float:left;
    }
    .el-pagination{
        float:right
    }
    .table-footer-actions{
        @extend %clearfix;
    }
    .table-box{
        padding: 10px 0;
    }
}
</style>