import {reactive} from 'vue'
import {RouteLocationNormalized,onBeforeRouteUpdate} from 'vue-router'
import router from '../routes/index'
interface TableConfig {
    page?:number,
    limit?:number,
    pageSizeOpts?:number[]
}

export const usePage = (route:RouteLocationNormalized,setTable:()=>void)=>{

    const baseConfig = {
        page: 1,
        limit: 10,
        pageSizeOpts: [10, 20]
    }

    const tableConfig:TableConfig = reactive({
        page: Number(route.query.page) || baseConfig.page,
        limit: Number(route.query.limit) || baseConfig.limit,
        pageSizeOpts: [...baseConfig.pageSizeOpts]
    })

    const updateTable = ()=>{
        setTable&&setTable()
    }

    const tableUpdated = ({ page, limit }:TableConfig) => {
        if (page !== tableConfig.page || limit !== tableConfig.limit) {
            router.push({
                path: route.path,
                query: Object.assign({}, route.query, {
                    page,
                    limit
                })
            })
        }
        updateTable()
    }

    const resetTable = ()=>{
        tableUpdated({
            page: 1,
            limit: tableConfig.limit
        })
    }

    onBeforeRouteUpdate((to, from, next)=>{
        const { page, limit } = to.query
        Object.assign(tableConfig, {
            page: Number(page) || baseConfig.page,
            limit: Number(limit) || baseConfig.limit
        })
        next()
    })

    return {
        tableConfig,
        updateTable,
        tableUpdated,
        resetTable
    }
}