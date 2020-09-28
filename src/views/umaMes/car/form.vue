<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="550px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
      <el-form-item label="车牌号" prop="carNumber">
        <el-input v-model="form.carNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="车辆类型" prop="carType">
        <el-select
          v-model="form.carType"
          placeholder="请选择车辆类型"
          style="width: 370px;">
          <el-option
            v-for="item in typeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="负责人" >
        <el-select
          v-model="form.carDirector"
          :loading="userLoading"
          :remote-method="transporterRemoteMethod"
          filterable
          allow-create
          remote
          reserve-keyword
          placeholder="输入负责人关键字"
          style="width: 370px;"
          @focus="cleanUpOptions"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.realname"
            :label="item.realname"
            :value="item.realname"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审理周期">
        <el-select
          v-model="form.trialCycle"
          placeholder="请选择审理周期"
          style="width: 370px;">
          <el-option
            v-for="item in option"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上次审核日期" >
        <el-date-picker v-model="form.lastTrial" type="date" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="预计审核日期" >
        <el-date-picker :disabled="true" v-model="form.expectDate" type="date" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="isAdd" :loading="loading" type="primary" @click="subThenCreate">确认并继续新增</el-button>
      <!--<el-popover
        :ref="form.id"
        placement="top"
        width="180">
        <p>确定删除本条数据吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="$refs[id].doClose()">取消</el-button>
          <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(form.id)">确定</el-button>
        </div>
        <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
      </el-popover>-->
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, del } from '@/api/car'
import { getUserListByDeptId } from '@/api/user'
import { parseTimeToDate } from '@/utils/index'
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
        carNumber: '',
        carType: '',
        carDirector: '',
        trialCycle: '',
        lastTrial: '',
        expectDate: '',
        enable: ''
      },
      userLoading: false,
      userOptions: [],
      rules: {
        carNumber: [
          {
            required: true, message: '请输入车牌号码', trigger: 'blur'
          }
        ],
        carType: [
          {
            required: true, message: '请输入车辆类型', trigger: 'blur'
          }
        ]
      },
      option: [
        {
          value: '三个月',
          label: '三个月'
        }, {
          value: '六个月',
          label: '六个月'
        }, {
          value: '十二个月',
          label: '十二个月'
        }
      ],
      typeOption: [
        {
          value: '槽罐车',
          label: '槽罐车'
        }, {
          value: '厢式车',
          label: '厢式车'
        }, {
          value: '拖头车',
          label: '拖头车'
        }
      ]
    }
  },
  methods: {
    parseTimeToDate,
    cancel() {
      this.resetForm()
    },
    subDelete(id) {
      del(id).then(res => {
        this.resetForm()
        this.$refs[id].doClose()
        this.$parent.dleChangePage()
        this.$parent.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    // 清空下拉框
    cleanUpOptions() {
      this.userOptions = []
    },
    subThenCreate() {
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
        carNumber: '',
        carType: '',
        carDirector: '',
        trialCycle: '',
        lastTrial: '',
        expectDate: '',
        enable: '',
        userOptions: ''
      }
    },
    // 查询运输的下拉列表
    transporterRemoteMethod(query) {
      // 运输部deptId为18
      const idList = [18]
      const params = { deptIdList: idList + '', realname: query }
      this.userLoading = true
      getUserListByDeptId(params).then(res => {
        this.userLoading = false
        this.userList = res
        this.userOptions = this.userList.filter(item => {
          return item.realname.toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        })
      })
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
        carNumber: '',
        carType: '',
        carDirector: '',
        trialCycle: '',
        lastTrial: '',
        expectDate: '',
        enable: '',
        userOptions: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
