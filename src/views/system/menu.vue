<template>
    <el-card class="page menus" shadow="false" >
        <template #header>
            <div>
                <el-button
                    type="primary"
                    @click.native="showCreateForm"
                >新增</el-button>
                <el-button
                    type="default"
                    @click.native="updateTable"
                >刷新</el-button>
            </div>
        </template>

        <el-table
            :data="menusList"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
            <el-table-column
                prop="id"
                label="菜单ID"
                sortable
                width="180"
            >
            </el-table-column>
            <el-table-column
                prop="name"
                label="菜单名称"
                sortable
                width="180"
            >
            </el-table-column>
            <el-table-column
                prop="level"
                label="类型"
                sortable
                width="180"
            >
            </el-table-column>
            <el-table-column
                prop="authorize_key"
                label="授权标识"
                sortable
                min-width="180"
            >
            </el-table-column>

            <el-table-column
                fixed="right"
                label="操作"
                width="150"
            >
                <template #default="scope">
                    <el-button size="mini" @click="showEditForm(scope.row)">编辑</el-button>
                    <el-popconfirm
                        title="确定删除吗？"
                        @confirm="deleteSubmit(scope.row.id)"
                    >
                        <template #reference>
                            <el-button size="mini" type="danger" >删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog 
            v-model="editingForm" 
            :title="creating?'创建':'修改'" 
            width="500px" 
        >
            <el-form ref="formEl" :model="form.data" :rules="form.ruleValidate" label-width="80px" >
                <el-form-item label="菜单类型" prop="level">
                    <el-radio-group v-model="form.data.level" :disabled="!creating" >
                        <el-radio
                            v-for="item in menuLevelList"
                            :key="item.value"
                            :label="item.value"
                        >{{item.text}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单名称" prop="name">
                    <el-input type="text" v-model="form.data.name" placeholder="菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="上级菜单" prop="parent_id">
                    <el-cascader
                        placeholder="所属菜单"
                        :props="{ checkStrictly: true }"
                        :options="menusSelect"
                        v-model="form.data.parent_id"
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="授权标识" prop="authorize_key">
                    <el-input v-model="form.data.authorize_key" placeholder="如：user:list"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="edit-form-dialog-footer" >
                <el-button type="default" @click="editingForm=false">取消</el-button>
                <el-button type="primary" @click="createSubmit" v-if="creating">创建</el-button>
                <el-button type="primary" @click="updateSubmit" v-else>修改</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script lang=ts >
import { defineComponent, onMounted, reactive, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "../../store/index";
import { ElMessage } from 'element-plus'
import { usePage,TableConfig } from '../../composables/usePage';
import { Menu,getMenuList, createMenu, updateMenu, deleteMenu  } from '../../api/index'
import { isNotEmpt } from '../../plugins/validate';

import HTable,{TableData} from "../../components/HTable.vue";
import { treeToCascaderValue } from '../../plugins/utils'


export default defineComponent({
    name: "page-menu",
    components: { HTable },
    setup(){
        const store = useStore()
        // 表格
        const tableData:TableData = reactive({
            baseRows:[],
            rows:[],
            count:0
        })
        const setTable = async (tableConfig:TableConfig)=>{
            try{
                const {rows,count} = await getMenuList({
                    page:tableConfig.page!,
                    limit:tableConfig.limit!
                })
                tableData.baseRows = rows
                tableData.count = count
                store.commit('setMenusList',rows)
                store.commit('setMenusSelect',rows)
            }catch(err){
                
            }
        }
        const { tableConfig ,updateTable, toUpdateTable, resetTable } = usePage(useRoute(),setTable,{
            limit:8888
        })

        // 创建和编辑
        const editingForm = ref(false)
        const creating = ref(true)
        const formEl = ref(null)
        const formData = {
            name: '',
            level:1,
            authorize_key:'user:create',
            parent_id: [1]
        }
        let form = reactive({
            data:JSON.parse(JSON.stringify(formData)),
            ruleValidate:{
                name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
                authorize_key:[{ required: true, message: '请输入授权关键字', trigger: 'blur' }],
                parent_id: [
                    {
                        required: true,
                        trigger: 'change',
                        validator:isNotEmpt,
                        message: '请输入此项'
                    }
                ]
            }
        })
        const createSubmit = async ()=>{
            const validateSuccess = await (formEl.value as any).validate()
            if(validateSuccess){
                const parent_id = form.data.parent_id[form.data.parent_id.length - 1]
                try{
                    await createMenu({...form.data,parent_id})
                    ElMessage.success('创建成功！')
                    editingForm.value = false
                    updateTable()
                }catch(err){
                    ElMessage.error(err.message)
                    console.log(err)
                }
            }
        }
        const updateSubmit = async ()=>{
            const validateSuccess = await (formEl.value as any).validate()
            if(validateSuccess){
                try{
                    const parent_id = form.data.parent_id[form.data.parent_id.length - 1]
                    if(parent_id===form.data.id){
                        throw new Error('请勿选择当前要修改的菜单。')
                    }
                    await updateMenu({...form.data,parent_id})
                    ElMessage.success('更新成功！')
                    editingForm.value = false
                    updateTable()
                }catch(err){
                    ElMessage.error(err.message)
                    console.log(err)
                }
            }
        }
        const deleteSubmit = async (id:number)=>{
            try{
                await deleteMenu(id)
                ElMessage.success('删除成功！')
                editingForm.value = false
                updateTable()
            }catch(err){
                ElMessage.error(err.message)
                console.log(err)
            }
        }
        const showCreateForm = ()=>{
            creating.value = true
            editingForm.value = true
            form.data = JSON.parse(JSON.stringify(formData))
        }
        const showEditForm = (data:Menu.Item)=>{
            creating.value = false
            editingForm.value = true
            form.data = JSON.parse(JSON.stringify(data))
            form.data.parent_id = treeToCascaderValue(store.state.menu.menusSelect,data.parent_id as number)
        }

        // 钩子
        onMounted(()=>{
            resetTable()
        })

        return {
            tableData,
            tableConfig,
            updateTable,
            toUpdateTable,

            editingForm,
            creating,
            form,
            formEl,
            createSubmit,
            updateSubmit,
            deleteSubmit,
            showCreateForm,
            showEditForm,

            menuLevelList:computed(()=>store.state.menu.levelList),
            menusList:computed(()=>store.state.menu.menusList),
            menusSelect:computed(()=>store.state.menu.menusSelect),
        }
    }
})

</script>