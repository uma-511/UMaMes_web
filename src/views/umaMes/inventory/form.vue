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
      <el-form-item label="标签编号（条码号）">
        <el-input v-model="form.labelNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="生产单id">
        <el-input v-model="form.productionId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="产品id">
        <el-input v-model="form.productId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="便签状态 0：待入库 1：入库 2：出库 3：作废 4：退库 5：退货">
        <el-input v-model="form.status" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="打印时间">
        <el-date-picker v-model="form.printTime" type="datetime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="实际每包个数">
        <el-input v-model="form.factPerBagNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="净重">
        <el-input v-model="form.netWeight" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="皮重">
        <el-input v-model="form.tare" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="毛重">
        <el-input v-model="form.grossWeight" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="班次">
        <el-input v-model="form.shifts" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="包装员">
        <el-input v-model="form.packer" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="机台号">
        <el-input v-model="form.machine" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="流水号">
        <el-input v-model="form.flowNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="规格">
        <el-input v-model="form.fineness" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="色号">
        <el-input v-model="form.color" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="芯重">
        <el-input v-model="form.coreWeight" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/chemicalFiberLabelInventory'
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
        labelNumber: '',
        productionId: '',
        productId: '',
        status: '',
        printTime: '',
        factPerBagNumber: '',
        netWeight: '',
        tare: '',
        grossWeight: '',
        shifts: '',
        packer: '',
        machine: '',
        flowNumber: '',
        fineness: '',
        color: '',
        coreWeight: ''
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
        labelNumber: '',
        productionId: '',
        productId: '',
        status: '',
        printTime: '',
        factPerBagNumber: '',
        netWeight: '',
        tare: '',
        grossWeight: '',
        shifts: '',
        packer: '',
        machine: '',
        flowNumber: '',
        fineness: '',
        color: '',
        coreWeight: ''
      }
    }
  }
}
</script>

<style scoped>
</style>
