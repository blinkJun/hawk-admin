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
        const parentId = Number(menu[parentIdKey])
        if ( parentId === topMenuId) {
            menu.expand = true
            tree.push(menu)
        } else {
            if (treeMap[parentId]) {
                treeMap[parentId].push(menu)
            } else {
                treeMap[parentId] = [menu]
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

/**
 * @method treeToCascaderValue
 * @description 树形数据转换为级联值
 * @param tree 树形结构
 * @param focusId 当前选中的id
 * @param itemKey 树形结构需要取出对比的键
 * @return [1,2,3] 树形结构数组
 */
export const  treeToCascaderValue = function(tree:any[], focusId:string |number , itemKey= 'id',){

    const parseData = function(tree:any[], start = []):any[]{
        for (const item of tree) {
            // 与当前的部门id相同 返回级联部门结构
            const treeItemKeyValue = item[itemKey]
            if (treeItemKeyValue === Number(focusId)) {
                return start.concat(treeItemKeyValue)
            } else {
                // 与当前部门id不同 查询其子级
                if (item.children && item.children.length) {
                    const chilrenTree = parseData(item.children, start.concat(treeItemKeyValue))
                    // 子级查询到匹配部门id则直接返回
                    if (chilrenTree.length>0) {
                        return chilrenTree
                    }
                }
            }
        }
        // 否则返回空
        return []
    }

    return parseData(tree)
}
