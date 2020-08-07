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
        v-model="checkInvalidQuery"
        @change="toQuery"
      >查询失效单</el-checkbox>
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
    <eForm ref="form" />
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      :summary-method="getDataSummaries"
      size="small"
      show-summary
      style="width: 100%;"
    >
      <el-table-column prop="scanNumber" label="出库单号"/>
      <el-table-column prop="customerName" label="客户名称"/>
      <el-table-column prop="customerCode" label="客户编号"/>
      <el-table-column prop="customerAddress" label="客户地址"/>
      <el-table-column prop="contacts" label="联系人"/>
      <el-table-column prop="contactPhone" label="联系电话"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column prop="totalPrice" label="总金额"/>
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
          <!--失效状态-->
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
          <!--<el-button
            v-permission="['admin','chemicalFiberDeliveryNote:edit']"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          >编辑</el-button>-->
          <el-button
            v-permission="['admin','chemicalFiberDeliveryNote:edit']"
            v-if="scope.row.invalid == 1"
            size="mini"
            type="primary"
            icon="el-icon-tickets"
            @click="unInvalid(scope.row.id)"
            @click.stop
          >设为生效</el-button>
          <el-button
            v-permission="['admin','chemicalFiberDeliveryNote:edit']"
            v-if="scope.row.invalid == 0"
            size="mini"
            type="warning"
            icon="el-icon-tickets"
            @click="doInvalid(scope.row.id)"
            @click.stop
          >设为失效</el-button>
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
        <el-form ref="form1" :model="form" size="mini" label-width="80px" >
          <el-form :inline="true" size="mini">
            <el-form-item label="客户编号">
              <el-select
                v-model="form.customerCode"
                :loading="customerCodeLoading"
                :remote-method="customerCodeMethod"
                multiple:false
                filterable
                remote
                reserve-keyword
                placeholder="输入客户编号关键词"
                style="width: 150px;"
                @change="setCustomerName($event)"
              >
                <el-option
                  v-for="item in customerCodeOptions"
                  :key="item.name"
                  :label="item.code"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="客户名称">
              <el-select
                v-model="form.customerName"
                :loading="customerLoading"
                :remote-method="customerRemoteMethod"
                multiple:false
                filterable
                remote
                reserve-keyword
                placeholder="输入客户关键词"
                style="width: 150px;"
                @change="setCustomerId($event)"
              >
                <el-option
                  v-for="item in customerOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="联系人员" >
              <el-input v-model="form.contacts" style="width: 150px;" @input="ButtonType"/>
            </el-form-item>
            <el-form-item label="客户电话" >
              <el-input v-model="form.contactPhone" style="width: 150px;" @input="ButtonType"/>
            </el-form-item>
            <el-form-item label="出库单号" >
              <el-input v-model="form.scanNumber" :disabled="true" style="width: 150px;" @input="ButtonType"/>
            </el-form-item>
          </el-form>
          <el-form :inline="true" size="mini">
            <el-form-item label="客户地址" >
              <el-input v-model="form.customerAddress" style="width: 382px;" @input="ButtonType"/>
            </el-form-item>
            <el-form-item label="仓管人员">
              <el-select
                v-model="form.storeKeeper"
                :loading="userLoading"
                :remote-method="storeKeeperRemoteMethod"
                multiple:false
                filterable
                remote
                reserve-keyword
                placeholder="输入仓管员关键词"
                style="width: 150px;"
                @change="ButtonType"
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
            <el-form-item label="业务人员" >
              <el-select
                v-model="form.seller"
                :loading="userLoading"
                :remote-method="sellerRemoteMethod"
                multiple:false
                filterable
                remote
                reserve-keyword
                placeholder="输入业务员关键词"
                style="width: 150px;"
                @change="ButtonType"
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
            <el-form-item label="订单号码" >
              <el-input style="width: 150px;" @input="ButtonType"/>
            </el-form-item>
          </el-form>
          <el-form :inline="true" size="mini">
            <el-form-item label="交货日期" >
              <el-date-picker v-model="form.deliveryDate" type="date" placeholder="选择日期时间" style="width: 150px;" maxlength="15" @change="ButtonType"/>
            </el-form-item>
            <el-form-item label="主 司 机" >
              <el-select
                v-model="form.driverMain"
                :loading="userLoading"
                :remote-method="transporterRemoteMethod"
                multiple:false
                filterable
                remote
                reserve-keyword
                placeholder="输入主司机关键词"
                style="width: 157px;"
                @change="ButtonType"
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
            <el-form-item label="装载员1" >
              <el-select
                v-model="form.loaderOne"
                :loading="userLoading"
                :remote-method="transporterRemoteMethod"
                multiple:false
                filterable
                remote
                reserve-keyword
                placeholder="输入装卸员1关键词"
                style="width: 156px;"
                @change="ButtonType"
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
            <el-form-item label="付款方式" >
              <el-input v-model="form.payment" style="width: 150px;" @input="buttonType"/>
            </el-form-item>
            <el-form-item label="最新欠款" >
              <el-input v-model="form.balance" :disabled="true" style="width: 150px;" @input="buttonType"/>
            </el-form-item>
          </el-form>
          <el-form :inline="true" size="mini"/>
          <el-form :inline="true" size="mini">
            <el-form-item label="车 牌 号" >
              <el-input v-model="form.carNumber" style="width: 158px;" @input="buttonType"/>
            </el-form-item>
            <el-form-item label="副 司 机" >
              <el-select
                v-model="form.driverDeputy"
                :loading="userLoading"
                :remote-method="transporterRemoteMethod"
                multiple:false
                filterable
                remote
                reserve-keyword
                placeholder="输入副司机关键词"
                style="width: 158px;"
                @change="buttonType"
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
            <el-form-item label="装载员2" >
              <el-select
                v-model="form.loaderTwo"
                :loading="userLoading"
                :remote-method="transporterRemoteMethod"
                multiple:false
                filterable
                remote
                reserve-keyword
                placeholder="输入装卸员2关键词"
                style="width: 156px;"
                @change="buttonType"
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
            <el-form-item label="备 注" >
              <el-input v-model="form.remark" style="width: 403px;" @input="buttonType"/>
            </el-form-item>
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
          highlight-current-row
          row-key="id"
          @current-change="handleCurrentChange"
        >
          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="50px"/>
          <el-table-column prop="prodModel" label="产品编号" align="center" width="100px"/>
          <el-table-column prop="prodName" label="产品名称" align="center" width="150px"/>
          <el-table-column prop="unit" label="单位" width="100px" align="center">
            <template slot-scope="scope">
              <!-- <el-input v-model="scope.row.unit" placeholder="请输入单位"/> -->
              <el-select v-model="scope.row.unit" placeholder="请选择单位" @change="buttonType">
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
              <el-input v-model="scope.row.totalNumber" :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true" :min="0" type="number" @input = "sum(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="realQuantity" label="实收数量" width="100px" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.realQuantity" :disabled="form.noteStatus == 4 || form.noteStatus == 5?true : false" :min="0" type="number" @input = "sum(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="sellingPrice" label="单价" width="130px" align="center">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.sellingPrice"
                :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true"
                :min="0"
                type="number"
                class = "login-form-input"
                @input = "sum(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="预计金额" width="120px" align="center"/>
          <el-table-column prop="realPrice" label="应收金额" width="120px" align="center"/>
          <el-table-column prop="remark" label="备注" width="250px" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="备注" @input="buttonType"/>
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkPermission(['admin','chemicalFiberDeliveryDetail:edit','chemicalFiberDeliveryDetail:del'])
            && (form.noteStatus == 1 || form.noteStatus == 2 )"
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
                    @click="delNoteDetail(scope.row.id)"
                  >确定</el-button>
                </div>
                <el-button slot="reference" type="warning" icon="el-icon-delete" size="mini">删除</el-button>
              </el-popover>
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
        <el-button v-if="form.invalId == 0" :loading="loading" :type="typeButton" icon="el-icon-edit" @click="addAll">保存</el-button>
        <el-button v-if="form.noteStatus == 0 && form.invalId == 1" @click="addTable" >添加产品</el-button>
        <el-button v-if="form.invalId == 0 && form.noteStatus == 1 || form.noteStatus == 2 " :loading="downloadLoading" type="primary" @click="exportDelivery()">导出送货单</el-button>
        <el-popover
          :ref="form.id"
          placement="top"
        >
          <p>是否发货</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popoverClose(form.id)">取消</el-button>
            <el-button
              :loading="sutmitDetailLoading"
              type="primary"
              size="mini"
              @click="sendOut(form.id)"
            >确定</el-button>
          </div>
          <el-button slot="reference" :disabled="form.noteStatus != 2 ? true : false" :type="form.noteStatus != 2 ? 'info' : 'success'" icon="el-icon-truck">发货</el-button>
        </el-popover>
        <el-popover
          :ref="tableForm.customerName"
          placement="top"
        >
          <p>确认签收前，请确认回填信息</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popoverClose(tableForm.customerName)">取消</el-button>
            <el-button
              :loading="sutmitDetailLoading"
              type="primary"
              size="mini"
              @click="recived(form.id)"
            >确定</el-button>
          </div>
          <el-button slot="reference" :disabled="form.noteStatus != 3 ? true : false" :type="form.noteStatus != 3 ? 'info' : 'warning'" icon="el-icon-suitcase">签收</el-button>
        </el-popover>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>

      <el-dialog
        :visible.sync="addTableFrom"
        :append-to-body = "true"
        width="40%"
        title="添加产品" >
        <el-form :model="tableForm" size="mini" label-width="80px" >
          <el-form-item label="产品搜索" >
            <el-select
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
                :label="item.prodName"
                :value="item.prodName"
                @blur="prodOptions"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="产品型号" >
            <el-input v-model="tableForm.prodModel" :disabled="true" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="产品名称" >
            <el-input v-model="tableForm.prodName" :disabled="true" style="width: 370px;"/>
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
import { edit, editList, getChemicalFiberDeliveryDetailsList, addTableRow, delDetail } from '@/api/chemicalFiberDeliveryDetail'
import { parseTime, downloadFile, downloadFileWhithScanNumber } from '@/utils/index'
import { getUserListByDeptId } from '@/api/user'
import { add, editAll, doInvalid, unInvalid } from '@/api/chemicalFiberDeliveryNote'
import { getCustomerList, getCustomerLists } from '@/api/customer'
import { getSelectMap, getByProdName } from '@/api/chemicalFiberStock'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      dateQuery: '',
      checkInvalidQuery: false,
      delLoading: false,
      dialogVisible: false,
      detailLoading: false,
      sutmitDetailLoading: false,
      customerLoading: false,
      userLoading: false,
      customerCodeLoading: false,
      addTableFrom: false,
      isAdd: '',
      customerOptions: [],
      customerCodeOptions: [],
      userOptions: [],
      prodOptions: [],
      prods: [],
      typeButton: '',
      visible: false,
      sumRealQuantity: '',
      id: '',
      form: {
        id: '',
        searchName: '',
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
        realPrice: '',
        noteStatus: '',
        sendOutFlag: '',
        invalid: ''
      },
      customerForm: {
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
        realPrice: '',
        noteStatus: ''
      },
      tableForm: {
        detailNumber: '',
        prodModel: '',
        prodName: '',
        scanNumber: '',
        searchName: '',
        unit: '',
        sellingPrice: '',
        remark: '',
        totalNumber: '',
        realQuantity: '',
        realPrice: '',
        totalPrice: '',
        id: '',
        customerName: ''
      },
      customerQuery: {
        name: '',
        code: ''
      },
      customerQueryName: {
        name: ''
      },
      customerQueryCode: {
        code: ''
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
        2: '待发货',
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
      const checkInvalidQurey = this.checkInvalidQuery
      if (type && value) { this.params[type] = value }
      this.params['queryWithInvalid'] = checkInvalidQurey
      if (dateQuery) {
        this.params['tempStartTime'] = dateQuery[0].getTime()
        this.params['tempEndTime'] = dateQuery[1].getTime()
      }
      return true
    },
    sendOut(id) {
      var notNullFalg = true
      for (var i = 0; i < this.detailList.length; i++) {
        if (this.detailList[i].totalNumber == '' || this.detailList[i].totalNumber == 0 || this.detailList[i].totalNumber == null) {
          notNullFalg = false
          break
        }
        if (this.detailList[i].sellingPrice == '' || this.detailList[i].sellingPrice == 0 || this.detailList[i].sellingPrice == null) {
          notNullFalg = false
          break
        }
      }
      if (!notNullFalg) {
        // 有空值，不允许打印
        this.$notify({
          title: '请补充产品相关信息',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (this.typeButton == 'danger') {
        this.$notify({
          title: '请先保存',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.sutmitDetailLoading = true
      sendOut(id).then(res => {
        this.sutmitDetailLoading = false
        this.$refs[this.form.id].doClose()
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
      if (this.typeButton == 'danger') {
        this.$notify({
          title: '请先保存',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.sutmitDetailLoading = true
      recived(id).then(res => {
        this.sutmitDetailLoading = false
        this.$refs[this.tableForm.customerName].doClose()
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
    initDetail() {
      var params = { 'scanNumber': this.form.scanNumber }
      this.detailLoading = true
      getChemicalFiberDeliveryDetailsList(params).then(res => {
        this.detailList = res
        this.detailLoading = false
      })
    },
    delNoteDetail(id) {
      this.sutmitDetailLoading = true
      delDetail(id).then(res => {
        this.sutmitDetailLoading = false
        this.$refs[id].doClose()
        this.initDetail()
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
    // 新增按钮的弹出事件
    add() {
      this.isAdd = 1
      this.resetForm()
      this.dialogVisible = true
      this.detailLoading = false
      this.detailList = []
      this.buttonType()
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
    // 点击添加产品的弹出框并清空里面的数据
    addTable() {
      this.tableForm = {
        prodName: ''
      }
      this.form.searchName = ''
      this.prods = []
      this.addTableFrom = true
    },
    // 传添加产品数据给后端
    addTableRow() {
      this.tableForm = {
        detailNumber: this.detailList.length + 1,
        prodModel: this.tableForm.prodModel,
        prodName: this.tableForm.prodName,
        scanNumber: this.form.scanNumber,
        unit: '吨',
        sellingPrice: this.tableForm.sellingPrice,
        remark: this.tableForm.remark,
        totalNumber: this.tableForm.totalNumber,
        realQuantity: this.tableForm.realQuantity,
        customerName: this.form.customerName,
        totalPrice: this.tableForm.totalPrice,
        realPrice: this.tableForm.realPrice
      }
      if (!this.tableForm.prodModel == '' && !this.tableForm.prodName == '') {
        addTableRow(this.tableForm).then(res => {
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.addTableFrom = true
          this.buttonType()
          this.dataiList(this.form.scanNumber)
          this.addTableFrom = false
          this.$parent.init()
        }).catch(err => {
          this.addTableFrom = false
          console.log(err.response.data.message)
        })
        this.addTableFrom = false
      } else {
        this.$notify({
          title: '请选择产品',
          type: 'warning',
          duration: 2500
        })
      }
    },
    // 添加成功后关联产品数据到送货单
    dataiList(scanNumber) {
      var params = { 'scanNumber': scanNumber }
      getChemicalFiberDeliveryDetailsList(params).then(res => {
        // this.detailList = res
        this.detailList = []
        var data = []
        for (var i = 0; i < res.length; i++) {
          var obj = {}
          obj.prodModel = res[i].prodModel
          obj.id = res[i].id
          obj.prodName = res[i].prodName
          obj.scanNumber = res[i].scanNumber
          obj.unit = res[i].unit
          obj.sellingPrice = res[i].sellingPrice
          obj.remark = res[i].remark
          obj.totalNumber = res[i].totalNumber
          obj.realQuantity = res[i].realQuantity
          obj.totalPrice = res[i].totalPrice
          obj.realPrice = res[i].realPrice
          data[i] = obj
        }
        this.detailLoading = false
        this.detailList = data
      })
      // this.$set(this.detailList,res[i].prodModel,this.detailList.prodModel)
      this.detailLoading = true
    },
    handleNodeClick(data) {
      this.tableForm.prodName = data.prodName
      this.tableForm.prodModel = data.prodModel
    },
    // 取消按钮触发事件
    popoverClose(id) {
      this.$refs[id].doClose()
    },
    // 把详情的数据传给后端
    addAll() {
      // 判断客户Id不为空才进行下一步
      if (this.form.customerId === null) {
        this.$notify({
          title: '请选择客户',
          type: 'warning',
          duration: 2500
        })
        return
      }
      // 后期可能要修改上面已经有判断了
      if (this.form.customerId != '') {
        this.id = this.form.customerId
      }
      this.customerForm = {
        id: this.form.id,
        scanNumber: this.form.scanNumber,
        customerId: this.id,
        customerName: this.form.customerName,
        customerCode: this.form.customerCode,
        customerAddress: this.form.customerAddress,
        contacts: this.form.contacts,
        contactPhone: this.form.contactPhone,
        totalPrice: this.sumRealQuantity,
        remark: this.form.remark,
        seller: this.form.seller,
        storeKeeper: this.form.storeKeeper,
        createDate: this.form.createDate,
        createUser: this.form.createUser,
        carNumber: this.form.carNumber,
        deliveryDate: this.form.deliveryDate,
        driverMain: this.form.driverMain,
        driverDeputy: this.form.driverDeputy,
        state: this.form.state,
        loaderOne: this.form.loaderOne,
        loaderTwo: this.form.loaderTwo,
        balance: this.form.balance,
        payment: this.form.payment,
        realPrice: this.form.realPrice,
        noteStatus: this.form.noteStatus,
        totalNumber: this.form.totalNumber,
        realQuantity: this.form.realQuantity
      }
      if (this.isAdd == 1) {
        this.doAdd(this.customerForm)
      }
      // form表单保存
      // this.doEdit(this.customerForm)
      var ifNull = true
      // 循环列表里面的数据判断
      for (var i = 0; i < this.detailList.length; i++) {
        // 判断是否有写计划数量
        if (this.detailList[i].totalNumber == '' || this.detailList[i].totalNumber == 0 || this.detailList[i].totalNumber == null) {
          ifNull = false
          this.$notify({
            title: '请填写计划数量',
            type: 'warning',
            duration: 2500
          })
          break
        }
        // 判断是否有写单价
        if (this.detailList[i].sellingPrice == '' || this.detailList[i].sellingPrice == 0 || this.detailList[i].sellingPrice == null) {
          ifNull = false
          this.$notify({
            title: '请填写单价',
            type: 'warning',
            duration: 2500
          })
          break
        }
        // 判断实际数量是否为空，为空赋值0
        if (this.detailList[i].realQuantity == '' || this.detailList[i].realQuantity == null) {
          this.detailList[i].realQuantity = 0
        }
        // 判断最后一次并没有空值才进行修改
        if (i < this.detailList.length && ifNull == true) {
          editList(this.detailList).then(res => {
            if (this.isAdd == 2) {
              this.doEdit(this.customerForm)
            }
            this.init()
            this.detailLoading = false
          })
        }
      }
      if (this.isAdd == 2) {
        this.doEdit(this.customerForm)
      }
      // 可能要改因为修改错误肯也很显示保存成功
      if (ifNull) {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        this.typeButton = 'success'
      }
    },
    // 显示详情列表的数据
    detail(data) {
      this.isAdd = 2
      this.typeButton = 'success'
      this.form = {
        id: data.id,
        customerName: data.customerName,
        customerAddress: data.customerAddress,
        scanNumber: data.scanNumber,
        contactPhone: data.contactPhone,
        contacts: data.contacts,
        createDate: data.createDate,
        customerCode: data.customerCode,
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
        balance: data.balance,
        remark: data.remark,
        invalId: data.invalId
      }
      // 查询详情列表数据
      var params = { 'scanNumber': data.scanNumber }
      getChemicalFiberDeliveryDetailsList(params).then(res => {
        this.detailLoading = false
        var data = []
        for (var i = 0; i < res.length; i++) {
          var obj = {}
          obj.prodModel = res[i].prodModel
          obj.prodName = res[i].prodName
          obj.scanNumber = res[i].scanNumber
          obj.unit = res[i].unit
          obj.id = res[i].id
          obj.sellingPrice = res[i].sellingPrice
          obj.remark = res[i].remark
          obj.totalNumber = res[i].totalNumber
          obj.realQuantity = res[i].realQuantity
          obj.totalPrice = res[i].totalPrice
          obj.realPrice = res[i].realPrice
          data[i] = obj
        }
        this.detailList = res
      })
      this.detailLoading = true
      this.dialogVisible = true
    },
    doInvalid(id) {
      doInvalid(id).then(res => {
        this.sutmitDetailLoading = false
        this.$refs[this.form.id].doClose()
        this.dialogVisible = false
        this.init()
        this.$notify({
          title: '状态设置为失效',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.sutmitDetailLoading = false
        console.log(err.response.data.message)
      })
    },
    unInvalid(id) {
      this.sutmitDetailLoading = true
      unInvalid(id).then(res => {
        this.sutmitDetailLoading = false
        this.init()
        this.$notify({
          title: '状态设置为生效',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.sutmitDetailLoading = false
        console.log(err.response.data.message)
      })
    },
    handleCurrentChange(val) {
      this.currentChangeItem = val
    },
    // 触发输入框后自动计算预计金额和实际金额
    sum(data) {
      // this.typeButton = 'danger'
      this.buttonType()
      if (data.totalNumber == '' || data.totalNumber == 0) {
        this.$notify({
          title: '请填写计划数量',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.detailLoading = true
      // 判断实际数量不为空时预计金额也是实际金额
      /* if (data.realQuantity == '' || data.realQuantity == 0 || data.realQuantity == null) {
        data.totalPrice = data.totalNumber * data.sellingPrice
        data.realPrice = data.realQuantity * data.sellingPrice
      } else {
        data.totalPrice = data.realQuantity * data.sellingPrice
        data.realPrice = data.realQuantity * data.sellingPrice
      }*/
      data.totalPrice = (data.totalNumber * data.sellingPrice).toFixed(2)
      data.realPrice = (data.realQuantity * data.sellingPrice).toFixed(2)
      this.detailLoading = false
    },
    // 改变保存按钮的状态方法
    buttonType() {
      this.typeButton = 'danger'
    },
    // 单号列表的合计显示
    getDataSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
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
      return sums
    },
    // 详情列表的合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
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
        this.sumRealQuantity = sums[index]
      })
      return sums
    },
    // 导出送货单
    exportDelivery() {
      if (this.typeButton == 'danger') {
        this.$notify({
          title: '请先保存',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (this.form.customerName === null) {
        this.$notify({
          title: '请返回填写客户信息',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (this.detailList.length < 1) {
        this.$notify({
          title: '请添加产品',
          type: 'warning',
          duration: 2500
        })
        return
      }
      var notNullFalg = true
      for (var i = 0; i < this.detailList.length; i++) {
        if (this.detailList[i].totalNumber == '' || this.detailList[i].totalNumber == 0 || this.detailList[i].totalNumber == null) {
          notNullFalg = false
          break
        }
        if (this.detailList[i].sellingPrice == '' || this.detailList[i].sellingPrice == 0 || this.detailList[i].sellingPrice == null) {
          notNullFalg = false
          break
        }
      }
      if (!notNullFalg) {
        // 有空值，不允许打印
        this.$notify({
          title: '请补充产品相关信息',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.downloadLoading = true
      downloadDeliveryNote(this.form.id).then(result => {
        this.downloadLoading = false
        this.dialogVisible = false
        this.init()
        downloadFileWhithScanNumber(result, this.form.scanNumber + '送货单导出', 'xls')
      }).catch(() => {
        this.downloadLoading = false
        this.$notify({
          title: '请保存产品信息',
          type: 'warning',
          duration: 2500
        })
      })
    },
    kgformatter(row, column, cellValue, index) {
      return cellValue + ' KG'
    },
    // 输入客户名称自动填入客户编号
    setCustomerId(event) {
      this.customerQueryCode.code = event
      getCustomerList(this.customerQueryCode).then(res => {
        this.customerLists = res
        this.form.customerCode = event
        this.form.contacts = this.customerLists[0].contacts
        this.form.customerName = this.customerLists[0].name
        this.form.contactPhone = this.customerLists[0].contactPhone
        this.form.customerAddress = this.customerLists[0].address
        this.form.customerId = this.customerLists[0].id
        this.id = this.customerLists[0].id
        this.customerQueryCode.code = ''
      })
      this.buttonType()
    },
    // 输入客户编号自动填入客户名称
    setCustomerName(event) {
      this.customerQueryName.name = event
      getCustomerList(this.customerQueryName).then(res => {
        this.customerLists = res
        this.form.customerName = event
        this.form.customerCode = this.customerLists[0].code
        this.form.contacts = this.customerLists[0].contacts
        this.form.contactPhone = this.customerLists[0].contactPhone
        this.form.customerAddress = this.customerLists[0].address
        this.form.customerId = this.customerLists[0].id
        this.id = this.customerLists[0].id
        this.customerQueryName.name = ''
      })
      this.buttonType()
    },
    // 清空下拉框
    cleanUpOptions() {
      this.userOptions = []
      this.prodOptions = []
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
          this.customerQuery.code = ''
          this.customerCodeOptions = this.customerList.filter(item => {
            return item.code.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        })
      } else {
        this.customerOptions = []
      }
    },
    // 查询业务员的下拉列表
    sellerRemoteMethod(query) {
      // 业务员deptId为19
      const params = { deptId: 19, realname: query }
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
    // 查询仓管员的下拉列表
    storeKeeperRemoteMethod(query) {
      // 仓管员deptId为16
      const params = { deptId: 16, realname: query }
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
    // 查询产品把产品信息填入框
    fullWithProd(event) {
      const params = { prodName: event }
      getByProdName(params).then(res => {
        this.prodList = res
        this.tableForm.prodName = this.prodList[0].prodName
        this.tableForm.prodModel = this.prodList[0].prodModel
      })
    },
    // 查询产品下拉框
    prodRemoteMethod(query) {
      const params = { prodName: query }
      getSelectMap(params).then(res => {
        this.userLoading = false
        this.prodList = res
        this.prodOptions = this.prodList.filter(item => {
          return item.prodName
        })
      })
    },
    // 查询运输的下拉列表
    transporterRemoteMethod(query) {
      // 运输部deptId为18
      const params = { deptId: 18, realname: query }
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
    // 保存按钮，保存form表单数据
    doEdit(customerForm) {
      if (this.detailList.length == 0) {
        customerForm.totalPrice = 0
      }
      editAll(customerForm).then(res => {
        this.customerOptions = []
        this.customerOptions = []
        this.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    // 保存按钮，新增数据
    doAdd(customerForm) {
      customerForm.scanNumber = ''
      add(customerForm).then(res => {
        this.isAdd = 2
        this.form.scanNumber = res.scanNumber
        this.form.id = res.id
        this.form.noteStatus = 1
        this.form.customerId = res.customerId
        this.init()
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    // 清空form表单的数据
    resetForm() {
      this.form = {
        id: '',
        scanNumber: '',
        customerId: '',
        customerName: '',
        customerCode: '',
        customerAddress: '',
        contacts: '',
        contactPhone: '',
        totalCost: '',
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
        invalId: 0
      }
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
