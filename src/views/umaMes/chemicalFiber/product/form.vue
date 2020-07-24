<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="产品型号" prop="model">
        <el-input v-model="form.model" style="width: 370px;" maxlength="10"/>
      </el-form-item>
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="form.name" style="width: 370px;" maxlength="25"/>
      </el-form-item>
    <!--  <el-form-item label="色号" prop="color">
        <el-input v-model="form.color" style="width: 370px;" maxlength="10"/>
      </el-form-item>
      <el-form-item label="纤度" prop="fineness">
        <el-input v-model="form.fineness" style="width: 370px;" maxlength="10"/>
      </el-form-item>-->
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
import { add, edit } from '@/api/chemicalFiberProduct'
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
        model: '',
        name: '',
        color: '',
        fineness: '',
        createDate: '',
        createUser: '',
        unit: '',
        delFlag: ''
      },
      rules: {
        model: [
          {
            required: true, message: '请输入产品型号', trigger: 'blur'
          }
        ],
        name: [
          {
            required: true, message: '请输入产品名称', trigger: 'blur'
          }
        ],
        color: [
          {
            required: true, message: '请输入产品颜色', trigger: 'blur'
          }
        ],
        fineness: [
          {
            required: true, message: '请输入产品纤度', trigger: 'blur'
          }
        ],
        unit: [
          {
            required: true, message: '计量单位', trigger: 'blur'
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
        model: '',
        name: '',
        color: '',
        fineness: '',
        createDate: '',
        createUser: '',
        delFlag: '',
        unit: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
