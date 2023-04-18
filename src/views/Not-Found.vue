<template>
  <section class="page not-found" >
        <img :src="`${publicPath}images/404.svg`" alt="">
        <p class="tips" >找不到此页面了。<router-link to="/" >回到首页</router-link> </p>
    </section>
</template>

<script lang="ts" setup >
import config from '@/config'
const publicPath = config.publicPath
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