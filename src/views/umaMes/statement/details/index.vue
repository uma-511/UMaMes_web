<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','umaChemicalFiberStatementDetails:add']"
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
      <el-table-column prop="id" label="id"/>
      <el-table-column prop="statementId" label="对账单主键"/>
      <el-table-column prop="scanNumber" label="送货单号"/>
      <el-table-column prop="scanDate" label="送货日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.scanDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="prodName" label="产品名称"/>
      <el-table-column prop="totalBag" label="总件数"/>
      <el-table-column prop="netWeight" label="重量"/>
      <el-table-column prop="sellingPrice" label="单价"/>
      <el-table-column prop="totalPrice" label="金额"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column prop="advanceCharge" label="预付款"/>
      <el-table-column prop="amountDeducted" label="扣除金额"/>
      <el-table-column
        v-if="checkPermission(['admin','umaChemicalFiberStatementDetails:edit','umaChemicalFiberStatementDetails:del'])"
        label="操作"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['admin','umaChemicalFiberStatementDetails:edit']"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          />
          <el-popover
            v-permission="['admin','umaChemicalFiberStatementDetails:del']"
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
import { del, downloadUmaChemicalFiberStatementDetails } from '@/api/umaChemicalFiberStatementDetails'
import { parseTime, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false
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
      this.url = 'api/umaChemicalFiberStatementDetails'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
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
        statementId: data.statementId,
        scanNumber: data.scanNumber,
        scanDate: data.scanDate,
        prodName: data.prodName,
        totalBag: data.totalBag,
        netWeight: data.netWeight,
        sellingPrice: data.sellingPrice,
        totalPrice: data.totalPrice,
        remark: data.remark,
        advanceCharge: data.advanceCharge,
        amountDeducted: data.amountDeducted
      }
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadUmaChemicalFiberStatementDetails(this.params).then(result => {
        downloadFile(result, 'UmaChemicalFiberStatementDetails列表', 'xlsx')
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
