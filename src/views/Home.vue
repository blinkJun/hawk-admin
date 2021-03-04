<template>
    <el-container class="home container" :class="{collapse:collapse}" >
        <menu-left />
        <menu-top />
        <el-container class="page-wrap"  >
            <router-view v-slot="{ Component }">
                <transition name="zoom-fade" mode="out-in" >
                    <component :is="Component" />
                </transition>
            </router-view>
        </el-container>
    </el-container>
</template>

<script lang="ts" >
import { defineComponent,computed} from "vue";
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

<style lang="scss" >
.home.container{
    min-height: 100vh;
    padding:104px 0 10px $menu-left-open-width;
    transition: all 0.3s ease-in-out;
    &.collapse{
        padding-left:$menu-left-shrink-width;
    }
    >.page-wrap {
        padding:0 15px;
        min-height: calc(100vh - 115px);
        >.page {
            width:100%;
            >.el-card{
                min-height:100%;
            }
        }
    }
}

</style>