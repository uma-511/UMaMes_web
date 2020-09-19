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
      <!--<div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','monthlyWageStatistics:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>-->
      <!-- 生成上月工资清单 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="generateWage">生成上月工资清单</el-button>
      </div>
      <!-- 导出 -->
      <div style="display: inline-block;">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" @row-click="edit">
      <el-table-column prop="personName" label="姓名"/>
      <el-table-column prop="dept" label="部门"/>
      <el-table-column prop="job" label="岗位"/>
      <el-table-column prop="basicSalary" label="基本工资"/>
      <el-table-column prop="performance" label="绩效"/>
      <el-table-column prop="cardPrize" label="打卡奖"/>
      <el-table-column prop="safePrize" label="安全奖"/>
      <el-table-column prop="fullPrize" label="全勤奖"/>
      <el-table-column prop="highTemperatureSubsidy" label="高温津贴"/>
      <el-table-column prop="overtimePay" label="加班费"/>
      <el-table-column prop="otherPrize" label="其他"/>
      <el-table-column prop="wagesPayable" label="应发工资"/>
      <el-table-column prop="attendance" label="出勤天数"/>
      <el-table-column prop="attendanceReal" label="实际出勤"/>
      <el-table-column prop="leaveCount" label="请假"/>
      <el-table-column prop="lackCard" label="缺卡"/>
      <el-table-column prop="violationOfSafety" label="违反安全"/>
      <el-table-column prop="dateTime" label="日期">
        <template slot-scope="scope">
          <span>{{ parseTimeToDates(scope.row.dateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="netSalary" label="实发工资"/>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <!--待确认-->
          <div v-if="scope.row.status == 0">
            <el-tag
              size="medium"
            >{{ statusValue[0] }}</el-tag>
          </div>
          <!--待发放-->
          <div v-if="scope.row.status == 1">
            <el-tag
              size="medium"
            >{{ statusValue[1] }}</el-tag>
          </div>
          <!--已发放-->
          <div v-if="scope.row.status == 2">
            <el-tag
              type="warning"
              size="medium"
            >{{ statusValue[2] }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column v-if="checkPermission(['admin','monthlyWageStatistics:edit','monthlyWageStatistics:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','monthlyWageStatistics:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','monthlyWageStatistics:del']"
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
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadMonthlyWageStatistics, generateWage } from '@/api/monthlyWageStatistics'
import { parseTimeToDates, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      statusValue: {
        0: '待确认',
        1: '待发放',
        2: '已发放'
      },
      queryTypeOptions: [
        { key: 'personName', display_name: '姓名' },
        { key: 'dept', display_name: '部门' },
        { key: 'job', display_name: '岗位' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTimeToDates,
    checkPermission,
    beforeInit() {
      this.url = 'api/monthlyWageStatistics'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      return true
    },
    generateWage() {
      generateWage().then(
        res => {

        }
      )
      this.init()
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
        dept: data.dept,
        job: data.job,
        basicSalary: data.basicSalary,
        performance: data.performance,
        cardPrize: data.cardPrize,
        safePrize: data.safePrize,
        fullPrize: data.fullPrize,
        highTemperatureSubsidy: data.highTemperatureSubsidy,
        overtimePay: data.overtimePay,
        otherPrize: data.otherPrize,
        wagesPayable: data.wagesPayable,
        attendance: data.attendance,
        attendanceReal: data.attendanceReal,
        leaveCount: data.leaveCount,
        lackCard: data.lackCard,
        restDay: data.restDay,
        violationOfSafety: data.violationOfSafety,
        dateTime: data.dateTime,
        netSalary: data.netSalary
      }
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadMonthlyWageStatistics(this.params).then(result => {
        downloadFile(result, 'MonthlyWageStatistics列表', 'xlsx')
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
