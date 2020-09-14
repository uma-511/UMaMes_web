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
      <el-table-column prop="color" label="日期" align="center">
        <template slot-scope="scope">
          <span>{{ parseTimeToDate(scope.row.create_date) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="color" label="生产单号" align="center">
        <template slot-scope="scope">
          <span style="color:#67C23A;">{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="color" label="机台" align="center">
        <template slot-scope="scope">
          <span style="color:#67C23A;">{{ scope.row.machine_number }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="color" label="班次" align="center">
        <template slot-scope="scope">
          <span style="color:#67C23A;">{{ scope.row.shifts }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="color" label="色号" align="center"/>
      <el-table-column prop="fineness" label="纤度" align="center"/>
      <el-table-column prop="in_stock_pack" label="生产包数" align="center">
        <template slot-scope="scope">
          <span style="color:#67C23A;">{{ scope.row.in_stock_pack }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="in_stock_number" label="生产个数" align="center">
        <template slot-scope="scope">
          <span style="color:#67C23A;">{{ scope.row.in_stock_number }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="in_net_weight" label="生产净重(kg)" align="center">
        <template slot-scope="scope">
          <span style="color:#67C23A;">{{ scope.row.in_net_weight }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="in_gross_weight" label="生产毛重(kg)" align="center">
        <template slot-scope="scope">
          <span style="color:#67C23A;">{{ scope.row.in_gross_weight }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="out_stock_pack" label="入库库包数" align="center">
        <template slot-scope="scope">
          <span style="color:#409EFF;">{{ scope.row.out_stock_pack }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="out_stock_number" label="入库个数" align="center">
        <template slot-scope="scope">
          <span style="color:#409EFF;">{{ scope.row.out_stock_number }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="out_net_weight" label="入库净重(kg)" align="center">
        <template slot-scope="scope">
          <span style="color:#409EFF;">{{ scope.row.out_net_weight }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="out_gross_weight" label="入库毛重(kg)" align="center">
        <template slot-scope="scope">
          <span style="color:#409EFF;">{{ scope.row.out_gross_weight }}</span>
        </template>
      </el-table-column>
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
import { getProductionReportSummaries, exportPoundExcelProduct} from '@/api/chemicalFiberProduction'
import { parseTime, downloadFile, parseTimeToDate } from '@/utils/index'
import initData from '@/mixins/initData'
export default {
  mixins: [initData],
  data() {
    return {
      dateQuery: [],
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
    var start = new Date(new Date(new Date().toLocaleDateString()))
    this.dateQuery = [start, new Date(start.getTime() + 24 * 60 * 60 * 1000)]
  },
  methods: {
    parseTime,
    parseTimeToDate,
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
      } else {
        this.$notify({
          title: '警告',
          message: '请选择时间',
          type: 'warning'
        })
        return false
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
    },
    exportPoundExcelProduct() {
      exportPoundExcelProduct(this.params).then(result => {
        this.detailLoading = false
        downloadFile(result, '导出列表', 'xls')
      }).catch(() => {
        this.detailLoading = false
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
