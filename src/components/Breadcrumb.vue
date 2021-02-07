<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: route.path }" v-for="routeItem in route.matched" >
            <el-breadcrumb-item :to="{ path: routeItem.path }">
                <el-link type="info" :underline="false" >{{routeItem.meta.title}}</el-link>
            </el-breadcrumb-item>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script lang="ts" >
import {defineComponent} from 'vue';
import {useRoute} from 'vue-router'
export default defineComponent({
    setup(){
        const route = useRoute()
        return {
            route
        }
    }
})
</script>

<style lang="scss" >
</style>