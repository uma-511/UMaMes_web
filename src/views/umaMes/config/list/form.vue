<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <!-- <el-form-item label="分类id" >
        <el-input v-model="form.classifyId" style="width: 370px;"/>
      </el-form-item> -->
      <el-form-item label="配置名称" >
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="配置值" >
        <el-input v-model="form.value" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="默认值" >
        <el-input v-model="form.isDefault" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/config'
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
        classifyId: '',
        name: '',
        value: '',
        isDefault: ''
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
      if (this.form.classifyId === 0) {
        this.$notify.error({
          title: '错误',
          message: '请选择左侧变量设置'
        })
        this.loading = false
        return
      }
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
        classifyId: '',
        name: '',
        value: '',
        isDefault: ''
      }
    },
    initClassifyId(classifyId) {
      this.form.classifyId = classifyId
    }
  }
}
</script>

<style scoped>

</style>
