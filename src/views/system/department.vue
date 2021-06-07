<template>
    <el-card class="page depts" shadow="false" >
        <template #header>
            <div>
                <el-button
                    type="primary"
                    v-auth="'system:dept:create'"
                    @click.native="showCreateForm"
                >新增</el-button>
                <el-button
                    type="default"
                    @click.native="updateTable"
                >刷新</el-button>
            </div>
        </template>

        <el-table
            :data="departmentList"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
            <el-table-column
                prop="name"
                label="部门名称"
                sortable
                min-width="180"
            >
            </el-table-column>
            <el-table-column
                prop="id"
                label="部门ID"
                sortable
                width="180"
            >
            </el-table-column>
            <el-table-column
                prop="parent_id"
                label="上级部门"
                sortable
                width="180"
            >
            </el-table-column>

            <el-table-column
                fixed="right"
                label="操作"
                width="150"
            >
                <template #default="scope">
                    <el-button
                        size="mini" 
                        v-auth="'system:dept:update'"
                        @click="showEditForm(scope.row)"
                    >编辑</el-button>
                    <el-popconfirm
                        title="确定删除吗？"
                        @confirm="deleteSubmit(scope.row.id)"
                    >
                        <template #reference>
                            <el-button 
                                size="mini" 
                                type="danger"
                                v-auth="'system:dept:del'" 
                            >删除</el-button>
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
                <el-form-item label="部门名称" prop="name">
                    <el-input type="text" v-model="form.data.name" placeholder="部门名称"></el-input>
                </el-form-item>
                <el-form-item label="上级部门" prop="parent_id">
                    <el-cascader
                        placeholder="所属部门"
                        :props="{ checkStrictly: true }"
                        :options="rootDepartmentList"
                        v-model="form.data.parent_id"
                    >
                    </el-cascader>
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
import { usePage,TableConfig } from '../../composables/usePage';
import { Depts,getDeptList,updateDept,deleteDept, createDept  } from '../../api/index'
import { isNotEmpt } from '../../plugins/validate';

import {ElMessage} from 'element-plus'
import HTable,{TableData} from "../../components/HTable.vue";


export default defineComponent({
    name: "page-depts",
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
                const {rows,count} = await getDeptList({
                    page:tableConfig.page!,
                    limit:tableConfig.limit!
                })
                tableData.baseRows = rows
                tableData.count = count
                store.commit('setDepartmentList',rows)
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
            parent_id: []
        }
        let form = reactive({
            data:JSON.parse(JSON.stringify(formData)),
            ruleValidate:{
                name: [{ required: true, message: '用户名', trigger: 'blur' }],
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
                    await createDept({...form.data,parent_id})
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
                        throw new Error('请勿选择当前要修改的部门。')
                    }
                    await updateDept({...form.data,parent_id})
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
                await deleteDept(id)
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
        const showEditForm = (data:Depts.Item)=>{
            creating.value = false
            editingForm.value = true
            form.data = JSON.parse(JSON.stringify(data))
        }

        // 钩子
        onMounted(()=>{
            resetTable()
        })

        return {
            departmentList:computed(()=>store.state.depts.departmentList),
            rootDepartmentList:computed(()=>store.getters.rootDepartmentList),
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
            showEditForm
        }
    }
})

</script>