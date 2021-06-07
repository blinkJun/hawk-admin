<template>
    <section class="page no-auth" >
        <img :src="`${publicPath}images/warning.svg`" alt="">
        <p class="tips-1" >暂无此页面权限，请联系管理员添加权限。<router-link to="/" >回到首页</router-link> </p>
        <p class="tips-2" >已获得权限？ <a href="javascript:void(0)" @click="tryRedirect" >重试</a></p>
    </section>
</template>

<script lang="ts" >
import {getCurrentInstance} from 'vue'
import {useStore} from '../store/index'
export default {
    name: '',
    data () {
        return {

        }
    },
    setup(){
        const {appContext} = getCurrentInstance()!
        const store = useStore()
        const config = appContext.config.globalProperties.$config
        return {
            store,
            publicPath:config.publicPath
        }
    },
    methods: {
        async tryRedirect () {
            await this.store.dispatch('initUserAuthState')
            const redirectUrl = this.$route.query.redirect_url as string || '/'
            this.$router.replace(redirectUrl || '/')
        }
    }
}
</script>

<style lang="scss" scoped>
    .no-auth{
        padding:100px 0;
        text-align: center;
        >img{
            height:50vh;
        }
        p{
            margin:10px 0;
        }
        .tips-2{
            color:#999
        }
    }
</style>
