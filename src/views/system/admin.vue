<template>
    <div class="page admin">
        <el-card>
            <template #header>
                <div>
                    <el-button
                        type="success"
                        @click.native="showCreateForm"
                    >新增</el-button>
                </div>
            </template>
            <h-table
                :list="tableData.rows"
                :limit="tableConfig.limit"
                :total="tableData.count"
                :pageSizeOpts="tableConfig.pageSizeOpts"
                :currentPage="tableConfig.page"
                @update="toUpdateTable($event)"
            >
                <el-table-column label="id" prop="id" width="100"></el-table-column>
                <el-table-column label="名称" prop="name" ></el-table-column>
            </h-table>
        </el-card>
        
    </div>
</template>

<script>
import { defineComponent, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { usePage } from '../../composables/usePage';
import { getAdminList  } from '../../api/index'

import HTable from "../../components/HTable.vue";
export default defineComponent({
    components: { HTable },
    name: "page-admin",
    setup(props,ctx){

        let tableData = reactive({
            rows:[],
            count:0
        })
        const setTable = async (tableConfig)=>{
            const listData = await getAdminList(tableConfig)
            tableData.rows = listData.rows
            tableData.count = listData.count
        }
        const showCreateForm = ()=>{
            
        }
        const { tableConfig ,toUpdateTable, resetTable } = usePage(useRoute(),setTable)

        onMounted(()=>{
            resetTable()
        })

        return {
            tableData,
            tableConfig,
            toUpdateTable,
            showCreateForm
        }
    }
});
</script>

<style lang="scss" >
.page.admin{
    width:100%;
}
</style>