<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" title="结款" width="500px">
    <el-row style="width: 100%">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="客户名" >
          <el-input v-model="form.customerName" style="width: 350px;"/>
        </el-form-item>
        <el-form-item label="欠款" >
          <el-input :disabled="true" v-model="form.overArrears" style="width: 350px;"/>
        </el-form-item>
        <el-form-item label="本次结款金额" >
          <el-input v-model="form.price" onkeyup="this.value = this.value.replace(/^[+](\d+).(\d){1,2}/g,'')" type="number" style="width: 350px;"/>
        </el-form-item>
        <el-form-item label="结款日期" >
          <el-date-picker v-model="form.payDate" type="date" style="width: 350px;"/>
        </el-form-item>
        <el-form-item style="width: 450px;text-align: right">
          <el-button type="text" @click="cancel">取消</el-button>
          <el-button :loading="loading" type="primary" @click="doAdd">结算</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row style="width: 100%">
      <el-table
        :data="payDetailList"
        style="width:451px"
        show-summary
      >
        <el-table-column label="结款记录" align="center" width="100%">
          <el-table-column
            :formatter="formatDate"
            prop="payDate"
            label="结款日期"
            align="center"
            width="150px"
          />
          <el-table-column prop="price" label="结款金额" width="150px" align="center"/>
          <el-table-column prop="createUser" label="操作人" width="150px" align="center"/>
        </el-table-column>
      </el-table>
    </el-row>
  </el-dialog>
</template>

<script>
import { add } from '@/api/overArrearsPayDetail'
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
      payDetailList: [],
      form: {
        id: '',
        price: '',
        payDate: '',
        createDate: '',
        createUser: '',
        customerName: '',
        customerId: '',
        overArrears: '',
        enable: '',
        payDetailList: []
      },
      rules: {
        price: [
          {
            required: true,
            message: '请输入金额',
            trigger: 'change'
          },
          {
            pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
            message: '请输入合法的金额数字，最多两位小数',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    formatDate(row, column) {
      // 获取单元格数据
      const data = row[column.property]
      if (data == null) {
        return null
      }
      const dt = new Date(data)
      return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()
    },
    doAlert() {
      console.log(this.payDetailList)
      console.log(this.tableData)
    },
    doAdd() {
      if (this.form.overArrears == '0.00' || this.form.overArrears == '' || this.form.overArrears == null) {
        this.$notify({
          title: '该客户没有欠款',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (this.form.price == '0.00' || this.form.price == '' || this.form.price == null) {
        this.$notify({
          title: '请输入金额',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (this.form.price < 0) {
        this.$notify({
          title: '结款金额不能为负数',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (this.form.payDate == '' || this.form.payDate == null) {
        this.$notify({
          title: '请输入日期',
          type: 'warning',
          duration: 2500
        })
        return
      }
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
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        price: '',
        payDate: '',
        createDate: '',
        createUser: '',
        customerName: '',
        customerId: '',
        enable: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
