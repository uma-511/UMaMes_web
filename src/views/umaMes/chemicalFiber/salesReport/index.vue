<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input
        v-model="query.value"
        clearable
        placeholder="输入搜索客户"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
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
      <el-tag class="filter-item" type="info">计划金额 {{ sumTotal }} 元</el-tag>
      <el-tag class="filter-item" type="info">应收金额 {{ sumTotalPrice }} 元</el-tag>
      <el-tag class="filter-item" type="info">实收金额 {{ sumTotalCost }} 元</el-tag>
      <el-tag class="filter-item" type="success">损数 {{ sumRemainder }} 元</el-tag>
    </div>
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
      <el-table-column prop="scanNumber" label="送货单号" align="center"/>
      <el-table-column prop="deliveryDate" label="送货日期" align="center">
        <template slot-scope="scope">
          <span>{{ parseTimeToDate(scope.row.deliveryDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="noteStatus" label="结款状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.enable == false">
            <el-tag
              type="info"
              size="medium"
            >{{ statusValue[0] }}</el-tag>
          </div>
          <div v-else>
            <!--待打印-->
            <div v-if="scope.row.noteStatus == 1">
              <el-tag
                size="medium"
              >{{ statusValue[1] }}</el-tag>
            </div>
            <!--待出库-->
            <div v-if="scope.row.noteStatus == 2">
              <el-tag
                size="medium"
              >{{ statusValue[2] }}</el-tag>
            </div>
            <!--待签收-->
            <div v-if="scope.row.noteStatus == 3">
              <el-tag
                type="warning"
                size="medium"
              >{{ statusValue[3] }}</el-tag>
            </div>
            <!--待结款-->
            <div v-if="scope.row.noteStatus == 4">
              <el-tag
                type="danger"
                size="medium"
              >{{ statusValue[4] }}</el-tag>
            </div>
            <!--结款中-->
            <div v-if="scope.row.noteStatus == 5">
              <el-tag
                type="danger"
                size="medium"
              >{{ statusValue[5] }}</el-tag>
            </div>
            <!--完结-->
            <div v-if="scope.row.noteStatus == 6">
              <el-tag
                type="success"
                size="medium"
              >{{ statusValue[6] }}</el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="customerName" label="客户" align="center"/>
      <el-table-column prop="sumTotalPrice" label="计划金额" align="center"/>
      <el-table-column prop="totalPrice" label="应收金额" align="center"/>
      <el-table-column prop="totalCost" label="实收金额" align="center"/>
      <el-table-column prop="remainder" label="损数" align="center"/>
      <el-table-column prop="createUser" label="制单人" align="center"/>
      <el-table-column prop="createDate" label="制单时间" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="payDateil(scope.row)" @click.stop >收款记录</el-button>
        </template>
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
    <el-table
      v-loading="loadingDateil"
      :data="dateil"
      size="small"
      border
      max-height="200"
      style="width: 50%;"
    >
      <el-table-column prop="prodModel" label="产品编号" align="center"/>
      <el-table-column prop="prodName" label="产品名称" align="center"/>
      <el-table-column prop="unit" label="单位" align="center"/>
      <!-- <el-table-column prop="outOfStockPackageNumber" label="出库包数" align="center"/>
      <el-table-column prop="outOfStockFactPerBagNumber" label="出库个数" align="center"/>
      <el-table-column prop="outOfStockNetWeight" label="出库净重(kg)" align="center"/>
      <el-table-column prop="totalCost" label="成本金额" align="center"/>
      <el-table-column prop="receivablePrice" label="总金额" align="center"/>-->
      <el-table-column prop="totalNumber" label="计划数量" align="center"/>
      <el-table-column prop="totalPrice" label="计划金额" align="center"/>
      <el-table-column prop="realQuantity" label="实际数量" align="center"/>
      <el-table-column prop="realPrice" label="实际金额" align="center"/>
      <!-- <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-tickets" @click="details(scope.row)"/>
        </template>
      </el-table-column>-->
    </el-table>
    <!--分页组件-->
   <!-- <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />-->

   <!-- <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :title="detailsTitle"
      width="65%"
    >
      <el-table :data="chemicalFiberDeliveryDetails" style="width: 100%">
        <el-table-column prop="prodColor" label="色号" width="180"/>
        <el-table-column prop="prodFineness" label="纤度" width="180"/>
        <el-table-column prop="totalBag" label="出库包数"/>
        <el-table-column prop="totalNumber" label="出库个数"/>
        <el-table-column prop="totalWeight" label="出库净重"/>
        <el-table-column prop="cost" label="成本单价"/>
        <el-table-column prop="totalCost" label="成本总价"/>
        <el-table-column prop="sellingPrice" label="销售单价"/>
        <el-table-column prop="totalPrice" label="销售总价"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>-->
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="dialog"
      :before-close="handleClose"
      title="收款记录"
      width="40%">
      <el-table
        v-loading="loadingPay"
        :data="paydateil"
        size="small"
        border
        style="width: 100%;"
      >
        <el-table-column prop="customerName" label="客户名称" align="center"/>
        <el-table-column prop="createDate" label="创建日期" align="center">
          <template slot-scope="scope">
            <span>{{ parseTimeToDate(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payDate" label="支付日期" align="center">
          <template slot-scope="scope">
            <span>{{ parseTimeToDate(scope.row.payDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="本次结账金额" align="center"/>
      </el-table>


    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import { getSalesReportSummaries, getChemicalFiberDeliveryDetailsList } from '@/api/chemicalFiberDeliveryDetail'
import { getSummaryData } from '@/api/chemicalFiberDeliveryNote'
import initData from '@/mixins/initData'
import { parseTimeToDate, parseTime } from '@/utils/index'
import { doPay, finalPay, getPayDetailList } from '@/api/chemicalFiberDeliveryNotePayDetail'
export default {
  mixins: [initData],
  data() {
    return {
      dateQuery: [],
      dialogVisible: false,
      loadingDateil: false,
      loading: false,dialog: false,loadingPay: false,
      sumTotalCost: 0, sumTotalPrice: 0,sumRemainder: 0,sumTotal: 0,
      queryTypeOptions: [
        { key: 'customerName', display_name: '客户名称' }
      ],
      sums: [],
      chemicalFiberDeliveryDetails: [],
      tempName: '客户名称',
      detailsTitle: '',
      statusValue: {
        0: '已失效',
        1: '待打印',
        2: '待发货',
        3: '待签收',
        4: '待结款',
        5: '结款中',
        6: '完结'
      },
      form: {
        deliveryNoteId: '',
        scanNumber: ''
      }
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
    parseTime,
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
        this.params['tempEndTime'] = dateQuery[1].getTime() + 24 * 60 * 60 * 1000
      }
      this.tempGetSalesReportSummaries()
      this.getSummaryData(this.params)
      return true
    },
    getSummaries() {
      return this.sums
    },
    tempGetSalesReportSummaries() {
      getSalesReportSummaries(this.params).then(res => {
        this.sums = res.data
      })
    },
    getSummaryData(params) {
      getSummaryData(params).then(res => {
        this.sumTotalCost = res.data.sumTotalCost
        this.sumTotalPrice = res.data.sumTotalPrice
        this.sumRemainder = res.data.sumRemainder
        this.sumTotal = res.data.sumTotal
      })
    },
    getDataSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (index === 5) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          sums[index] += ' 元'
        }
        if (index === 6) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          sums[index] += ' 元'
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
          sums[index] += ' 元'
        }
        if (index === 8) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          sums[index] += ' 元'
        }
      })
      return sums
    },
    detailList(data) {
      this.form.scanNumber = data.scanNumber
      this.loadingDateil = true
      getChemicalFiberDeliveryDetailsList(this.form).then(res => {
        this.dateil = res
        this.loadingDateil = false
      })
    },
    payDateil(data) {
      this.dialog = true
      const paramPay = { scanNumber: data.scanNumber }
      this.loadingPay = true
      getPayDetailList(paramPay).then(res => {
        this.paydateil = res
        this.loadingPay = false
      })
    },

    getCurrentMonthFirst () {
      var date = new Date()
      date.setDate(1)
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10)  month = '0' + month
      if (day < 10)  day = '0' + day
      this.startTime = date.getFullYear() + '-' + month + '-' + day + " 00:00:00"
    },
    /*getCurrentMonthLast () {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 2
      month = month < 10 ? '0' + month : month
      var day = new Date(year, month, 0)
      this.endTime = year + '-' + month + '-' + day.getDate()
    }*/
    getCurrentMonthLast () {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var day = new Date(year, month, 0)
      this.endTime = year + '-' + month + '-' + day.getDate() + " 23:59:59"
    }
   /* details(data) {
      this.dialogVisible = true
      this.chemicalFiberDeliveryDetails = data.chemicalFiberDeliveryDetails
      this.detailsTitle = data.scanNumber + ' -- ' + (data.customerName === null ? '' : data.customerName) + ' 详情'
    }*/
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
