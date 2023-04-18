<template>
    <el-card class="page depts" shadow="never">
        <template #header>
            <div>
                <el-button
                    type="primary"
                    v-auth="'system:dept:create'"
                    @click.native="showCreateForm"
                    >新增</el-button
                >
                <el-button type="default" @click.native="updateTable"
                    >刷新</el-button
                >
            </div>
        </template>

        <el-table
            :data="departmentList"
            style="width: 100%; margin-bottom: 20px"
            row-key="id"
            border
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <el-table-column
                prop="name"
                label="部门名称"
                sortable
                min-width="180"
            >
            </el-table-column>
            <el-table-column prop="id" label="部门ID" sortable width="180">
            </el-table-column>
            <el-table-column
                prop="parent_id"
                label="上级部门"
                sortable
                width="180"
            >
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="150">
                <template #default="scope">
                    <el-button
                        size="small"
                        v-auth="'system:dept:update'"
                        @click="showEditForm(scope.row)"
                        >编辑</el-button
                    >
                    <el-popconfirm
                        title="确定删除吗？"
                        @confirm="deleteSubmit(scope.row.id)"
                    >
                        <template #reference>
                            <el-button
                                size="small"
                                type="danger"
                                v-auth="'system:dept:del'"
                                >删除</el-button
                            >
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
            v-model="editingForm"
            :title="creating ? '创建' : '修改'"
            width="500px"
        >
            <el-form
                ref="formRef"
                :model="formData"
                :rules="formRule"
                label-width="80px"
            >
                <el-form-item label="部门名称" prop="name">
                    <el-input
                        type="text"
                        v-model="formData.name"
                        placeholder="部门名称"
                    ></el-input>
                </el-form-item>
                <el-form-item label="上级部门" prop="parent_id">
                    <el-cascader
                        placeholder="所属部门"
                        :props="{ checkStrictly: true }"
                        :options="rootDepartmentList"
                        v-model="formData.parent_id"
                    >
                    </el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="edit-form-dialog-footer">
                <el-button type="default" @click="editingForm = false"
                    >取消</el-button
                >
                <el-button type="primary" @click="createSubmit" v-if="creating"
                    >创建</el-button
                >
                <el-button type="primary" @click="updateSubmit" v-else
                    >修改</el-button
                >
            </div>
        </el-dialog>
    </el-card>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, computed } from "vue";
import { FormInstance } from "element-plus";
import { useRoute } from "vue-router";
import { useDeptStore } from "../../store/dept";
import { usePage, TableConfig } from "../../composables/usePage";
import {
    Depts,
    getDeptList,
    updateDept,
    deleteDept,
    createDept,
} from "../../api/index";
import { isNotEmpt } from "../../plugins/validate";

import { ElMessage } from "element-plus";
import { TableData } from "../../components/HTable.vue";
const deptStore = useDeptStore();
// 表格
const tableData: TableData = reactive({
    baseRows: [],
    rows: [],
    count: 0,
});
const setTable = async (tableConfig: TableConfig) => {
    try {
        const { rows, count } = await getDeptList({
            page: tableConfig.page!,
            limit: tableConfig.limit!,
        });
        tableData.baseRows = rows;
        tableData.count = count;
        deptStore.setDepartmentList(rows)
    } catch (err: any) {}
};
const { updateTable, resetTable } = usePage(
    useRoute(),
    setTable,
    {
        limit: 8888,
    }
);

// 创建和编辑
const editingForm = ref(false);
const creating = ref(true);
const formRef = ref<FormInstance>();
const baseFormData = {
    id:null,
    name: "",
    parent_id: [],
};
const formData = reactive({...baseFormData})
const formRule = reactive({
    name: [{ required: true, message: "用户名", trigger: "blur" }],
    parent_id: [
        {
            required: true,
            trigger: "change",
            validator: isNotEmpt,
            message: "请输入此项",
        },
    ],
})

const createSubmit = async () => {
    const validateSuccess = await formRef.value?.validate();
    if (validateSuccess) {
        const parent_id = formData.parent_id[formData.parent_id.length - 1];
        try {
            await createDept({ ...formData, parent_id });
            ElMessage.success("创建成功！");
            editingForm.value = false;
            updateTable();
        } catch (err: any) {
            ElMessage.error(err.message);
            console.log(err);
        }
    }
};
const updateSubmit = async () => {
    const validateSuccess = await (formRef.value as any).validate();
    if (validateSuccess) {
        try {
            const parent_id =
                formData.parent_id[formData.parent_id.length - 1];
            if (parent_id === formData.id) {
                throw new Error("请勿选择当前要修改的部门。");
            }
            await updateDept({ ...formData, parent_id });
            ElMessage.success("更新成功！");
            editingForm.value = false;
            updateTable();
        } catch (err: any) {
            ElMessage.error(err.message);
            console.log(err);
        }
    }
};
const deleteSubmit = async (id: number) => {
    try {
        await deleteDept(id);
        ElMessage.success("删除成功！");
        editingForm.value = false;
        updateTable();
    } catch (err: any) {
        ElMessage.error(err.message);
        console.log(err);
    }
};
const showCreateForm = () => {
    creating.value = true;
    editingForm.value = true;
    Object.assign(formData,{...baseFormData});
};
const showEditForm = (data: Depts.Item) => {
    creating.value = false;
    editingForm.value = true;
    Object.assign(formData,{...data});
};

// 钩子
onMounted(() => {
    resetTable();
});

const departmentList = computed(() => deptStore.departmentList);
const rootDepartmentList = computed(() => deptStore.rootDepartmentList);
</script>
