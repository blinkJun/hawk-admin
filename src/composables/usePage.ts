import {reactive} from 'vue'
import {RouteLocationNormalized,onBeforeRouteUpdate} from 'vue-router'
import router from '../routes/index'
interface TableConfig {
    page?:number,
    limit?:number,
    pageSizeOpts?:number[]
}
const basePageConfig = {
    page: 1,
    limit: 10,
    pageSizeOpts: [10, 20]
}

export const usePage = (
    route:RouteLocationNormalized,
    setTable:(tableConfig:TableConfig)=>void,
    replacePageConfig:TableConfig = {}
)=>{

    // 将传入的配置和默认配置合并
    const pageConfig:TableConfig = {
        page:replacePageConfig.page || basePageConfig.page,
        limit:replacePageConfig.limit || basePageConfig.limit,
        pageSizeOpts:replacePageConfig.pageSizeOpts || basePageConfig.pageSizeOpts
    }

    // 将默认配置和路由的配置合并
    const tableConfig:TableConfig = reactive({
        page: Number(route.query.page) || pageConfig.page,
        limit: Number(route.query.limit) || pageConfig.limit,
        pageSizeOpts: pageConfig.pageSizeOpts
    })

    const updateTable = ()=>{
        setTable&&setTable({
            page:tableConfig.page,
            limit:tableConfig.limit
        })
    }

    const toUpdateTable = ({ page, limit }:TableConfig) => {
        if (page !== tableConfig.page || limit !== tableConfig.limit) {
            router.push({
                path: route.path,
                query: Object.assign({}, route.query, {
                    page,
                    limit
                })
            })
        }else{
            updateTable()
        }
    }

    const resetTable = ()=>{
        toUpdateTable({
            page: basePageConfig.page,
            limit: tableConfig.limit
        })
    }

    onBeforeRouteUpdate((to, from, next)=>{
        const { page, limit } = to.query
        Object.assign(tableConfig, {
            page: Number(page) || pageConfig.page,
            limit: Number(limit) || pageConfig.limit
        })
        next()
        updateTable()
    })

    return {
        tableConfig,
        updateTable,
        toUpdateTable,
        resetTable
    }
}