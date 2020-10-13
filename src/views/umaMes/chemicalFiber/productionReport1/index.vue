<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-select
        v-model="query.value"
        clearable
        placeholder="班次"
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in customerOptions"
          :key="item.shifts"
          :label="item.shifts"
          :value="item.shifts"
        />
      </el-select>
      <el-input
        v-model="query.values"
        clearable
        placeholder="输入搜索内容"
        style="width: 130px;"
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
          v-for="item in queryTypeOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-input
        v-model="query.values1"
        clearable
        placeholder="输入搜索内容"
        style="width: 130px;"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
      <el-select
        v-model="query.types1"
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
      <el-input
        v-model="query.values2"
        clearable
        placeholder="输入搜索内容"
        style="width: 130px;"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
      <el-select
        v-model="query.types2"
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
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="exportPoundExcelProduct()"
      >导出</el-button>
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
      <el-table-column prop="time" label="日期" align="center">
        <template slot-scope="scope">
          <span>{{ parseTimeToDate(scope.row.time) }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="productionNumber" label="生产单号" align="center"/>-->
      <el-table-column prop="machine" label="机台" align="center"/>
      <el-table-column prop="shifts" label="班次" align="center"/>
      <el-table-column prop="model" label="产品名称" align="center"/>
      <el-table-column prop="color" label="色号" align="center"/>
      <el-table-column prop="fineness" label="纤度" align="center"/>
      <el-table-column prop="productionPacketNumber" label="生产包数" align="center"/>
      <el-table-column prop="productionFactPerBagNumber" label="生产个数" align="center"/>
      <el-table-column prop="productionNetWeight" label="生产净重(kg)" align="center"/>
      <el-table-column prop="productionGrossWeight" label="生产毛重(kg)" align="center"/>
      <el-table-column prop="warehousingPacketNumber" label="入库库包数" align="center"/>
      <el-table-column prop="warehousingFactPerBagNumber" label="入库个数" align="center"/>
      <el-table-column prop="warehousingNetWeight" label="入库净重(kg)" align="center"/>
      <el-table-column prop="warehousingGrossWeight" label="入库毛重(kg)" align="center"/>
      <el-table-column prop="toVoidPacketNumber" label="作废包数" align="center"/>
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
import { getProductionReportSummaries, exportPoundExcelProduct} from '@/api/chemicalFiberProductionReport'
import { getShifts } from '@/api/chemicalFiberLabel'
import { parseTime, downloadFile, parseTimeToDate } from '@/utils/index'
import initData from '@/mixins/initData'
export default {
  mixins: [initData],
  data() {
    return {
      dateQuery: [],customerOptions: [],
      queryTypeOptions: [
        { key: 'machine', display_name: '机台' },
        { key: 'color', display_name: '产品颜色' },
        { key: 'fineness', display_name: '产品纤度' },
        { key: 'name', display_name: '产品名称' }
      ],
      sums: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    var start = new Date(new Date(new Date().toLocaleDateString()))
    this.dateQuery = [start, new Date(start.getTime() + 24 * 60 * 60 * 1000)]
  },
  methods: {
    parseTime,
    parseTimeToDate,
    checkPermission,
    beforeInit() {
      this.url = 'api/chemicalFiberProductionReport'
      const sort = 'id,asc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const types = query.types
      const values = query.values
      const types1 = query.types1
      const values1 = query.values1
      const types2 = query.types2
      const values2 = query.values2
      const type = 'shifts'
      const value = query.value
      const dateQuery = this.dateQuery
      this.params['is'] = 1;
      if (types && values) { this.params[types] = values }
      if (types1 && values1) { this.params[types1] = values1 }
      if (types2 && values2) { this.params[types2] = values2 }
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
      this.shiftsRemoteMethod()
      return true
    },
    getSummaries() {
      return this.sums
    },
    tempGetProductionReportSummaries() {
      getProductionReportSummaries(this.params).then(res => {
        this.sums = res.data
      })
    },
    exportPoundExcelProduct() {
      exportPoundExcelProduct(this.params).then(result => {
        this.detailLoading = false
        downloadFile(result, '导出列表', 'xls')
      }).catch(() => {
        this.detailLoading = false
      })
    },
    shiftsRemoteMethod() {
      this.customerOptions = []
      getShifts().then(res => {
        this.customerList = res
        this.customerOptions = this.customerList.filter(item => {
          return item.shifts.toLowerCase()
            .indexOf(item.shifts.toLowerCase()) > -1
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
