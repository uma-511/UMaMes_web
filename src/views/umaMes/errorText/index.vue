<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input
        v-model="query.value"
        clearable
        placeholder="输入搜索内容"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
      <el-select
        v-model="query.type"
        clearable
        placeholder="类型"
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in queryTypeOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
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
          v-permission="['admin','customer:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >新增</el-button>
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

    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column
        type="index"
        width="200"
        label="编号"
        align="center"/>
      <el-table-column prop="labelNumber" label="标签号"align="center"/>
      <el-table-column prop="labelError" label="删除原因"align="center"/>
      <el-table-column prop="labelStatus" label="状态"align="center">
        <template slot-scope="scope">
          <div>
            <span>{{ typeValue[scope.row.labelStatus] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建日期"align="center">
        <template slot-scope="scope">
          <span>{{ parseTimeToDate(scope.row.createDate) }}</span>
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
export default {
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      typeValue: {
        0: '待入仓',
        1: '入仓',
        9: '托板入仓',
        2: '出仓',
        3: '作废',
        4: '返仓',
        5: '退货'
      },
      queryTypeOptions: [
        { key: 'labelNumber', display_name: '标签号' },
        // { key: 'type', display_name: '扫描类型（入库：RK 出库：SH 退库：TK 退货：TH）' },
        { key: 'labelStatus', display_name: '状态' }
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
      this.url = 'api/errorText'
      const sort = 'id,desc'
      this.params = {page: this.page, size: this.size, sort: sort}
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) {
        this.params[type] = value
      }
      return true
    }

  }
}
</script>

<style scoped>

</style>
