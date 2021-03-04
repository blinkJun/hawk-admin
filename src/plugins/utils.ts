/**
 * @method toTree
 * @description 表格数据转换为树形结构
 * @param {Array} list 平铺的数据数组，每一项应该包含一个{itemKey}和[parentIdKey]：[{id,name,parentId},{id,name,parentId}]
 * @param {String} itemKey 每一项的唯一键
 * @param {Number || String} topMenuId 最上级菜单的唯一键值
 * @return {Array} [{id,name,parentId,children:[{id,name,parentId}]}]
 */
export const toTree = function (list:any, itemKey = 'id', topMenuId = 0,parentIdKey='parentId') {
    const tree = []; const treeMap:{[propName:string]:any} = {}
    for (let i = 0; i < list.length; i++) {
        const menu = list[i]
        menu.title = menu.name
        menu.label = menu.name
        menu.value = menu[itemKey]
        if (menu[parentIdKey] === topMenuId) {
            menu.expand = true
            tree.push(menu)
            list[i] = null
        } else {
            if (treeMap[menu[parentIdKey]]) {
                treeMap[menu[parentIdKey]].push(menu)
            } else {
                treeMap[menu[parentIdKey]] = [menu]
            }
        }
    }

    const createInfinite = function (menus:any[]) {
        for (let i = 0; i < menus.length; i++) {
            const menu = menus[i]
            if (treeMap[menu[itemKey]]) {
                menu.children = treeMap[menu[itemKey]]
                delete treeMap[menu[itemKey]]
                createInfinite(menu.children)
            }
        }
    }
    createInfinite(tree)

    return tree
}