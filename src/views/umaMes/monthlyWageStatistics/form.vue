<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="570px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
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
        <el-input v-model="form.leaveCount" style="width: 370px;"/>
      </el-form-item>
      <!--<el-form-item label="休息" >
        <el-input v-model="form.restDay" style="width: 370px;"/>
      </el-form-item>-->
      <el-form-item label="缺卡" >
        <el-input v-model="form.lackCard" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="违反安全" >
        <el-input v-model="form.violationOfSafety" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="日期" >
        <el-date-picker :disabled="true" v-model="form.dateTime" type="month" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="实发工资" >
        <el-input :disabled="true" v-model="form.netSalary" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-popover
        v-permission="['admin','bookAccountType:del']"
        :ref="form.id"
        placement="top"
        width="180">
        <p>确定完成本条记录吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="$refs[form.id].doClose()">取消</el-button>
          <el-button :loading="delLoading" type="primary" size="mini" @click="doFinish()">确定</el-button>
        </div>
        <el-button slot="reference" type="warning">完成</el-button>
      </el-popover>
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, doFinish } from '@/api/monthlyWageStatistics'
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
      finishLoading: false,
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
        leaveCount: '',
        lackCard: '',
        restDay: '',
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
    doFinish() {
      this.finishLoading = true
      doFinish(this.form.id).then(res => {
        this.$refs[this.form.id].doClose()
        this.resetForm()
        this.$notify({
          title: '成功',
          type: 'success',
          duration: 2500
        })
        this.finishLoading = false
        this.$parent.init()
      }).catch(err => {
        this.finishLoading = false
        this.$refs[this.form.id].doClose()
        console.log(err.response.data.message)
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
        leaveCount: '',
        lackCard: '',
        restDay: '',
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
