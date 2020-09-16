<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="520px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="姓名" >
        <el-input :disabled="true" v-model="form.personName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="部门" >
        <el-input :disabled="true" v-model="form.dept" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="岗位" >
        <el-input :disabled="true" v-model="form.job" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="基本工资" >
        <el-input v-model="form.basicSalary" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="绩效" >
        <el-input v-model="form.performance" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="打卡奖" >
        <el-input v-model="form.cardPrize" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="安全奖" >
        <el-input v-model="form.safePrize" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="全勤奖" >
        <el-input v-model="form.fullPrize" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="高温津贴" >
        <el-input v-model="form.highTemperatureSubsidy" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="加班费" >
        <el-input v-model="form.overtimePay" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="其他" >
        <el-input v-model="form.otherPrize" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="应发工资" >
        <el-input v-model="form.wagesPayable" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="出勤天数" >
        <el-input v-model="form.attendance" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="实际出勤天数" >
        <el-input v-model="form.attendanceReal" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="请假" >
        <el-input v-model="form.leave" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="缺卡" >
        <el-input v-model="form.lackCard" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="违反安全" >
        <el-input v-model="form.violationOfSafety" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="日期" >
        <el-date-picker v-model="form.dateTime" type="datetime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="实发工资" >
        <el-input v-model="form.netSalary" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/monthlyWageStatistics'
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
        personName: '',
        dept: '',
        job: '',
        basicSalary: '',
        performance: '',
        cardPrize: '',
        safePrize: '',
        fullPrize: '',
        highTemperatureSubsidy: '',
        overtimePay: '',
        otherPrize: '',
        wagesPayable: '',
        attendance: '',
        attendanceReal: '',
        leave: '',
        lackCard: '',
        violationOfSafety: '',
        dateTime: '',
        netSalary: ''
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
        personName: '',
        dept: '',
        job: '',
        basicSalary: '',
        performance: '',
        cardPrize: '',
        safePrize: '',
        fullPrize: '',
        highTemperatureSubsidy: '',
        overtimePay: '',
        otherPrize: '',
        wagesPayable: '',
        attendance: '',
        attendanceReal: '',
        leave: '',
        lackCard: '',
        violationOfSafety: '',
        dateTime: '',
        netSalary: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
