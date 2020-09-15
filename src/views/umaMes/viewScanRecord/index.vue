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
      <el-select
        v-model="query.scanStatus"
        clearable
        placeholder="扫描状态"
        class="filter-item"
        style="width: 130px"
      >
        <el-option key="RK" label="入仓" value="RK"/>
        <el-option key="TB" label="托板入仓" value="TB"/>
        <el-option key="SH" label="出仓" value="SH"/>
        <el-option key="TK" label="返仓" value="TK"/>
        <el-option key="TH" label="退货" value="TH"/>
        <el-option key="TZ+" label="托板+" value="TZ+"/>
        <el-option key="TZ-" label="托板-" value="TZ-"/>
        <el-option key="SH+" label="出仓+" value="SH+"/>
        <el-option key="RK-" label="出仓-" value="RK-"/>
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
      <!-- 新增 -->
      <!-- <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','viewScanRecord:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>-->
      <!-- 导出 -->
      <!-- <div style="display: inline-block;">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出</el-button>
      </div>-->
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="scanTime" label="扫描时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.scanTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="scanNumber" label="扫描单号"/>
      <el-table-column prop="type" label="扫描类型">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag
              :type="scanMapping[scope.row.type]"
              size="medium"
            >{{ scanValue[scope.row.type] }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="labelNumber" label="条码号"/>
      <el-table-column prop="prodName" label="产品名称"/>
      <el-table-column prop="prodColor" label="产品颜色"/>
      <el-table-column prop="prodFineness" label="产品纤度"/>
      <el-table-column prop="number" label="订单编号"/>
      <el-table-column prop="customerCode" label="客户编号"/>
      <el-table-column prop="factPerBagNumber" label="每包个数"/>
      <el-table-column :formatter="kgformatter" prop="netWeight" label="净重"/>
      <el-table-column :formatter="kgformatter" prop="tare" label="皮重"/>
      <el-table-column :formatter="kgformatter" prop="grossWeight" label="毛重"/>
      <el-table-column prop="shifts" label="班次"/>
      <el-table-column prop="packer" label="包装员"/>

      <!-- <el-table-column v-if="checkPermission(['admin','viewScanRecord:edit','viewScanRecord:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','viewScanRecord:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','viewScanRecord:del']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
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
import initData from '@/mixins/initData'
import { del, downloadViewScanRecord } from '@/api/viewScanRecord'
import { parseTime, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      dateQuery: '',
      delLoading: false,
      queryTypeOptions: [
        { key: 'scanNumber', display_name: '扫描单号' },
        // { key: 'type', display_name: '扫描类型（入库：RK 出库：SH 退库：TK 退货：TH）' },
        { key: 'labelNumber', display_name: '条码号' },
        { key: 'shifts', display_name: '班次' },
        { key: 'packer', display_name: '包装员' },
        { key: 'number', display_name: '订单编号' },
        { key: 'customerCode', display_name: '客户编号' },
        { key: 'prodName', display_name: '产品名称' }
      ],
      scanMapping: {
        'RK': 'success',
        'SH': '',
        'TK': 'warning',
        'TH': 'danger',
        'TH': 'success',
        'TZ+': '',
        'TZ-': 'success',
        'SH+': '',
        'Rk-': 'success',
      },
      scanValue: {
        'RK': '入仓',
        'SH': '出仓',
        'TK': '返仓',
        'TH': '退货',
        'TB': '托板入库',
        'TZ+': '托板+',
        'TZ-': '托板-',
        'SH+': '出仓+',
        'RK-': '出仓-'

      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/viewScanRecord'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      const dateQuery = this.dateQuery
      const scanStatus = query.scanStatus
      if (type && value) { this.params[type] = value }

      if (scanStatus) {
        this.params['type'] = scanStatus
      }

      if (dateQuery) {
        this.params['tempStartTime'] = dateQuery[0].getTime()
        this.params['tempEndTime'] = dateQuery[1].getTime()
      }

      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        scanTime: data.scanTime,
        scanNumber: data.scanNumber,
        type: data.type,
        labelNumber: data.labelNumber,
        factPerBagNumber: data.factPerBagNumber,
        netWeight: data.netWeight,
        tare: data.tare,
        grossWeight: data.grossWeight,
        shifts: data.shifts,
        packer: data.packer,
        number: data.number,
        customerCode: data.customerCode,
        prodName: data.prodName,
        prodColor: data.prodColor,
        prodFineness: data.prodFineness
      }
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadViewScanRecord(this.params).then(result => {
        downloadFile(result, 'ViewScanRecord列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    kgformatter(row, column, cellValue, index) {
      return cellValue + ' KG'
    }
  }
}
</script>

<style scoped>
</style>
