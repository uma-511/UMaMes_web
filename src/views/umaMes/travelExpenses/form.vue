<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="发货地" >
        <el-select
          v-model="form.startPlace"
          :loading="customerLoading"
          :remote-method="customerRemoteMethod"
          filterable
          allow-create
          remote
          reserve-keyword
          placeholder="输入发货地关键词"
          style="width: 370px;"
          @focus="cleanUpOptions"
        >
          <el-option
            v-for="item in customerOptions"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="目的地" >
        <el-select
          v-model="form.endPlace"
          :loading="customerLoading"
          :remote-method="customerRemoteMethod"
          filterable
          allow-create
          remote
          reserve-keyword
          placeholder="输入目的地关键词"
          style="width: 370px;"
          @focus="cleanUpOptions"
        >
          <el-option
            v-for="item in customerOptions"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="拖头费用" >
        <el-input v-model="form.tractorPrice" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="厢式车费用" >
        <el-input v-model="form.vanPrice" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="槽罐车费用" >
        <el-input v-model="form.tankPrice" style="width: 370px;"/>
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
import { add, edit } from '@/api/travelExpenses'
import { getCustomerList } from '@/api/customer'
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
      customerOptions: [],
      customerLoading: false,
      form: {
        id: '',
        startPlace: '',
        endPlace: '',
        createUser: '',
        createTime: '',
        price: '',
        tractorPrice: '',
        vanPrice: '',
        tankPrice: '',
        enable: ''
      },
      rules: {
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    // 查询客户名称的下拉列表
    customerRemoteMethod(query) {
      if (query !== '') {
        this.customerLoading = true
        this.customerOptions = []
        const params = { name: query }
        getCustomerList(params).then(res => {
          this.customerLoading = false
          this.customerList = res
          this.customerOptions = this.customerList.filter(item => {
            return item
          })
        })
      } else {
        this.customerOptions = []
      }
    },
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    // 清空下拉框
    cleanUpOptions() {
      this.customerOptions = []
    },
    subThenCreate() {
      if (this.form.startPlace == this.form.endPlace) {
        this.$notify({
          title: '发货地不能与目的地相同',
          type: 'success',
          duration: 2500
        })
        return
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
        startPlace: '',
        endPlace: '',
        createUser: '',
        createTime: '',
        price: '',
        tractorPrice: '',
        vanPrice: '',
        tankPrice: '',
        enable: ''
      }
    },
    doAdd() {
      if (this.form.startPlace == this.form.endPlace) {
        this.$notify({
          title: '发货地不能与目的地相同',
          type: 'success',
          duration: 2500
        })
        return
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
    },
    doEdit() {
      if (this.form.startPlace == this.form.endPlace) {
        this.$notify({
          title: '发货地不能与目的地相同',
          type: 'success',
          duration: 2500
        })
        return
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
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        startPlace: '',
        endPlace: '',
        createUser: '',
        createTime: '',
        price: '',
        tractorPrice: '',
        vanPrice: '',
        tankPrice: '',
        enable: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
