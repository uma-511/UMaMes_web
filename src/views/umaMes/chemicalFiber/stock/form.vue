<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="产品id" >
        <el-input v-model="form.prodId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="产品型号" >
        <el-input v-model="form.prodModel" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="产品名称" >
        <el-input v-model="form.prodName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="产品色号" >
        <el-input v-model="form.prodColor" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="产品纤度" >
        <el-input v-model="form.prodFineness" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="总净重" >
        <el-input v-model="form.totalNetWeight" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="总皮重" >
        <el-input v-model="form.totalTare" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="总毛重" >
        <el-input v-model="form.totalGrossWeight" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="总个数" >
        <el-input v-model="form.totalNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="总件数" >
        <el-input v-model="form.totalBag" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="最大值" >
        <el-input v-model="form.max" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="最小值" >
        <el-input v-model="form.min" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="库存指标" >
        <el-input v-model="form.flag" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="状态" >
        <el-input v-model="form.status" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/chemicalFiberStock'
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
        prodId: '',
        prodModel: '',
        prodName: '',
        prodColor: '',
        prodFineness: '',
        totalNetWeight: '',
        totalTare: '',
        totalGrossWeight: '',
        totalNumber: '',
        totalBag: '',
        max: '',
        min: '',
        flag: '',
        status: ''
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
        prodId: '',
        prodModel: '',
        prodName: '',
        prodColor: '',
        prodFineness: '',
        totalNetWeight: '',
        totalTare: '',
        totalGrossWeight: '',
        totalNumber: '',
        totalBag: '',
        max: '',
        min: '',
        flag: '',
        status: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
