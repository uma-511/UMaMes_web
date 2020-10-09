<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="queryValue" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="queryType" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-checkbox
        v-model="showAll"
        @change="toQuery"
      >查询所有客户</el-checkbox>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="code" label="客户编号"/>
      <el-table-column prop="name" label="客户名称"/>
      <el-table-column prop="account" label="支配额度"/>
      <el-table-column prop="overArrears" label="旧账欠款"/>
      <el-table-column
        v-if="checkPermission(['admin','customer:edit','customer:del'])"
        label="操作"
        width="250px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            icon="el-icon-edit"
            @click="changeOverArrears(scope.row)"
          >修改欠款</el-button>
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-edit"
            @click="doPay(scope.row)"
          >结算</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { getPayDetailList } from '@/api/overArrearsPayDetail'
import { parseTime } from '@/utils/index'
import { changeOverArrears } from '@/api/customer'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      showAll: false,
      payDetailList: [],
      queryTypeOptions: [
        { key: 'name', display_name: '客户名称' },
        { key: 'code', display_name: '客户编号' }
      ],
      queryType: 'name',
      queryValue: ''
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/overArrearsPayDetail'
      const sort = 'id,desc'
      const checkEnables = this.showAll
      this.params = { page: this.page, size: this.size, sort: sort }
      this.params['showAll'] = checkEnables
      if (this.queryType && this.queryValue) { this.params[this.queryType ] = this.queryValue }
      return true
    },
    changeOverArrears(data) {
      this.$prompt('修改金额', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
        inputErrorMessage: '格式不正确'
      }).then(({ value }) => {
        const params = { id: data.id, overArrears: value }
        changeOverArrears(params).then(res => {
          this.$notify({
            title: '修改成功',
            type: 'success',
            duration: 2500
          })
          this.init()
        }).catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
      })
    },
    doPay(data) {
      const _this = this.$refs.form
      const params = { 'customerId': data.id }
      getPayDetailList(params).then(res => {
        this.payDetailList = res
        _this.payDetailList = this.payDetailList.filter(item => {
          return item
        })
      })
      _this.form = {
        customerId: data.id,
        customerName: data.name,
        payDate: new Date(),
        code: data.code,
        overArrears: data.overArrears
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
