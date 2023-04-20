<template>
    <el-card class="page menus" shadow="never">
        <template #header>
            <div>
                <el-button
                    type="primary"
                    v-auth="'system:menu:create'"
                    @click.native="showCreateForm"
                    >新增</el-button
                >
                <el-button type="default" @click.native="refreshPage"
                    >刷新</el-button
                >
            </div>
        </template>

        <el-table
            :data="menusList"
            style="width: 100%; margin-bottom: 20px"
            row-key="id"
            border
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <el-table-column prop="name" label="菜单名称" sortable width="180">
            </el-table-column>
            <el-table-column prop="id" label="菜单ID" sortable width="180">
            </el-table-column>
            <el-table-column prop="level" label="类型" sortable width="180">
            </el-table-column>
            <el-table-column
                prop="authorize_key"
                label="授权标识"
                sortable
                min-width="180"
            >
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="150">
                <template #default="scope">
                    <el-button
                        size="small"
                        v-auth="'system:menu:update'"
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
                                v-auth="'system:menu:del'"
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
                <el-form-item label="菜单类型" prop="level">
                    <el-radio-group
                        v-model="formData.level"
                        :disabled="!creating"
                    >
                        <el-radio
                            v-for="item in menuLevelList"
                            :key="item.value"
                            :label="item.value"
                            >{{ item.text }}</el-radio
                        >
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单名称" prop="name">
                    <el-input
                        type="text"
                        v-model="formData.name"
                        placeholder="菜单名称"
                    ></el-input>
                </el-form-item>
                <el-form-item label="上级菜单" prop="parent_id">
                    <el-cascader
                        placeholder="所属菜单"
                        :props="{ checkStrictly: true }"
                        :options="menusSelect"
                        v-model="formData.parent_id"
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="授权标识" prop="authorize_key">
                    <el-input
                        v-model="formData.authorize_key"
                        placeholder="如：user:list"
                    ></el-input>
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
import { useMenuStore } from "../../store/menu";
import { ElMessage, FormInstance } from "element-plus";
import { usePage, PageConfig } from "../../composables/usePage";
import {
    Menu,
    getMenuList,
    createMenu,
    updateMenu,
    deleteMenu,
} from "../../api/index";
import { isNotEmpt } from "../../plugins/validate";

import { TableData } from "../../components/HTable.vue";
import { treeToCascaderValue } from "../../plugins/utils";

const menuStore = useMenuStore();

// 表格
const tableData: TableData = reactive({
    baseRows: [],
    rows: [],
    count: 0,
});
const setTable = async (pageConfig: PageConfig) => {
    try {
        const { rows, count } = await getMenuList({
            page: pageConfig.page!,
            limit: pageConfig.limit!,
        });
        tableData.baseRows = rows;
        tableData.count = count;
        menuStore.setMenusList(rows);
        menuStore.setMenusSelect(rows);
    } catch (err: any) {}
};
const { refreshPage } = usePage(setTable, null, null, {
    limit: 8888,
});

// 创建和编辑
const editingForm = ref(false);
const creating = ref(true);
const formRef = ref<FormInstance>();
const baseFormData = {
    id: null,
    name: "",
    level: 1,
    authorize_key: "user:create",
    parent_id: [1],
    static: 0,
};
const formData = reactive({ ...baseFormData });
const formRule = reactive({
    name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
    authorize_key: [
        { required: true, message: "请输入授权关键字", trigger: "blur" },
    ],
    parent_id: [
        {
            required: true,
            trigger: "change",
            validator: isNotEmpt,
            message: "请输入此项",
        },
    ],
});
const createSubmit = async () => {
    const validateSuccess = await formRef.value?.validate();
    if (validateSuccess) {
        const parent_id = formData.parent_id[formData.parent_id.length - 1];
        try {
            await createMenu({ ...formData, parent_id });
            ElMessage.success("创建成功！");
            editingForm.value = false;
            refreshPage();
        } catch (err: any) {
            ElMessage.error(err.message);
            console.log(err);
        }
    }
};
const updateSubmit = async () => {
    const validateSuccess = await formRef.value?.validate();
    if (validateSuccess) {
        try {
            const parent_id = formData.parent_id[formData.parent_id.length - 1];
            if (parent_id === formData.id) {
                throw new Error("请勿选择当前要修改的菜单。");
            }
            await updateMenu({ ...formData, parent_id });
            ElMessage.success("更新成功！");
            editingForm.value = false;
            refreshPage();
        } catch (err: any) {
            ElMessage.error(err.message);
            console.log(err);
        }
    }
};
const deleteSubmit = async (id: number) => {
    try {
        await deleteMenu(id);
        ElMessage.success("删除成功！");
        editingForm.value = false;
        refreshPage();
    } catch (err: any) {
        ElMessage.error(err.message);
        console.log(err);
    }
};
const showCreateForm = () => {
    creating.value = true;
    editingForm.value = true;
    Object.assign(formData, { ...baseFormData });
};
const showEditForm = (data: Menu.Item) => {
    creating.value = false;
    editingForm.value = true;
    Object.assign(formData, {
        ...data,
        parent_id: treeToCascaderValue(
            menuStore.menusSelect,
            data.parent_id as number
        ),
    });
};

// 钩子
onMounted(() => {
    refreshPage();
});

const menuLevelList = computed(() => menuStore.levelList);
const menusList = computed(() => menuStore.menusList);
const menusSelect = computed(() => menuStore.menusSelect);
</script>
