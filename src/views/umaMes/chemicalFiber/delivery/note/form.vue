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
      </el-form-item>-->
      <el-form-item label="总成本" prop="totalCost">
        <el-input-number :min="0.1" v-model="form.totalCost" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="总价" prop="totalPrice">
        <el-input-number :min="0.1" v-model="form.totalPrice" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="业务员" prop="seller">
        <el-input v-model="form.seller" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="仓管员" prop="storeKeeper">
        <el-input v-model="form.storeKeeper" style="width: 370px;"/>
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
        createUser: ''
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
        ],
        seller: [
          {
            required: true, message: '请输入业务员', trigger: 'blur'
          }
        ],
        storeKeeper: [
          {
            required: true, message: '请输入仓管员', trigger: 'blur'
          }
        ]
      },
      customerOptions: [],
      customerList: [],
      customerLoading: false,
      customerQuery: {
        name: ''
      },
      tempCustomerId: '',
      tempCustomerName: ''
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      if (this.tempCustomerName !== this.form.customerName) {
        this.form.customerId = this.form.customerName
      } else {
        this.form.customerId = this.tempCustomerId
      }
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
      edit(this.form).then(res => {
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
        createUser: ''
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
  }
}
</script>

<style scoped>
</style>
