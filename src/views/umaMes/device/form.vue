<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    width="500px"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="设备ip">
        <el-input v-model="form.ip" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="设备名称">
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="类型">
        <!-- <el-input v-model="form.type" style="width: 370px;"/> -->
        <el-select v-model="form.type" placeholder="请选择" style="width: 370px;">
          <el-option
            v-for="item in deviceTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="设备类型：0：打印机 1：触摸屏 2：扫描抢 3：秤 4：标签打印机 5：手持机">
        <el-input v-model="form.type" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="使用状态：1：正常，0：停用" >
        <el-input v-model="form.status" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="设备分组id" >
        <el-input v-model="form.groupId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="设备分组名称" >
        <el-input v-model="form.groupName" style="width: 370px;"/>
      </el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/chemicalFibeDevice'
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
      tempGroupId: '',
      tempGroupName: '',
      tempStatus: '',
      form: {
        id: '',
        ip: '',
        name: '',
        type: '',
        status: '',
        groupId: '',
        groupName: ''
      },
      rules: {
      },
      deviceTypeOptions: [{
        value: 0,
        label: '打印机'
      }, {
        value: 1,
        label: '触摸屏'
      }, {
        value: 2,
        label: '扫描枪'
      }, {
        value: 3,
        label: '称'
      }, {
        value: 4,
        label: '标签打印机'
      }, {
        value: 5,
        label: '手持机'
      }, {
        value: 6,
        label: '看板'
      }]
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
      this.form.groupId = this.tempGroupId
      this.form.groupName = this.tempGroupName
      this.form.status = this.tempStatus
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
        ip: '',
        name: '',
        type: '',
        status: '',
        groupId: '',
        groupName: ''
      }
    }
  }
}
</script>

<style scoped>
</style>
