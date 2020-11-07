<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="客户名称" prop="name">
        <el-input v-model="form.name" style="width: 370px;" maxlength="50"/>
      </el-form-item>
      <el-form-item label="客户编号" prop="code">
        <el-input v-model="form.code" style="width: 370px;" maxlength="10"/>
      </el-form-item>
      <el-form-item label="客户地址" prop="address">
        <el-input v-model="form.address" style="width: 370px;" maxlength="100"/>
      </el-form-item>
      <el-form-item label="联系人" prop="contacts">
        <el-input v-model="form.contacts" style="width: 370px;" maxlength="10"/>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactPhone">
        <el-input v-model="form.contactPhone" style="width: 370px;" maxlength="15"/>
      </el-form-item>
      <el-form-item label="传真" prop="fax">
        <el-input v-model="form.fax" style="width: 370px;" maxlength="15"/>
      </el-form-item>
      <el-form-item label="备注" >
        <el-input v-model="form.remark" style="width: 370px;" maxlength="100"/>
      </el-form-item>
      <!-- <el-form-item label="创建日期" >
        <el-date-picker v-model="form.createDate" type="datetime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="创建人" >
        <el-input v-model="form.createUser" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="删除标识" >
        <el-input v-model="form.delFlag" style="width: 370px;"/>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/customer'
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
        name: '',
        code: '',
        address: '',
        contacts: '',
        contactPhone: '',
        remark: '',
        createDate: '',
        createUser: '',
        delFlag: ''
      },
      rules: {
        name: [
          {
            required: true, message: '请输入客户名称', trigger: 'blur'
          }
        ],
        code: [
          {
            required: true, message: '请输入客户编号', trigger: 'blur'
          }
        ],
        address: [
          {
            required: true, message: '请输入客户地址', trigger: 'blur'
          }
        ],
        contacts: [
          {
            required: true, message: '请输入客户联系人', trigger: 'blur'
          }
        ],
        contactPhone: [
          {
            required: true, message: '请输入客户联系电话', trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
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
        name: '',
        code: '',
        address: '',
        contacts: '',
        contactPhone: '',
        remark: '',
        createDate: '',
        createUser: '',
        delFlag: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
