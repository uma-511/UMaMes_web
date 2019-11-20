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
          v-permission="['admin','chemicalFiberProduction:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
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
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="number" label="订单编号"/>
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
          <span>{{ parseTime(scope.row.deliveryDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="machineNumber" label="机器编号"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column prop="status" label="状态"/>
      <el-table-column prop="createTime" label="制单时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" label="制单人"/>
      <el-table-column v-if="checkPermission(['admin','chemicalFiberProduction:edit','chemicalFiberProduction:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','chemicalFiberProduction:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','chemicalFiberProduction:del']"
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
import { del, downloadChemicalFiberProduction } from '@/api/chemicalFiberProduction'
import { parseTime, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
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
    }
  }
}
</script>

<style scoped>

</style>
