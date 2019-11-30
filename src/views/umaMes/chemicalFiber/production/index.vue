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
          v-permission="['admin','chemicalFiberProduction:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >新增</el-button>
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
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column fixed prop="number" label="订单编号"/>
      <el-table-column prop="prodModel" label="产品型号"/>
      <el-table-column prop="prodName" label="产品名称"/>
      <el-table-column prop="prodColor" label="产品颜色"/>
      <el-table-column prop="prodFineness" label="产品纤度"/>
      <el-table-column prop="customerName" label="客户名称"/>
      <el-table-column prop="customerContactPhone" label="联系电话"/>
      <el-table-column prop="customerContacts" label="联系人"/>
      <el-table-column prop="customerAddress" label="客户地址"/>
      <el-table-column prop="customerCode" label="客户编号"/>
      <el-table-column prop="coreWeight" label="纸芯重量"/>
      <el-table-column prop="perBagNumber" label="每袋个数"/>
      <el-table-column prop="planNumber" label="计划生产数量"/>
      <el-table-column prop="quantityCompeted" label="完成数量"/>
      <el-table-column prop="productionSchedule" label="生产进度(%)"/>
      <el-table-column prop="deliveryDate" label="交货日期">
        <template slot-scope="scope">
          <span>{{ parseTimeToDate(scope.row.deliveryDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="machineNumber" label="机器编号"/>
      <el-table-column prop="remark" label="备注"/>
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
      <el-table-column prop="createTime" label="制单时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" label="制单人"/>
      <el-table-column
        v-if="checkPermission(['admin','chemicalFiberProduction:edit','chemicalFiberProduction:del'])"
        fixed="right"
        label="操作"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary">更多菜单
              <i class="el-icon-arrow-down el-icon--right"/>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  v-permission="['admin','chemicalFiberProduction:edit']"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="edit(scope.row)"
                >编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="optionMapping[scope.row.status].indexOf(0)>=0">
                <el-button
                  v-permission="['admin','chemicalFiberProduction:edit']"
                  size="mini"
                  type="warning"
                  icon="el-icon-setting"
                  @click="setMachine(scope.row)"
                >设置机台</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="optionMapping[scope.row.status].indexOf(1)>=0">
                <el-button
                  v-permission="['admin','chemicalFiberProduction:edit']"
                  size="mini"
                  type="info"
                  icon="el-icon-setting"
                  @click="cancel(scope.row)"
                >作废</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="optionMapping[scope.row.status].indexOf(2)>=0">
                <el-button
                  v-permission="['admin','chemicalFiberProduction:edit']"
                  size="mini"
                  type="info"
                  icon="el-icon-setting"
                  @click="suspend(scope.row)"
                >暂停</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="optionMapping[scope.row.status].indexOf(3)>=0">
                <el-button
                  v-permission="['admin','chemicalFiberProduction:edit']"
                  size="mini"
                  type="info"
                  icon="el-icon-setting"
                  @click="prodContinue(scope.row)"
                >继续</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="optionMapping[scope.row.status].indexOf(4)>=0">
                <el-button
                  v-permission="['admin','chemicalFiberProduction:edit']"
                  size="mini"
                  type="success"
                  icon="el-icon-setting"
                  @click="complete(scope.row)"
                >完成</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-permission="['admin','chemicalFiberProduction:edit']"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="showDeleteDialog(scope.row)"
                >删除</el-button>
              </el-dropdown-item>
              <!-- <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDeleteDialog(scope.row)">删除</el-button> -->
            </el-dropdown-menu>
          </el-dropdown>
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

    <!-- 设置机台 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :modal="true"
      title="选择机台"
      width="30%"
    >
      <el-table
        v-loading="tableDataLoading"
        ref="table"
        :data="tableData"
        :highlight-current-row="highlight"
        :row-class-name="tableRowClassName"
        style="width: 100%"
        max-height="300"
        @current-change="handleCurrentChange"
      >
        <el-table-column prop="number" label="机台号"/>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag
                :type="machinesMapping[scope.row.status]"
                size="medium"
              >{{ machinesValue[scope.row.status] }}</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="setMachinesLoading" type="primary" @click="setMachinesSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除确认 -->
    <el-dialog
      :visible.sync="deleteDialogVisible"
      :append-to-body="true"
      :modal="true"
      title="删除确认"
      width="20%"
    >
      <span>确定删除本条数据吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button
          :loading="delLoading"
          type="danger"
          @click="subDelete()"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadChemicalFiberProduction, setMachines, setProductionStatus } from '@/api/chemicalFiberProduction'
import { getMachinesAllList } from '@/api/machine'
import { parseTime, downloadFile, parseTimeToDate } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      tableDataLoading: false,
      dialogVisible: false,
      setMachinesLoading: false,
      deleteDialogVisible: false,
      queryTypeOptions: [
        { key: 'number', display_name: '订单编号' },
        { key: 'prodModel', display_name: '产品型号' },
        { key: 'prodName', display_name: '产品名称' },
        { key: 'prodColor', display_name: '产品颜色' },
        { key: 'prodFineness', display_name: '产品纤度' },
        { key: 'customerName', display_name: '客户名称' },
        { key: 'customerContactPhone', display_name: '联系电话' },
        { key: 'customerContacts', display_name: '联系人' },
        { key: 'customerAddress', display_name: '客户地址' },
        { key: 'customerCode', display_name: '客户编号' }
      ],
      typeMapping: {
        0: '',
        1: 'danger',
        2: 'warning',
        3: 'info',
        4: 'success'
      },
      typeValue: {
        0: '待产',
        1: '生产中',
        2: '暂停',
        3: '作废',
        4: '完成'
      },
      machinesMapping: {
        0: 'success',
        1: 'danger',
        2: 'warning',
        3: 'info'
      },
      machinesValue: {
        0: '空闲',
        1: '生产中',
        2: '暂停',
        3: '取消'
      },
      optionMapping: {
        // '待产'
        0: [0, 1],
        // '生产中'
        1: [2, 4],
        // '暂停'
        2: [0, 1, 4],
        // '作废'
        3: [],
        // '完成'
        4: []
      },
      tableData: [],
      highlight: false,
      setMachinesForm: {
        machinesId: '',
        productionId: ''
      },
      deleteId: ''
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
      this.url = 'api/chemicalFiberProduction'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      return true
    },
    subDelete() {
      var id = this.deleteId
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.deleteDialogVisible = false
        // this.$refs[id].doClose()
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
        number: data.number,
        prodId: data.prodId,
        prodModel: data.prodModel,
        prodName: data.prodName,
        prodColor: data.prodColor,
        prodFineness: data.prodFineness,
        customerId: data.customerId,
        customerName: data.customerName,
        customerContactPhone: data.customerContactPhone,
        customerContacts: data.customerContacts,
        customerAddress: data.customerAddress,
        customerCode: data.customerCode,
        coreWeight: data.coreWeight,
        perBagNumber: data.perBagNumber,
        planNumber: data.planNumber,
        quantityCompeted: data.quantityCompeted,
        productionSchedule: data.productionSchedule,
        deliveryDate: data.deliveryDate,
        machineNumber: data.machineNumber,
        remark: data.remark,
        status: data.status,
        createTime: data.createTime,
        createUser: data.createUser
      }
      this.$refs.form.tempProdId = data.prodId
      this.$refs.form.tempProdModel = data.prodModel
      this.$refs.form.tempCustomerId = data.customerId
      this.$refs.form.tempCustomerName = data.customerName
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadChemicalFiberProduction(this.params).then(result => {
        downloadFile(result, 'ChemicalFiberProduction列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    setMachine(data) {
      if (parseInt(data.status) !== 0 && parseInt(data.status) !== 2) {
        this.$notify({
          title: '生产中~~',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.dialogVisible = true
      this.tableDataLoading = true
      this.setMachinesForm.productionId = data.id
      this.setMachinesForm.machinesId = ''
      var _this = this
      getMachinesAllList().then(res => {
        _this.tableDataLoading = false
        _this.tableData = res
      })
    },
    handleCurrentChange(val) {
      if (val != null) {
        if (val.status !== 0 && val.status !== 2) {
          this.highlight = false
          this.setMachinesForm.machinesId = ''
        } else {
          this.highlight = true
          this.setMachinesForm.machinesId = val.id
        }
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (parseInt(row.status) === 0 || parseInt(row.status) === 2) {
        return 'success-row'
      } else {
        return 'warning-row'
      }
    },
    setMachinesSubmit() {
      if (this.setMachinesForm.machinesId === '') {
        this.$notify({
          title: '请选择机台',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.setMachinesLoading = true
      setMachines(this.setMachinesForm).then(res => {
        this.setMachinesLoading = false
        this.dialogVisible = false
        this.init()
      })
    },
    showDeleteDialog(data) {
      this.deleteDialogVisible = true
      this.deleteId = data.id
    },
    // 暂停
    suspend(data) {
      this.loading = true
      var dataForm = {
        productionId: data.id,
        status: 0
      }
      setProductionStatus(dataForm).then(res => {
        this.$notify({
          title: '生产暂停',
          type: 'success',
          duration: 2500
        })
        this.init()
      })
    },
    // 继续
    prodContinue(data) {
      this.loading = true
      var dataForm = {
        productionId: data.id,
        status: 1
      }
      setProductionStatus(dataForm).then(res => {
        this.$notify({
          title: '生产继续',
          type: 'success',
          duration: 2500
        })
        this.init()
      })
    },
    // 完成
    complete(data) {
      this.loading = true
      var dataForm = {
        productionId: data.id,
        status: 2
      }
      setProductionStatus(dataForm).then(res => {
        this.$notify({
          title: '生产完成',
          type: 'success',
          duration: 2500
        })
        this.init()
      })
    },
    // 取消
    cancel(data) {
      this.loading = true
      var dataForm = {
        productionId: data.id,
        status: 3
      }
      setProductionStatus(dataForm).then(res => {
        this.$notify({
          title: '生产取消',
          type: 'success',
          duration: 2500
        })
        this.init()
      })
    }
  }
}
</script>

<style>
.el-table .warning-row {
  background: #c5c8ce;
}

.el-table .success-row {
  background: #ffffff;
}
</style>
