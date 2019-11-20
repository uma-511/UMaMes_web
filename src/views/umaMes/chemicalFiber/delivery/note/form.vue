<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="出库单号" >
        <el-input v-model="form.scanNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="客户id" >
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
      <el-form-item label="总成本" >
        <el-input v-model="form.totalCost" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="总价" >
        <el-input v-model="form.totalPrice" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="备注" >
        <el-input v-model="form.remark" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="业务员" >
        <el-input v-model="form.seller" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="仓管员" >
        <el-input v-model="form.storeKeeper" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="制单日期" >
        <el-date-picker v-model="form.createDate" type="datetime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="制单人" >
        <el-input v-model="form.createUser" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/chemicalFiberDeliveryNote'
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
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
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
    }
  }
}
</script>

<style scoped>

</style>
