<template>
    <el-card class="page admin" shadow="never">
        <template #header>
            <div>
                <el-button
                    type="primary"
                    v-auth="'system:admin:create'"
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
                label="所属部门"
                prop="deptLabel"
                width="140"
            ></el-table-column>
            <el-table-column
                label="角色"
                prop="roleLabel"
                width="140"
            ></el-table-column>
            <el-table-column
                label="邮箱"
                prop="email"
                width="180"
            ></el-table-column>
            <el-table-column label="状态" width="90">
                <template #default="scope">
                    <el-tag
                        :type="scope.row.status === 1 ? 'success' : 'danger'"
                    >
                        {{ scope.row.status === 1 ? "正常" : "禁用" }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="创建日期" width="175">
                <template #default="scope">
                    {{ scope.row.created_at }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template #default="scope">
                    <el-button
                        size="small"
                        v-auth="'system:admin:update'"
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
                                v-auth="'system:admin:del'"
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
                :rules="formRule"
                label-width="80px"
            >
                <el-form-item label="用户名" prop="name">
                    <el-input
                        type="text"
                        v-model="formData.name"
                        placeholder="用户名"
                    ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        type="password"
                        v-model="formData.password"
                        placeholder="请输入密码"
                    ></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone_number">
                    <el-input
                        v-model.number="formData.phone_number"
                        placeholder="请输入用户邮箱"
                    ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input
                        v-model="formData.email"
                        placeholder="请输入用户邮箱"
                    ></el-input>
                </el-form-item>
                <el-form-item label="所属部门" prop="dept_id">
                    <el-cascader
                        placeholder="所属部门"
                        :options="departmentList"
                        v-model="formData.dept_id"
                        :props="{ checkStrictly: true }"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="身份" prop="role_id">
                    <el-radio-group
                        v-model="formData.role_id"
                        class="role-list"
                    >
                        <el-radio
                            v-for="role in roleSelectList"
                            :label="role.id"
                            >{{ role.name }}</el-radio
                        >
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="formData.status">
                        <el-radio :label="1">正常</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
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
import { ElMessage, FormInstance } from "element-plus";
import { useRoute,useRouter } from "vue-router";
import { useDeptStore } from "../../store/dept";
import { useRoleStore } from "../../store/role";
import { usePage, PageConfig } from "../../composables/usePage";
import {
    getAdminList,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    Admin,
    getDeptList,
    getRoleList,
} from "../../api/index";
import { isNotEmpt, isPhoneNumber } from "../../plugins/validate";
import HTable, { TableData } from "../../components/HTable.vue";
import { treeToCascaderValue } from "../../plugins/utils";

const router = useRouter()
const route = useRoute();
const deptStore = useDeptStore();
const roleStore = useRoleStore();
// 表格
const tableData: TableData = reactive({
    rows: [],
    count: 0,
});
const setTable = async (pageConfig: PageConfig) => {
    try {
        const { rows, count } = await getAdminList({
            page: pageConfig.page!,
            limit: pageConfig.limit!,
        });
        // 获取部门
        const depts = await getDeptList({
            page: 1,
            limit: 8888,
        });
        deptStore.setDepartmentList(depts.rows);

        // 获取角色
        const roles = await getRoleList({
            page: 1,
            limit: 8888,
        });
        roleStore.setRoleSelectList(roles.rows);

        // 给每个用户设置部门名称和角色名称
        rows.forEach((user) => {
            user.deptLabel = depts.rows.find(
                (dept) => dept.id === Number(user.dept_id)
            )?.name;
            user.roleLabel = roles.rows.find(
                (role) => role.id === Number(user.role_id)
            )?.name;
        });

        tableData.rows = rows;
        tableData.count = count;
    } catch (err: any) {
        ElMessage.error(err.message);
    }
};
const { pageConfig,updatePage,refreshPage } = usePage(
    setTable,
    route,
    router
);

// 创建和编辑
const editingForm = ref(false);
const creating = ref(true);
const formRef = ref<FormInstance>();
const baseFormData = {
    id:null,
    name: "",
    password: "admin",
    phone_number: 18520879566,
    email: "530080147@qq.com",
    dept_id: [4],
    role_id: 1,
    status: '',
    head_pic: "/images/logo.png",
};
const formData = reactive({ ...baseFormData });
const formRule = reactive({
    name: [{ required: true, message: "用户名", trigger: "blur" }],
    email: [{ required: true, message: "请输入正确的邮箱地址", type: "email" }],
    phone_number: [
        {
            required: true,
            trigger: "blur",
            message: "请输入正确的手机号",
            validator: isPhoneNumber,
        },
    ],
    dept_id: [
        {
            required: true,
            trigger: "change",
            validator: isNotEmpt,
            message: "请输入此项",
        },
    ],
    role_id: [
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
        try {
            const dept_id = formData.dept_id[formData.dept_id.length - 1];
            await createAdmin({
                ...formData,
                dept_id,
                role_id: formData.role_id,
            });
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
    const validateSuccess = await (formRef.value as any).validate();
    if (validateSuccess) {
        const formDeptId = formData.dept_id;
        const dept_id = Array.isArray(formDeptId)
            ? formDeptId[formDeptId.length - 1]
            : formDeptId;
        try {
            await updateAdmin({
                ...formData,
                dept_id
            });
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
        await deleteAdmin(id);
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
    Object.assign(formData, baseFormData);
};
const showEditForm = (admin: Admin.Item) => {
    creating.value = false;
    editingForm.value = true;
    Object.assign(formData, {
        ...admin,
        dept_id: treeToCascaderValue(deptStore.departmentList, admin.dept_id),
        role_id: Number(admin.role_id),
        password: "",
    });
};
// 钩子
onMounted(() => {
    refreshPage();
});

const departmentList = computed(() => deptStore.departmentList);
const roleSelectList = computed(() => roleStore.roleSelectList);
</script>
