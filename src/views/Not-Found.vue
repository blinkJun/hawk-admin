<template>
  <section class="page not-found" >
        <img :src="`${publicPath}images/404.svg`" alt="">
        <p class="tips" >找不到此页面了。<router-link to="/" >回到首页</router-link> </p>
    </section>
</template>

<script lang="ts" >
import {getCurrentInstance} from 'vue'
export default {
    name:'not-found',
    setup(){
        const {appContext} = getCurrentInstance()!
        const config = appContext.config.globalProperties.$config
        return {
            publicPath:config.publicPath
        }
    },
}
</script>

<style lang="scss" scoped>
    .not-found{
        padding:100px 0;
        text-align: center;
        >img{
            height:50vh;
        }
        p{
            margin:10px 0;
        }
        .tips{
            color:#999
        }
    }
</style>