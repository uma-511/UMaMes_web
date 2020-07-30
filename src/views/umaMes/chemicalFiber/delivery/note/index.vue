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
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','chemicalFiberDeliveryNote:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
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
    <el-table v-loading="loading" :data="data" size="small" stripe style="width: 100%;" @row-click="rowClicker">
      <el-table-column prop="scanNumber" label="出库单号"/>
      <el-table-column prop="customerName" label="客户名称"/>
      <el-table-column prop="customerCode" label="客户编号"/>
      <el-table-column prop="customerAddress" label="客户地址"/>
      <el-table-column prop="contacts" label="联系人"/>
      <el-table-column prop="contactPhone" label="联系电话"/>
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
      <el-table-column prop="noteStatus" label="状态">
        <template slot-scope="scope">
          <!--待打印-->
          <div v-if="scope.row.noteStatus == 1">
            <el-tag
              size="medium"
            >{{ statusValue[1] }}</el-tag>
          </div>
          <!--待出库-->
          <div v-if="scope.row.noteStatus == 2">
            <el-tag
              size="medium"
            >{{ statusValue[2] }}</el-tag>
          </div>
          <!--待签收-->
          <div v-if="scope.row.noteStatus == 3">
            <el-tag
              type="warning"
              size="medium"
            >{{ statusValue[3] }}</el-tag>
          </div>
          <!--待结款-->
          <div v-if="scope.row.noteStatus == 4">
            <el-tag
              type="danger"
              size="medium"
            >{{ statusValue[4] }}</el-tag>
          </div>
          <!--完结-->
          <div v-if="scope.row.noteStatus == 5">
            <el-tag
              type="success"
              size="medium"
            >{{ statusValue[5] }}</el-tag>
          </div>
          <!--销毁状态-->
          <div v-if="scope.row.noteStatus <= 0 || scope.row.noteStatus >5 ">
            <el-tag
              type="info"
              size="medium"
            >{{ statusValue[0] }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission(['admin','chemicalFiberDeliveryNote:edit','chemicalFiberDeliveryNote:del'])"
        label="操作"
        width="240px"
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
            @click.stop
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
      width="80%"
    >
      <el-row style="width: 100%">
        <el-form ref="form1" :model="form" :rules="rules" size="mini" label-width="80px" >
          <el-form :inline="true" size="mini">
            <el-form-item label="客户编号">
              <el-input v-model="form.customerCode" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="仓管员">
              <el-select
                v-model="form.storeKeeper"
                :loading="userLoading"
                :remote-method="storeKeeperRemoteMethod"
                multiple:false
                filterable
                remote
                reserve-keyword
                placeholder="请输入仓管员名称关键词"
                style="width: 200px;"
                @focus="cleanUpOptions"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.username"
                  :label="item.username"
                  :value="item.username"
                  @blur="userOptions"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <el-form :inline="true" size="mini">
            <el-form-item label="客户名称">
              <el-select
                v-model="form.customerName"
                :loading="customerLoading"
                :remote-method="customerRemoteMethod"
                multiple:false
                filterable
                remote
                reserve-keyword
                placeholder="请输入客户名称关键词"
                style="width: 200px;"
                @change="setCustomerId($event)"
              >
                <el-option
                  v-for="item in customerOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="车牌号" >
              <el-input v-model="form.carNumber" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="业务员" >
              <el-select
                v-model="form.seller"
                :loading="userLoading"
                :remote-method="sellerRemoteMethod"
                multiple:false
                filterable
                remote
                reserve-keyword
                placeholder="请输入业务员名称关键词"
                style="width: 200px;"
                @focus="cleanUpOptions"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.username"
                  :label="item.username"
                  :value="item.username"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="出库单号" >
              <el-input v-model="form.scanNumber" style="width: 200px;"/>
            </el-form-item>
          </el-form>
          <el-form :inline="true" size="mini">
            <el-form-item label="客户地址" >
              <el-input v-model="form.customerAddress" style="width: 470px;"/>
            </el-form-item>
            <el-form-item label="付款方式" >
              <el-input v-model="form.payment" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="最新欠款" >
              <el-input v-model="form.balance" style="width: 200px;"/>
            </el-form-item>
          </el-form>
          <el-form :inline="true" size="mini">
            <el-form-item label="客户电话" >
              <el-input v-model="form.contactPhone" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="联系人" >
              <el-input v-model="form.contacts" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="订单号码" >
              <el-input style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="交货日期" >
              <el-date-picker v-model="form.deliveryDate" type="datetime" placeholder="选择日期时间" style="width: 200px;" maxlength="15"/>
            </el-form-item>
          </el-form>
          <el-form :inline="true" size="mini">
            <el-form-item label="主司机" >
              <el-select
                v-model="form.driverMain"
                :loading="userLoading"
                :remote-method="transporterRemoteMethod"
                multiple:false
                filterable
                remote
                reserve-keyword
                placeholder="请输入主司机名称关键词"
                style="width: 200px;"
                @focus="cleanUpOptions"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.username"
                  :label="item.username"
                  :value="item.username"
                  @blur="userOptions"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="副司机" >
              <el-select
                v-model="form.driverDeputy"
                :loading="userLoading"
                :remote-method="transporterRemoteMethod"
                multiple:false
                filterable
                remote
                reserve-keyword
                placeholder="请输入副司机名称关键词"
                style="width: 200px;"
                @focus="cleanUpOptions"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.username"
                  :label="item.username"
                  :value="item.username"
                  @blur="userOptions"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="装载员1" >
              <el-select
                v-model="form.loaderOne"
                :loading="userLoading"
                :remote-method="transporterRemoteMethod"
                multiple:false
                filterable
                remote
                reserve-keyword
                placeholder="请输入装卸员1名称关键词"
                style="width: 200px;"
                @focus="cleanUpOptions"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.username"
                  :label="item.username"
                  :value="item.username"
                  @blur="userOptions"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="装载员2" >
              <el-select
                v-model="form.loaderTwo"
                :loading="userLoading"
                :remote-method="transporterRemoteMethod"
                multiple:false
                filterable
                remote
                reserve-keyword
                placeholder="请输入装卸员2名称关键词"
                style="width: 200px;"
                @focus="cleanUpOptions"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.username"
                  :label="item.username"
                  :value="item.username"
                  @blur="userOptions"
                />
              </el-select>
            </el-form-item>
            <el-button :loading="loading" type="success" icon="el-icon-check" size="mini" @click="addAll" >保存</el-button>
          </el-form>
        </el-form>
      </el-row>
      <el-row>
        <el-table
          v-loading="detailLoading"
          :data="detailList"
          :summary-method="getSummaries"
          style="width: 100%"
          show-summary
          height = "260px"
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column prop="prodModel" label="产品编号" align="center" width="100px"/>
          <el-table-column prop="prodName" label="产品名称" align="center" width="150px"/>
          <el-table-column prop="unit" label="单位" width="100px" align="center">
            <template slot-scope="scope">
              <!-- <el-input v-model="scope.row.unit" placeholder="请输入单位"/> -->
              <el-select v-model="scope.row.unit" placeholder="请选择单位">
                <el-option
                  v-for="item in option"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="totalNumber" label="计划数量" width="100px" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.totalNumber" :min="0" />
            </template>
          </el-table-column>
          <el-table-column prop="realQuantity" label="实收数量" width="100px" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.realQuantity" :min="0" />
            </template>
          </el-table-column>
          <el-table-column prop="sellingPrice" label="单价" width="130px" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sellingPrice" :min="0" />
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="金额" width="120px" align="center"></el-table-column>
          <el-table-column prop="realPrice" label="应收金额" width="120px" align="center"/>
          <el-table-column prop="remark" label="备注" width="150%" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="备注" maxlength="6"/>
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkPermission(['admin','chemicalFiberDeliveryDetail:edit','chemicalFiberDeliveryDetail:del'])"
            label="操作"
            align="center"
            width="170%"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                icon="el-icon-edit"
                @click="sutmitDetail(scope.row)"
              >更新</el-button>
              <!--<el-button
                size="mini"
                type="primary"
                icon="el-icon-download"
                @click="exportPoundExcel(scope.row)"
              >磅码单</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="form.noteStatus == 1" @click="addTable" >添加产品</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button v-if="form.noteStatus == 1" :loading="downloadLoading" type="primary" @click="exportDelivery()">导出送货单</el-button>
        <div v-if="form.noteStatus == 2">
          <el-popover
            :ref="'poper'+form.id"
            placement="top"
          >
            <p>是否发货</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="pCancle(form.id)">取消</el-button>
              <el-button
                :loading="sutmitDetailLoading"
                type="primary"
                size="mini"
                @click="sendOut(form.id)"
              >确定</el-button>
            </div>
            <el-button slot="reference" type="warning" icon="el-icon-s-promotion" size="mini">发货</el-button>
          </el-popover>
        </div>
        <div v-if="form.noteStatus == 3">
          <el-popover
            :ref="'poper'+form.id"
            placement="top"
          >
            <p>确认签收前，请确认回填信息</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="pCancle(form.id)">取消</el-button>
              <el-button
                :loading="sutmitDetailLoading"
                type="primary"
                size="mini"
                @click="recived(form.id)"
              >确定</el-button>
            </div>
            <el-button slot="reference" type="warning" icon="el-icon-s-promotion" size="mini">签收</el-button>
          </el-popover>
        </div>
      </span>

      <el-dialog
        :visible.sync="addTableFrom"
        :append-to-body = "true"
        width="40%"
        title="添加产品" >
        <el-form :model="tableForm" size="mini" label-width="80px" >
          <el-form-item label="产品搜索" >
            <el-input v-model="tableForm.searchName" clearable placeholder="输入产品名称进行搜索" prefix-icon="el-icon-search" style="width: 100%;" class="filter-item" @input="getSelectMap"/>
            <el-tree :data="prods" :expand-on-click-node="false" default-expand-all style="width: 370px;" @node-click="handleNodeClick"/>
          </el-form-item>
          <el-form-item label="产品型号" >
            <el-input v-model="tableForm.prodModel" :disabled="true" style="width: 370px;" @input="getSelectMap"/>
          </el-form-item>
          <el-form-item label="产品名称" >
            <el-input v-model="tableForm.prodName" :disabled="true" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="单位">
            <template >
              <el-select v-model="tableForm.unit" placeholder="请选择单位">
                <el-option
                  v-for="item in option"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="tableForm.totalNumber" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="单价">
            <el-input v-model="tableForm.sellingPrice" style="width: 370px;" placeholder="请输入销售单价"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="tableForm.remark" style="width: 370px;" placeholder="请输入销售单价"/>
          </el-form-item>

        </el-form>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="addTableFrom = false">取消</el-button>
          <el-button :loading="delLoading" type="primary" size="mini" @click="addTableRow">确定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>

</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadChemicalFiberDeliveryNote, downloadDeliveryNote, exportPoundExcel, sendOut, recived } from '@/api/chemicalFiberDeliveryNote'
import { edit, getChemicalFiberDeliveryDetailsList, addTableRow } from '@/api/chemicalFiberDeliveryDetail'
import { parseTime, downloadFile } from '@/utils/index'
import { getUserListByDeptId } from '@/api/user'
import { add, editAll } from '@/api/chemicalFiberDeliveryNote'
import { getCustomerList } from '@/api/customer'
import { getSelectMap } from '@/api/chemicalFiberStock'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      dateQuery: '',
      delLoading: false,
      dialogVisible: false,
      popVisible: false,
      detailLoading: false,
      sutmitDetailLoading: false,
      customerLoading: false,
      userLoading: false,
      addTableFrom: false,
      customerOptions: [],
      userOptions: [],
      prods: [],
      visible: false,
      form: {
        id: '',
        scanNumber: '',
        customerId: '',
        customerName: '',
        customerCode: '',
        customerAddress: '',
        contacts: '',
        contactPhone: '',
        totalPrice: '',
        remark: '',
        seller: '',
        storeKeeper: '',
        createDate: '',
        createUser: '',
        carNumber: '',
        deliveryDate: '',
        driverMain: '',
        driverDeputy: '',
        state: '',
        loaderOne: '',
        loaderTwo: '',
        balance: '',
        payment: '',
        realPrice: ''
      },
      tableForm: {
        prodModel: '',
        prodName: '',
        scanNumber: '',
        unit: '',
        sellingPrice: '',
        remark: '',
        totalNumber: '',
        realQuantity: ''
      },
      customerQuery: {
        name: ''
      },
      rules: {
        totalPrice: [
          {
            required: true, message: '请输入总价格', trigger: 'blur'
          }
        ]
      },
      queryTypeOptions: [
        { key: 'scanNumber', display_name: '出库单号' },
        { key: 'customerName', display_name: '客户名称' },
        { key: 'customerCode', display_name: '客户编号' },
        { key: 'customerAddress', display_name: '客户地址' },
        { key: 'contacts', display_name: '联系人' },
        { key: 'contactPhone', display_name: '联系电话' }
      ],
      statusValue: {
        0: '已失效',
        1: '待打印',
        2: '待出库',
        3: '待签收',
        4: '待结款',
        5: '已完结'
      },
      detailList: [],
      option: [
        {
          value: '吨',
          label: '吨'
        }, {
          value: '支',
          label: '支'
        }, {
          value: '箱',
          label: '箱'
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
    rowClicker: function(row) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: row.id,
        scanNumber: row.scanNumber,
        customerId: row.customerId,
        customerName: row.customerName,
        customerCode: row.customerCode,
        customerAddress: row.customerAddress,
        contacts: row.contacts,
        contactPhone: row.contactPhone,
        totalPrice: row.totalPrice,
        realPrice: row.realPrice,
        remark: row.remark,
        seller: row.seller,
        storeKeeper: row.storeKeeper,
        createDate: row.createDate,
        createUser: row.createUser,
        carNumber: row.carNumber,
        deliveryDate: row.deliveryDate,
        driverMain: row.driverMain,
        driverDeputy: row.driverDeputy,
        noteStatus: row.noteStatus,
        loaderOne: row.loaderOne,
        loaderTwo: row.loaderTwo
      }
      this.$refs.form.tempCustomerId = row.customerId
      this.$refs.form.tempCustomerName = row.customerName
      _this.dialog = true
    },
    sendOut(id) {
      this.sutmitDetailLoading = true
      sendOut(id).then(res => {
        this.sutmitDetailLoading = false
        this.$refs[`poper` + id].doClose()
        this.dialogVisible = false
        this.init()
        this.$notify({
          title: '状态变更为已发货',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.sutmitDetailLoading = false
        console.log(err.response.data.message)
      })
    },
    recived(id) {
      this.sutmitDetailLoading = true
      recived(id).then(res => {
        this.sutmitDetailLoading = false
        this.$refs[`poper` + id].doClose()
        this.dialogVisible = false
        this.init()
        this.$notify({
          title: '确认签收成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.sutmitDetailLoading = false
        console.log(err.response.data.message)
      })
    },
    pCancle(id) {
      this.$refs[`poper` + id].doClose()
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
        totalPrice: data.totalPrice,
        realPrice: data.realPrice,
        remark: data.remark,
        seller: data.seller,
        storeKeeper: data.storeKeeper,
        createDate: data.createDate,
        createUser: data.createUser,
        carNumber: data.carNumber,
        deliveryDate: data.deliveryDate,
        driverMain: data.driverMain,
        driverDeputy: data.driverDeputy,
        state: data.state,
        loaderOne: data.loaderOne,
        loaderTwo: data.loaderTwo,
        payment: data.payment,
        balance: data.balance
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
        this.dialogVisible = false
        this.init()
      }).catch(() => {
        this.downloadLoading = false
        this.$notify.error({
          title: '请确保已选择单位',
          duration: 2500
        })
      })
    },
    addTable() {
      this.tableForm = {
        prodModel: '',
        prodName: '',
        unit: '',
        sellingPrice: '',
        remark: '',
        totalNumber: '',
        realPrice: '',
        realQuantity: ''
      }
      this.prods = []
      this.addTableFrom = true
    },
    addTableRow() {
      this.tableForm = {
        prodModel: this.tableForm.prodModel,
        prodName: this.tableForm.prodName,
        scanNumber: this.form.scanNumber,
        unit: this.tableForm.unit,
        sellingPrice: this.tableForm.sellingPrice,
        remark: this.tableForm.remark,
        totalNumber: this.tableForm.totalNumber,
        realQuantity: this.tableForm.realQuantity,
        totalPrice: this.tableForm.totalNumber * this.tableForm.sellingPrice,
        realPrice: this.tableForm.realQuantity * this.tableForm.totalNumber
      }
      addTableRow(this.tableForm).then(res => {
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.addTableFrom = false
<<<<<<<<< Temporary merge branch 1
        this.$parent.init()
      }).catch(err => {
        this.addTableFrom = false
        console.log(err.response.data.message)
      })
      this.addTableFrom = false
      var params = { 'scanNumber': this.form.scanNumber }
      getChemicalFiberDeliveryDetailsList(params).then(res => {
        this.detailLoading = false
        this.detailList = res
      })
      this.detailLoading = true
    },
    handleNodeClick(data) {
      this.tableForm.prodName = data.prodName
      this.tableForm.prodModel = data.prodModel
    },
    getSelectMap() {
      const params = {}
      params['prodName'] = this.tableForm.searchName
      getSelectMap(params).then(res => {
        this.prods = res.content
      })
    },
    addAll(data) {
      if (this.form.customerId === null) {
        this.$notify({
          title: '请选择客户',
          type: 'warning',
          duration: 2500

        var params = { 'scanNumber': this.form.scanNumber }
        getChemicalFiberDeliveryDetailsList(params).then(res => {
          this.detailLoading = false
          this.detailList = res
        })
        this.detailLoading = true
      },
      handleNodeClick(data) {
        this.tableForm.prodName = data.prodName
        this.tableForm.prodModel = data.prodModel
      },
      getSelectMap() {
        const params = {}
        params['prodName'] = this.tableForm.searchName
        getSelectMap(params).then(res => {
          this.prods = res.content
        })
      },
      addAll(data) {
        if (this.form.customerId === null) {
          this.$notify({
            title: '请选择客户',
            type: 'warning',
            duration: 2500
          })
          return
        }
        this.$refs['form1'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.doEdit()
          }
        })
      },
      detail(data) {
        this.form = {
          id: data.id,
          customerName: data.customerName,
          customerAddress: data.customerAddress,
          scanNumber: data.scanNumber,
          contactPhone: data.contactPhone,
          contacts: data.contacts,
          createDate: data.createDate,
          customerCode: data.custmerCode,
          seller: data.seller,
          storeKeeper: data.storeKeeper,
          createUser: data.createUser,
          carNumber: data.carNumber,
          driverMain: data.driverMain,
          driverDeputy: data.driverDeputy,
          state: data.state,
          loaderOne: data.loaderOne,
          loaderTwo: data.loaderTwo,
          totalPrice: data.totalPrice,
          realPrice: data.realPrice,
          customerId: data.customerId,
          deliveryDate: data.deliveryDate,
          noteStatus: data.noteStatus,
          payment: data.payment,
          balance: data.balance
        }
        var params = { 'scanNumber': data.scanNumber }
        getChemicalFiberDeliveryDetailsList(params).then(res => {
          this.detailLoading = false
          this.detailList = res
        })
        this.detailLoading = true
        this.dialogVisible = true
      },
      handleCurrentChange(val) {
        this.currentChangeItem = val
      },
      sutmitDetail(data) {
        this.detailLoading = true
        data.totalPrice = data.totalNumber * data.sellingPrice
        data.realPrice = data.realQuantity * data.sellingPrice
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
        })
        return
      }
      this.$refs['form1'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.doEdit()
        }
      })
    },
    detail(data) {
      this.form = {
        id: data.id,
        customerName: data.customerName,
        customerAddress: data.customerAddress,
        scanNumber: data.scanNumber,
        contactPhone: data.contactPhone,
        contacts: data.contacts,
        createDate: data.createDate,
        customerCode: data.custmerCode,
        seller: data.seller,
        storeKeeper: data.storeKeeper,
        createUser: data.createUser,
        carNumber: data.carNumber,
        driverMain: data.driverMain,
        driverDeputy: data.driverDeputy,
        state: data.state,
        loaderOne: data.loaderOne,
        loaderTwo: data.loaderTwo,
        totalPrice: data.totalPrice,
        realPrice: data.realPrice,
        customerId: data.customerId,
        deliveryDate: data.deliveryDate,
        noteStatus: data.noteStatus,
        payment: data.payment,
        balance: data.balance
      }
      var params = { 'scanNumber': data.scanNumber }
      getChemicalFiberDeliveryDetailsList(params).then(res => {
        this.detailLoading = false
        this.detailList = res
      })
      this.detailLoading = true
      this.dialogVisible = true
    },
    handleCurrentChange(val) {
      this.currentChangeItem = val
    },
    sutmitDetail(data) {
      this.detailLoading = true
      data.totalPrice = data.totalNumber * data.sellingPrice
      data.realPrice = data.realQuantity * data.sellingPrice
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
      })
      return sums
    },
    exportDelivery() {
      if (this.form.customerName === null) {
        this.$notify({
          title: '请返回填写客户信息',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.downloadLoading = true
      downloadDeliveryNote(this.form.id).then(result => {
        this.downloadLoading = false
        downloadFile(result, '生产单导出', 'xls')
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    exportPoundExcel(data) {
      if (this.form.customerName === null) {
        this.$notify({
          title: '请返回填写客户信息',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.detailLoading = true
      var dto = {
        scanNumber: this.form.scanNumber,
        prodId: data.prodId,
        prodName: data.prodName,
        customerName: this.form.customerName,
        createDate: this.form.createDate
      }
      exportPoundExcel(dto).then(result => {
        this.detailLoading = false
        downloadFile(result, '磅码单导出', 'xls')
      }).catch(() => {
        this.detailLoading = false
      })
    },
    kgformatter(row, column, cellValue, index) {
      return cellValue + ' KG'
    },
    setCustomerId(event) {
      this.form.customerId = event
    },
    cleanUpOptions() {
      this.userOptions = []
    },
    customerRemoteMethod(query) {
      if (query !== '') {
        this.customerLoading = true
        this.customerQuery.name = query
        getCustomerList(this.customerQuery).then(res => {
          this.customerLoading = false
          this.customerList = res
          this.customerOptions = this.customerList.filter(item => {
            return item.name.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        })
      } else {
        this.customerOptions = []
      }
    },
    sellerRemoteMethod(query) {
      // 业务员deptId为19
      const params = { deptId: 19, username: query }
      this.userLoading = true
      getUserListByDeptId(params).then(res => {
        this.userLoading = false
        this.userList = res
        this.userOptions = _this.userList.filter(item => {
          return item.username.toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        })
      })
    },
    storeKeeperRemoteMethod(query) {
      // 仓管员deptId为16
      const params = { deptId: 16, username: query }
      this.userLoading = true
      getUserListByDeptId(params).then(res => {
        this.userLoading = false
        this.userList = res
        this.userOptions = this.userList.filter(item => {
          return item.username.toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        })
      })
    },
    transporterRemoteMethod(query) {
      // 运输部deptId为18
      const params = { deptId: 18, username: query }
      this.userLoading = true
      getUserListByDeptId(params).then(res => {
        this.userLoading = false
        this.userList = res
        this.userOptions = this.userList.filter(item => {
          return item.username.toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        })
      })
    },
    doEdit() {
      editAll(this.form).then(res => {
        // this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.init()
        this.customerOptions = []
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
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
  .el-dialog{
    display: flex;
    flex-direction: column;
    margin:0 !important;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    /*height:600px;*/
    max-height:calc(100% - 30px);
    max-width:calc(100% - 30px);
  }
  .el-dialog .el-dialog__body{
    flex:1;
    overflow: auto;
  }
  .el-table{
    overflow:visible !important;
  }
</style>
