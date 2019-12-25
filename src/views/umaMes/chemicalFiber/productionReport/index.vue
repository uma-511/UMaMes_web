<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input
        v-model="query.value"
        clearable
        placeholder="输入搜索内容"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
      <el-select
        v-model="query.type"
        clearable
        placeholder="类型"
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in queryTypeOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-date-picker
        v-model="dateQuery"
        class="el-range-editor--small filter-item"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery"
      >搜索</el-button>
    </div>
    <!--表单组件-->
    <!-- <eForm ref="form" :is-add="isAdd"/> -->
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      :summary-method="getSummaries"
      size="small"
      style="width: 100%;"
      show-summary
    >
      <el-table-column
        type="index"
        width="50"
        label="编号"
        align="center"/>
      <!-- <el-table-column prop="number" label="编号" align="center"/> -->
      <el-table-column prop="prodColor" label="色号" align="center"/>
      <el-table-column prop="prodFineness" label="纤度" align="center"/>
      <el-table-column prop="warehousingPacketNumber" label="入库包数" align="center"/>
      <el-table-column prop="warehousingFactPerBagNumber" label="入库个数" align="center"/>
      <el-table-column prop="warehousingNetWeight" label="入库净重(kg)" align="center"/>
      <el-table-column prop="warehousingGrossWeight" label="入库毛重(kg)" align="center"/>
      <el-table-column prop="outOfstockPacketNumber" label="出库包数" align="center"/>
      <el-table-column prop="outOfstockFactPerBagNumber" label="出库个数" align="center"/>
      <el-table-column prop="outOfstockNetWeight" label="出库净重(kg)" align="center"/>
      <el-table-column prop="outOfstockGrossWeight" label="出库毛重(kg)" align="center"/>
      <el-table-column prop="warehousingPacketRatio" label="在库包数比例" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.warehousingPacketRatio }}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="warehousingNetWeightRatio" label="在库净重比例" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.warehousingNetWeightRatio }}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="toVoidPacketNumber" label="作废包数" align="center"/>
      <el-table-column prop="toVoidFactPerBagNumber" label="作废个数" align="center"/>
      <el-table-column prop="toVoidNetWeight" label="作废净重(kg)" align="center"/>
      <el-table-column prop="toVoidGrossWeight" label="作废毛重(kg)" align="center"/>
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
import { getProductionReportSummaries } from '@/api/chemicalFiberProduction'
import initData from '@/mixins/initData'
export default {
  mixins: [initData],
  data() {
    return {
      dateQuery: '',
      queryTypeOptions: [
        { key: 'prodColor', display_name: '产品颜色' },
        { key: 'prodFineness', display_name: '产品纤度' }
      ],
      sums: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/chemicalFiberProduction/getProductionReport'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      const dateQuery = this.dateQuery
      if (type && value) { this.params[type] = value }
      if (dateQuery) {
        this.params['tempStartTime'] = dateQuery[0].getTime()
        this.params['tempEndTime'] = dateQuery[1].getTime()
      }
      this.tempGetProductionReportSummaries()
      return true
    },
    getSummaries() {
      return this.sums
    },
    tempGetProductionReportSummaries() {
      getProductionReportSummaries(this.params).then(res => {
        this.sums = res.data
      })
    }
  }
}
</script>

<style>
.el-table .warning-row {
  background: #c5c8ce;
}

.el-table .success-row {
  background: #ffffff;
}
</style>
