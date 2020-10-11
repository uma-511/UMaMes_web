<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="520px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="责任人" prop="person">
        <el-select
          v-model="form.person"
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
      <el-form-item label="任务日期" >
        <el-date-picker v-model="form.taskDate" type="date" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="产品编号" prop="productCode">
        <el-select
          v-model="form.productCode"
          :disabled="!isAdd"
          :loading="userLoading"
          :remote-method="prodRemoteMethodByCode"
          filterable
          remote
          reserve-keyword
          placeholder="输入产品编号关键字"
          style="width: 370px;"
          @focus="cleanUpOptions"
          @change="setProd($event)"
        >
          <el-option
            v-for="item in prodOptions"
            :key="item.model"
            :label="item.model"
            :value="item.model"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
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
          @change="setProd($event)"
        >
          <el-option
            v-for="item in prodOptions"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="桶数" prop="number">
        <el-input v-model="form.number" type="number" onkeyup="this.value = this.value.replace(/^[+](\d+).(\d){1,2}/g,'')" style="width: 370px;" @input="calPrice"/>
      </el-form-item>
      <el-form-item label="规格(公斤)" prop="specifications">
        <el-input v-model="form.specifications" type="number" onkeyup="this.value = this.value.replace(/^[+](\d+).(\d){1,2}/g,'')" style="width: 370px;" @input="calPrice"/>
      </el-form-item>
      <el-form-item label="吨数" >
        <el-input v-model="form.weight" :disabled="true" type="number" onkeyup="this.value = this.value.replace(/^[+](\d+).(\d){1,2}/g,'')" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="单价(元)" prop="unitPrice">
        <el-input v-model="form.unitPrice" type="number" onkeyup="this.value = this.value.replace(/^[+](\d+).(\d){1,2}/g,'')" style="width: 370px;" @input="calPrice"/>
      </el-form-item>
      <el-form-item label="金额" >
        <el-input v-model="form.price" :disabled="true" type="number" onkeyup="this.value = this.value.replace(/^[+](\d+).(\d){1,2}/g,'')" style="width: 370px;"/>
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
import { add, edit } from '@/api/acidPersionPerformance'
import { getUserListByDeptId } from '@/api/user'
import { getProdList } from '@/api/chemicalFiberProduct'
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
        productCode: '',
        number: '',
        specifications: '',
        weight: '',
        unitPrice: '',
        price: '',
        enable: '',
        createDate: ''
      },
      rules: {
        person: [
          { required: true, message: '责任人不能为空', trigger: 'blur' }
        ],
        productCode: [
          { required: true, message: '产品编号不能为空', trigger: 'blur' }
        ],
        productName: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '桶数不能为空', trigger: 'blur' }
        ],
        specifications: [
          { required: true, message: '规格不能为空', trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, message: '单价不能为空', trigger: 'blur' }
        ]
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
    setProd(event) {
      let obj = []
      obj = this.prodOptions.find((item) => {
        return item.name === event
      })
      if (obj == [] || obj == null) {
        obj = this.prodOptions.find((item) => {
          return item.model === event
        })
      }
      console.log(obj)
      this.form.productName = obj.name
      this.form.productCode = obj.model
    },
    // 查询产品的下拉列表
    prodRemoteMethod(query) {
      const params = { name: query }
      this.userLoading = true
      getProdList(params).then(res => {
        this.userLoading = false
        this.prodList = res
        this.prodOptions = this.prodList.filter(item => {
          return item
        })
      })
    },
    prodRemoteMethodByCode(query) {
      const params = { model: query }
      this.userLoading = true
      getProdList(params).then(res => {
        this.userLoading = false
        this.prodList = res
        this.prodOptions = this.prodList.filter(item => {
          return item
        })
      })
    },
    subThenCreate() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.person === null || this.person === undefined) {
            this.$message({
              message: '责任人不能为空',
              type: 'warning'
            })
          } else if (this.productName === null) {
            this.$message({
              message: '产品名称不能为空',
              type: 'warning'
            })
          } else if (this.productCode === null) {
            this.$message({
              message: '产品编号不能为空',
              type: 'warning'
            })
          } else if (this.number === null) {
            this.$message({
              message: '桶数不能为空',
              type: 'warning'
            })
          } else if (this.specifications === null) {
            this.$message({
              message: '规格不能为空',
              type: 'warning'
            })
          } else if (this.unitPrice === null) {
            this.$message({
              message: '单价不能为空',
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
            person: '',
            personId: '',
            taskDate: new Date(),
            productName: '',
            productCode: '',
            number: '',
            specifications: '',
            weight: '',
            unitPrice: '',
            price: '',
            enable: '',
            createDate: ''
          }
        }
      })
    },
    doAdd() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.person === null || this.person === undefined) {
            this.$message({
              message: '责任人不能为空',
              type: 'warning'
            })
          } else if (this.productName === null) {
            this.$message({
              message: '产品名称不能为空',
              type: 'warning'
            })
          } else if (this.productCode === null) {
            this.$message({
              message: '产品编号不能为空',
              type: 'warning'
            })
          } else if (this.number === null) {
            this.$message({
              message: '桶数不能为空',
              type: 'warning'
            })
          } else if (this.specifications === null) {
            this.$message({
              message: '规格不能为空',
              type: 'warning'
            })
          } else if (this.unitPrice === null) {
            this.$message({
              message: '单价不能为空',
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
    },
    doEdit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.person === null || this.person === undefined) {
            this.$message({
              message: '责任人不能为空',
              type: 'warning'
            })
          } else if (this.productName === null) {
            this.$message({
              message: '产品名称不能为空',
              type: 'warning'
            })
          } else if (this.productCode === null) {
            this.$message({
              message: '产品编号不能为空',
              type: 'warning'
            })
          } else if (this.number === null) {
            this.$message({
              message: '桶数不能为空',
              type: 'warning'
            })
          } else if (this.specifications === null) {
            this.$message({
              message: '规格不能为空',
              type: 'warning'
            })
          } else if (this.unitPrice === null) {
            this.$message({
              message: '单价不能为空',
              type: 'warning'
            })
          }
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
        }
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
        productCode: '',
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
