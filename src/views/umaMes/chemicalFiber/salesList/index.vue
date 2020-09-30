<template>
  <div class="app-container">
    <el-input
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
    <!--工具栏-->
    <div class="head-container">
      <el-table
        v-loading="loading"
        :data="data"
        :summary-method="getSummaries"
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
        <el-table-column prop="scanNumber" label="送货单号" align="center"/>
        <el-table-column prop="customerName" label="客户名称" align="center"/>
        <el-table-column prop="deliveryDate" label="送货日期" align="center">
          <template slot-scope="scope">
            <span>{{ parseTimeToDate(scope.row.deliveryDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="prodName" label="产品名称" align="center"/>
        <el-table-column prop="unit" label="单位" align="center"/>
        <el-table-column prop="totalNumber" label="计划数量" align="center"/>
        <el-table-column prop="realQuantity" label="实收数量" align="center"/>
        <el-table-column prop="sumNumber" label="数量差" align="center">
        </el-table-column>
        </el-table-column>
        <el-table-column prop="totalPrice" label="计划金额" align="center"/>
        <el-table-column prop="realPrice" label="实际金额" align="center"/>
        <el-table-column prop="sumPrice" label="金额差" align="center">
        </el-table-column>
        </el-table-column>
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
import { getSalesSummaries } from '@/api/chemicalFiberSalesList'
export default {
  mixins: [initData],
  data() {
    return {
      loading: false, dateQuery: '',checkInvalidQuery: false,sumtotalPrice: 0,sumTon: 0,sum: 0,startTime: '',
      endTime: '',sums: [],
      queryTypeOptions: [
        { key: 'customerName', display_name: '客户名称' },
        { key: 'prodName', display_name: '产品名称' },
        { key: 'scanNumber', display_name: '送货单号' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.getCurrentMonthFirst()
    this.getCurrentMonthLast()
    this.dateQuery = [new Date(this.startTime), new Date(this.endTime)];
  },
  methods: {
    parseTimeToDate,
    checkPermission,
    beforeInit() {
      this.url = 'api/chemicalFiberSalesList'
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
      } else {
        this.$notify({
          title: '警告',
          message: '请选择时间',
          type: 'warning'
        })
        return false
      }
      this.tempGetProductionReportSummaries()
      /*this.tempGetSalesReportSummaries()
      this.getSummaryData(this.params)*/
      return true
    },
    getSummaries() {
      return this.sums
    },
    tempGetProductionReportSummaries() {
      getSalesSummaries(this.params).then(res => {
        this.sums = res.data
      })
    },
    /*getDataSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (index === 6) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          sums[index]
        }
        if (index === 7) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          sums[index]
        }
        if (index === 9) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          sums[index]
        }
        if (index === 10) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          sums[index]
        }
        if (index === 11) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          sums[index]
        }
      })
      return sums
    },*/
    getCurrentMonthFirst () {
      var date = new Date()
      date.setDate(1)
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10)  month = '0' + month
      if (day < 10)  day = '0' + day
      this.startTime = date.getFullYear() + '-' + month + '-' + day
    },
    getCurrentMonthLast () {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var day = new Date(year, month, 0)
      this.endTime = year + '-' + month + '-' + day.getDate()
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
