<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="queryValue" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="queryType" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>

      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <el-checkbox
        v-model="showUnEnable"
        label="查询失效单"
        style="margin-top: 1px"
        @change="toQuery"
      />
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','travelPersionPerformance:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <!--流水单号非中文-->
      <el-table-column prop="scanNumber" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" label="流水单号"/>
      <el-table-column prop="personName" label="责任人"/>
      <el-table-column prop="permission" label="职位"/>
      <el-table-column prop="mileageFee" label="里程费"/>
      <el-table-column prop="overtimePay" label="加班费"/>
      <el-table-column prop="allowance" label="补贴费"/>
      <el-table-column prop="surcharge" label="附加费"/>
      <el-table-column prop="handlingCost" label="装卸费"/>
      <el-table-column prop="totalPerformance" label="绩效总计"/>
      <el-table-column prop="createTime" label="交货日期">
        <template slot-scope="scope">
          <span>{{ parseTimeToDate(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="enable" label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.enable == false">
            <el-tag
              type="info"
              size="medium"
            >已失效</el-tag>
          </div>
          <div v-if="scope.row.enable == true">
            <el-tag
              type="success"
              size="medium"
            >正常</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','travelPersionPerformance:edit','travelPersionPerformance:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','travelPersionPerformance:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','travelPersionPerformance:del']"
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
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadTravelPersionPerformance } from '@/api/travelPersionPerformance'
import { parseTimeToDate, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      showUnEnable: false,
      queryValue: '',
      queryType: 'personName',
      queryTypeOptions: [
        { key: 'personName', display_name: '责任人' },
        { key: 'scanNumber', display_name: '单号' }
      ]
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
      this.url = 'api/travelPersionPerformance'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const checkEnables = this.showUnEnable
      this.params['showUnEnable'] = checkEnables
      if (this.queryType && this.queryValue) { this.params[this.queryType ] = this.queryValue }
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
        personName: data.personName,
        personId: data.personId,
        scanNumber: data.scanNumber,
        permission: data.permission,
        mileageFee: data.mileageFee,
        overtimePay: data.overtimePay,
        allowance: data.allowance,
        surcharge: data.surcharge,
        handlingCost: data.handlingCost,
        totalPerformance: data.totalPerformance,
        createTime: data.createTime,
        enable: data.enable
      }
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadTravelPersionPerformance(this.params).then(result => {
        downloadFile(result, 'TravelPersionPerformance列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
