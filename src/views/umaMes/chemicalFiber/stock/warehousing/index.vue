<template>
  <div class="app-container">
    <el-input
      v-model="query.value"
      clearable
      size="mini"
      placeholder="输入搜索内容"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="toQuery"
    />
    <el-select
      v-model="query.type"
      clearable
      size="mini"
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
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    />
    <el-checkbox
      v-model="showUnEnable"
      @change="toQuery"
    >查询失效单</el-checkbox>
    <el-button
      class="filter-item"
      size="mini"
      type="success"
      icon="el-icon-search"
      @click="toQuery"
    >搜索</el-button>
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="add">新增</el-button>
    </div>
    <!--工具栏-->
    <div class="head-container">
      <el-table
        v-loading="loading"
        :data="data"
        size="small"
        style="width: 100%;"
      >
        <el-table-column prop="scanNumber" label="入库单号"align="center"/>
        <el-table-column prop="supplierName" label="供应商名称"align="center"/>
        <el-table-column prop="batchNumber" label="批号"align="center"/>
        <el-table-column prop="tonAndBranch" label="数量"align="center"/>
        <el-table-column prop="totalPrice" label="总金额"align="center"/>
        <el-table-column prop="createDate" label="制单时间"align="center">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="warehousingDate" label="入库日期"align="center">
          <template slot-scope="scope">
            <span>{{ parseTimeToDate(scope.row.warehousingDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="制单人"align="center"/>
        <el-table-column prop="warehousingStatus" label="状态"align="center">
          <template slot-scope="scope">
            <div v-if = "scope.row.invalid == 1">
                <el-tag
                  type="danger"
                  size="medium"
                >{{ statusValue[0] }}</el-tag>
            </div>
            <div v-else>
              <div v-if="scope.row.warehousingStatus == 1">
                <el-tag
                  type="danger"
                  size="medium"
                >{{ statusValue[1] }}</el-tag>
              </div>
              <div v-if="scope.row.warehousingStatus == 2">
                <el-tag
                  type="success"
                  size="medium"
                >{{ statusValue[2] }}</el-tag>
              </div>

            </div>

          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="240px"
          align="center"
        >
          <template slot-scope="scope">
            <!--<el-button
              v-permission="['admin','chemicalFiberDeliveryNote:edit']"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="edit(scope.row)"
            >编辑</el-button>-->
            <el-button
              v-if = "scope.row.invalid == 0"
              size="mini"
              type="success"
              icon="el-icon-tickets"
              @click="warehousingDetail(scope.row)"
              @click.stop
            >编辑</el-button>
            <el-popover
              v-if = "scope.row.invalid == 0"
              :ref="scope.row.id"
              placement="top"
            >
              <p>是否删除</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="popoverClose(scope.row.id)">取消</el-button>
                <el-button
                  :loading="sutmitDetailLoading"
                  type="primary"
                  size="mini"
                  @click="delWarehousing(scope.row.id)"
                >确定</el-button>
              </div>
              <el-button slot="reference" type="warning" icon="el-icon-delete" size="mini">删除</el-button>
            </el-popover>
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
    </div>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :modal="true"
      :visible.sync="dialog"
      :title="isAdd ? '新增' : '编辑'"
      width="65%">
      <el-row>
        <el-form ref="form1" :model="form" size="mini" label-width="80px" >
          <el-form :inline="true" size="mini">
            <el-form-item label="入库单号" >
              <el-input v-model="form.scanNumber" :disabled="true" style="width: 120px;" @input="buttonType"/>
            </el-form-item>
            <!--<el-form-item label="供应商" >
              <el-input v-model="form.supplierName" :disabled="form.warehousingStatus == 2?true:false" style="width: 150px;" @input="buttonType"/>
            </el-form-item>-->
            <el-form-item label="客户编号">
              <el-select
                v-model="form.supplierCode"
                :loading="customerLoading"
                :remote-method="customerCodeMethod"
                multiple:false
                :disabled="form.warehousingStatus == 2?true:false"
                filterable
                remote
                reserve-keyword
                placeholder="输入编号关键词"
                style="width: 100px;"
                @change="setCustomerId($event)"
              >
                <el-option
                  v-for="item in customerCodeOptions"
                  :key="item.code"
                  :label="item.code"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="客户名称">
              <el-select
                v-model="form.supplierName"
                :loading="customerLoading"
                :remote-method="customerRemoteMethod"
                multiple:false
                :disabled="form.warehousingStatus == 2?true:false"
                filterable
                remote
                reserve-keyword
                placeholder="输入客户关键词"
                style="width: 100px;"
                @change="setCustomerId($event)"
              >
                <el-option
                  v-for="item in customerOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="批号" >
              <el-input v-model="form.batchNumber" :disabled="form.warehousingStatus == 2?true:false" maxlength="17" style="width: 100px;" @input="buttonType"/>
            </el-form-item>
            <el-form-item label="入库日期" >
              <el-date-picker v-model="form.warehousingDate" :disabled="form.warehousingStatus == 2?true:false"s type="date" placeholder="选择日期时间" style="width: 130px;" maxlength="15" @change="buttonType"/>
            </el-form-item>
          </el-form>
          <el-form :inline="true" size="mini">
            <el-form-item label="司机" >
              <el-select
                v-model="form.driverMain"
                :loading="userLoading"
                :remote-method="transporterRemoteMethod"
                :disabled="form.warehousingStatus == 2?true:false"
                multiple:false
                clearable
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="输入主司机关键词"
                style="width: 157px;"
                @change="isDriverMain($event)"
                @focus="cleanUpOptions"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.realname"
                  :label="item.realname"
                  :value="item.realname"
                  @blur="userOptions"
                />
              </el-select>
              <el-select
                v-model="form.driverDeputy"
                :loading="userLoading"
                :remote-method="transporterRemoteMethod"
                :disabled="form.warehousingStatus == 2?true:false"
                multiple:false
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="输入副司机关键词"
                style="width: 157px;"
                @change="isDriverDeputy($event)"
                @focus="cleanUpOptions"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.realname"
                  :label="item.realname"
                  :value="item.realname"
                  @blur="userOptions"
                />
              </el-select>
            </el-form-item>
            <!--<el-form-item label="副司机" >
              <el-input v-model="form.driverDeputy" style="width: 150px;" @input="buttonType"/>
            </el-form-item>-->
            <el-form-item label="押运员" >
              <el-select
                v-model="form.escortOne"
                :loading="userLoading"
                :remote-method="transporterRemoteMethod"
                multiple:false
                :disabled="form.warehousingStatus == 2?true:false"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="输入副司机关键词"
                style="width: 157px;"
                @change="isEscortOne($event)"
                @focus="cleanUpOptions"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.realname"
                  :label="item.realname"
                  :value="item.realname"
                  @blur="userOptions"
                />
              </el-select>
              <el-select
                v-model="form.escortTwo"
                :loading="userLoading"
                :remote-method="transporterRemoteMethod"
                :disabled="form.warehousingStatus == 2?true:false"
                multiple:false
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="输入副司机关键词"
                style="width: 157px;"
                @change="isEscortTwo($event)"
                @focus="cleanUpOptions"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.realname"
                  :label="item.realname"
                  :value="item.realname"
                  @blur="userOptions"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="车牌号" >
              <el-select
                v-model="form.carNumber"
                :loading="carLoading"
                :remote-method="carMethod"
                multiple:false
                :disabled="form.warehousingStatus == 2?true:false"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="输入车牌关键词"
                style="width: 157px;"
                @change="buttonType"
                @focus="cleanUpOptions"
              >
                <el-option
                  v-for="item in carOptions"
                  :key="item.carNumber"
                  :label="item.carNumber"
                  :value="item.carNumber"
                  @blur="carOptions"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="单据备注" >
              <el-input v-model="form.remark" :disabled="form.warehousingStatus == 2?true:false" style="width: 150px;" @input="buttonType"/>
            </el-form-item>
          </el-form>
          <el-form :inline="true" size="mini">

          </el-form>
        </el-form>
      </el-row>
      <el-row>
        <el-table
          v-loading="detaLoading"
          :data="detalList"
          :summary-method="getSummaries"
          style="width: 100%"
          max-height="300"
          show-summary
          highlight-current-row
          row-key="id"
          >
          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="50px"/>
          <el-table-column prop="prodModel" label="产品编号" align="center" width="100px"/>
          <el-table-column prop="prodName" label="产品名称" align="center" width="120px"/>
          <el-table-column prop="unit" label="单位"  width="100px" align="center">
            <template slot-scope="scope">
              <!-- <el-input v-model="scope.row.unit" placeholder="请输入单位"/> -->
              <el-select v-model="scope.row.unit" :disabled="form.warehousingStatus == 2?true:false" placeholder="请选择单位" @change="buttonType">
                <el-option
                  v-for="item in option"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="warehousingNumber" label="数量" width="120px" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.warehousingNumber" :disabled="form.warehousingStatus == 2?true:false" :min="0" type="number" @input = "sum(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" width="120px" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price" :disabled="form.warehousingStatus == 2?true:false" :min="0" type="number" @input = "sum(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="总金额" width="150px" align="center"/>
          <el-table-column prop="remark" label="产品备注" width="200px" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" :disabled="form.warehousingStatus == 2?true:false" placeholder="备注" @input="buttonType"/>
            </template>
          </el-table-column>
          <el-table-column
            v-if="form.warehousingStatus == 1"
            label="操作"
            align="center"
            width="170%"
          >
            <template slot-scope="scope">
              <el-popover
                :ref="scope.row.id"
                placement="top"
              >
                <p>是否删除</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="popoverClose(scope.row.id)">取消</el-button>
                  <el-button
                    :loading="sutmitDetailLoading"
                    type="primary"
                    size="mini"
                    @click="delWarehousingDetail(scope.row.id)"
                  >确定</el-button>
                </div>
                <el-button slot="reference" type="warning" icon="el-icon-delete" size="mini">删除</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="form.warehousingStatus == 1 || form.warehousingStatus == 0" :loading="loading" :type="typeButton" icon="el-icon-edit" @click="addAll">保存</el-button>
        <el-button v-if="form.warehousingStatus == 1" @click="addTable" >添加产品</el-button>
        <el-popover
          :ref="form.id"
          placement="top"
          v-model="visible"
        >
          <p>是否入库</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button
              :loading="sutmitDetailLoading"
              type="primary"
              size="mini"
              @click="warehousingOut(form.id)"
            >确定</el-button>
          </div>
          <el-button slot="reference" :disabled="form.warehousingStatus != 1 ? true : false" :type="form.warehousingStatus != 1 ? 'info' : 'success'" icon="el-icon-bottom-left">入库</el-button>
        </el-popover>
        <el-button @click="dialog = false">取 消</el-button>
      </span>
      <el-dialog
        :visible.sync="addTableFrom"
        :append-to-body = "true"
        :modal="true"
        width="25%"
        title="添加产品" >
        <el-form :model="tableForm" size="mini" label-width="80px" >
          <!--<el-form-item label="产品搜索" >-->
            <!--<el-select
              v-model="form.searchName"
              :loading="userLoading"
              :remote-method="prodRemoteMethod"
              multiple:false
              filterable
              remote
              reserve-keyword
              placeholder="请输入产品型号/名称关键词"
              style="width: 200px;"
              @change="fullWithProd"
              @focus="cleanUpOptions"
            >
              <el-option
                v-for="item in prodOptions"
                :label="item.name"
                :value="item.name"
                @blur="prodOptions"
              />
            </el-select>-->
          </el-form-item>
          <el-form-item label="产品型号" >
            <!--<el-input v-model="tableForm.prodModel" :disabled="true" style="width: 370px;"/>-->
            <el-select
              v-model="tableForm.prodModel"
              :loading="userLoading"
              :remote-method="prodCodeRemoteMethod"
              multiple:false
              filterable
              remote
              reserve-keyword
              placeholder="请输入产品型号/名称关键词"
              style="width: 200px;"
              @change="setProdId($event)"
              @focus="cleanUpOptions"
            >
              <el-option
                v-for="item in prodModelOptions"
                :key="item.id"
                :label="item.model"
                :value="item.model"
                @blur="prodModelOptions"
              />
            </el-select>

          </el-form-item>
          <el-form-item label="产品名称" >
            <!--<el-input v-model="tableForm.prodName" :disabled="true" style="width: 370px;"/>-->
            <el-select
              v-model="tableForm.prodName"
              :loading="userLoading"
              :remote-method="prodRemoteMethod"
              multiple:false
              filterable
              remote
              reserve-keyword
              placeholder="请输入产品型号/名称关键词"
              style="width: 200px;"
              @change="setProdId($event)"
              @focus="cleanUpOptions"
            >
              <el-option
                v-for="item in prodOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"
                @blur="prodOptions"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="产品名称" >
            <template slot-scope="scope">
              <!-- <el-input v-model="scope.row.unit" placeholder="请输入单位"/> -->
              <el-select v-model="tableForm.unit" placeholder="请选择单位" >
                <el-option
                  v-for="item in option"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="产品数量" >
            <el-input v-model="tableForm.warehousingNumber" style="width: 100px;" @input="buttonType"/>
          </el-form-item>
          <el-form-item label="产品单价" >
            <el-input v-model="tableForm.price" style="width: 100px;" @input="buttonType"/>
          </el-form-item>
        </el-form>
        <div style="text-align: right; margin: 0">
          <el-button type="primary" size="mini" @click="addWarehousingDetalis">添加并继续新增</el-button>
          <el-button size="mini" type="text" @click="addTableFrom = false">取消</el-button>
          <el-button type="primary" size="mini" @click="addWarehousingDetali">确定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import { getCustomerList, getCustomerLists, getCustomerById } from '@/api/customer'
import { parseTime, downloadFile, downloadFileWhithScanNumber, parseTimeToDate } from '@/utils/index'
import { getSelectMaps, getByProdName } from '@/api/chemicalFiberStock'
import { getProdList } from '@/api/chemicalFiberProduct'
import { getCarList } from '@/api/car'
import { add, edit, warehousing, delWarehousing } from '@/api/chemicalFiberStockWarehousing'
import { warehousingDetali, warehousingDetaliList, warehousingEdit, delDetail } from '@/api/chemicalFiberStockWarehousingDetail'
import { getUserListByDeptId } from '@/api/user'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return{
      loading: false,dialog: false,detalList:[],userLoading: false,prodOptions: [],addTableFrom: false,isAnd: '',
      typeButton: '',formTotalPrice: '',detaLoading: false,sutmitDetailLoading:false,
      dateQuery: '',userLoading: false,userOptions: [],visible: false,checkInvalidQuery: false,customerOptions: [],
      customerCodeOptions: [],customerLoading:false,carOptions: [],carLoading: false,prodModelOptions: [],
      showUnEnable: false,
      form: {
        id: '',
        createUser: '',
        totalPrice: '',
        scanNumber: '',
        createDate: '',
        warehousingDate: '',
        supplierName: '',
        batchNumber: '',
        warehousingStatus: '',
        remark: '',
        driverMain: '',
        driverDeputy: '',
        escortOne: '',
        escortTwo: '',
        carNumber: '',
        invalid: '',
        supplierCode: ''
      },
      tableForm: {
        prodModel: '',
        prodName: '',
        warehousingId: '',
        stockId: '',
        prodId: '',
        scanNumber: '',
        warehousingId: '',
        unit: '',
        totalPrice: '',
        createDate: ''
      },
      option: [
        {
          value: '吨',
          label: '吨'
        }, {
          value: '支',
          label: '支'
        }
      ],
      queryTypeOptions: [
        { key: 'scanNumber', display_name: '入库单号' },
        { key: 'supplierName', display_name: '供应商' },
      ],
      statusValue: {
        0: '已失效',
        1: '编辑中',
        2: '已入库'
      },
      customerQuery: {
        name: '',
        code: ''
      },
      carQuery: {
        carNumber: ''
      }


    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    var start = new Date(new Date(new Date().toLocaleDateString()))
    this.dateQuery = [start, new Date(start.getTime() + 24 * 60 * 60 * 1000)]
  },
  methods: {
    parseTime,
    parseTimeToDate,
    beforeInit() {
      this.url = 'api/chemicalFiberStockWarehousing'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort}
      const query = this.query
      const type = query.type
      const value = query.value
      const dateQuery = this.dateQuery
      const checkEnables = this.showUnEnable
      this.params['queryWithInvalid'] = checkEnables
      if (type && value) { this.params[type] = value }
      if (dateQuery) {
        this.params['tempStartTime'] = dateQuery[0].getTime()
        this.params['tempEndTime'] = dateQuery[1].getTime()
      }
      return true
    },
    // 详情触发按钮
    warehousingDetail(data) {
      this.isAnd = 2
      this.isAdd = false
      this.typeButton = 'success'
      this.form = {
        id: data.id,
        createUser: data.createUser,
        totalPrice: this.formTotalPrice,
        scanNumber: data.scanNumber,
        createDate: data.createDate,
        warehousingDate: data.warehousingDate,
        supplierName: data.supplierName,
        batchNumber: data.batchNumber,
        warehousingStatus: data.warehousingStatus,
        remark: data.remark,
        driverMain: data.driverMain,
        driverDeputy: data.driverDeputy,
        escortOne: data.escortOne,
        escortTwo: data.escortTwo,
        carNumber: data.carNumber,
        invalid: data.invalid,
        supplierCode: data.supplierCode
      }
      if (this.form.warehousingStatus == 1) {
        this.form.warehousingDate = new Date()
      }
      this.tableDetailList(data)
      this.dialog = true
      this.init()
    },
    add() {
      this.isAnd = 1;
      this.resetForm()
      this.detalList = []
      this.typeButton = 'success'
      this.isAdd = true
      this.form.warehousingStatus = 0
      this.dialog = true
    },
    // 添加产品触发
    addTable() {
      this.tableForm = {
        prodName: ''
      }
      this.form.searchName = ''
      this.prods = []
      this.addTableFrom = true
    },
    prodRemoteMethod(query) {
      const params = { name: query }
      getProdList(params).then(res => {
        this.userLoading = false
        this.prodList = res
        this.prodOptions = this.prodList.filter(item => {
          return item.name
        })
      })
    },
    prodCodeRemoteMethod(query) {
      const params = { model: query }
      getProdList(params).then(res => {
        this.userLoading = false
        this.prodList = res
        this.prodModelOptions = this.prodList.filter(item => {
          return item.model
        })
      })
    },
    cleanUpOptions() {
      this.userOptions = []
      this.prodOptions = []
      this.prodModelOptions = []
      this.carOptions = []
    },
    fullWithProd(event) {
      const params = { name: event }
      getProdList(params).then(res => {
        this.prodList = res
        this.tableForm.prodName = this.prodList[0].name
        this.tableForm.prodId = this.prodList[0].id
        this.tableForm.prodModel = this.prodList[0].model
      })
    },
    // 新增产品确定按钮说
    addWarehousingDetali() {
      this.tableForm = {
        warehousingId: this.form.id,
        scanNumber: this.form.scanNumber,
        prodName: this.tableForm.prodName,
        prodId: this.tableForm.prodId,
        prodModel: this.tableForm.prodModel,
        unit: this.tableForm.unit,
        createDate: this.form.createDate,
        warehousingNumber: this.tableForm.warehousingNumber,
        price: this.tableForm.price,
        totalPrice: this.tableForm.warehousingNumber * this.tableForm.price
      }
      this.addTableFrom = true
      if (!this.tableForm.prodModel == '' && !this.tableForm.prodName == '' && !this.tableForm.unit == '') {
        warehousingDetali(this.tableForm).then(res => {
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.buttonType()
          this.detaLoading = true
          this.tableDetailList(this.form)
          this.addTableFrom = false
          this.init()
        }).catch(err => {
          this.addTableFrom = false
          console.log(err.response.data.message)
        })
        this.addTableFrom = false
      } else {
        this.$notify({
          title: '请填写信息',
          type: 'warning',
          duration: 2500
        })
      }
    },
    addWarehousingDetalis() {
      this.tableForm = {
        warehousingId: this.form.id,
        scanNumber: this.form.scanNumber,
        prodName: this.tableForm.prodName,
        prodId: this.tableForm.prodId,
        prodModel: this.tableForm.prodModel,
        unit: this.tableForm.unit,
        createDate: this.form.createDate,
        warehousingNumber: this.tableForm.warehousingNumber,
        price: this.tableForm.price,
        totalPrice: this.tableForm.warehousingNumber * this.tableForm.price
      }
      this.addTableFrom = true
      if (!this.tableForm.prodModel == '' && !this.tableForm.prodName == '' && !this.tableForm.unit == '') {
        warehousingDetali(this.tableForm).then(res => {
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.buttonType()
          //this.detaLoading = true
          this.tableDetailList(this.form)
          //this.addTableFrom = false
          this.tableForm = {
            warehousingId: '',
            scanNumber: '',
            prodName: '',
            prodId: '',
            prodModel: '',
            unit: '',
            createDate: '',
            warehousingNumber: '',
            price: '',
            totalPrice: ''
          }
          this.init()
        }).catch(err => {
          this.addTableFrom = false
          console.log(err.response.data.message)
        })
        //this.addTableFrom = false
      } else {
        this.$notify({
          title: '请填写信息',
          type: 'warning',
          duration: 2500
        })
      }
    },
    addAll() {
      if (this.form.supplierName == '') {
        this.$notify({
          title: '请填写供应商',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (this.form.warehousingDate == null) {
        this.$notify({
          title: '请填日期',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (this.isAnd == 1) {
        this.doAdd(this.form)
        return
      }else if (this.isAnd == 2) {
        for (var i = 0; i < this.detalList.length; i++) {
          if (this.detalList[i].warehousingNumber == '' || this.detalList[i].warehousingNumber == 0 || this.detalList[i].warehousingNumber == null) {
            this.$notify({
              title: '请填写数量',
              type: 'warning',
              duration: 2500
            })
            return
          }
        }
        this.typeButton = 'success'
        warehousingEdit(this.detalList).then(res => {
          this.$notify({
            title: '修改成功',
            type: 'success',
            duration: 2500
          })
          this.doEdit(this.form)
        })
      }
    },
    delWarehousingDetail(id) {
      this.sutmitDetailLoading = true
      delDetail(id).then(res => {
        this.sutmitDetailLoading = false
        this.$refs[id].doClose()
        this.tableDetailList(this.form)
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.sutmitDetailLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })


    },
    delWarehousing(id) {
      this.sutmitDetailLoading = true
      delWarehousing(id).then(res => {
        this.sutmitDetailLoading = false
        this.$refs[id].doClose()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.sutmitDetailLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    warehousingOut(id) {
      if (this.typeButton == 'danger') {
        this.$notify({
          title: '请先保存',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (this.detalList.length == '' || this.detalList.length == 0) {
        this.$notify({
          title: '请先添加产品',
          type: 'warning',
          duration: 2500
        })
        return
      }
      for (var i = 0; i < this.detalList.length; i++) {
        if (this.detalList[i].warehousingNumber == '' || this.detalList[i].warehousingNumber == 0 || this.detalList[i].warehousingNumber == null) {
          this.$notify({
            title: '请填写数量',
            type: 'warning',
            duration: 2500
          })
          return
        }
      }
      warehousing(this.detalList).then(res => {
        this.sutmitDetailLoading = false
        this.$refs[id].doClose()
        this.dialog = false
        this.visible = false
        this.init()
        this.$notify({
          title: '确认入库成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.sutmitDetailLoading = false
        console.log(err.response.data.message)
      })
    },
    doAdd(form){
      this.form.scanNumber = ''
      add(form).then(res => {
        this.isAnd = 2
        this.form.scanNumber = res.scanNumber
        this.form.warehousingStatus = res.warehousingStatus
        this.form.id = res.id
        this.form.createDate = res.createDate
        this.form.warehousingDate = res.warehousingDate
        this.form.createUser = res.createUser
        this.form.invalid = res.invalid
        this.init()
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    doEdit(form){
      form.totalPrice = this.formTotalPrice
      edit(form).then(res => {
        this.init()
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    sum(data) {
      data.totalPrice = (data.warehousingNumber * data.price).toFixed(2)
      this.buttonType()
    },
    buttonType(){
      this.typeButton = 'danger'
    },
    isDriverMain(quer) {
      if (quer != null && quer != '') {
        if (quer === this.form.escortOne || quer === this.form.escortTwo || quer === this.form.driverDeputy) {
          this.$notify({
            title: '司机与押运重复',
            type: 'warning',
            duration: 2500
          })
          if (this.form.driverMain === quer) {
            this.form.driverMain = ''
          }
          return
        }
      }

      this.typeButton = 'danger'
    },
    isDriverDeputy(quer) {
      if (quer != null && quer != '') {
        if (quer === this.form.escortOne || quer === this.form.escortTwo || quer === this.form.driverMain) {
          this.$notify({
            title: '司机与押运重复',
            type: 'warning',
            duration: 2500
          })
          if (this.form.driverMain === quer) {
            this.form.driverDeputy = ''
          }
          return
        }
      }

      this.typeButton = 'danger'
    },
    isEscortOne(quer) {
      console.log(quer)
      if (quer != null && quer != '') {
        if (quer === this.form.driverMain || quer === this.form.driverDeputy || quer === this.form.escortTwo) {
          this.$notify({
            title: '司机与押运重复',
            type: 'warning',
            duration: 2500
          })
          if (this.form.escortOne === quer) {
            this.form.escortOne = ''
          }
          return
        }
      }

      this.typeButton = 'danger'
    },
    isEscortTwo(quer) {
      if (quer != null && quer != '') {
        if (quer === this.form.driverMain || quer === this.form.driverDeputy || quer === this.form.escortOne) {
          this.$notify({
            title: '司机与押运重复',
            type: 'warning',
            duration: 2500
          })
          if (this.form.escortTwo === quer) {
            this.form.escortTwo = ''
          }
          return
        }
      }

      this.typeButton = 'danger'
    },
    tableDetailList(data) {
      this.detaLoading = true
      this.detalList = []
      var params = { 'scanNumber': data.scanNumber }
      warehousingDetaliList(params).then(res => {
        this.detalList = res
        this.detaLoading = false
        //this.dataiList(this.form.scanNumber)
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
          this.formTotalPrice = sums[index]
          sums[index] += ' 元'
        }
      })
      return sums
    },
    popoverClose(id) {
      this.sutmitDetailLoading = false
      this.$refs[id].doClose()
    },
    // 查询运输的下拉列表
    transporterRemoteMethod(query) {
      // 运输部deptId为18
      const idList = [18]
      const params = { deptIdList: idList + '', realname: query }
      this.userLoading = true
      getUserListByDeptId(params).then(res => {
        this.userLoading = false
        this.userList = res
        this.userOptions = this.userList.filter(item => {
          return item.realname.toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        })
      })
    },
    // 查询车牌号的下拉列表
    carMethod(query) {
      this.customerCodeLoading = false
      if (query !== '') {
        this.carLoading = true
        this.carQuery.carNumber = query
        this.carOptions = []
        getCarList(this.carQuery).then(res => {
          this.carLoading = false
          this.carList = res
          this.typeButton = 'danger'
          this.carQuery.code = ''
          this.carOptions = this.carList.filter(item => {
            return item
          })
        })
      } else {
        this.customerOptions = []
      }
    },
    // 查询客户编号的下拉列表
    customerCodeMethod(query) {
      this.customerCodeLoading = false
      if (query !== '') {
        this.customerCodeLoading = true
        this.customerQuery.code = query
        this.customerCodeOptions = []
        getCustomerList(this.customerQuery).then(res => {
          this.customerCodeLoading = false
          this.customerList = res
          this.typeButton = 'danger'
          this.customerQuery.code = ''
          this.customerCodeOptions = this.customerList.filter(item => {
            return item
          })
        })
      } else {
        this.customerOptions = []
      }
    },
    // 查询客户名称的下拉列表
    customerRemoteMethod(query) {
      if (query !== '') {
        this.customerLoading = true
        this.customerQuery.name = query
        this.customerOptions = []
        getCustomerList(this.customerQuery).then(res => {
          this.customerLoading = false
          this.customerQuery.name = ''
          this.typeButton = 'danger'
          this.customerList = res
          this.customerOptions = this.customerList.filter(item => {
            return item
          })
        })
      } else {
        this.customerOptions = []
      }
    },
    // 输入客户名称自动填入客户编号
    setCustomerId(event) {
      let obj = []
      obj = this.customerOptions.find((item) => {
        return item.name === event
      })
      if (obj == [] || obj == null) {
        obj = this.customerCodeOptions.find((item) => {
          return item.code === event
        })
      }
      this.form.supplierId = obj.id
      this.form.supplierName = obj.name
      this.form.supplierCode = obj.code
    },
    setProdId(event) {
      let obj = []
      obj = this.prodOptions.find((item) => {
        return item.name === event
      })
      if (obj == [] || obj == null) {
        obj = this.prodModelOptions.find((item) => {
          return item.model === event
        })
      }
      this.tableForm.prodId = obj.id
      this.tableForm.prodName = obj.name
      this.tableForm.prodModel = obj.model
    },
    resetForm() {
      this.form = {
        id: '',
        createUser: '',
        totalPrice: '',
        scanNumber: '',
        warehousingDate: '',
        supplierName: '',
        batchNumber: '',
        warehousingStatus: '',
        remark: '',
        driverMain: '',
        driverDeputy: '',
        escortOne: '',
        escortTwo: '',
        carNumber: ''
      }
    }
  }
}

</script>

<style scoped>

</style>
