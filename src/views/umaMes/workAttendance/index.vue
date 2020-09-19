<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
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
      <el-table-column prop="serialNumber" label="流水号"/>
      <el-table-column prop="personName" label="人员姓名"/>
      <el-table-column prop="attenceDate" label="记录日期">
        <template slot-scope="scope">
          <span>{{ parseTimeToDate(scope.row.attenceDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="attenceType" label="类型"/>
      <el-table-column prop="safeType" label="安全类型"/>
      <el-table-column prop="day" label="天数"/>
      <el-table-column prop="price" label="金额"/>
      <el-table-column prop="remark" label="备注"/>
      <!--<el-table-column prop="enable" label="状态"/>-->
      <el-table-column v-if="checkPermission(['admin','workAttendance:edit','workAttendance:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','workAttendance:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','workAttendance:del']"
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
import { del, downloadWorkAttendance } from '@/api/workAttendance'
import { parseTimeToDate, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'personName', display_name: '人员姓名' },
        { key: 'attenceDate', display_name: '制单日期' },
        { key: 'attenceType', display_name: '类型' },
        { key: 'day', display_name: '天数' },
        { key: 'remark', display_name: '备注' }
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
      this.url = 'api/workAttendance'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
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
        attenceDate: data.attenceDate,
        attenceType: data.attenceType,
        day: data.day,
        remark: data.remark,
        createDate: data.createDate,
        serialNumber: data.serialNumber,
        safeType: data.safeType,
        price: data.price,
        status: data.status,
        enable: data.enable
      }
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadWorkAttendance(this.params).then(result => {
        downloadFile(result, 'WorkAttendance列表', 'xlsx')
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
