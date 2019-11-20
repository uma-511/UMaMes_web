<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="条码号" >
        <el-input v-model="form.labelNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="生产单id" >
        <el-input v-model="form.productionId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="状态" >
        <el-input v-model="form.status" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="打印时间" >
        <el-date-picker v-model="form.printTime" type="datetime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="每袋个数" >
        <el-input v-model="form.factPerBagNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="净重" >
        <el-input v-model="form.netWeight" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="皮重" >
        <el-input v-model="form.tare" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="毛重" >
        <el-input v-model="form.grossWeight" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="班次" >
        <el-input v-model="form.shifts" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="包装员" >
        <el-input v-model="form.packer" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="入库单号" >
        <el-input v-model="form.rkNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="送货单号" >
        <el-input v-model="form.shNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="退库单号" >
        <el-input v-model="form.tkNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="退货单号" >
        <el-input v-model="form.thNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="入库扫描时间" >
        <el-date-picker v-model="form.rkScanTime" type="datetime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="出库扫描时间" >
        <el-date-picker v-model="form.shScanTime" type="datetime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="退库扫描时间" >
        <el-date-picker v-model="form.tkScanTime" type="datetime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="退货扫描时间" >
        <el-date-picker v-model="form.thScanTime" type="datetime" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/chemicalFiberLabel'
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
        labelNumber: '',
        productionId: '',
        status: '',
        printTime: '',
        factPerBagNumber: '',
        netWeight: '',
        tare: '',
        grossWeight: '',
        shifts: '',
        packer: '',
        rkNumber: '',
        shNumber: '',
        tkNumber: '',
        thNumber: '',
        rkScanTime: '',
        shScanTime: '',
        tkScanTime: '',
        thScanTime: ''
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
        labelNumber: '',
        productionId: '',
        status: '',
        printTime: '',
        factPerBagNumber: '',
        netWeight: '',
        tare: '',
        grossWeight: '',
        shifts: '',
        packer: '',
        rkNumber: '',
        shNumber: '',
        tkNumber: '',
        thNumber: '',
        rkScanTime: '',
        shScanTime: '',
        tkScanTime: '',
        thScanTime: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
