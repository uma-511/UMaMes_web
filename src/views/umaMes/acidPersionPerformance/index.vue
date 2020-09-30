<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-checkbox
        v-model="showUnEnable"
        label="查询失效单"
        style="margin-top: 1px"
        @change="toQuery"
      />
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="person" label="责任人"/>
      <el-table-column prop="taskDate" label="任务日期">
        <template slot-scope="scope">
          <span>{{ parseTimeToDate(scope.row.taskDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productCode" label="产品编号"/>
      <el-table-column prop="productName" label="产品名称"/>
      <el-table-column prop="number" label="桶数"/>
      <el-table-column prop="specifications" label="规格(公斤)"/>
      <el-table-column prop="weight" label="吨数"/>
      <el-table-column prop="unitPrice" label="单价（元）"/>
      <el-table-column prop="price" label="金额"/>
      <el-table-column prop="enable" label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.enable == false">
            <el-tag
              type="info"
              size="medium"
            >已失效</el-tag>
          </div>
          <div v-if="scope.row.enable == true">
            <el-tag
              type="success"
              size="medium"
            >正常</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTimeToDate(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','acidPersionPerformance:edit','acidPersionPerformance:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','acidPersionPerformance:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','acidPersionPerformance:del']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
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
import { del, downloadAcidPersionPerformance } from '@/api/acidPersionPerformance'
import { parseTimeToDate, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      showUnEnable: false,
      queryTypeOptions: [
        { key: 'person', display_name: '责任人' },
        { key: 'taskDate', display_name: '任务日期' },
        { key: 'productName', display_name: '产品名称' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTimeToDate,
    checkPermission,
    beforeInit() {
      this.url = 'api/acidPersionPerformance'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      const checkEnables = this.showUnEnable
      this.params['showUnEnable'] = checkEnables
      if (type && value) { this.params[type] = value }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
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
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        person: data.person,
        personId: data.personId,
        taskDate: data.taskDate,
        productCode: data.productCode,
        productName: data.productName,
        number: data.number,
        specifications: data.specifications,
        weight: data.weight,
        unitPrice: data.unitPrice,
        price: data.price,
        enable: data.enable,
        createDate: data.createDate
      }
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadAcidPersionPerformance(this.params).then(result => {
        downloadFile(result, 'AcidPersionPerformance列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
