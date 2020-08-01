<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    width="500px"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="出库单号">
        <el-input v-model="form.scanNumber" :disabled="true" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="客户编号">
        <el-select
          v-model="form.customerCode"
          :loading="customerCodeLoading"
          :remote-method="customerCodeMethod"
          multiple:false
          filterable
          remote
          reserve-keyword
          placeholder="请输入客户编号关键词"
          style="width: 370px;"
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
          placeholder="请输入客户名称关键词"
          style="width: 370px;"
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
      <el-form-item label="业务员">
        <el-select
          v-model="form.seller"
          :loading="userLoading"
          :remote-method="sellerRemoteMethod"
          multiple:false
          filterable
          remote
          reserve-keyword
          placeholder="请输入业务员名称关键词"
          style="width: 370px;"
          @focus="cleanUpOptions"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.realname"
            :label="item.realname"
            :value="item.realname"
          />
        </el-select>
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
          style="width: 370px;"
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
      <!-- <el-form-item label="客户id" >
        <el-input v-model="form.customerId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="客户名称" >
        <el-input v-model="form.customerName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="客户编号" >
        <el-input v-model="form.customerCode" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="客户地址" >
        <el-input v-model="form.customerAddress" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="联系人" >
        <el-input v-model="form.contacts" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="联系电话" >
        <el-input v-model="form.contactPhone" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="总成本" prop="totalCost">
        <el-input-number :min="0.1" v-model="form.totalCost" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="总价" prop="totalPrice">
        <el-input-number :min="0.1" v-model="form.totalPrice" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="业务员">
        <el-input v-model="form.seller" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="仓管员">
        <el-input v-model="form.storeKeeper" style="width: 370px;"/>
      </el-form-item>-->
      <el-form-item label="车牌号码" prop="carNumber">
        <el-input v-model="form.carNumber" style="width: 370px;" maxlength="15"/>
      </el-form-item>
      <el-form-item label="交货日期" prop="deliveryDate">
        <el-date-picker v-model="form.deliveryDate" type="datetime" placeholder="选择日期时间" style="width: 370px;" maxlength="15"/>
      </el-form-item>
      <el-form-item label="主司机">
        <el-select
          v-model="form.driverMain"
          :loading="userLoading"
          :remote-method="transporterRemoteMethod"
          multiple:false
          filterable
          remote
          reserve-keyword
          placeholder="请输入主司机名称关键词"
          style="width: 370px;"
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
      <el-form-item label="副司机">
        <el-select
          v-model="form.driverDeputy"
          :loading="userLoading"
          :remote-method="transporterRemoteMethod"
          multiple:false
          filterable
          remote
          reserve-keyword
          placeholder="请输入副司机名称关键词"
          style="width: 370px;"
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
      <el-form-item label="装卸员1">
        <el-select
          v-model="form.loaderOne"
          :loading="userLoading"
          :remote-method="transporterRemoteMethod"
          multiple:false
          filterable
          remote
          reserve-keyword
          placeholder="请输入装卸员1名称关键词"
          style="width: 370px;"
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
      <el-form-item label="装卸员2">
        <el-select
          v-model="form.loaderTwo"
          :loading="userLoading"
          :remote-method="transporterRemoteMethod"
          multiple:false
          filterable
          remote
          reserve-keyword
          placeholder="请输入装卸员2名称关键词"
          style="width: 370px;"
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
      <el-form-item label="备注">
        <el-input v-model="form.remark" style="width: 370px;"/>
      </el-form-item>
      <!-- <el-form-item label="制单日期" >
        <el-date-picker v-model="form.createDate" type="datetime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="制单人" >
        <el-input v-model="form.createUser" style="width: 370px;"/>
      </el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/chemicalFiberDeliveryNote'
import { getCustomerList } from '@/api/customer'
import { getUserListByDeptId } from '@/api/user'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
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
        loaderTwo: ''
      },
      form1: {
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
        loaderTwo: ''
      },
      rules: {
        totalCost: [
          {
            required: true, message: '请输入总成本', trigger: 'blur'
          }
        ],
        totalPrice: [
          {
            required: true, message: '请输入总价格', trigger: 'blur'
          }
        ]
      },
      customerOptions: [],
      customerCodeOptions: [],
      customerList: [],
      customerLoading: false,
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
      userOptions: [],
      userList: [],
      userLoading: false,
      userQuery: {
        realname: ''
      },
      tempCustomerId: '',
      tempCustomerName: '',
      id: ''
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      if (this.form.customerId === null) {
        this.$notify({
          title: '请选择客户',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        }
      })
    },
    doAdd() {
      add(this.form).then(res => {
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
      this.form1 = {
        id: this.form.id,
        scanNumber: this.form.scanNumber,
        customerId: this.form.customerId,
        customerName: this.id,
        customerCode: this.form.customerCode,
        customerAddress: this.form.customerAddress,
        contacts: this.form.contacts,
        contactPhone: this.form.contactPhone,
        totalCost: this.form.totalCost,
        totalPrice: this.form.totalPrice,
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
        loaderTwo: this.form.loaderTwo
      }
      edit(this.form1).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.customerOptions = []
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
        loaderTwo: ''
      }
    },
    setCustomerName(event) {
      this.customerQueryName.name = event
      getCustomerList(this.customerQueryName).then(res => {
        this.customerLists = res
        this.form.customerName = event
        this.form.customerCode = this.customerLists[0].code
        this.form.customerId = this.customerLists[0].id
        this.customerQueryName.name = ''
        this.id = this.customerLists[0].id
      })
    },
    setCustomerId(event) {
      this.customerQueryCode.code = event
      getCustomerList(this.customerQueryCode).then(res => {
        this.customerLists = res
        this.form.customerCode = event
        this.form.customerName = this.customerLists[0].name
        this.form.customerId = this.customerLists[0].id
        this.customerQueryCode.code = ''
        this.id = this.customerLists[0].id
      })
    },
    cleanUpOptions() {
      this.userOptions = []
    },
    customerCodeMethod (query) {
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
    customerRemoteMethod(query) {
      var _this = this
      if (query !== '') {
        _this.customerLoading = true
        _this.customerQuery.name = query
        _this.customerOptions = []
        getCustomerList(_this.customerQuery).then(res => {
          _this.customerLoading = false
          _this.customerList = res
          _this.customerQuery.name = ''

          _this.customerOptions = _this.customerList.filter(item => {
            return item.name.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        })
      } else {
        _this.customerOptions = []
      }
    },
    sellerRemoteMethod(query) {
      // 业务员deptId为19
      const params = { deptId: 19, realname: query }
      var _this = this
      _this.userLoading = true
      getUserListByDeptId(params).then(res => {
        _this.userLoading = false
        _this.userList = res
        _this.userOptions = _this.userList.filter(item => {
          return item.realname.toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        })
      })
    },
    storeKeeperRemoteMethod(query) {
      // 仓管员deptId为16
      const params = { deptId: 16, realname: query }
      var _this = this
      _this.userLoading = true
      getUserListByDeptId(params).then(res => {
        _this.userLoading = false
        _this.userList = res
        _this.userOptions = _this.userList.filter(item => {
          return item.realname.toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        })
      })
    },
    transporterRemoteMethod(query) {
      // 运输部deptId为18
      const params = { deptId: 18, realname: query }
      var _this = this
      _this.userLoading = true
      getUserListByDeptId(params).then(res => {
        _this.userLoading = false
        _this.userList = res
        _this.userOptions = _this.userList.filter(item => {
          return item.realname.toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
