<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="人员姓名" prop="personName">
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
      <el-form-item label="记录日期" >
        <el-date-picker v-model="form.attenceDate" type="date" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="类型" prop="attenceType">
        <el-select
          v-model="form.attenceType"
          :loading="attenceTypeLoading"
          placeholder="请选择类型"
          style="width: 370px;"
          @focus="attenceTypeRemoteMethod"
          @change="setPrice($event)">
          <el-option
            v-for="item in attenceTypeOptions"
            :key="item.attenceType"
            :label="item.attenceType"
            :value="item.attenceType"
          />
        </el-select>
      </el-form-item>
      <!--<el-form-item label="安全类型" >
        <el-select
          v-model="form.safeType"
          placeholder="请选择安全类型"
          style="width: 370px;">
          <el-option
            v-for="item in safeTypeOption"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>-->
      <el-form-item label="天数" >
        <el-input v-model="form.day" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="金额" prop="price">
        <el-input v-model="form.price" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="备注" >
        <el-input v-model="form.remark" style="width: 370px;"/>
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
      safeTypeOption: [
        {
          label: '不按规定穿戴劳保用品',
          value: '不按规定穿戴劳保用品'
        }, {
          label: '抽酸溢出槽罐',
          value: '抽酸溢出槽罐'
        }, {
          label: '违反安全出车',
          value: '违反安全出车'
        }, {
          label: '没有协调卸货擅自回公司',
          value: '没有协调卸货擅自回公司'
        }, {
          label: '分装不检查造成漏酸',
          value: '分装不检查造成漏酸'
        }, {
          label: '个人驾驶违章',
          value: '个人驾驶违章'
        }, {
          label: '暴力驾驶',
          value: '暴力驾驶'
        }, {
          label: '疲劳驾驶',
          value: '疲劳驾驶'
        }, {
          label: '驾驶时打电话',
          value: '驾驶时打电话'
        }, {
          label: '驾驶时抽烟',
          value: '驾驶时抽烟'
        }, {
          label: '擅自离岗造成车辆或财产损失',
          value: '擅自离岗造成车辆或财产损失'
        }, {
          label: '产品处理不当造成环境污染',
          value: '产品处理不当造成环境污染'
        }, {
          label: '不按污水排放指标操作',
          value: '不按污水排放指标操作'
        }, {
          label: '未及时做好防盗巡查及签到',
          value: '未及时做好防盗巡查及签到'
        }, {
          label: '厂区内吸烟',
          value: '厂区内吸烟'
        }, {
          label: '不及时打卡签字',
          value: '不及时打卡签字'
        }, {
          label: '严重损害公司形象',
          value: '严重损害公司形象'
        }, {
          label: '向客户索要好处费',
          value: '向客户索要好处费'
        }
      ],
      form: {
        id: '',
        personName: '',
        personId: '',
        attenceDate: new Date(),
        attenceType: '',
        day: '',
        remark: '',
        createDate: '',
        serialNumber: '',
        safeType: '',
        price: '',
        enable: ''
      },
      rules: {
        personName: [
          { required: true, message: '人员姓名不能为空', trigger: 'blur' }
        ],
        attenceType: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '金额不能为空', trigger: 'blur' }
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
    setPrice(event) {
      let obj = []
      console.log(event)
      obj = this.attenceTypeOptions.find((item) => {
        return item.attenceType === event
      })
      this.form.price = obj.price
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
    subThenCreate() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.personName === null || this.personName === undefined) {
            this.$message({
              message: '人员姓名不能为空',
              type: 'warning'
            })
          } else if (this.attenceType === null) {
            this.$message({
              message: '类型不能为空',
              type: 'warning'
            })
          } else if (this.price === null) {
            this.$message({
              message: '金额不能为空',
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
            attenceDate: new Date(),
            attenceType: '',
            day: '',
            remark: '',
            createDate: '',
            serialNumber: '',
            safeType: '',
            price: '',
            enable: ''
          }
        }
      })
      this.loading = false
    },
    doAdd() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.personName === null || this.personName === undefined) {
            this.$message({
              message: '人员姓名不能为空',
              type: 'warning'
            })
          } else if (this.attenceType === null) {
            this.$message({
              message: '类型不能为空',
              type: 'warning'
            })
          } else if (this.price === null) {
            this.$message({
              message: '金额不能为空',
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
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.personName === null || this.personName === undefined) {
            this.$message({
              message: '人员姓名不能为空',
              type: 'warning'
            })
          } else if (this.attenceType === null) {
            this.$message({
              message: '类型不能为空',
              type: 'warning'
            })
          } else if (this.price === null) {
            this.$message({
              message: '金额不能为空',
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
      this.loading = false
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
        serialNumber: '',
        safeType: '',
        price: '',
        enable: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
