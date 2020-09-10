<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="人员姓名" >
        <el-select
          v-model="form.personName"
          :disabled="!isAdd"
          :loading="userLoading"
          :remote-method="personRemoteMethod"
          filterable
          allow-create
          remote
          reserve-keyword
          placeholder="输入责任人关键字"
          style="width: 370px;"
          @focus="cleanUpOptions"
          @change="initId($event)"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.realname"
            :label="item.realname"
            :value="item.realname"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="制单日期" >
        <el-date-picker v-model="form.attenceDate" type="date" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="类型" >
        <el-select
          v-model="form.attenceType"
          :loading="attenceTypeLoading"
          placeholder="请选择收款类型"
          style="width: 370px;"
          @focus="attenceTypeRemoteMethod">
          <el-option
            v-for="item in attenceTypeOptions"
            :key="item.attenceType"
            :label="item.attenceType"
            :value="item.attenceType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="天数" >
        <el-input v-model="form.day" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="备注" >
        <el-input v-model="form.remark" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="创建日期" >
        <el-date-picker v-model="form.createDate" type="date" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/workAttendance'
import { getUserListByRealName } from '@/api/user'
import { getAttenceTypesList } from '@/api/attenceType'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      userLoading: false,
      userOptions: [],
      attenceTypeLoading: false,
      attenceTypeOptions: [],
      form: {
        id: '',
        personName: '',
        personId: '',
        attenceDate: new Date(),
        attenceType: '',
        day: '',
        remark: '',
        createDate: '',
        enable: ''
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
    // 清空下拉框
    cleanUpOptions() {
      this.userOptions = []
      this.attenceTypeOptions = []
    },
    // 查询类型的下拉列表
    attenceTypeRemoteMethod(query) {
      this.attenceTypeLoading = true
      getAttenceTypesList().then(res => {
        this.attenceTypeLoading = false
        this.attenceTypeList = res
        this.attenceTypeOptions = this.attenceTypeList.filter(item => {
          return item
        })
      })
    },
    // 查询人员的下拉列表
    personRemoteMethod(query) {
      const params = { realname: query }
      this.userLoading = true
      getUserListByRealName(params).then(res => {
        this.userLoading = false
        this.userList = res
        this.userOptions = this.userList.filter(item => {
          return item
        })
      })
    },
    initId(event) {
      let obj = []
      obj = this.userOptions.find((item) => {
        return item.realname === event
      })
      this.form.personId = obj.id
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
        personId: '',
        attenceDate: new Date(),
        attenceType: '',
        day: '',
        remark: '',
        createDate: '',
        enable: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
