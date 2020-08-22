<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="客户名称" prop="customerName">
        <el-select
          v-model="form.customerName"
          :loading="customerLoading"
          :remote-method="customerRemoteMethod"
          multiple:false
          filterable
          remote
          reserve-keyword
          placeholder="输入客户关键词"
          style="width: 370px;"
          @change="setCustomerId($event)"
        >
          <el-option
            v-for="item in customerOptions"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户编号" prop="customerCode">
        <el-select
          v-model="form.customerCode"
          :loading="customerLoading"
          :remote-method="customerCodeMethod"
          multiple:false
          filterable
          remote
          reserve-keyword
          placeholder="输入客户关键词"
          style="width: 370px;"
          @change="setCustomerId($event)"
        >
          <el-option
            v-for="item in customerCodeOptions"
            :key="item.code"
            :label="item.code"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收款分类" prop="type">
        <el-select
          v-model="form.type"
          :loading="accountLoading"
          placeholder="请选择收款类型"
          style="width: 370px;"
          @focus="initReceiptTypeOptions">
          <el-option
            v-for="item in receiptTypeOption"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收款方式" prop="recivedAccount">
        <template slot-scope="scope">
          <el-select
            v-model="form.recivedAccount"
            :loading="accountLoading"
            placeholder="请选择收款方式"
            style="width: 370px;"
            @focus="initAccountOptions">
            <el-option
              v-for="item in accountOption"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="收款日期" prop="recivedDate">
        <el-date-picker
          v-model="form.recivedDate"
          type="datetime"
          format="yyyy 年 MM 月 dd 日"
          style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="项目类型" prop="projectType">
        <template slot-scope="scope">
          <el-select
            v-model="form.projectType"
            placeholder="请选择项目类型"
            style="width: 370px;"
            @focus="initBookAccountTypeOptions">
            <el-option
              v-for="item in bookAccountTypeOption"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="经办人" >
        <template slot-scope="scope">
          <el-select
            v-model="form.operator"
            :loading="customerLoading"
            :remote-method="initOperatorOption"
            multiple:false
            filterable
            remote
            reserve-keyword
            placeholder="输入经办人关键词"
            style="width: 370px;"
            @blur="selectBlur"
          >
            <el-option
              v-for="item in operatorOption"
              :key="item.realname"
              :label="item.realname"
              :value="item.realname"
            />
          </el-select>
        </template>
      </el-form-item>

      <el-form-item label="金额" prop="amountOfMoney">
        <el-input v-model="form.amountOfMoney" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="单据编号" >
        <el-input v-model="form.recivedNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="说明" >
        <el-input v-model="form.remark" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认并录入</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, doFinish } from '@/api/receipt'
import { getAccountList } from '@/api/accountName'
import { getBookAccountList } from '@/api/bookAccountType'
import { getCustomerList } from '@/api/customer'
import { getReceiptTypeList } from '@/api/receiptType'
import { getUserListByDeptId } from '@/api/user'
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
      accountList: [],
      accountLoading: false,
      sutmitDetailLoading: false,
      customerLoading: false,
      customerLists: [],
      customerOptions: [],
      customerCodeOptions: [],
      form: {
        id: '',
        receiptNumber: '',
        customerName: '',
        type: '',
        recivedAccount: '',
        recivedDate: '',
        projectType: '',
        operator: '',
        amountOfMoney: '',
        recivedNumber: '',
        remark: '',
        createUser: '',
        createDate: '',
        status: '',
        customerId: '',
        customerCode: ''
      },
      customerQuery: {
        name: '',
        code: ''
      },
      rules: {
        customerName: [
          {
            required: true, message: '请输入客户名称', trigger: 'blur'
          }
        ],
        customerCode: [
          {
            required: true, message: '请输入客户名称', trigger: 'blur'
          }
        ],
        recivedAccount: [
          {
            required: true, message: '请输入收款方式', trigger: 'blur'
          }
        ],
        type: [
          {
            required: true, message: '请输入收款类别', trigger: 'blur'
          }
        ],
        recivedDate: [
          {
            required: true, message: '请输入收款日期', trigger: 'blur'
          }
        ],
        projectType: [
          {
            required: true, message: '请输入项目类型', trigger: 'blur'
          }
        ],
        amountOfMoney: [
          {
            required: true, message: '请输入金额', trigger: 'blur'
          }
        ]
      },
      accountOption: [],
      projectOption: [],
      bookAccountTypeOption: [],
      bookAccountTypeList: [],
      operatorOption: [],
      operatorList: [],
      receiptTypeOption: [],
      receiptTypeList: []
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doAlert1() {
      console.log(this.aList)
    },
    // 查询客户编号的下拉列表
    customerCodeMethod(query) {
      this.customerCodeLoading = false
      if (query !== '') {
        this.customerCodeLoading = true
        this.customerQuery.code = query
        this.customerCodeOptions = []
        getCustomerList(this.customerQuery).then(res => {
          this.customerCodeLoading = false
          this.customerList = res
          this.customerQuery.code = ''
          this.customerCodeOptions = this.customerList.filter(item => {
            return item
          })
        })
      } else {
        this.customerOptions = []
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
            return item
          })
        })
      } else {
        this.customerOptions = []
      }
    },
    // 输入客户名称自动填入客户编号
    setCustomerId(event) {
      let obj = []
      obj = this.customerOptions.find((item) => {
        return item.name === event
      })
      if (obj == [] || obj == null) {
        obj = this.customerCodeOptions.find((item) => {
          return item.code === event
        })
      }
      this.form.customerId = obj.id
      this.form.customerName = obj.name
      this.form.customerCode = obj.code
    },
    initAccountOptions() {
      this.accountLoading = true
      getAccountList().then(res => {
        this.accountList = res
        this.accountOption = this.accountList.filter(item => {
          return item.name
        })
        this.accountLoading = false
      })
    },
    initReceiptTypeOptions() {
      this.accountLoading = true
      getReceiptTypeList().then(res => {
        this.receiptTypeList = res
        this.receiptTypeOption = this.receiptTypeList.filter(item => {
          return item.name
        })
        this.accountLoading = false
      })
    },
    initOperatorOption(query) {
      let idList = [13, 14]
      const params = { deptIdList: idList + '', realname: query }
      this.accountLoading = true
      getUserListByDeptId(params).then(res => {
        this.accountLoading = false
        this.operatorList = res
        this.operatorOption = this.operatorList.filter(item => {
          return item
        })
      })
    },
    // 取消按钮触发事件
    popoverClose(id) {
      this.$refs[id].doClose()
    },
    initBookAccountTypeOptions() {
      this.accountLoading = true
      getBookAccountList().then(res => {
        this.bookAccountTypeList = res
        this.bookAccountTypeOption = this.bookAccountTypeList.filter(item => {
          return item
        })
        this.accountLoading = false
      })
    },
    selectBlur(e) {
      this.form.operator = e.target.value
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        }
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
        receiptNumber: '',
        customerName: '',
        type: '',
        recivedAccount: '',
        recivedDate: '',
        projectType: '',
        operator: '',
        amountOfMoney: '',
        recivedNumber: '',
        remark: '',
        createUser: '',
        createDate: '',
        status: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
