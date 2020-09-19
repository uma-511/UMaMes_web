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
        v-model="query.status"
        clearable
        placeholder="状态"
        class="filter-item"
        style="width: 130px"
      >
        <el-option key="0" label="待入仓" value="0"/>
        <el-option key="1" label="已入仓" value="1"/>
        <el-option key="2" label="已出仓" value="2"/>
        <el-option key="3" label="已作废" value="3"/>
        <el-option key="4" label="已返仓" value="4"/>
        <el-option key="5" label="已退货" value="5"/>
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
          v-permission="['admin','chemicalFiberLabel:add']"
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
      <el-tag class="filter-item" type="success">个数汇总 {{ sumFactPerBagNumber }}</el-tag>
      <el-tag class="filter-item" type="info">净重汇总 {{ sumNetWeight }} KG</el-tag>
      <el-tag class="filter-item" type="warning">毛重汇总 {{ sumGrossWeight }} KG</el-tag>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="labelNumber" label="条码号"/>
      <el-table-column prop="fineness" label="纤度"/>
      <el-table-column prop="color" label="色号"/>
      <el-table-column prop="factPerBagNumber" label="每包个数"/>
      <el-table-column :formatter="kgformatter" prop="netWeight" label="净重"/>
      <el-table-column :formatter="kgformatter" prop="tare" label="皮重"/>
      <el-table-column :formatter="kgformatter" prop="grossWeight" label="毛重"/>
      <el-table-column prop="shifts" label="班次"/>
      <el-table-column prop="machine" label="机台号"/>
      <el-table-column prop="packer" label="包装员"/>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag
              :type="typeMapping[scope.row.status]"
              size="medium"
            >{{ typeValue[scope.row.status] }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="printTime" label="打印日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.printTime) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="checkPermission(['admin','chemicalFiberLabel:edit','chemicalFiberLabel:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','chemicalFiberLabel:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','chemicalFiberLabel:del']"
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
import { del, downloadChemicalFiberLabel, getSummaryData } from '@/api/chemicalFiberLabel'
import { parseTime, downloadFile, parseTimeToDate } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      sumFactPerBagNumber: 0,
      sumNetWeight: 0,
      sumGrossWeight: 0,
      dateQuery: '',
      queryTypeOptions: [
        { key: 'labelNumber', display_name: '条码号' },
        // { key: 'status', display_name: '状态' },
        // { key: 'printTime', display_name: '打印时间' },
        { key: 'shifts', display_name: '班次' },
        { key: 'packer', display_name: '包装员' },
        { key: 'fineness', display_name: '纤度' },
        { key: 'color', display_name: '色号' },
        { key: 'machine', display_name: '机台号' }
      ],
      typeMapping: {
        0: 'warning',
        1: 'success',
        2: '',
        3: 'info',
        4: 'warning',
        5: 'danger'
      },
      typeValue: {
        0: '待入仓',
        1: '已入仓',
        9: '托板入仓',
        2: '已出仓',
        3: '已作废',
        4: '已返仓',
        5: '已退货'
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
    parseTimeToDate,
    checkPermission,
    beforeInit() {
      this.url = 'api/chemicalFiberLabel'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      const status = query.status
      const dateQuery = this.dateQuery
      if (type && value) {
        this.params[type] = value
      }
      if (status) {
        this.params['status'] = status
      }
      if (dateQuery) {
        this.params['tempStartTime'] = dateQuery[0].getTime()
        this.params['tempEndTime'] = dateQuery[1].getTime()
      }
      this.getSummaryData(this.params)
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
        labelNumber: data.labelNumber,
        productionId: data.productionId,
        status: data.status,
        printTime: data.printTime,
        factPerBagNumber: data.factPerBagNumber,
        netWeight: data.netWeight,
        tare: data.tare,
        grossWeight: data.grossWeight,
        shifts: data.shifts,
        packer: data.packer,
        rkNumber: data.rkNumber,
        shNumber: data.shNumber,
        tkNumber: data.tkNumber,
        thNumber: data.thNumber,
        rkScanTime: data.rkScanTime,
        shScanTime: data.shScanTime,
        tkScanTime: data.tkScanTime,
        thScanTime: data.thScanTime
      }
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadChemicalFiberLabel(this.params).then(result => {
        downloadFile(result, 'ChemicalFiberLabel列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    // 获取汇总数据
    getSummaryData(params) {
      getSummaryData(params).then((res) => {
        this.sumFactPerBagNumber = res.data.sumFactPerBagNumber
        this.sumNetWeight = res.data.sumNetWeight
        this.sumGrossWeight = res.data.sumGrossWeight
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
