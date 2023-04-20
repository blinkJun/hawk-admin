<template>
    <el-card class="page role" shadow="never">
        <template #header>
            <div>
                <el-button
                    type="primary"
                    v-auth="'system:role:create'"
                    @click.native="showCreateForm"
                    >新增</el-button
                >
                <el-button type="default" @click.native="refreshPage"
                    >刷新</el-button
                >
            </div>
        </template>

        <h-table
            :list="tableData.rows"
            :limit="pageConfig.limit"
            :total="tableData.count"
            :pageSizeOpts="pageConfig.pageSizeOpts"
            :currentPage="pageConfig.page"
            @update="updatePage($event)"
        >
            <el-table-column label="id" prop="id" width="100"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column
                label="备注"
                prop="remark"
                width="180"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template #default="scope">
                    <el-button
                        size="small"
                        v-auth="'system:role:update'"
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
                                v-auth="'system:role:del'"
                                >删除</el-button
                            >
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </h-table>

        <el-dialog
            v-model="editingForm"
            :title="creating ? '创建' : '修改'"
            width="500px"
        >
            <el-form
                ref="formRef"
                :model="formData"
                :rules="fromRule"
                label-width="80px"
            >
                <el-form-item label="角色名" prop="name">
                    <el-input
                        type="text"
                        v-model="formData.name"
                        placeholder="角色名称"
                    ></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input
                        v-model="formData.remark"
                        placeholder="备注"
                    ></el-input>
                </el-form-item>
                <el-form-item label="功能权限" prop="remark">
                    <ol
                        tyle="1"
                        style="margin-bottom: 10px;font-size: 12px;color: #999;"
                    >
                        <li>
                            提示：子级菜单依赖父级菜单的显示，要
                            <em>显示子级</em> 同样应该 <em>勾选父级</em>
                        </li>
                        <li>
                            快捷操作：<el-button
                                type="text"
                                @click="selectedRoleItem('all')"
                                >全选</el-button
                            >
                            <el-button
                                type="text"
                                @click="selectedRoleItem(null)"
                                >清空</el-button
                            >
                        </li>
                    </ol>
                    <el-tree
                        ref="authTreeEl"
                        :data="menusList"
                        show-checkbox
                        node-key="id"
                        :check-strictly="true"
                        :default-expanded-keys="[]"
                        :default-checked-keys="formData.auth_list"
                        :props="defaultProps"
                    >
                    </el-tree>
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
import { onMounted, reactive, ref, computed, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMenuStore } from "../../store/menu";
import { usePage, PageConfig } from "../../composables/usePage";
import {
    Role,
    getRoleList,
    createRole,
    updateRole,
    deleteRole,
    getMenuList,
} from "../../api/index";

import { ElMessage, FormInstance } from "element-plus";
import HTable, { TableData } from "../../components/HTable.vue";

const menuStore = useMenuStore();
// tree组件
const authTreeEl = ref<any>();

// 表格
const tableData: TableData = reactive({
    menus: [],
    rows: [],
    count: 0,
});
const setTable = async (pageConfig: PageConfig) => {
    try {
        const { rows, count } = await getRoleList({
            page: pageConfig.page!,
            limit: pageConfig.limit!,
        });
        // 获取菜单列表
        const menus = await getMenuList({
            page: 1,
            limit: 8888,
        });
        menuStore.setMenusList(menus.rows);

        tableData.rows = rows;
        tableData.count = count;
        tableData.menus = menus.rows;
    } catch (err: any) {
        ElMessage.error(err.message);
    }
};
const { pageConfig, refreshPage, updatePage } = usePage(
    setTable,
    useRoute(),
    useRouter()
);

// 创建和编辑
const editingForm = ref(false);
const creating = ref(true);
const formRef = ref<FormInstance>();
const baseFormData = {
    id:null,
    name: "管理员",
    auth_list: [],
    remark: "",
};
const formData = reactive({ ...baseFormData });
const fromRule = reactive({
    name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
});

const createSubmit = async () => {
    const validateSuccess = await formRef.value?.validate();
    if (validateSuccess) {
        try {
            const auth_list = authTreeEl.value
                .getCheckedNodes()
                .map((node: any) => node.id);
            await createRole({ ...formData, auth_list });
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
            const auth_list = authTreeEl.value
                .getCheckedNodes()
                .map((node: any) => node.id);
            await updateRole({ ...formData, auth_list });
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
        await deleteRole(id);
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
    Object.assign(formData,baseFormData)
    nextTick(() => {
        authTreeEl.value?.setCheckedKeys([]);
    });
};
const showEditForm = (data: Role.Item) => {
    creating.value = false;
    editingForm.value = true;
    Object.assign(formData,data)
    nextTick(() => {
        authTreeEl.value?.setCheckedKeys(formData.auth_list);
    });
};

// 钩子
onMounted(() => {
    refreshPage();
});

const menusList = computed(() => menuStore.menusList);
const defaultProps = {
    children: "children",
    label: "name",
};

const selectedRoleItem = function (value: string | null) {
    if (value === "all") {
        authTreeEl.value.setCheckedKeys(
            tableData.menus.map((menu: any) => menu.id)
        );
    }
    if (value === null) {
        authTreeEl.value.setCheckedKeys([]);
    }
};
</script>
