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
      <el-form-item label="对账单主键">
        <el-input v-model="form.statementId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="送货单号">
        <el-input v-model="form.scanNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="送货日期">
        <el-date-picker v-model="form.scanDate" type="datetime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="产品名称">
        <el-input v-model="form.prodName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="总包数">
        <el-input v-model="form.totalBag" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="重量">
        <el-input v-model="form.netWeight" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="单价">
        <el-input v-model="form.sellingPrice" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="金额">
        <el-input v-model="form.totalPrice" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="预付款">
        <el-input v-model="form.advanceCharge" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="扣除金额">
        <el-input v-model="form.amountDeducted" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, statementDetailsEdit } from '@/api/umaChemicalFiberStatementDetails'
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
        statementId: '',
        scanNumber: '',
        scanDate: '',
        prodName: '',
        totalBag: '',
        netWeight: '',
        sellingPrice: '',
        totalPrice: '',
        remark: '',
        advanceCharge: '',
        amountDeducted: ''
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
      statementDetailsEdit(this.form).then(res => {
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
        statementId: '',
        scanNumber: '',
        scanDate: '',
        prodName: '',
        totalBag: '',
        netWeight: '',
        sellingPrice: '',
        totalPrice: '',
        remark: '',
        advanceCharge: '',
        amountDeducted: ''
      }
    }
  }
}
</script>

<style scoped>
</style>
