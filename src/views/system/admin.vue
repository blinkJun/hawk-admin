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
                :list="tableData.list"
                :limit="tableConfig.limit"
                :total="tableData.total"
                :pageSizeOpts="tableConfig.pageSizeOpts"
                :currentPage="tableConfig.page"
                @updete="tableUpdated"
            >
                <el-table-column label="id" prop="id" width="100"></el-table-column>
                <el-table-column label="名称" prop="name" ></el-table-column>
            </h-table>
        </el-card>
        
    </div>
</template>

<script>
import { defineComponent, onMounted, reactive } from "vue";
import HTable from "../../components/HTable.vue";
import adminJson from '../../assets/response/admin'
import {usePage} from '../../composables/usePage'
import { useRoute } from "vue-router";
export default defineComponent({
    components: { HTable },
    name: "page-admin",
    setup(props,ctx){
        const tableData = reactive({
            list:[],
            total:0
        })
        const setTable = ()=>{
            tableData.list = adminJson
        }
        const showCreateForm = ()=>{

        }
        const {tableConfig , tableUpdated , resetTable } = usePage(useRoute(),setTable)

        onMounted(()=>{
            resetTable()
        })

        return {
            tableData,
            tableConfig,
            tableUpdated,
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