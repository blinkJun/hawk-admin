import { RouteLocationNormalized, onBeforeRouteUpdate, useRouter, Router } from 'vue-router'

export interface PageConfig {
    page?: number,
    limit?: number,
    pageSizeOpts?: number[]
}
const basePageConfig = {
    page: 1,
    limit: 10,
    pageSizeOpts: [10, 20]
}

export const usePage = (
    updateCallback: (PageConfig: PageConfig) => Promise<void>,
    route?: RouteLocationNormalized | null,
    router?: Router | null,
    replacePageConfig: PageConfig = {},
) => {

    // 将传入的配置和默认配置合并，得到基本配置
    const pageConfig: PageConfig = {
        page: replacePageConfig.page || basePageConfig.page,
        limit: replacePageConfig.limit || basePageConfig.limit,
        pageSizeOpts: replacePageConfig.pageSizeOpts || basePageConfig.pageSizeOpts
    }

    const refreshPage = () => {
        updateCallback && updateCallback({
            page: pageConfig.page,
            limit: pageConfig.limit
        })
    }

    const updatePage = ({ page, limit }: PageConfig) => {
        // 对比参数，是否需要更新
        const needUpdate = (Number(page) !== pageConfig.page || Number(limit) !== pageConfig.limit)
        // 更新分页配置
        Object.assign(pageConfig, {
            page: Number(page || pageConfig.page),
            limit: Number(limit || pageConfig.limit)
        })
        // 如果传入路由，则使用路由更新
        if (route && router && needUpdate) {
            router.push({
                path: route.path,
                query: {
                    ...route.query,
                    page,
                    limit
                }
            })
        } else {
            
            refreshPage()
        }
    }

    const resetPage = () => {
        updatePage({
            page: 1,
            limit: pageConfig.limit
        })
    }

    // 传入route则使用路由上的参数
    if (route && router) {
        pageConfig.page = Number(route?.query.page || pageConfig.page)
        pageConfig.limit = Number(route?.query.limit || pageConfig.limit)

        onBeforeRouteUpdate((to, from, next) => {
            next()
            updatePage(to.query)
        })
    }

    return {
        pageConfig,
        resetPage,
        refreshPage,
        updatePage
    }
}