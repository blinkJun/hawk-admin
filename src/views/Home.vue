<template>
    <el-container class="home container" :class="{collapse:collapse}" >
        <menu-left />
        <menu-top />
        <el-container class="home page"  >
            <router-view v-slot="{ Component }">
                <transition name="zoom-fade">
                    <component :is="Component" />
                </transition>
            </router-view>
        </el-container>
    </el-container>
</template>

<script lang="ts" >
import { defineComponent,ref,computed  } from "vue";
import MenuLeft from "../components/MenuLeft.vue";
import MenuTop from "../components/MenuTop.vue";
import {useStore} from '../store/index'

export default defineComponent({
    components: { MenuLeft,MenuTop },
    name: "Home",
    setup(){
        const store  = useStore()
        return {
            collapse:computed(()=>store.state.collapse)
        }
    }
});
</script>

<style lang="scss" scoped >
.home.container{
    min-height: 100vh;
    padding:108px 0 15px $menu-left-open-width;
    transition: all 0.3s ease-in-out;
    &.collapse{
        padding-left:$menu-left-shrink-width;
    }
}
.home.page {
    padding:0 10px;
}
</style>