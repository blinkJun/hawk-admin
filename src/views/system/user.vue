import { ElDialog } from 'element-plus';

<template>
    <ElCard class="user-card">
        <div class="head-portrait">
            <img :src="userinfo.head_pic" alt="" />
        </div>
        <div class="user-info">
            <div class="welcome">
                您好！<span>{{ userinfo.name }}</span>
            </div>
            <div class="identity">
                <div class="dept">
                    <el-icon><Grid /></el-icon>
                    所属部门：{{ dept }}
                </div>
                <div class="role">
                    <el-icon><User /></el-icon>
                    所属角色：{{ role }}
                </div>
            </div>
            <div class="contact">
                <div class="phone">
                    <el-icon><Cellphone /></el-icon>
                    <span>{{ userinfo.phone_number }}</span>
                </div>
                <div class="email">
                    <el-icon><Message /></el-icon>
                    <span>{{ userinfo.email }}</span>
                </div>
            </div>
            <div class="actions">
                <ElButton type="warning" size="small" @click="showUpdatePasswordDialog = true">
                    修改密码
                </ElButton>
            </div>
        </div>
    </ElCard>
    <el-dialog
        v-model="showUpdatePasswordDialog"
        title="修改账户密码"
        width="30%"
    >
        <ElForm
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordFormRules"
        >
            <el-form-item label="旧密码" prop="oldPassword">
                <el-input type="password" v-model="passwordForm.oldPassword" />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="passwordForm.newPassword" />
            </el-form-item>
            <el-form-item label="再次输入新密码" prop="newPasswordAgain">
                <el-input type="password" v-model="passwordForm.newPasswordAgain" />
            </el-form-item>
        </ElForm>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="showUpdatePasswordDialog = false"
                    >取消</el-button
                >
                <el-button
                    type="primary"
                    @click="changePassword"
                >
                    提交
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { useAccountStore } from "@/store/account";
import router from '@/routes/index'
import { getDeptList, getRoleList, updatePassword } from "../../api/index";
import { computed, onMounted, reactive, ref } from "vue";
import { ElButton, ElForm, FormInstance, ElMessage } from "element-plus";

const accountStore = useAccountStore();

const userinfo = computed(()=>{
    return accountStore.userInfo || {}
})
const dept = ref("-");
const role = ref("-");
const passwordFormRef = ref<FormInstance>();
const passwordForm = reactive({
    oldPassword: "",
    newPassword: "",
    newPasswordAgain: "",
});
const passwordFormRules = reactive({
    oldPassword: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
    newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
    newPasswordAgain: [
        { required: true, message: "请再次输入新密码", trigger: "blur" },
    ],
});
const showUpdatePasswordDialog = ref(false);
const changePassword = async () => {
    await passwordFormRef.value?.validate();
    try {
        await updatePassword(passwordForm);
        accountStore.clearLocalUserState()
        await router.push('/login')
        ElMessage.success("更新成功！请重新登录！");
    } catch (error: any) {
        ElMessage.error(error.message);
    }
};

onMounted(async () => {
    // 获取部门
    const depts = await getDeptList({
        page: 1,
        limit: 8888,
    });

    // 获取角色
    const roles = await getRoleList({
        page: 1,
        limit: 8888,
    });

    dept.value = depts.rows.find(
        (dept) => dept.id === Number(accountStore.userInfo.dept_id)
    )?.name as string;
    role.value = roles.rows.find(
        (role) => role.id === Number(accountStore.userInfo.role_id)
    )?.name as string;
});
</script>

<style lang="scss" scoped>
.user-card {
    width: 450px;
    height: 200px;
    ::v-deep .el-card__body {
        display: flex;
    }
    .head-portrait {
        width: 80px;
        height: 80px;
        margin-right: 20px;
        > img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }
    }

    .user-info {
        flex: 1;
        .el-icon {
            margin-right: 10px;
        }
    }

    .welcome {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        > span {
            color: $primary-color;
        }
    }

    .identity {
        color: #666;
        font-size: 14px;
        margin-top: 15px;
        > div {
            margin-top: 10px;
        }
    }

    .contact {
        margin-top: 10px;
        color: #666;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
    }

    .actions{
        padding:10px 0;
    }
}
</style>
