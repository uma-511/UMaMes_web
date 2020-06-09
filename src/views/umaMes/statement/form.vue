<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    width="1224px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
      label-position="top"
    >
      <el-form-item>
        <el-col :span="24">
          <el-col :span="2">客户名称</el-col>
          <el-col :span="6">
            <!-- <el-input v-model="form.customerName" style="width: 230px;"/> -->
            <el-select
              v-model="form.customerName"
              :loading="customerLoading"
              :remote-method="customerRemoteMethod"
              :disabled="!isAdd"
              value-key="id"
              multiple:false
              filterable
              remote
              reserve-keyword
              placeholder="请输入客户名称关键词"
              style="width: 230px;"
              @change="changeTelescopic"
            >
              <el-option
                v-for="item in customerOptions"
                :key="item.id"
                :label="item.name"
                :value="item"
              />
            </el-select>
          </el-col>
          <el-col :span="2">联 系 人</el-col>
          <el-col :span="6">
            <el-input v-model="form.contacts" style="width: 230px;" disabled/>
          </el-col>
          <el-col :span="2">联系电话</el-col>
          <el-col :span="6">
            <el-input v-model="form.contactPhone" style="width: 230px;" disabled/>
          </el-col>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="24">
          <el-col :span="2">应收金额</el-col>
          <el-col :span="6">
            <el-input v-model="form.receivable" style="width: 230px;" disabled/>
          </el-col>
          <el-col :span="2">上期欠款</el-col>
          <el-col :span="6">
            <el-input v-model="form.accumulatedArrears" style="width: 230px;" @change="accumulatedArrearsChange"/>
          </el-col>
          <el-col :span="2">总欠金额</el-col>
          <el-col :span="6">
            <el-input v-model="form.totalArrears" style="width: 230px;" disabled/>
          </el-col>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="24">
          <el-col :span="2">搜索</el-col>
          <el-col :span="10">
            <el-date-picker
              v-model="queryDate"
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
              @click="queryDateFun"
            >搜索</el-button>
          </el-col>
          <el-col :span="2">对账单号</el-col>
          <el-col :span="4">
            {{ form.accountCode }}
          </el-col>
          <el-col :span="2">账单周期</el-col>
          <el-col :span="4">
            {{ parseTimeToDate(cycleDate[0]) }} -- {{ parseTimeToDate(cycleDate[1]) }}
          </el-col>
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="对账单号">
        <el-input v-model="form.accountCode" style="width: 370px;"/>
      </el-form-item>-->
      <!-- <el-form-item label="创建日期" >
        <el-date-picker v-model="form.createDate" type="datetime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="创建人" >
        <el-input v-model="form.createUser" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="客户ID">
        <el-input v-model="form.customerId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input v-model="form.customerName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="客户联系人">
        <el-input v-model="form.contacts" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="客户联系电话">
        <el-input v-model="form.contactPhone" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="应收金额">
        <el-input v-model="form.receivable" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="上期欠款">
        <el-input v-model="form.accumulatedArrears" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="总欠金额">
        <el-input v-model="form.totalArrears" style="width: 370px;"/>
      </el-form-item>-->
      <el-form-item>
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          :summary-method="getSummaries"
          show-summary
          style="width: 100%"
        >
          <el-table-column prop="scanNumber" label="送货单号"/>
          <el-table-column prop="scanDate" label="日期">
            <template slot-scope="scope">
              <span>{{ parseTimeToDate(scope.row.scanDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prodName" label="产品名称"/>
          <el-table-column prop="totalBag" label="包数"/>
          <el-table-column prop="netWeight" label="重量（KG）"/>
          <el-table-column prop="sellingPrice" label="单价"/>
          <el-table-column prop="totalPrice" label="金额"/>
          <el-table-column prop="advanceCharge" label="预付款">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.advanceCharge"
                placeholder="请输入预付款"
                @change="editDetalis(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="amountDeducted" label="扣除">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.amountDeducted"
                placeholder="请输入扣除"
                @change="editDetalis(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.remark"
                placeholder="请输入备注"
                @change="editDetalis(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-pagination
          :current-page="initCurrentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="size"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChange"
          @current-change="pageChange"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      <el-button :loading="exportStatementLoading" type="success" @click="exportStatement">导出对账单</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, getStatementDetailsList, getStatementDetailsAllList, getSums, exportStatementFun } from '@/api/umaChemicalFiberStatement'
import { statementDetailsEdit } from '@/api/umaChemicalFiberStatementDetails'
import { getCustomerList } from '@/api/customer'
import { parseTimeToDate, downloadFile } from '@/utils/index'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      customerLoading: false,
      tableLoading: false,
      queryDate: '',
      customerOptions: [],
      customerQuery: {
        name: ''
      },
      tempData: {},
      tempCustomerObj: '',
      initCurrentPage: 1,
      total: 0,
      page: 0,
      size: 10,
      form: {
        id: '',
        accountCode: '',
        createDate: '',
        createUser: '',
        customerId: '',
        customerName: '',
        contacts: '',
        contactPhone: '',
        receivable: '',
        accumulatedArrears: '',
        totalArrears: ''
      },
      tableData: [],
      rules: {
      },
      sums: [],
      exportStatementLoading: false,
      cycleDate: []
    }
  },
  methods: {
    parseTimeToDate,
    downloadFile,
    cancel() {
      this.tableData = []
      this.customerOptions = []
      this.resetForm()
      this.sums = []
    },
    doSubmit() {
      // this.tableData = []
      // this.customerOptions = []
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      add(
        {
          'createStatementDetailsDto': this.tempData,
          'umaChemicalFiberStatement': this.form
        }
      ).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        // this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        accountCode: '',
        createDate: '',
        createUser: '',
        customerId: '',
        customerName: '',
        contacts: '',
        contactPhone: '',
        receivable: '',
        accumulatedArrears: '',
        totalArrears: ''
      }
    },
    customerRemoteMethod(query) {
      var _this = this
      if (query !== '') {
        _this.customerLoading = true
        _this.customerQuery.name = query
        getCustomerList(_this.customerQuery).then(res => {
          _this.customerLoading = false
          _this.customerList = res
          _this.customerOptions = _this.customerList.filter(item => {
            return item.name.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        })
      } else {
        _this.customerOptions = []
      }
    },
    queryDateFun() {
      if (this.form.customerId === '') {
        this.$notify({
          message: '请选择客户后再查询',
          type: 'warning'
        })
        return
      }
      if (this.queryDate === '') {
        this.$notify({
          message: '请选择时间段',
          type: 'warning'
        })
        return
      }
      this.tableLoading = true
      if (this.isAdd) {
        this.tempData = {
          customerId: this.form.customerId,
          tempStartTime: this.queryDate[0].getTime(),
          tempEndTime: this.queryDate[1].getTime(),
          pageNumber: this.page,
          pageSize: this.size
        }
        getStatementDetailsList(this.tempData).then(res => {
          this.tableData = res.content
          this.total = res.totalElements
          this.tableLoading = false
        })
      } else {
        this.tempData = {
          statementId: this.form.id,
          tempStartTime: this.queryDate ? this.queryDate[0].getTime() : null,
          tempEndTime: this.queryDate ? this.queryDate[1].getTime() : null,
          pageNumber: this.page,
          pageSize: this.size
        }
        getStatementDetailsAllList(this.tempData).then((res) => {
          this.tableData = res.content
          this.total = res.totalElements
          this.tableLoading = false
        })
      }
    },
    sizeChange(size) {
      this.size = size
      if (this.isAdd) {
        this.queryDateFun()
      } else {
        var parameter = {
          'statementId': this.form.id,
          'pageNumber': this.page,
          'pageSize': this.size
        }
        getStatementDetailsAllList(parameter).then((res) => {
          this.tableData = res.content
          this.total = res.totalElements
        })
      }
    },
    pageChange(page) {
      this.page = page - 1
      if (this.isAdd) {
        this.queryDateFun()
      } else {
        var parameter = {
          'statementId': this.form.id,
          'pageNumber': this.page,
          'pageSize': this.size
        }
        getStatementDetailsAllList(parameter).then((res) => {
          this.tableData = res.content
          this.total = res.totalElements
        })
      }
    },
    changeTelescopic(data) {
      var _this = this
      _this.form.customerId = data.id
      _this.form.customerName = data.name
      _this.form.contacts = data.contacts
      _this.form.contactPhone = data.contactPhone
    },
    initEdit(data) {
      var parameter = {
        'statementId': data.id,
        'pageNumber': this.page,
        'pageSize': this.size
      }
      getStatementDetailsAllList(parameter).then((res) => {
        this.tableData = res.content
        this.total = res.totalElements
      })
    },
    editDetalis(data) {
      var numReg = /^[0-9,.]*$/
      var numRe = new RegExp(numReg)
      if (!numRe.test(data.amountDeducted) || data.amountDeducted == null || data.amountDeducted < 0 || data.amountDeducted === '') {
        this.$notify({
          title: '请输入数字',
          type: 'warning',
          duration: 2500
        })
        data.amountDeducted = 0
      }
      if (!numRe.test(data.advanceCharge) || data.advanceCharge == null || data.advanceCharge < 0 || data.advanceCharge === '') {
        this.$notify({
          title: '请输入数字',
          type: 'warning',
          duration: 2500
        })
        data.advanceCharge = 0
      }
      statementDetailsEdit(data).then(res => {
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.initGetSums({ 'statementId': data.statementId })
        this.initReceivable()
      })
    },
    getSummaries() {
      return this.sums
    },
    initGetSums(data) {
      var parameter = {
        'statementId': data.id
      }
      getSums(parameter).then((res) => {
        this.sums = res.data.sums
        this.cycleDate = res.data.cycleDate
        this.initReceivable()
      })
    },
    initReceivable() {
      this.form.receivable = this.sums[6] - this.sums[7] - this.sums[8]
      this.form.totalArrears = this.form.receivable * 1 + this.form.accumulatedArrears * 1
    },
    accumulatedArrearsChange(data) {
      this.form.accumulatedArrears = data
      this.initReceivable()
    },
    exportStatement() {
      this.exportStatementLoading = true
      exportStatementFun(this.form.id).then(result => {
        this.exportStatementLoading = false
        downloadFile(result, '对账单导出', 'xls')
      }).catch(() => {
        this.exportStatementLoading = false
      })
    }
  }
}
</script>

<style scoped>
</style>
