<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-select
        v-model="query.status"
        clearable
        placeholder="状态"
        class="filter-item"
        style="width: 130px"
      >
        <el-option key="RK" label="在线" value="1"/>
        <el-option key="TB" label="离线" value="2"/>
      </el-select>
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery"
      >搜索</el-button>
      <!-- 新增 -->
      <!--<div style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >x</el-button>
      </div>-->
      <!-- 导出 -->
      <!-- <div style="display: inline-block;">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download"
        >导出</el-button>
      </div> -->
    </div>

    <eForm ref="form"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column
        type="index"
        width="200"
        label="序号"
        align="center"/>
      <el-table-column prop="ip" label="ip"align="center"/>
      <el-table-column prop="name" label="机台名称"align="center"/>
      <el-table-column prop="status" label="状态"align="center">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag
              :type="statusMapping[scope.row.status]"
              size="medium"
            >{{ statusValue[scope.row.status] }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission(['admin','chemicalFiberStock:edit','chemicalFiberStock:del'])"
        label="操作"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['admin','chemicalFiberStock:edit']"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          />
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
      @current-change="pageChange"
    />

  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { parseTime, downloadFile, parseTimeToDate } from '@/utils/index'
import eForm from './form'
export default {
  components: {eForm},
  mixins: [initData],
  data() {
    return {
      delLoading: false, dialogVisible: false,
      statusValue: {
        1: '在线',
        2: '离线',
      },
      statusMapping: {
        '1': 'success',
        '2': 'warning',
      },
      queryTypeOptions: [
        {key: 'ip', display_name: 'ip号'},
        // { key: 'type', display_name: '扫描类型（入库：RK 出库：SH 退库：TK 退货：TH）' },
      ],
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
      this.url = 'api/equipment'
      const sort = 'id,desc'
      this.params = {page: this.page, size: this.size, sort: sort}
      const query = this.query
      const type = query.type
      const value = query.value
      const status = query.status
      if (type && value) {
        this.params[type] = value
      }
      if (status) {
        this.params['status'] = status
      }
      return true
    },
    edit(data) {
      const _this = this.$refs.form
      _this.form = {
        ip: data.ip,
        name: data.name,
        id: data.id,
        status: data.status
      }
      _this.dialog = true

    }
  }
}
</script>

<style scoped>

</style>
