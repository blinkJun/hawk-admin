<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: routeItem.path }" v-for="routeItem in route.matched">
            {{ routeItem.meta.title }}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script lang="ts" setup >
import { useRoute } from 'vue-router'
const route = useRoute()
</script>