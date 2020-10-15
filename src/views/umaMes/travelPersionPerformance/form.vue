<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="流水单号" prop="scanNumber">
        <el-input :disabled="!isAdd" v-model="form.scanNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="发货地" >
        <el-select
          v-model="form.startPlace"
          :loading="customerLoading"
          :remote-method="customerRemoteMethod"
          filterable
          allow-create
          clearable
          remote
          reserve-keyword
          placeholder="输入发货地关键词"
          style="width: 370px;"
          @visible-change="$forceUpdate()"
          @focus="cleanUpOptions"
          @change="checkEndPlace($event)"
        >
          <el-option
            v-for="item in customerOptions"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="目的地" >
        <el-select
          v-model="form.endPlace"
          :loading="customerLoading"
          :remote-method="customerRemoteMethod"
          filterable
          allow-create
          remote
          clearable
          reserve-keyword
          placeholder="输入目的地关键词"
          style="width: 370px;"
          @visible-change="$forceUpdate()"
          @focus="cleanUpOptions"
          @change="checkStartPlace($event)"
        >
          <el-option
            v-for="item in customerOptions"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="责任人" prop="personName">
        <el-select
          v-model="form.personName"
          :disabled="!isAdd"
          :loading="userLoading"
          :remote-method="transporterRemoteMethod"
          filterable
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
      <el-form-item label="职位" >
        <el-input :disabled="true" v-model="form.permission" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="里程费" >
        <el-input v-model="form.mileageFee" type="number" onkeyup="this.value = this.value.replace(/^[+](\d+).(\d){1,2}/g,'')" style="width: 370px;" @input="doCount"/>
      </el-form-item>
      <el-form-item label="加班费" >
        <el-input v-model="form.overtimePay" type="number" onkeyup="this.value = this.value.replace(/^[+](\d+).(\d){1,2}/g,'')" style="width: 370px;" @input="doCount"/>
      </el-form-item>
      <el-form-item label="补贴费" >
        <el-input v-model="form.allowance" type="number" onkeyup="this.value = this.value.replace(/^[+](\d+).(\d){1,2}/g,'')" style="width: 370px;" @input="doCount"/>
      </el-form-item>
      <el-form-item label="附加费" >
        <el-input v-model="form.surcharge" type="number" onkeyup="this.value = this.value.replace(/^[+](\d+).(\d){1,2}/g,'')" style="width: 370px;" @input="doCount"/>
      </el-form-item>
      <el-form-item label="装卸费" >
        <el-input v-model="form.handlingCost" type="number" onkeyup="this.value = this.value.replace(/^[+](\d+).(\d){1,2}/g,'')" style="width: 370px;" @input="doCount"/>
      </el-form-item>
      <el-form-item label="绩效总计" >
        <el-input :disabled="true" v-model="form.totalPerformance" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="交货日期" >
        <el-date-picker :disabled="!isAdd" v-model="form.createTime" type="date" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="isAdd" :loading="loading" type="primary" @click="subThenCreate">确认并新增</el-button>
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/travelPersionPerformance'
import { getUserListByRealName, getPermissionByUserId } from '@/api/user'
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
      loading: false,
      dialog: false,
      userLoading: false,
      userOptions: [],
      customerOptions: [],
      customerLoading: false,
      customerQuery: {
        name: '',
        code: ''
      },
      form: {
        id: '',
        personName: '',
        startPlace: '',
        endPlace: '',
        personId: '',
        permission: '',
        mileageFee: '',
        overtimePay: '',
        allowance: '',
        surcharge: '',
        handlingCost: '',
        totalPerformance: '',
        createTime: new Date(),
        enable: ''
      },
      rules: {
        personName: [
          { required: true, message: '责任人不能为空', trigger: 'blur' }
        ],
        scanNumber: [
          { required: true, message: '流水号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    // 清空下拉框
    cleanUpOptions() {
      this.customerOptions = []
    },
    initIdAndPermission(event) {
      let obj = []
      obj = this.userOptions.find((item) => {
        return item.realname === event
      })
      this.form.personId = obj.id
      const params = { id: obj.id }
      getPermissionByUserId(params).then(res => {
        this.form.permission = res[0].permission
      })
    },
    // 查询运输的下拉列表
    transporterRemoteMethod(query) {
      // 运输部deptId为18
      /* const idList = [18]
      const params = { deptIdList: idList + '', realname: query }*/
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
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    checkEndPlace(data) {
      if (data == '' || data == null) {
        return
      }
      if (data == this.form.endPlace) {
        this.form.startPlace = ''
        this.$notify({
          title: '发货地，目的地不能相同',
          type: 'warning',
          duration: 2500
        })
      }
    },
    checkStartPlace(data) {
      if (data == '' || data == null) {
        return
      }
      if (data == this.form.startPlace) {
        this.form.endPlace = ''
        this.$notify({
          title: '发货地，目的地不能相同',
          type: 'warning',
          duration: 2500
        })
      }
    },
    // 查询客户名称的下拉列表
    customerRemoteMethod(query) {
      if (query !== '') {
        this.customerLoading = true
        this.customerQuery.name = query
        this.customerOptions = []
        getCustomerList(this.customerQuery).then(res => {
          this.customerLoading = false
          this.customerQuery.name = ''
          this.customerList = res
          this.customerOptions = this.customerList.filter(item => {
            return item.name.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        })
      } else {
        this.customerOptions = []
      }
    },
    doCount() {
      var n1 = this.form.mileageFee
      var n2 = this.form.overtimePay
      var n3 = this.form.allowance
      var n4 = this.form.surcharge
      var n5 = this.form.handlingCost
      var sum = n1 * 1 + n2 * 1 + n3 * 1 + n4 * 1 + n5 * 1
      this.form.totalPerformance = sum.toFixed(2)
    },
    subThenCreate() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.personName === null || this.form.personName === undefined) {
            this.$message({
              message: '责任人不能为空',
              type: 'warning'
            })
          } else if (this.form.scanNumber === null) {
            this.$message({
              message: '流水号不能为空',
              type: 'warning'
            })
          }
          add(this.form).then(res => {
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
          this.form = {
            id: '',
            personName: '',
            personId: '',
            permission: '',
            mileageFee: '',
            overtimePay: '',
            allowance: '',
            surcharge: '',
            handlingCost: '',
            totalPerformance: '',
            createTime: new Date(),
            enable: ''
          }
        }
      })
      this.loading = false
    },
    doAdd() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.personName === null || this.form.personName === undefined) {
            this.$message({
              message: '责任人不能为空',
              type: 'warning'
            })
          } else if (this.form.scanNumber === null) {
            this.$message({
              message: '流水号不能为空',
              type: 'warning'
            })
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
        }
      })
      this.loading = false
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
        permission: '',
        mileageFee: '',
        overtimePay: '',
        allowance: '',
        surcharge: '',
        handlingCost: '',
        totalPerformance: '',
        createTime: new Date(),
        enable: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
