<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="责任人" >
        <el-select
          v-model="form.person"
          :disabled="!isAdd"
          :loading="userLoading"
          :remote-method="transporterRemoteMethod"
          filterable
          allow-create
          remote
          reserve-keyword
          placeholder="输入责任人关键字"
          style="width: 370px;"
          @focus="cleanUpOptions"
          @change="initIdAndPermission($event)"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.realname"
            :label="item.realname"
            :value="item.realname"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务日期" >
        <el-date-picker v-model="form.taskDate" type="date" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="产品名称" >
        <el-select
          v-model="form.productName"
          :disabled="!isAdd"
          :loading="userLoading"
          :remote-method="prodRemoteMethod"
          filterable
          remote
          reserve-keyword
          placeholder="输入产品名称关键字"
          style="width: 370px;"
          @focus="cleanUpOptions"
        >
          <el-option
            v-for="item in prodOptions"
            :key="item.prodName"
            :label="item.prodName"
            :value="item.prodName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="桶数" >
        <el-input v-model="form.number" type="number" onkeyup="this.value = this.value.replace(/^[+](\d+).(\d){1,2}/g,'')" style="width: 370px;" @input="calPrice"/>
      </el-form-item>
      <el-form-item label="规格(公斤)" >
        <el-input v-model="form.specifications" type="number" onkeyup="this.value = this.value.replace(/^[+](\d+).(\d){1,2}/g,'')" style="width: 370px;" @input="calPrice"/>
      </el-form-item>
      <el-form-item label="吨数" >
        <el-input v-model="form.weight" :disabled="true" type="number" onkeyup="this.value = this.value.replace(/^[+](\d+).(\d){1,2}/g,'')" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="单价(元)" >
        <el-input v-model="form.unitPrice" type="number" onkeyup="this.value = this.value.replace(/^[+](\d+).(\d){1,2}/g,'')" style="width: 370px;" @input="calPrice"/>
      </el-form-item>
      <el-form-item label="金额" >
        <el-input v-model="form.price" :disabled="true" type="number" onkeyup="this.value = this.value.replace(/^[+](\d+).(\d){1,2}/g,'')" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/acidPersionPerformance'
import { getUserListByDeptId } from '@/api/user'
import { getSelectMaps } from '@/api/chemicalFiberStock'
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
      userLoading: false,
      userOptions: [],
      prodOptions: [],
      prodList: '',
      form: {
        id: '',
        person: '',
        personId: '',
        taskDate: new Date(),
        productName: '',
        number: '',
        specifications: '',
        weight: '',
        unitPrice: '',
        price: '',
        enable: '',
        createDate: ''
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
    calPrice() {
      this.form.weight = (this.form.number * this.form.specifications / 1000).toFixed(2)
      this.form.price = (this.form.weight * this.form.unitPrice).toFixed(2)
    },
    // 清空下拉框
    cleanUpOptions() {
      this.userOptions = []
      this.prodOptions = []
    },
    initIdAndPermission(event) {
      let obj = []
      obj = this.userOptions.find((item) => {
        return item.realname === event
      })
      this.form.personId = obj.id
    },
    // 查询运输的下拉列表
    transporterRemoteMethod(query) {
      // 运输部deptId为18
      const idList = [18]
      const params = { deptIdList: idList + '', realname: query }
      this.userLoading = true
      getUserListByDeptId(params).then(res => {
        this.userLoading = false
        this.userList = res
        this.userOptions = this.userList.filter(item => {
          return item
        })
      })
    },
    // 查询产品的下拉列表
    prodRemoteMethod(query) {
      const params = { prodName: query }
      this.userLoading = true
      getSelectMaps(params).then(res => {
        this.userLoading = false
        this.prodList = res
        this.prodOptions = this.prodList.filter(item => {
          return item
        })
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
      this.cleanUpOptions()
      this.form = {
        id: '',
        person: '',
        personId: '',
        taskDate: new Date(),
        productName: '',
        number: '',
        specifications: '',
        weight: '',
        unitPrice: '',
        price: '',
        enable: '',
        createDate: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
