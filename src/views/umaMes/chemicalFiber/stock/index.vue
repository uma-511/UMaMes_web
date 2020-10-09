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
      <div style="display: inline-block;margin: 0px 2px;">
        <!--<el-button
          v-permission="['admin','chemicalFiberStock:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >新增</el-button>-->
      </div>
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
      </div>-->
      <el-tag class="filter-item" type="success">总支数 {{ sumFactPerBagNumber }} 支</el-tag>
      <el-tag class="filter-item" type="info">总吨数 {{ sumNetWeight }} T</el-tag>
     <!-- <el-tag class="filter-item" type="warning">毛重汇总 {{ sumGrossWeight }} KG</el-tag>-->
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" stripe style="width: 100%;">
      <el-table-column prop="prodModel" label="产品编号"/>
      <el-table-column prop="prodName" label="产品名称"/>
      <el-table-column prop="prodUnit" label="计量单位"/>
      <el-table-column :filter-method = "screen" prop="totalNumber" label="数量"/>
      <!--<el-table-column prop="tonNumber" label="吨数量"/>-->
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.totalNumber <= scope.row.min">
            <el-tag
              :type="stockMapping[2]"
              size="medium"
            >{{ stockValue[2] }}</el-tag>
          </div>
          <div v-else-if="scope.row.totalNumber <= scope.row.min">
            <el-tag
              :type="stockMapping[2]"
              size="medium"
            >{{ stockValue[2] }}</el-tag>
          </div>
          <div v-else-if="scope.row.min == undefined && scope.row.max == undefined || scope.row.min == 0 && scope.row.max == 0">
            <el-tag
              :type="stockMapping[0]"
              size="medium"
            >{{ stockValue[0] }}</el-tag>
          </div>
          <div v-else-if=" scope.row.totalNumber >= scope.row.max">
            <el-tag
              :type="stockMapping[1]"
              size="medium"
            >{{ stockValue[1] }}</el-tag>
          </div>
          <div v-else>
            <el-tag
              :type="stockMapping[0]"
              size="medium"
            >{{ stockValue[0] }}</el-tag>
          </div>

        </template>
      </el-table-column>
      <!--<el-table-column prop="branchNumber" label="支数量"/>-->
      <!--<el-table-column prop="totalBag" label="总包数"/>-->
      <!--<el-table-column :formatter="maxformatter" prop="max" label="最大值" />
      <el-table-column :formatter="maxformatter" prop="min" label="最小值"/>-->
      <!-- <el-table-column prop="flag" label="库存指标"/> -->
      <!--<el-table-column prop="status" label="支状态">
        <template slot-scope="scope">
          <div v-if="scope.row.branchNumber <= scope.row.min">
            <el-tag
              :type="stockMapping[2]"
              size="medium"
            >{{ stockValue[2] }}</el-tag>
          </div>
          <div v-else-if=" scope.row.branchNumber >= scope.row.max">
            <el-tag
              :type="stockMapping[1]"
              size="medium"
            >{{ stockValue[1] }}</el-tag>
          </div>
          <div v-else>
            <el-tag
              :type="stockMapping[0]"
              size="medium"
            >{{ stockValue[0] }}</el-tag>
          </div>
        </template>
      </el-table-column>-->
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
          <!-- <el-popover
            v-permission="['admin','chemicalFiberStock:del']"
            :ref="scope.row.id"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="subDelete(scope.row.id)"
              >确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>-->
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
import { del, downloadChemicalFiberStock, getSummaryData } from '@/api/chemicalFiberStock'
import { downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      sumFactPerBagNumber: 0,
      sumNetWeight: 0,
      sumGrossWeight: 0,isType : null,
      queryTypeOptions: [
        { key: 'prodModel', display_name: '产品编号' },
        { key: 'prodName', display_name: '产品名称' },
 /*       { key: 'prodColor', display_name: '产品色号' },
        { key: 'prodFineness', display_name: '产品纤度' },*/
        { key: 'prodUnit', display_name: '计量单位' }
      ],
      query: {
        type: 'prodName'
      },
      stockMapping: {
        0: 'success',
        1: 'warning',
        2: 'info'
      },
      stockValue: {
        0: '正常',
        1: '高库存',
        2: '低库存'
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/chemicalFiberStock'
      const sort = 'prodModel,asc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      this.getSummaryData(this.params)
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
        prodId: data.prodId,
        prodModel: data.prodModel,
        prodName: data.prodName,
        prodColor: data.prodColor,
        prodFineness: data.prodFineness,
        totalNetWeight: data.totalNetWeight,
        totalTare: data.totalTare,
        totalGrossWeight: data.totalGrossWeight,
        totalNumber: data.totalNumber,
        totalBag: data.totalBag,
        prodUnit: data.prodUnit,
        max: data.max,
        min: data.min,
        flag: data.flag,
        status: data.status
      }
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadChemicalFiberStock(this.params).then(result => {
        downloadFile(result, 'ChemicalFiberStock列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    // 获取汇总数据
    getSummaryData(params) {
      getSummaryData(params).then((res) => {
        this.sumFactPerBagNumber = res.data.sumFactPerBagNumber
        this.sumNetWeight = res.data.sumNetWeight
        this.sumGrossWeight = res.data.sumGrossWeight
      })
    },
    screen(value, row) {
      return
    },
    kgformatter(row, column, cellValue, index) {
      return cellValue + ' KG'
    },
    maxformatter(row, column, cellValue, index) {
      if (cellValue == null || cellValue === 0) {
        return ''
      } else {
        return cellValue
      }
    }
  }
}
</script>

<style scoped>
</style>
