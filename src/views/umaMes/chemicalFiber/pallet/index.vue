<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
     <!-- <el-input
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
      <el-select
        v-model="query.status"
        clearable
        placeholder="状态"
        class="filter-item"
        style="width: 130px"
      >
        <el-option key="0" label="待入仓" value="0"/>
        <el-option key="1" label="已入仓" value="1"/>
        <el-option key="2" label="已出仓" value="2"/>
        <el-option key="3" label="已作废" value="3"/>
        <el-option key="4" label="已返仓" value="4"/>
        <el-option key="5" label="已退货" value="5"/>
      </el-select>
      <el-date-picker
        v-model="dateQuery"
        class="el-range-editor&#45;&#45;small filter-item"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery"
      >搜索</el-button>-->
      <!-- 新增 -->
      <!-- <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','chemicalFiberLabel:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>-->
      <!-- 导出 -->
      <!-- <div style="display: inline-block;">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出</el-button>
      </div>-->
      <!--<el-tag class="filter-item" type="success">个数汇总 {{ sumFactPerBagNumber }}</el-tag>
      <el-tag class="filter-item" type="info">净重汇总 {{ sumNetWeight }} KG</el-tag>
      <el-tag class="filter-item" type="warning">毛重汇总 {{ sumGrossWeight }} KG</el-tag>-->
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="palletNumber" label="托板号"/>
      <el-table-column prop="prodModel" label="料号"/>
      <el-table-column prop="prodName" label="品名"/>
      <el-table-column prop="prodColor" label="纤度"/>
      <el-table-column prop="prodFineness" label="色号"/>
      <el-table-column prop="totalBag" label="包数"/>
      <el-table-column prop="totalNumber" label="个数"/>
      <el-table-column :formatter="kgformatter" prop="netWeight" label="净重"/>
      <el-table-column prop="tare" label="皮重"/>
      <el-table-column prop="grossWeight" label="毛重"/>
      <el-table-column prop="totalBag" label="出库包数"/>
      <el-table-column prop="totalNumber" label="出库个数"/>
      <el-table-column prop="packer" label="包装员"/>
      <el-table-column prop="printStatus" label="打印状态">
        <!--<template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag
              :type="typeMapping[scope.row.status]"
              size="medium"
            >{{ typeValue[scope.row.status] }}</el-tag>
          </div>
        </template>-->
      </el-table-column>
      <el-table-column prop="printNumber" label="打印次数"/>
      <el-table-column prop="printTime" label="打印时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.printTime) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="checkPermission(['admin','chemicalFiberLabel:edit','chemicalFiberLabel:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','chemicalFiberLabel:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','chemicalFiberLabel:del']"
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
      </el-table-column>-->
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
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="palletNumber" label="条码号"/>
      <el-table-column prop="prodModel" label="料号"/>
      <el-table-column prop="prodName" label="品名"/>
      <el-table-column prop="prodColor" label="纤度"/>
      <el-table-column prop="prodFineness" label="色号"/>
      <el-table-column prop="totalBag" label="包数"/>
      <el-table-column prop="totalNumber" label="个数"/>
      <el-table-column :formatter="kgformatter" prop="netWeight" label="净重"/>
      <el-table-column prop="tare" label="皮重"/>
      <el-table-column prop="grossWeight" label="毛重"/>
      <el-table-column prop="totalBag" label="班次"/>
      <el-table-column prop="totalNumber" label="机台号"/>
      <el-table-column prop="packer" label="状态"/>
      <el-table-column prop="printStatus" label="包装员">
        <!--<template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag
              :type="typeMapping[scope.row.status]"
              size="medium"
            >{{ typeValue[scope.row.status] }}</el-tag>
          </div>
        </template>-->
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import { parseTime, downloadFile } from '@/utils/index'
export default {
  mixins: [initData],
  data() {
    return {
      loading: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    beforeInit() {
      this.url = 'api/chemicalFiberPallet'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      return true
    }

  }
}
</script>

<style scoped>

</style>
