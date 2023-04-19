<template>
    <ElCard class="user-card" >
        <div class="head-portrait">
            <img :src="accountStore.userInfo.head_pic" alt="">
        </div>
        <div class="user-info">
            <div class="welcome">您好！<span>{{ accountStore.userInfo.name }}</span></div>
            <div class="identity" >
                <div class="dept">
                    <el-icon><Grid /></el-icon>
                    所属部门：{{dept}}
                </div>
                <div class="role">
                    <el-icon><User /></el-icon>
                    所属角色：{{role}}
                </div>
            </div>
            <div class="contact">
                <div class="phone">
                    <el-icon><Cellphone /></el-icon>
                    <span>{{accountStore.userInfo.phone_number}}</span>
                </div>
                <div class="email">
                    <el-icon><Message /></el-icon>
                    <span>{{accountStore.userInfo.email}}</span>
                </div>
            </div>
        </div>
    </ElCard>
</template>

<script lang="ts" setup >
import { useAccountStore } from '@/store/account';
import {
    getDeptList,
    getRoleList,
} from "../../api/index";
import { onMounted, ref } from 'vue';

const accountStore  = useAccountStore()

const dept = ref('-')
const role = ref('-')



onMounted(async ()=>{
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
    )?.name  as string;
})

</script>

<style lang="scss" scoped>
.user-card {
    width:450px;
    height:170px;
    ::v-deep .el-card__body{
        display: flex;
    }
    .head-portrait{
        width:80px;
        height:80px;
        margin-right:20px;
        >img{
            display: block;
            width:100%;
            height:100%;
            object-fit: cover;
            border-radius: 50%;
        }
    }

    .user-info{
        flex:1;
        .el-icon{
            margin-right:10px;
        }
    }

    .welcome{
        font-size:16px;
        font-weight: bold;
        color:#333;
        >span{
            color:$primary-color;
        }
    }

    .identity{
        color:#666;
        font-size:14px;
        margin-top:15px;
        >div{
            margin-top:10px;
        }
    }

    .contact{
        margin-top:10px;
        color:#666;
        display: flex;
        justify-content: space-between;
        font-size:14px;
    }
}
</style>
