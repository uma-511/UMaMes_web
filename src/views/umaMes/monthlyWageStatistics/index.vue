<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-longpress="showInvoice" v-model="queryValue" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="queryType" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-date-picker
        v-model="dateQuery"
        size="mini"
        class="el-range-editor--small filter-item"
        type="month"
        placeholder="选择月份"
      />
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
      <!-- 一键删除上月工资单 -->
      <div style="display: inline-block;">
        <el-popover
          v-permission="['admin','monthlyWageStatistics:del']"
          :ref="'ref'+refOneKey"
          placement="top"
          width="180">
          <p>确定删除吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="$refs['ref'+refOneKey].doClose()">取消</el-button>
            <el-button :loading="delLoading" type="primary" size="mini" @click="oneKeyDelete">确定</el-button>
          </div>
          <el-button
            slot="reference"
            :style="{ display: hideInvalidButton }"
            size="mini"
            class="filter-item"
            type="danger"
            icon="el-icon-download">一键删除</el-button>
        </el-popover>
      </div>
      <div style="display: inline-block;">
        <el-popover
          v-permission="['admin','monthlyWageStatistics:del']"
          :ref="refReSet"
          placement="top"
          width="180">
          <p>确定重置吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="$refs[refReSet].doClose()">取消</el-button>
            <el-button :loading="delLoading" type="primary" size="mini" @click="oneKeyReset">确定</el-button>
          </div>
          <el-button
            slot="reference"
            :style="{ display: hideInvalidButton }"
            size="mini"
            class="filter-item"
            type="danger"
            icon="el-icon-download">一键重置</el-button>
        </el-popover>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :max-height="tableHeight" :summary-method="getDataSummaries" :data="data" show-summary size="small" style="width: 100%;" @row-click="edit">
      <el-table-column prop="dateTime" label="日期">
        <template slot-scope="scope">
          <span>{{ parseTimeToDates(scope.row.dateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="personName" label="姓名"/>
      <el-table-column prop="dept" label="部门"/>
      <el-table-column prop="job" label="岗位"/>
      <el-table-column width="100px" prop="basicSalary" label="基本工资"/>
      <el-table-column width="100px" prop="performance" label="绩效"/>
      <el-table-column width="100px" prop="cardPrize" label="打卡奖"/>
      <el-table-column width="100px" prop="safePrize" label="安全奖"/>
      <el-table-column width="100px" prop="fullPrize" label="全勤奖"/>
      <el-table-column width="100px" prop="highTemperatureSubsidy" label="高温津贴"/>
      <el-table-column width="100px" prop="overtimePay" label="加班费"/>
      <el-table-column width="100px" prop="otherPrize" label="其他"/>
      <el-table-column width="100px" prop="wagesPayable" label="应发工资"/>
      <el-table-column prop="attendance" label="出勤天数"/>
      <el-table-column prop="attendanceReal" label="实际出勤"/>
      <el-table-column width="100px" prop="leaveCount" label="请假"/>
      <el-table-column width="100px" prop="lackCard" label="缺卡"/>
      <el-table-column width="100px" prop="violationOfSafety" label="违反安全"/>
      <el-table-column width="100px" prop="netSalary" label="实发工资"/>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <!--待确认-->
          <div v-if="scope.row.status == 0">
            <el-tag
              size="medium"
            >{{ statusValue[0] }}</el-tag>
          </div>
          <!--已完成-->
          <div v-if="scope.row.status == 1">
            <el-tag
              type="success"
              size="medium"
            >{{ statusValue[1] }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','monthlyWageStatistics:edit','monthlyWageStatistics:del'])" label="操作" width="80px" align="center">
        <template slot-scope="scope">
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
            <el-button slot="reference" :style="{ display: hideInvalidButton }" type="danger" icon="el-icon-delete" size="mini" @click.stop/>
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
import { del, downloadMonthlyWageStatistics, generateWage, oneKeyDelete, oneKeyReset } from '@/api/monthlyWageStatistics'
import { parseTimeToDates, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      tableHeight: window.innerHeight - 240,
      delLoading: false,
      hideInvalidButton: 'none',
      refOneKey: '',
      refReSet: '',
      dateQuery: new Date(),
      statusValue: {
        0: '待确认',
        1: '已完成'
      },
      queryTypeOptions: [
        { key: 'personName', display_name: '姓名' },
        { key: 'dept', display_name: '部门' },
        { key: 'job', display_name: '岗位' }
      ],
      queryType: 'personName',
      queryValue: ''
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
      const dateQuery = this.dateQuery
      if (this.queryType && this.queryValue) { this.params[this.queryType ] = this.queryValue }
      if (dateQuery) {
        this.params['monthTime'] = dateQuery.getTime()
      }
      return true
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
        if (index === 18) {
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
        if (index === 17) {
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
        if (index === 16) {
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
        if (index === 15) {
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
        if (index === 12) {
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
        if (index === 11) {
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
        if (index === 10) {
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
        if (index === 9) {
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
        if (index === 4) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, null).toFixed(2)
          sums[index] += ' 元'
        }
      })
      return sums
    },
    generateWage() {
      generateWage().then(
        res => {
          this.init()
        }
      )
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
    oneKeyDelete() {
      this.$refs['ref' + this.refOneKey].doClose()
      oneKeyDelete().then(res => {
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        }).catch(err => {
          console.log(err.response.data.message)
        })
      })
    },
    oneKeyReset() {
      this.$refs[this.refReSet].doClose()
      oneKeyReset().then(res => {
        this.init()
        this.$notify({
          title: '重置成功',
          type: 'success',
          duration: 2500
        }).catch(err => {
          console.log(err.response.data.message)
        })
      })
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
    showInvoice(event) {
      if (this.hideInvalidButton == 'none') {
        this.hideInvalidButton = ''
      } else {
        this.hideInvalidButton = 'none'
      }
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadMonthlyWageStatistics(this.params).then(result => {
        downloadFile(result, '工资列表', 'xls')
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
