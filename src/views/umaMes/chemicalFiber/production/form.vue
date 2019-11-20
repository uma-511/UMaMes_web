<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="订单编号" >
        <el-input v-model="form.number" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="产品id" >
        <el-input v-model="form.prodId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="产品型号" >
        <el-input v-model="form.prodModel" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="产品名称" >
        <el-input v-model="form.prodName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="产品颜色" >
        <el-input v-model="form.prodColor" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="产品纤度" >
        <el-input v-model="form.prodFineness" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="客户id" >
        <el-input v-model="form.customerId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="客户名称" >
        <el-input v-model="form.customerName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="联系电话" >
        <el-input v-model="form.customerContactPhone" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="联系人" >
        <el-input v-model="form.customerContacts" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="客户地址" >
        <el-input v-model="form.customerAddress" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="客户编号" >
        <el-input v-model="form.customerCode" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="纸芯重量" >
        <el-input v-model="form.coreWeight" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="每袋个数" >
        <el-input v-model="form.perBagNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="计划生产数量" >
        <el-input v-model="form.planNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="完成数量" >
        <el-input v-model="form.quantityCompeted" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="生产进度(%)" >
        <el-input v-model="form.productionSchedule" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="交货日期" >
        <el-date-picker v-model="form.deliveryDate" type="datetime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="机器编号" >
        <el-input v-model="form.machineNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="备注" >
        <el-input v-model="form.remark" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="状态" >
        <el-input v-model="form.status" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="创建时间" >
        <el-date-picker v-model="form.createTime" type="datetime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="创建人" >
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
import { add, edit } from '@/api/umaProductionChemicalFiber'
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
    }
  }
}
</script>

<style scoped>

</style>
