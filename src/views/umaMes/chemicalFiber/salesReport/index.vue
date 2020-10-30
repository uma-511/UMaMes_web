<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <!--<el-input
        v-model="query.value"
        clearable
        placeholder="输入搜索客户"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />-->
      <el-select
        v-model="query.value"
        :remote-method="customerRemoteMethod"
        multiple:false
        clearable
        filterable
        remote
        reserve-keyword
        placeholder="客户名称"
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in customerOptions"
          :key="item.name"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <el-input
        v-model="query.values"
        clearable
        placeholder="输入搜索内容"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
      <el-select
        v-model="query.types"
        clearable
        placeholder="类型"
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in queryTypeOption"
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
    <el-table
      v-loading="loading"
      :data="data"
      :summary-method="getSummaries"
      size="small"
      style="width: 100%;"
      show-summary
    >
      <el-table-column prop="scanNumber" label="销售单号" align="center"/>
      <el-table-column prop="createTime" label="制单时间" align="center">
        <template slot-scope="scope">
          <span>{{ parseTimeToDate(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="customerName" label="客户" align="center"/>
      <!-- <el-table-column prop="outOfStockPackageNumber" label="出库包数" align="center"/>
      <el-table-column prop="outOfStockFactPerBagNumber" label="出库个数" align="center"/>
      <el-table-column prop="outOfStockNetWeight" label="出库净重(kg)" align="center"/>
      <el-table-column prop="totalCost" label="成本金额" align="center"/>
      <el-table-column prop="receivablePrice" label="总金额" align="center"/>-->
      <el-table-column prop="prodName" label="产品名称"/>
      <el-table-column prop="prodColor" label="色号"/>
      <el-table-column prop="prodFineness" label="规格"/>
      <el-table-column prop="totalBag" label="出库包数"/>
      <el-table-column prop="totalNumber" label="出库个数"/>
      <el-table-column prop="totalWeight" label="出库净重"/>
      <el-table-column prop="cost" label="成本单价"/>
      <el-table-column prop="totalCost" label="成本总价"/>
      <el-table-column prop="sellingPrice" label="销售单价"/>
      <el-table-column prop="totalPrice" label="销售总价"/>
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
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :title="detailsTitle"
      width="65%"
    >
      <el-table :data="chemicalFiberDeliveryDetails" style="width: 100%">
        <el-table-column prop="prodColor" label="色号" width="180"/>
        <el-table-column prop="prodFineness" label="规格" width="180"/>
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
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import { getSalesReportSummaries } from '@/api/chemicalFiberDeliveryDetail'
import { getCustomerList } from '@/api/customer'
import initData from '@/mixins/initData'
import { parseTimeToDate } from '@/utils/index'
export default {
  mixins: [initData],
  data() {
    return {
      dateQuery: [],
      dialogVisible: false,customerOptions: [],
      queryTypeOptions: [
        { key: 'customerName', display_name: '客户名称' }
      ],
      queryTypeOption: [
        { key: 'scanNumber', display_name: '销售单号' },
        { key: 'prodName', display_name: '产品名称' },
        { key: 'prodColor', display_name: '产品颜色' },
        { key: 'prodFineness', display_name: '产品规格' }
      ],
      sums: [],
      chemicalFiberDeliveryDetails: [],
      tempName: '客户名称',
      detailsTitle: '',
      customerQuery: {
        name
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    var start = new Date(new Date(new Date().toLocaleDateString()))
    this.dateQuery = [start, new Date(start.getTime() + 24 * 60 * 60 * 1000)]
  },
  wathc:{
    arr: function() {
      this.$nextTick(function(){
        this.customerRemoteMethod(query)
      })
    }
  },
  methods: {
    parseTimeToDate,
    checkPermission,
    beforeInit() {
      this.url = 'api/chemicalFiberDeliveryDetail'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = 'customerName'
      const value = query.value
      const types = query.types
      const values = query.values
      if (types && values) { this.params[types] = values }
      const dateQuery = this.dateQuery
      if (type && value) { this.params[type] = value }
      if (dateQuery) {
        this.params['tempStartTime'] = dateQuery[0].getTime()
        this.params['tempEndTime'] = dateQuery[1].getTime()
      }
      this.tempGetSalesReportSummaries()
      this.customerRemoteMethod();
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
    details(data) {
      this.dialogVisible = true
      this.chemicalFiberDeliveryDetails = data.chemicalFiberDeliveryDetails
      this.detailsTitle = data.scanNumber + ' -- ' + (data.customerName === null ? '' : data.customerName) + ' 详情'
    },
    customerRemoteMethod(query) {
        this.customerQuery.name = query
        this.customerOptions = []
        getCustomerList(this.customerQuery).then(res => {
          this.customerLoading = false
          this.customerQuery.name = ''
          this.customerList = res
          this.customerOptions = this.customerList.filter(item => {
            console.log(item)
            return item.name.toLowerCase()
              .indexOf(item.name.toLowerCase()) > -1
          })
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
