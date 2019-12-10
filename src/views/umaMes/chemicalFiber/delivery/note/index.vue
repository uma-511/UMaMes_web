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
          v-permission="['admin','chemicalFiberDeliveryNote:add']"
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
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="scanNumber" label="出库单号"/>
      <el-table-column prop="customerName" label="客户名称"/>
      <el-table-column prop="customerCode" label="客户编号"/>
      <el-table-column prop="customerAddress" label="客户地址"/>
      <el-table-column prop="contacts" label="联系人"/>
      <el-table-column prop="contactPhone" label="联系电话"/>
      <el-table-column prop="totalCost" label="总成本"/>
      <el-table-column prop="totalPrice" label="总价"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column prop="seller" label="业务员"/>
      <el-table-column prop="storeKeeper" label="仓管员"/>
      <el-table-column prop="createDate" label="制单日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" label="制单人"/>
      <el-table-column
        v-if="checkPermission(['admin','chemicalFiberDeliveryNote:edit','chemicalFiberDeliveryNote:del'])"
        label="操作"
        width="180px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['admin','chemicalFiberDeliveryNote:edit']"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          >编辑</el-button>
          <el-button
            v-permission="['admin','chemicalFiberDeliveryNote:edit']"
            size="mini"
            type="success"
            icon="el-icon-tickets"
            @click="detail(scope.row)"
          >详情</el-button>
          <!-- <el-popover
            v-permission="['admin','chemicalFiberDeliveryNote:del']"
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
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :modal="true"
      title="出货单详情"
      width="75%"
    >
      <el-row style="width: 100%">
        <el-container>
          <el-aside width="10%">收货单位</el-aside>
          <el-main style="height: 160px; width:30%">
            <el-main>公司：{{ unitInfoMsg.customerName }}</el-main>
            <el-main>地址：{{ unitInfoMsg.customerAddress }}</el-main>
          </el-main>
          <el-aside width="1px"/>
          <el-main style="height: 160px; width:30%">
            <el-main>联 系 人：{{ unitInfoMsg.contacts }}</el-main>
            <el-main>联系信息：{{ unitInfoMsg.contactPhone }}</el-main>
          </el-main>
          <el-aside width="1px"/>
          <el-main style="height: 160px; width:30%">
            <el-main>单 号：{{ unitInfoMsg.scanNumber }}</el-main>
          </el-main>
        </el-container>
      </el-row>
      <el-row>
        <el-table
          v-loading="detailLoading"
          :data="detailList"
          :summary-method="getSummaries"
          style="width: 100%"
          show-summary
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column prop="prodModel" label="型号" align="center"/>
          <el-table-column prop="prodName" label="品名" align="center"/>
          <el-table-column prop="totalWeight" label="重量" width="60%" align="center"/>
          <el-table-column prop="totalNumber" label="数量" width="60%" align="center"/>
          <el-table-column prop="totalBag" label="件数" width="60%" align="center"/>
          <el-table-column prop="unit" label="单位" width="125%" align="center">
            <template slot-scope="scope">
              <!-- <el-input v-model="scope.row.unit" placeholder="请输入单位"/> -->
              <el-select v-model="scope.row.unit" placeholder="请选择单位">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="cost" label="成本单价" width="200%" align="center">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.cost" :min="0" placeholder="请输入成本单价"/>
            </template>
          </el-table-column>
          <el-table-column prop="totalCost" label="总成本（元）" width="80%" align="center"/>
          <el-table-column prop="sellingPrice" label="销售单价" width="200%" align="center">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.sellingPrice" :min="0" placeholder="请输入销售单价"/>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="总金额（元）" width="80%" align="center"/>
          <el-table-column
            v-if="checkPermission(['admin','configClassify:edit','configClassify:del'])"
            label="操作"
            align="center"
            width="195%"
          >
            <template slot-scope="scope">
              <el-button
                v-permission="['admin','configClassify:edit']"
                size="mini"
                type="success"
                icon="el-icon-edit"
                @click="sutmitDetail(scope.row)"
              >更新</el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-download"
                @click="exportPoundExcel(scope.row)"
              >磅码单</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="downloadLoading" type="primary" @click="exportDelivery()">导出送货单</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadChemicalFiberDeliveryNote, downloadDeliveryNote, exportPoundExcel } from '@/api/chemicalFiberDeliveryNote'
import { edit, getChemicalFiberDeliveryDetailsList } from '@/api/chemicalFiberDeliveryDetail'
import { parseTime, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      dateQuery: '',
      delLoading: false,
      dialogVisible: false,
      detailLoading: false,
      sutmitDetailLoading: false,
      unitInfoMsg: {
        id: '',
        customerName: '',
        customerAddress: '',
        scanNumber: '',
        contactPhone: '',
        contacts: '',
        createDate: ''
      },
      queryTypeOptions: [
        { key: 'scanNumber', display_name: '出库单号' },
        { key: 'customerName', display_name: '客户名称' },
        { key: 'customerCode', display_name: '客户编号' },
        { key: 'customerAddress', display_name: '客户地址' },
        { key: 'contacts', display_name: '联系人' },
        { key: 'contactPhone', display_name: '联系电话' }
      ],
      detailList: [],
      options: [
        {
          value: '个',
          label: '个'
        }, {
          value: '公斤',
          label: '公斤'
        }
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
      this.url = 'api/chemicalFiberDeliveryNote'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      const dateQuery = this.dateQuery
      if (type && value) { this.params[type] = value }
      if (dateQuery) {
        this.params['tempStartTime'] = dateQuery[0].getTime()
        this.params['tempEndTime'] = dateQuery[1].getTime()
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
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        scanNumber: data.scanNumber,
        customerId: data.customerId,
        customerName: data.customerName,
        customerCode: data.customerCode,
        customerAddress: data.customerAddress,
        contacts: data.contacts,
        contactPhone: data.contactPhone,
        totalCost: data.totalCost,
        totalPrice: data.totalPrice,
        remark: data.remark,
        seller: data.seller,
        storeKeeper: data.storeKeeper,
        createDate: data.createDate,
        createUser: data.createUser
      }
      this.$refs.form.tempCustomerId = data.customerId
      this.$refs.form.tempCustomerName = data.customerName
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadChemicalFiberDeliveryNote(this.params).then(result => {
        downloadFile(result, 'ChemicalFiberDeliveryNote列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
        this.$notify.error({
          title: '请确保已选择单位',
          duration: 2500
        })
      })
    },
    detail(data) {
      this.unitInfoMsg = {
        id: data.id,
        customerName: data.customerName,
        customerAddress: data.customerAddress,
        scanNumber: data.scanNumber,
        contactPhone: data.contactPhone,
        contacts: data.contacts,
        createDate: data.createDate
      }
      this.detailLoading = true
      this.dialogVisible = true
      var params = { 'scanNumber': data.scanNumber }
      getChemicalFiberDeliveryDetailsList(params).then(res => {
        this.detailLoading = false
        this.detailList = res
      })
    },
    handleCurrentChange(val) {
      this.currentChangeItem = val
    },
    sutmitDetail(data) {
      this.detailLoading = true
      if (data.unit === '个') {
        if (data.cost) {
          data.totalCost = data.totalNumber * data.cost
        }
        if (data.sellingPrice) {
          data.totalPrice = data.totalNumber * data.sellingPrice
        }
      } else {
        var temp
        if (data.cost) {
          temp = data.totalWeight * data.cost
          data.totalCost = temp.toFixed(2)
        }
        if (data.sellingPrice) {
          temp = data.totalWeight * data.sellingPrice
          data.totalPrice = temp.toFixed(2)
        }
      }
      edit(data).then(res => {
        this.detailLoading = false
        this.$notify({
          title: '编辑详情成功',
          type: 'success',
          duration: 2500
        })
        this.init()
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
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
      })
      return sums
    },
    exportDelivery() {
      if (this.unitInfoMsg.customerName === null) {
        this.$notify({
          title: '请返回填写客户信息',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.downloadLoading = true
      downloadDeliveryNote(this.unitInfoMsg.id).then(result => {
        this.downloadLoading = false
        downloadFile(result, '生产单导出', 'xls')
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    exportPoundExcel(data) {
      if (this.unitInfoMsg.customerName === null) {
        this.$notify({
          title: '请返回填写客户信息',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.detailLoading = true
      var dto = {
        scanNumber: this.unitInfoMsg.scanNumber,
        prodId: data.prodId,
        prodName: data.prodName,
        customerName: this.unitInfoMsg.customerName,
        createDate: this.unitInfoMsg.createDate
      }
      exportPoundExcel(dto).then(result => {
        this.detailLoading = false
        downloadFile(result, '磅码单导出', 'xls')
      }).catch(() => {
        this.detailLoading = false
      })
    }
  }
}
</script>

<style>
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 160px;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: left;
  line-height: 10px;
}
.el-container {
  height: 160px;
}
</style>
