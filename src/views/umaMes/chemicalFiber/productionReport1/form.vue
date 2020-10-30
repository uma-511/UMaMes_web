<template>

  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="修改"
    width="90%"
  >
    <div class="dialog-footer">
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-search"
        @click="model(2)"
      >显示净重</el-button>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-search"
        @click="model(1)"
      >显示标签</el-button>
      <el-tag class="filter-item" type="success">总件数 {{ form.packetNumber }}</el-tag>
      <el-tag class="filter-item" type="success">总净重 {{ form.netWeight }} KG</el-tag>
    </div>

    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      style="width: 100%;"
    >
      <el-table-column
        type="index"
        width="50"
        label="行号"
        align="center"/>
      <el-table-column prop="list1" label="1"align="center"/>
      <el-table-column prop="list2" label="2"align="center"/>
      <el-table-column prop="list3" label="3"align="center"/>
      <el-table-column prop="list4" label="4"align="center"/>
      <el-table-column prop="list5" label="5"align="center"/>
      <el-table-column prop="list6" label="6"align="center"/>
      <el-table-column prop="list7" label="7"align="center"/>
      <el-table-column prop="list8" label="8"align="center"/>
      <el-table-column prop="list9" label="9"align="center"/>
      <el-table-column prop="list10" label="10"align="center"/>
      <el-table-column prop="sum" label="小计"align="center"/>

    </el-table>
      <el-pagination
        :total="total"
        :current-page="page + 1"
        style="margin-top: 8px;"
        layout="total, prev, pager, next"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
  </el-dialog>
</template>

<script>
import { parseTime, downloadFile, parseTimeToDate } from '@/utils/index'
import initData from '@/mixins/initData'
import checkPermission from '@/utils/permission'
export default {
  mixins: [initData],
  data() {
    return {
      loading: false, dialog: false,
      form: {
        machine: '',
        shifts: '',
        model: '',
        color: '',
        fineness: '',
        prodId: '',
        time: '',
        model: '',
        netWeight: '',
        packetNumber: ''
      }
    }
  },
  created() {
    this.resetForm()
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    parseTimeToDate,
    checkPermission,
    beforeInit() {
      this.url = 'api/chemicalFiberProductionReport/getDateil'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      if ( this.form.machine ) { this.params["machine"] = this.form.machine }
      if ( this.form.shifts ) { this.params["shifts"] = this.form.shifts }
      if ( this.form.color ) { this.params["color"] = this.form.color }
      if ( this.form.fineness ) { this.params["fineness"] = this.form.fineness }
      if ( this.form.prodId ) { this.params["prodId"] = this.form.prodId }
      if ( this.form.time ) { this.params["tempStartTime"] = this.form.time }
      if ( this.form.model ) { this.params["model"] = this.form.model }
      return true

    },
    model(id) {
      this.form.model = id
      this.init();

    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        machine: '',
        shifts: '',
        model: '',
        color: '',
        fineness: '',
        prodId: '',
        time: '',
        model: '',
        netWeight: '',
        packetNumber: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
