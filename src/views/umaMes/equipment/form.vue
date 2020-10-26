<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="修改"
    width="500px"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="ip">
        <el-input v-model="form.ip" style="width: 370px;" :disabled="true"/>
      </el-form-item>
      <el-form-item label="机台名称">
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doEdit(form)">确认</el-button>
    </div>


  </el-dialog>

</template>

<script>
import { edit } from '@/api/equipment'
export default {
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        ip: '',
        name: '',
        status: ''
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doEdit(form){
      edit(form).then(res => {
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
        ip: '',
        name: '',
        status: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
