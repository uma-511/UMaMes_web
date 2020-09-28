<template>
  <div class="app-container">
    <!--<el-input
      v-model="query.value"
      clearable
      size="mini"
      placeholder="输入搜索内容"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="toQuery"
    />
    <el-select
      v-model="query.type"
      clearable
      size="mini"
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
      size="mini"
      class="el-range-editor&#45;&#45;small filter-item"
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
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="add">新增</el-button>
    </div>-->
    <!--工具栏-->
    <div class="head-container">
      <el-table
        v-loading="loading"
        :data="data"
        :summary-method="getDataSummaries"
        size="small"
        border
        max-height="530"
        show-summary
        @row-click="detailList($event)"
      >
        <el-table-column
          type="index"
          label="序号"
          align="center">
        </el-table-column>
        <el-table-column prop="scanNumber" label="客户名称" align="center"/>
        <el-table-column prop="deliveryDate" label="产品名称" align="center"/>
        <el-table-column prop="noteStatus" label="单位" align="center"/>
        <el-table-column prop="customerName" label="计划数量" align="center"/>
        <el-table-column prop="totalPrice" label="实收数量" align="center"/>
        <el-table-column prop="totalCost" label="数量差" align="center"/>
        <el-table-column prop="remainder" label="计划金额" align="center"/>
        <el-table-column prop="createUser" label="实际金额" align="center"/>
        <el-table-column prop="createDate" label="金额差" align="center"/>
        <!--<el-table-column prop="totalWeight" label="出库净重"/>
        <el-table-column prop="cost" label="成本单价"/>
        <el-table-column prop="totalCost" label="成本总价"/>
        <el-table-column prop="sellingPrice" label="销售单价"/>
        <el-table-column prop="totalPrice" label="销售总价"/>-->
        <!-- <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-tickets" @click="details(scope.row)"/>
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
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import checkPermission from '@/utils/permission'
import { parseTimeToDate } from '@/utils/index'
export default {
  mixins: [initData],
  data() {
    return {
      loading: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTimeToDate,
    checkPermission,
    beforeInit() {
      this.url = 'api/chemicalFiberDeliveryNote/getSalesReport'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = 'customerName'
      const value = query.value
      const dateQuery = this.dateQuery
      if (type && value) { this.params[type] = value }
      if (dateQuery) {
        this.params['tempStartTime'] = dateQuery[0].getTime()
        this.params['tempEndTime'] = dateQuery[1].getTime()
      }
      /*this.tempGetSalesReportSummaries()
      this.getSummaryData(this.params)*/
      return true
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

  body .el-table th.gutter {
    display: table-cell !important
  }
</style>
