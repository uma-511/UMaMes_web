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
      <el-checkbox
        v-model="showUnEnable"
        label="查询失效单"
        style="margin-top: 1px"
        @change="toQuery"
      />
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery"
      >搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','receipt:add']"
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
      <el-table-column prop="receiptNumber" label="流水号"/>
      <el-table-column prop="customerName" label="客户名称"/>
      <el-table-column prop="type" label="收入类型"/>
      <el-table-column prop="recivedAccount" label="收款方式"/>
      <el-table-column prop="recivedDate" label="单据日期">
        <template slot-scope="scope">
          <span>{{ parseTimeToDate(scope.row.recivedDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="projectType" label="项目类型"/>
      <el-table-column prop="operator" label="经办人"/>
      <el-table-column prop="amountOfMoney" label="金额"/>
      <el-table-column prop="recivedNumber" label="单据编号"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column prop="createUser" label="制单人"/>
      <el-table-column prop="createDate" label="制单日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="noteStatus" label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.enable == false">
            <el-tag
              type="info"
              size="medium"
            >{{ statusValue[0] }}</el-tag>
          </div>
          <div v-else>
            <div v-if="scope.row.status == 1">
              <el-tag
                size="medium"
              >{{ statusValue[1] }}</el-tag>
            </div>
            <div v-if="scope.row.status == 2">
              <el-tag
                size="medium"
                type="success"
              >{{ statusValue[2] }}</el-tag>
            </div>
            <div v-if="scope.row.status == 0">
              <el-tag
                size="medium"
                type="info"
              >{{ statusValue[0] }}</el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column prop="status" label="状态"/>-->
      <el-table-column v-if="checkPermission(['admin','receipt:edit','receipt:del'])" label="操作" width="230px" align="center">
        <template slot-scope="scope">
         <!-- <el-button v-permission="['admin','receipt:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            :ref="scope.row.status"
            placement="top"
          >
            <p>是否确认录入1</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.status].doClose()">取消</el-button>
              <el-button
                :loading="sutmitDetailLoading"
                type="primary"
                size="mini"
                @click="doFinish(scope.row.id)"
              >确定</el-button>
            </div>
            <el-button v-if="scope.row.status == 1" slot="reference" type="success" icon="el-icon-circle-check" size="mini">确认录入</el-button>
          </el-popover>-->
          <el-popover
            v-permission="['admin','receipt:del']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定将本条数据永久删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button v-if="scope.row.enable == true" slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
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
import { del, downloadReceipt, doFinish } from '@/api/receipt'
import { parseTime, parseTimeToDate, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  dicts: ['recived_type'],
  data() {
    return {
      dateQuery: '',
      delLoading: false,
      finishLoading: false,
      showUnEnable: false,
      finishRef: '',
      sutmitDetailLoading: false,
      statusValue: {
        0: '已失效',
        1: '待确认',
        2: '已确认'
      },
      queryTypeOptions: [
        { key: 'receiptNumber', display_name: '流水单号' },
        { key: 'customerName', display_name: '客户名称' },
        { key: 'customerCode', display_name: '客户编号' },
        { key: 'recivedAccount', display_name: '收款方式' }
      ]
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
      this.url = 'api/receipt'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      const dateQuery = this.dateQuery
      const checkEnables = this.showUnEnable
      if (type && value) { this.params[type] = value }
      this.params['showUnEnable'] = checkEnables
      if (dateQuery) {
        this.params['tempStartTime'] = dateQuery[0].getTime()
        this.params['tempEndTime'] = dateQuery[1].getTime()
      }
      return true
    },
    doFinish(id) {
      this.finishLoading = true
      doFinish(id).then(res => {
        this.finishLoading = false
        this.$refs[this.finishRef].doClose()
        this.init()
        this.$notify({
          title: '成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.finishLoading = false
        this.$refs[this.finishRef].doClose()
        console.log(err.response.data.message)
      })
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
        receiptNumber: data.receiptNumber,
        customerName: data.customerName,
        type: data.type,
        recivedAccount: data.recivedAccount,
        recivedDate: data.recivedDate,
        projectType: data.projectType,
        operator: data.operator,
        amountOfMoney: data.amountOfMoney,
        recivedNumber: data.recivedNumber,
        remark: data.remark,
        createUser: data.createUser,
        createDate: data.createDate,
        status: data.status,
        customerId: data.customerId
      }
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadReceipt(this.params).then(result => {
        downloadFile(result, 'Receipt列表', 'xlsx')
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
