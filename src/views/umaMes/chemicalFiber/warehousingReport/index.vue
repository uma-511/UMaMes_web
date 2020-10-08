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
    <el-button :loading="downloadLoading" size="mini" type="success" @click="exportWarehousing()">导出</el-button>
    <el-tag class="filter-item" type="info">总支数 {{ sum}} 支</el-tag>
    <el-tag class="filter-item" type="info">总吨数 {{ sumTon }} T</el-tag>
    <el-tag class="filter-item" type="success">总金额 {{ sumtotalPrice }} 元</el-tag>
    <div class="head-container">
      <el-table
        v-loading="loading"
        :data="data"
        border
        size="small"
        style="width: 100%;"
      >
        <el-table-column
          type="index"
          label="序号"
          align="center">
        </el-table-column>
        <el-table-column prop="scanNumber" label="入库单号"/>
        <el-table-column prop="warehousingDate" label="入库时间">
          <template slot-scope="scope">
            <span>{{ parseTimeToDate(scope.row.warehousingDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商名称"/>
        <el-table-column prop="prodName" label="产品名称"/>
        <el-table-column prop="unit" label="单位"/>
        <el-table-column prop="warehousingNumber" label="数量"/>
        <el-table-column prop="price" label="单价"/>
        <el-table-column prop="totalPrice" label="金额"/>
        <el-table-column prop="createUser" label="制单人"/>
        <el-table-column prop="createDate" label="制单时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <!--<el-table-column prop="warehousingStatus" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.warehousingStatus == 1">
              <el-tag
                type="danger"
                size="medium"
              >{{ statusValue[1] }}</el-tag>
            </div>
            <div v-if="scope.row.warehousingStatus == 2">
              <el-tag
                type="success"
                size="medium"
              >{{ statusValue[2] }}</el-tag>
            </div>
          </template>
        </el-table-column>-->
        <!--<el-table-column
          label="操作"
          width="240px"
          align="center"
        >-->

        </el-table-column>
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
import { parseTime, parseTimeToDate, downloadChemicalFiberLabel,downloadFile} from '@/utils/index'
import { getSummaryData, download} from '@/api/chemicalFiberWarehousingReort'
export default {
  mixins: [initData],
  data() {
    return {
      dateQuery: '',checkInvalidQuery: false,sumtotalPrice: 0,sumTon: 0,sum: 0,startTime: '',
      endTime: '',
      queryTypeOptions: [
        { key: 'scanNumber', display_name: '入库单号' },
        { key: 'prodName', display_name: '产品名称' },
        { key: 'supplierName', display_name: '供应商' },
        { key: 'createUser', display_name: '制单人' }
      ],
      query:{
        type: 'supplierName'
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
    /*var start = new Date(new Date(new Date().toLocaleDateString()))
    this.dateQuery = [start, new Date(start.getTime() + 24 * 60 * 60 * 1000)]*/
  },
  methods: {
    parseTime,
    parseTimeToDate,
    beforeInit() {
      this.url = 'api/chemicalFiberWarehousingReort'
      const sort = 'id,desc'
      this.params = {page: this.page, size: this.size, sort: sort}
      const dateQuery = this.dateQuery
      const query = this.query
      const type = query.type
      const value = query.value
      const checkInvalidQurey = this.checkInvalidQuery
      this.params['queryWithInvalid'] = checkInvalidQurey
      if (type && value) {
        this.params[type] = value
      }
      if (dateQuery) {
        this.params['tempStartTime'] = dateQuery[0].getTime()
        this.params['tempEndTime'] = dateQuery[1].getTime() + 24 * 60 * 60 * 1000
      } else {
          this.$notify({
            title: '警告',
            message: '请选择时间',
            type: 'warning'
          })
          return false
      }
      this.getSummaryData(this.params)
      /*const query = this.query
      const type = query.type
      const value = query.value
      const dateQuery = this.dateQuery
      const checkInvalidQurey = this.checkInvalidQuery
      if (type && value) { this.params[type] = value }
      this.params['queryWithInvalid'] = checkInvalidQurey
      */
      return true
    },
    getSummaryData(params) {
      getSummaryData(params).then((res) => {
        this.sumtotalPrice = res.data.sumTotalPrice
        this.sumTon = res.data.sumTon
        this.sum = res.data.sum
      })

    },
    exportWarehousing() {
      if (!this.dateQuery) {
        this.$notify({
          title: '警告',
          message: '请选择时间',
          type: 'warning'
        })
        this.downloadLoading = false
        return
      }
      this.init()
      this.downloadLoading = true
      download(this.params).then(result => {
        this.downloadLoading = false
        this.dialogVisible = false
        this.init()
        downloadFile(result, '导出', 'xls')
      })
    },
    /*getdateValue (val) {
      this.startTime = val
      this.getbalanceIndexData()
    },
    getdateVal (val) {
      this.endTime = val
      this.getbalanceIndexData()
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
  body .el-table th.gutter {
    display: table-cell !important
  }

</style>
