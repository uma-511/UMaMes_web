<template>
  <div class="app-container">
    <!--<el-input
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
      class="el-range-editor&#45;&#45;small filter-item"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    />-->
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
    <div class="head-container">
      <el-table
        v-loading="loading"
        :data="data"
        size="small"
        style="width: 100%;"
      >
        <el-table-column prop="customerNumber" label="订单编号"align="center"/>
        <el-table-column prop="customerName" label="客户名称"align="center"/>
        <el-table-column prop="address" label="客户地址"align="center"/>
        <el-table-column prop="contacts" label="联系人"align="center"/>
        <el-table-column prop="contactPhone" label="联系电话"align="center"/>
        <el-table-column prop="createUser" label="制单人"align="center"/>
        <el-table-column prop="delFlag" label="状态"align="center">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag
                :type="typeMapping[scope.row.delFlag]"
                size="medium"
              >{{ typeValue[scope.row.delFlag] }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="warehousingDate" label="创建日期"align="center">
          <template slot-scope="scope">
            <span>{{ parseTimeToDate(scope.row.warehousingDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="240px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              icon="el-icon-tickets"
              @click="edit(scope.row)"
              @click.stop
            >编辑</el-button>
            <el-popover
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
            <el-form-item label="订单编号" >
              <el-input v-model="form.customerNumber" :disabled="true" style="width: 120px;" />
            </el-form-item>
            <el-form-item label="客户单号" >
              <el-input v-model="form.contactNumber"  style="width: 120px;" />
            </el-form-item>
            <el-form-item label="客户编号">
              <el-select
                v-model="form.code"
                :loading="customerLoading"
                :remote-method="customerCodeMethod"
                multiple:false
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
                v-model="form.customerName"
                :loading="customerLoading"
                :remote-method="customerRemoteMethod"
                multiple:false
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
            <el-form-item label="客户地址" >
              <el-input v-model="form.address"  style="width: 120px;" />
            </el-form-item>
            <el-form-item label="联系人" >
              <el-input v-model="form.contacts"  style="width: 120px;" />
            </el-form-item>
            <el-form-item label="联系电话" >
              <el-input v-model="form.contactPhone"  style="width: 120px;" />
            </el-form-item>
            <el-form-item label="客户传真" >
              <el-input v-model="form.fax"  style="width: 120px;" />
            </el-form-item>
            <el-form-item label="备注" >
              <el-input v-model="form.remark"  style="width: 120px;" />
            </el-form-item>
            <el-form-item label="交货日期" >
              <el-date-picker v-model="form.deviceDate"  type="date" placeholder="选择日期时间" style="width: 150px;" maxlength="15"/>
            </el-form-item>
            <!--<el-form-item label="创建日期" >
              <el-date-picker v-model="form.warehousingDate" type="date" placeholder="选择日期时间" style="width: 130px;" maxlength="15" />
            </el-form-item>-->
          </el-form>
        </el-form>
      </el-row>
      <el-row>
        <el-table
          v-loading="detaLoading"
          :data="detalList"
          style="width: 100%"
          max-height="300"
          highlight-current-row
          row-key="id"
        >
          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="50px"/>
          <el-table-column prop="number" label="订单编号" align="center" width="100px"/>
          <el-table-column prop="prodModel" label="产品编号" align="center" width="100px"/>
          <el-table-column prop="prodName" label="产品名称" align="center" width="120px"/>
          <el-table-column prop="prodColor" label="色号" align="center" width="120px"/>
          <el-table-column prop="prodFineness" label="规格" align="center" width="120px"/>
          <el-table-column prop="planNumber" label="计划数量(KG)" width="120px" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.planNumber"  :min="0" type="number" />
            </template>
          </el-table-column>
          <el-table-column prop="coreWeight" label="纸芯重量(KG)" width="120px" type="number" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.coreWeight"  :min="0" type="number" />
            </template>
          </el-table-column>
          <el-table-column prop="perBagNumber" label="每包个数" width="120px" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.perBagNumber"  :min="0" type="number" />
            </template>
          </el-table-column>
          <el-table-column prop="machineNumber" label="机台号" width="150px" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.machineNumber"  :min="0" type="number" />
            </template>
          </el-table-column>
          <el-table-column prop="factoryNumber" label="打印模板" width="150px" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.factoryNumber"  :min="0" type="number" />
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="产品备注" width="200px" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" :disabled="form.warehousingStatus == 2?true:false" placeholder="备注" />
            </template>
          </el-table-column>
          <el-table-column
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
                    @click="delProdction(scope.row)"
                  >确定</el-button>
                </div>
                <el-button slot="reference" type="warning" icon="el-icon-delete" size="mini">删除</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <span  slot="footer" class="dialog-footer">
        <el-button v-if="isAdd == false" @click="addTable" >添加产品</el-button>
        <el-button v-if="isAdd == false" :loading="exportCustomerOrderLoading" @click="exportCustomerOrder" >导出排产单</el-button>
        <el-button  @click="save" >保存</el-button>
        <el-button @click="dialog = false">取 消</el-button>
      </span>
      <el-dialog
        :visible.sync="addTableFrom"
        :append-to-body = "true"
        :close-on-click-modal="false"
        width="490px"
        title="添加产品" >
        <el-form ref="prodctionForm" :model="prodction" :inline="true" :rules="rules" size="mini" label-width="80px" >
            <el-form-item label="产品编号" prop="model">
              <el-autocomplete
                class="inline-input"
                v-model="prodction.model"
                :fetch-suggestions="prodctionModelRemoteMethod"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @change="setProdctionModel"
                @select="setProdctionModel"
                :debounce = 0
                style="width: 315px;"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="产品色号"  prop="color">
              <el-autocomplete
                class="inline-input"
                v-model="prodction.color"
                :fetch-suggestions="prodctionColorRemoteMethod"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @change="setProdction"
                @select="setProdction"
                :debounce = 0
                style="width: 315px;"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="产品规格" prop="fineness">
              <el-autocomplete
                class="inline-input"
                v-model="prodction.fineness"
                :fetch-suggestions="prodctionFinenessRemoteMethod"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @change="setProdction"
                @select="setProdction"
                :debounce = 0
                style="width: 315px;"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="计划数量" prop="planNumber">
              <el-input v-model="prodction.planNumber"  style="width: 120px;" >
                <template slot="append">KG</template>
              </el-input>
            </el-form-item>
            <el-form-item label="每包个数" prop="perBagNumber">
              <el-input v-model="prodction.perBagNumber"  style="width: 120px;" />
            </el-form-item>
            <el-form-item label="纸芯重量" prop="coreWeight">
              <el-input v-model="prodction.coreWeight"  style="width: 120px;" >
                <template slot="append">KG</template>
              </el-input>
            </el-form-item>
            <el-form-item label="机 台 号  " prop="machineNumber">
              <el-input v-model="prodction.machineNumber"  style="width: 120px;" />
            </el-form-item>
            <el-form-item label="标签模板" prop="factoryNumber">
              <el-input v-model="prodction.factoryNumber"  style="width: 120px;" >
              </el-input>
            </el-form-item>
            <el-form-item label="产品备注" prop="remark">
              <el-input v-model="prodction.remark"  style="width: 120px;" />
            </el-form-item>
        </el-form>

        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="addTableFrom = false">取消</el-button>
          <el-button type="primary" size="mini" @click="preservationProdction">保存</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>


</template>

<script>
import initData from '@/mixins/initData'
import { getCustomerList, getCustomerLists, getCustomerById } from '@/api/customer'
import { parseTime, downloadFile, downloadFileWhithScanNumber, parseTimeToDate } from '@/utils/index'
import { getProdction, addCustomerOrder, edit, del, exportCustomerOrder } from '@/api/chemicalFiberCustomerOrder'
import { getProdList, getProdListColor, getProdListFineness, addSave } from '@/api/chemicalFiberProduct'
import { addex, editPrductionList, delex } from '@/api/chemicalFiberProduction'
import { getUserListByDeptId } from '@/api/user'
export default {
  mixins: [initData],
  data() {
    return {
      loading: false, dialog: false, detaLoading: false,isAdd:false,dateQuery: '',customerCodeOptions:[],
      customerOptions: [],customerLoading:false,detalList: [],addTableFrom:false,prodctionLoading:false,
      prodctionOptions: [],required:false,exportCustomerOrderLoading:false,sutmitDetailLoading:false,
      queryTypeOptions: [
        { key: 'scanNumber', display_name: '入库单号' },
        { key: 'supplierName', display_name: '供应商' },

      ],
      form: {
        customerNumber:'',
        customerName: '',
        customerId: '',
        contactNumber: '',
        code: '',
        address: '',
        contacts: '',
        contactPhone: '',
        remark: '',
        status: '',
        id:'',
        warehousingDate: '',
        deviceDate: '',
        createUser: ''
      },
      prodction: {
        model: '',
        color:'',
        fineness: '',
        planNumber: '',
        perBagNumber: '',
        coreWeight: '',
        machineNumber: '',
        factoryNumber: '',
        remark: '',
        customerId: '',
        prodId: '',

      },
      customerQuery: {
        name: '',
        code: ''
      },
      prodctionQuery: {
        model: '',
        color: '',
        fineness: '',
        modelAccurate: '',
        colorAccurate: '',
        finenessAccurate: ''
      },
      rules: {
        color: [
          {
            required: true, message: '请输入产品颜色', trigger: 'blur'
          }
        ],
        fineness: [
          {
            required: true, message: '请输入产品规格', trigger: 'blur'
          }
        ],
        planNumber: [
          {
            required: true, message: '请输入计划数量', trigger: 'blur'
          }
        ],
        coreWeight: [
          {
            required: true, message: '请输入纸芯重量', trigger: 'blur'
          }
        ],
        factoryNumber: [
          {
            required: true, message: '请输入打印模板', trigger: 'blur'
          }
        ]
      },
      typeMapping: {
        0: '',
        1: 'danger',
      },
      typeValue: {
        0: '正常',
        1: '作废',
      }
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
    beforeInit() {
      this.url = 'api/chemicalFiberCustomerOrder'
      const sort = 'id,desc'
      this.params = {page: this.page, size: this.size, sort: sort}
      return true
    },
    getProdction(data) {
      this.detaLoading = true
      console.log(data)
      getProdction(data).then(res => {
        this.detalList = res
        this.detaLoading = false
      })
    },
    // 产品编号下拉框读取
    prodctionModelRemoteMethod(query, cb) {
      this.prodctionLoading = false
      if (query !== '') {
        this.prodctionLoading = true
        this.prodctionQuery.model = query
        var date = []
        getProdList(this.prodctionQuery).then(res => {
          this.prodctionLoading = false
          this.prodctionList = res
          this.prodctionQuery.model = ''
          for (var i = 0; i < res.length; i++) {
            var a  = {}
            a.value = res[i].model
            a.address = res[i].model
            date[i] = a
          }
          cb(date)
        })
      } else {
        this.prodctionOptions = []
      }
    },
    // 产品色号下拉框读取
    prodctionColorRemoteMethod(query, cb) {
      this.prodctionLoading = false
      if (query !== '') {
        this.prodctionLoading = true
        this.prodctionQuery.color = query
        var date = []
        getProdListColor(this.prodctionQuery).then(res => {
          this.prodctionLoading = false
          this.prodctionList = res
          this.prodctionQuery.color = ''
          for (var i = 0; i < res.length; i++) {
            var a  = {}
            a.value = res[i].color
            a.address = res[i].color
            date[i] = a
          }
          cb(date)
        })
      } else {
        this.prodctionOptions = []
      }
    },
    // 产品色号下拉框读取
    prodctionFinenessRemoteMethod(query, cb) {
      this.prodctionLoading = false
      if (query !== '') {
        this.prodctionLoading = true
        this.prodctionQuery.fineness = query
        var date = []
        getProdListFineness(this.prodctionQuery).then(res => {
          this.prodctionLoading = false
          this.prodctionList = res
          this.prodctionQuery.fineness = ''
          for (var i = 0; i < res.length; i++) {
            var a  = {}
            a.value = res[i].fineness
            a.address = res[i].fineness
            date[i] = a
          }

          cb(date)
        })
      } else {
        this.prodctionOptions = []
      }
    },
    createFilter(queryString) {
      return (date) => {
        return (date.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    setProdctionModel() {
      this.prodctionQuery.modelAccurate = this.prodction.model
      if (this.prodction.model != '') {
        getProdList(this.prodctionQuery).then(res => {
          if (res.length != 0) {
            this.$set(this.prodction,'color',res[0].color);
            this.$set(this.prodction,'fineness',res[0].fineness);
            this.$set(this.prodction,'coreWeight',res[0].coreWeight);
          }
          this.prodctionQuery.modelAccurate = ''
        })
      }
    },
    setProdction() {
      this.prodctionQuery.colorAccurate = this.prodction.color
      this.prodctionQuery.finenessAccurate = this.prodction.fineness
      if (this.prodction.color != '' && this.prodction.fineness != '' && this.prodction.color != null && this.prodction.fineness != null) {
        getProdList(this.prodctionQuery).then(res => {
          if (res.length != 0) {
            this.$set(this.prodction,'model',res[0].model);
            this.$set(this.prodction,'coreWeight',res[0].coreWeight);
          } else {
            this.$set(this.prodction,'model','');
            this.$set(this.prodction,'coreWeight','');
          }
          this.prodctionQuery.colorAccurate = ''
          this.prodctionQuery.finenessAccurate = ''
        })

      }

    },
    // 客户编号下拉框
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
            return item
          })
        })
      } else {
        this.customerOptions = []
      }
    },
    // 客户名称下拉框读取
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
            return item
          })
        })
      } else {
        this.customerOptions = []
      }
    },
    // 客户信息自动填入
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
      this.form.customerName = obj.name
      this.form.customerId = obj.id
      this.form.code = obj.code
      this.form.fax = obj.fax
      this.form.address = obj.address
      this.form.contacts = obj.contacts
      this.form.contactPhone = obj.contactPhone
    },
    // 客户编号下拉框读取
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
    // 打开新增
    add() {
      this.resetForm()
      this.isAdd = true
      this.detalList = []
      this.dialog = true
    },
    // 打开编辑
    edit(data) {
      /*if (this.$refs.form !== undefined ) {
        this.$refs.form.resetFields()
      }*/
      this.resetForm()
      this.isAdd = false
      this.form.id = data.id
      this.form.customerNumber = data.customerNumber
      this.form.customerId = data.customerId
      this.form.customerName = data.customerName
      this.form.contactNumber = data.contactNumber
      this.form.code = data.code
      this.form.address = data.address
      this.form.contacts = data.contacts
      this.form.contactPhone = data.contactPhone
      this.form.remark = data.remark
      this.form.fax = data.fax
      this.form.warehousingDate = data.warehousingDate
      this.form.deviceDate = data.deviceDate
      this.form.createUser = data.createUser
      this.dialog = true
      this.getProdction(data)
      this.init()
    },
    // 打开添加产品
    addTable() {
     /* this.$refs['prodctionForm'].validate((valid) => {
        if (valid) {*/
     if (this.$refs.prodctionForm !== undefined ) {
       this.$refs.prodctionForm.resetFields()
     }
      this.required = false
      this.prodction = {}
      this.addTableFrom = true
       /* }
      })*/
    },
    // 保存按钮
    save() {
      if (this.isAdd) {
        addCustomerOrder(this.form).then(res => {
          this.isAdd = false
          this.form.customerNumber = res.customerNumber
          this.form.customerId = res.customerId
          this.form.customerName = res.customerName
          this.form.code = res.code
          this.form.address = res.address
          this.form.contacts = res.contacts
          this.form.contactPhone = res.contactPhone
          this.form.remark = res.remark
          this.form.status = res.status
          this.form.id = res.id
          this.form.deviceDate = res.deviceDate
          this.form.createUser = res.createUser
          this.form.warehousingDate = res.warehousingDate
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.isAdd = false
          this.init()
        })
      } else {
        edit(this.form).then(res => {
          editPrductionList(this.detalList).then(res => {
            this.$notify({
              title: '保存成功',
              type: 'success',
              duration: 2500
            })
            this.init()
          })
        })
      }
    },
    // 保存产品信息
    preservationProdction() {
      this.$refs['prodctionForm'].validate((valid) => {
         if (valid) {
           this.prodction.name = 'PP Yarn'
           addSave(this.prodction).then(res => {
             this.prodction.customerId = this.form.customerId
             this.prodction.customerOrderNumber = this.form.customerNumber
             this.prodction.prodId = res.id
             addex(this.prodction).then(res => {
               this.getProdction(this.form)
               this.addTableFrom = false
               this.$notify({
                 title: '添加成功',
                 type: 'success',
                 duration: 2500
               })
             })
           })
         }
      })
    },
    subDelete(id) {
      del(id).then( res => {
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
        this.init()

      })
    },
    delProdction(data) {
      this.sutmitDetailLoading = true
      delex(data.id).then(res=>{
        this.sutmitDetailLoading = false
        this.$refs[data.id].doClose()
        const t = {
          customerNumber: data.customerOrderNumber
        }
        this.getProdction(t)
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
        this.init()
      })
    },
    exportCustomerOrder() {
      exportCustomerOrder(this.form.id).then(result => {
        //this.exportStatementLoading = false
        downloadFile(result, '排产单导出', 'xls')
      }).catch(() => {
        this.exportStatementLoading = false
      })
    },
    resetForm() {
      if (this.$refs.form !== undefined ) {
        this.$refs.form.resetFields()
      }
      this.form = {
        id:'',
        customerNumber:'',
        customerName: '',
        customerId: '',
        code: '',
        address: '',
        contacts: '',
        contactPhone: '',
        contactNumber: '',
        remark: '',
        status: '',
        fax: '',
        warehousingDate: '',
        deviceDate: '',
        createUser : ''
      }
    },
    // 取消按钮触发事件
    popoverClose(id) {
      this.$refs[id].doClose()
    }
  }



}
</script>

<style>

</style>
