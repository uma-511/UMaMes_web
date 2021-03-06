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
          v-permission="['admin','customer:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="code" label="客户编号"/>
      <el-table-column prop="name" label="客户名称"/>
      <el-table-column prop="fullName" show-overflow-tooltip="true" label="客户全称"/>
      <el-table-column prop="address" show-overflow-tooltip="true" label="客户地址"/>
      <el-table-column prop="contacts" show-overflow-tooltip="true" label="联系人"/>
      <el-table-column prop="contactPhone" show-overflow-tooltip="true" label="联系电话"/>
      <el-table-column prop="reconciliation" show-overflow-tooltip="true" label="对账日"/>
      <el-table-column prop="account" label="支配金额"/>
      <el-table-column prop="totalArrears" label="上期欠款"/>
      <el-table-column prop="currentArrears" label="本月欠款"/>
      <el-table-column prop="remark" show-overflow-tooltip="true" label="备注"/>
      <!--<el-table-column prop="createDate" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTimeToDate(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" label="创建人"/>-->
      <el-table-column
        v-if="checkPermission(['admin','customer:edit','customer:del'])"
        label="操作"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['admin','customer:edit']"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          />
          <el-popover
            v-permission="['admin','customer:del']"
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
import { del, downloadCustomer } from '@/api/customer'
import { parseTime, downloadFile, parseTimeToDate } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'name', display_name: '客户名称' },
        { key: 'code', display_name: '客户编号' },
        { key: 'address', display_name: '客户地址' },
        { key: 'contacts', display_name: '联系人' },
        { key: 'contactPhone', display_name: '联系电话' }
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
    parseTimeToDate,
    checkPermission,
    beforeInit() {
      this.url = 'api/customer'
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
        name: data.name,
        code: data.code,
        address: data.address,
        contacts: data.contacts,
        contactPhone: data.contactPhone,
        remark: data.remark,
        createDate: data.createDate,
        createUser: data.createUser,
        delFlag: data.delFlag,
        fullName: data.fullName,
        account: data.account,
        totalArrears: data.totalArrears,
        currentArrears: data.currentArrears,
        reconciliation: data.reconciliation
      }
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadCustomer(this.params).then(result => {
        downloadFile(result, 'Customer列表', 'xlsx')
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
