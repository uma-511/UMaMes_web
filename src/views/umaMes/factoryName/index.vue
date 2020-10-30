<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery"
      >搜索</el-button>
    </div>
    <!--表单组件-->
  <el-table
    v-loading="loading"
    :data="data"
    size="small"
    style="width: 100%;"
  >
    <!-- <el-table-column prop="number" label="编号" align="center"/> -->
    <!--<el-table-column prop="productionNumber" label="生产单号" align="center"/>-->
    <el-table-column prop="id" label="序号" align="center"/>
    <el-table-column prop="name" label="模板名称" align="center"/>
    <!--<el-table-column prop="in_stock_prop" label="在库包数比例" align="center">
      <template slot-scope="scope">
        <span style="color:#E6A23C;">{{ scope.row.in_stock_prop }}%</span>
      </template>
    </el-table-column>
    <el-table-column prop="in_weight_prop" label="在库净重比例" align="center">
      <template slot-scope="scope">
        <span style="color:#E6A23C;">{{ scope.row.in_weight_prop }}%</span>
      </template>
    </el-table-column>
    <el-table-column prop="cancel_stock_pack" label="作废包数" align="center">
      <template slot-scope="scope">
        <span style="color:#F56C6C;">{{ scope.row.cancel_stock_pack }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="cancel_stock_number" label="作废个数" align="center">
      <template slot-scope="scope">
        <span style="color:#F56C6C;">{{ scope.row.cancel_stock_number }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="cancel_net_weight" label="作废净重(kg)" align="center">
      <template slot-scope="scope">
        <span style="color:#F56C6C;">{{ scope.row.cancel_net_weight }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="cancel_gross_weight" label="作废毛重(kg)" align="center">
      <template slot-scope="scope">
        <span style="color:#F56C6C;">{{ scope.row.cancel_gross_weight }}</span>
      </template>
    </el-table-column>-->
    <!--<el-table-column
      label="操作"
      width="150px"
      align="center"
    >
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-search"
          @click="edit(scope.row)"
        />
      </template>
    </el-table-column>-->
  </el-table>
  <!--分页组件-->
  <el-pagination
    :total="total"
    :current-page="page + 1"
    style="margin-top: 8px;"
    layout="total, prev, pager, next, sizes"
    @size-change="sizeChange"
    @current-change="pageChange"
  />
  </div>

</template>
<script>
import checkPermission from '@/utils/permission'
import { parseTime, downloadFile, parseTimeToDate } from '@/utils/index'
import initData from '@/mixins/initData'
export default {
  mixins: [initData],
  data() {
    return {
      dateQuery: [],customerOptions: [],
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    parseTimeToDate,
    checkPermission,
    beforeInit() {
      this.url = 'api/chemicalFiberLabel/factoryName'
      const sort = 'id,asc'
      this.params = { page: this.page, size: this.size, sort: sort }
      return true
    }
  }

}
</script>

<style scoped>

</style>
