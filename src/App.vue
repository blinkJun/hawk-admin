<template>
    <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAccountStore } from './store/account';
// 初始化store;
const accountStore = useAccountStore()
accountStore.initLocalUserState()
</script>