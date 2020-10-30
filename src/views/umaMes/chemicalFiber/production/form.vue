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
      <!-- <el-form-item label="订单编号">
        <el-input v-model="form.number" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="产品id">
        <el-input v-model="form.prodId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="产品型号">
        <el-input v-model="form.prodModel" style="width: 370px;"/>
      </el-form-item>-->
      <el-form-item label="产品型号" prop="temp">
        <el-select
          v-model="form.prodModel"
          :loading="optionsLoading"
          :remote-method="remoteMethod"
          multiple:false
          filterable
          remote
          reserve-keyword
          placeholder="请输入型号关键词"
          style="width: 370px;"
        >
          <el-option
            v-for="item in prodOptions"
            :key="item.id"
            :label="item.model"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="产品名称">
        <el-input v-model="form.prodName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="产品颜色">
        <el-input v-model="form.prodColor" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="产品规格">
        <el-input v-model="form.prodFineness" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="客户id">
        <el-input v-model="form.customerId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input v-model="form.customerName" style="width: 370px;"/>
      </el-form-item>-->
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
        >
          <el-option
            v-for="item in customerOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="联系电话">
        <el-input v-model="form.customerContactPhone" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="form.customerContacts" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="客户地址">
        <el-input v-model="form.customerAddress" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="客户编号">
        <el-input v-model="form.customerCode" style="width: 370px;"/>
      </el-form-item>-->
      <el-form-item label="纸芯重量">
        <el-input-number v-model="form.coreWeight" :min="0.1" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="每包个数">
        <el-input-number v-model="form.perBagNumber" :min="1" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="计划生产数量">
        <el-input-number v-model="form.planNumber" :min="1" style="width: 370px;"/>
      </el-form-item>
      <!-- <el-form-item label="完成数量">
        <el-input v-model="form.quantityCompeted" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="生产进度(%)">
        <el-input v-model="form.productionSchedule" style="width: 370px;"/>
      </el-form-item>-->
      <el-form-item label="交货日期">
        <el-date-picker v-model="form.deliveryDate" type="datetime" style="width: 370px;"/>
      </el-form-item>
      <!-- <el-form-item label="机器编号">
        <el-input v-model="form.machineNumber" style="width: 370px;"/>
      </el-form-item>-->
      <el-form-item label="备注">
        <el-input v-model="form.remark" style="width: 370px;" maxlength="100"/>
      </el-form-item>
      <!-- <el-form-item label="状态">
        <el-input v-model="form.status" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="制单时间" >
        <el-date-picker v-model="form.createTime" type="datetime" style="width: 370px;"/>
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
import { add, edit } from '@/api/chemicalFiberProduction'
import { getProdList } from '@/api/chemicalFiberProduct'
import { getCustomerList } from '@/api/customer'
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
        number: '',
        prodId: '',
        prodModel: '',
        prodName: '',
        prodColor: '',
        prodFineness: '',
        customerId: '',
        customerName: '',
        customerContactPhone: '',
        customerContacts: '',
        customerAddress: '',
        customerCode: '',
        coreWeight: '',
        perBagNumber: '',
        planNumber: '',
        quantityCompeted: '',
        productionSchedule: '',
        deliveryDate: '',
        machineNumber: '',
        remark: '',
        status: '',
        createTime: '',
        createUser: ''
      },
      rules: {
        temp: [{ required: true, message: '请输入客户名称', trigger: 'blur' }]
      },
      prodOptions: [],
      prodList: [],
      optionsLoading: false,
      prodQuery: {
        model: ''
      },
      customerOptions: [],
      customerList: [],
      customerLoading: false,
      customerQuery: {
        name: ''
      },
      tempProdId: '',
      tempProdModel: '',
      tempCustomerId: '',
      tempCustomerName: ''
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      if (this.tempProdId === '') {
        this.form.prodId = this.form.prodModel
        this.form.customerId = this.form.customerName
      } else {
        if (this.tempProdModel !== this.form.prodModel) {
          this.form.prodId = this.form.prodModel
        } else {
          this.form.prodId = this.tempProdId
        }
        if (this.tempCustomerName !== this.form.customerName) {
          this.form.customerId = this.form.customerName
        } else {
          this.form.customerId = this.tempCustomerId
        }
      }
      if (this.form.prodId === '') {
        this.$notify({
          title: '请选择产品型号',
          type: 'warning',
          duration: 2500
        })
        return
      }
      var perBagNumberTemp = /^\+?[1-9][0-9]*$/
      if (!perBagNumberTemp.test(this.form.perBagNumber)) {
        this.$notify({
          title: '每包个数请输入正整数',
          type: 'warning',
          duration: 2500
        })
        return
      }
      var planNumberTemp = /^\+?[1-9][0-9]*$/
      if (!planNumberTemp.test(this.form.planNumber)) {
        this.$notify({
          title: '计划生产数量请输入正整数',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (this.form.deliveryDate === '') {
        this.$notify({
          title: '请选择交货日期',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
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
        this.prodOptions = []
        this.customerOptions = []
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
        this.prodOptions = []
        this.customerOptions = []
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
        number: '',
        prodId: '',
        prodModel: '',
        prodName: '',
        prodColor: '',
        prodFineness: '',
        customerId: '',
        customerName: '',
        customerContactPhone: '',
        customerContacts: '',
        customerAddress: '',
        customerCode: '',
        coreWeight: '',
        perBagNumber: '',
        planNumber: '',
        quantityCompeted: '',
        productionSchedule: '',
        deliveryDate: '',
        machineNumber: '',
        remark: '',
        status: '',
        createTime: '',
        createUser: ''
      }
    },
    remoteMethod(query) {
      var _this = this
      if (query !== '') {
        _this.optionsLoading = true
        _this.prodQuery.model = query
        getProdList(_this.prodQuery).then(res => {
          _this.optionsLoading = false
          _this.prodList = res
          _this.prodOptions = _this.prodList.filter(item => {
            return item.model.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        })
      } else {
        _this.prodOptions = []
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
    }
    // initEdit(prodId, customerId) {
    //   this.tempProdId = prodId
    //   this.tempCustomerId = customerId
    // }
  }
}
</script>

<style scoped>
</style>
