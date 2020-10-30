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
        <el-button
          v-permission="['admin','chemicalFiberLabelInventory:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >新增</el-button>
      </div>
      <!-- 导出 -->
      <div style="display: inline-block;">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download"
        >导出</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="labelNumber" label="标签编号（条码号）"/>
      <el-table-column prop="productionId" label="生产单id"/>
      <el-table-column prop="productId" label="产品id"/>
      <el-table-column prop="status" label="便签状态 0：待入库 1：入库 2：出库 3：作废 4：退库 5：退货"/>
      <el-table-column prop="printTime" label="打印时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.printTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="factPerBagNumber" label="实际每包个数"/>
      <el-table-column prop="netWeight" label="净重"/>
      <el-table-column prop="tare" label="皮重"/>
      <el-table-column prop="grossWeight" label="毛重"/>
      <el-table-column prop="shifts" label="班次"/>
      <el-table-column prop="packer" label="包装员"/>
      <el-table-column prop="machine" label="机台号"/>
      <el-table-column prop="flowNumber" label="流水号"/>
      <el-table-column prop="fineness" label="规格"/>
      <el-table-column prop="color" label="色号"/>
      <el-table-column prop="coreWeight" label="芯重"/>
      <el-table-column
        v-if="checkPermission(['admin','chemicalFiberLabelInventory:edit','chemicalFiberLabelInventory:del'])"
        label="操作"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['admin','chemicalFiberLabelInventory:edit']"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          />
          <el-popover
            v-permission="['admin','chemicalFiberLabelInventory:del']"
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
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadChemicalFiberLabelInventory } from '@/api/chemicalFiberLabelInventory'
import { parseTime, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'labelNumber', display_name: '标签编号（条码号）' }
      ]
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
      this.url = 'api/chemicalFiberLabelInventory'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
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
        labelNumber: data.labelNumber,
        productionId: data.productionId,
        productId: data.productId,
        status: data.status,
        printTime: data.printTime,
        factPerBagNumber: data.factPerBagNumber,
        netWeight: data.netWeight,
        tare: data.tare,
        grossWeight: data.grossWeight,
        shifts: data.shifts,
        packer: data.packer,
        machine: data.machine,
        flowNumber: data.flowNumber,
        fineness: data.fineness,
        color: data.color,
        coreWeight: data.coreWeight
      }
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadChemicalFiberLabelInventory(this.params).then(result => {
        downloadFile(result, 'ChemicalFiberLabelInventory列表', 'xlsx')
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
