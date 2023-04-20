<template>
    <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAccountStore } from './store/account';
import { useThemeStore } from './store/theme';
// 初始化store;
const accountStore = useAccountStore()
accountStore.initLocalUserState()
const themeStore = useThemeStore()
themeStore.initLocalThemeState()
</script>