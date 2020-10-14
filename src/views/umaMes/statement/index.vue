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
        size="mini"
        class="el-range-editor--small filter-item"
        type="month"
        placeholder="选择月份"
      />
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery"
      >搜索</el-button>
      <!--<el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="TableStatement"
      >导出对账单</el-button>-->
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <!--<el-button
          v-permission="['admin', 'umaChemicalFiberStatement:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >新增</el-button>-->
      </div>
      <!-- 导出 -->
      <!-- <div style="display: inline-block;">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download"
        >导出</el-button>
      </div>-->
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <addForm ref="addForm" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <!-- <el-table-column prop="id" label="主键"/> -->
      <el-table-column prop="accountCode" label="对账单号"/>
      <el-table-column prop="reconciliations" label="对账日">
      </el-table-column>
      <el-table-column prop="createDate" label="送货日期">
        <template slot-scope="scope">
          <span>{{ parseTimeToDate(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="customerId" label="客户ID"/> -->
      <el-table-column prop="customerName" label="客户名称"/>
      <!-- <el-table-column prop="contacts" label="客户联系人"/>
      <el-table-column prop="contactPhone" label="客户联系电话"/>-->
      <el-table-column prop="receivable" label="本月欠款">
        <template slot-scope="scope">
          <span>{{ scope.row.receivable }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="accumulatedArrears" label="上期欠款">
        <template slot-scope="scope">
          <span>{{ scope.row.accumulatedArrears }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalArrears" label="本期欠款">
        <template slot-scope="scope">
          <span>{{ scope.row.totalArrears }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="account" label="支配金额">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remainder" label="损数">
        <template slot-scope="scope">
          <span>{{ scope.row.remainder }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="printDate" label="打印时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.printDate) }}</span>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          />
          <!--<el-popover
            v-permission="['admin', 'umaChemicalFiberStatement:del']"
            :ref="scope.row.id"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="subDelete(scope.row.id)"
              >确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>-->
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
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadUmaChemicalFiberStatement } from '@/api/umaChemicalFiberStatement'
import { parseTimeToDate, downloadFile, parseTime } from '@/utils/index'
import eForm from './form'
import addForm from './addForm'
export default {
  components: { eForm, addForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,dateQuery: '',
      queryTypeOptions: [
        { key: 'accountCode', display_name: '对账单号' },
        { key: 'customerName', display_name: '客户名称' }
        // { key: 'contacts', display_name: '客户联系人' },
        // { key: 'contactPhone', display_name: '客户联系电话' }
      ],
      query:{
        type: 'customerName'
      }
    }
  },
  filters: {
    rounding (value) {
      return value.toFixed(2)
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.dateQuery = new Date();
  },
  methods: {
    parseTimeToDate,
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/umaChemicalFiberStatement'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const dateQuery = this.dateQuery
      const type = query.type
      const value = query.value
      /*const date = new Date()*/
     /* const createDate = date.getTime();*/
      /*this.params['createDate'] = createDate*/
      if (type && value) { this.params[type] = value }
      if (dateQuery) {
        this.params['createDate'] = dateQuery.getTime()
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
      this.$refs.addForm.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        accountCode: data.accountCode,
        createDate: data.createDate,
        createUser: data.createUser,
        customerId: data.customerId,
        customerName: data.customerName,
        contacts: data.contacts,
        contactPhone: data.contactPhone,
        receivable: data.receivable,
        accumulatedArrears: data.accumulatedArrears,
        totalArrears: data.totalArrears,
        unit: data.unit,
        time: this.dateQuery
      }
      _this.dialog = true
      _this.initEdit(_this.form)
      _this.initGetSums(_this.form)
    },
    TableStatement() {

    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadUmaChemicalFiberStatement(this.params).then(result => {
        downloadFile(result, 'UmaChemicalFiberStatement列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })

    }
    /*parses(data){
      data.accumulatedArrears = data.totalArrears - data.receivable
      return data.accumulatedArrears
    }*/
  }
}
</script>

<style scoped></style>
