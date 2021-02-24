const admin = () => import('../../views/system/admin.vue');
const menu = () => import('../../views/system/menu.vue');
const role = () => import('../../views/system/role.vue');
const department = () => import('../../views/system/department.vue');

export const systemRouteConfig = {
    name:'系统管理',
    icon:'el-icon-setting',
    path:'/system'
}

export const systemRoutes = [
    {
        path:'/system/admin',
        component:admin,
        meta:{
            title:'管理员管理'
        }
    },
    {
        path:'/system/menu',
        component:menu,
        meta:{
            title:'菜单管理'
        }
    },
    {
        path:'/system/role',
        component:role,
        meta:{
            title:'角色管理'
        }
    },
    {
        path:'/system/department',
        component:department,
        meta:{
            title:'部门管理'
        }
    }
]
