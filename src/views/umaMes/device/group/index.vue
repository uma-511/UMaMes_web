<template>
  <el-row>
    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="margin-bottom: 10px">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="role-span">分组</span>
        </div>
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
                v-permission="['admin','chemicalFibeDeviceGroup:add']"
                class="filter-item"
                size="mini"
                type="primary"
                icon="el-icon-plus"
                @click="add"
              >新增</el-button>
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
          </div>
          <!--表单组件-->
          <eForm ref="form" :is-add="isAdd" @fatherMethod="fatherMethod"/>
          <!--表格渲染-->
          <el-table
            v-loading="loading"
            :data="data"
            size="small"
            style="width: 100%;"
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column prop="name" label="设备分组名称"/>
            <!-- <el-table-column prop="status" label="使用状态：0：停用 1：正常"/> -->
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#409EFF"
                  inactive-color="#F56C6C"
                  @change="changeEnabled(scope.row, scope.row.status)"
                />
              </template>
            </el-table-column>
            <el-table-column
              v-if="checkPermission(['admin','chemicalFibeDeviceGroup:edit','chemicalFibeDeviceGroup:del'])"
              label="操作"
              width="150px"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['admin','chemicalFibeDeviceGroup:edit']"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="edit(scope.row)"
                />
                <el-popover
                  v-permission="['admin','chemicalFibeDeviceGroup:del']"
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
      </el-card>
    </el-col>
    <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18" style="margin-bottom: 10px">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="role-span">设备</span>
        </div>
        <deviceIndex ref="deviceIndex"/>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import checkPermission from '@/utils/permission'
import { downloadFile } from '@/utils/index'
import initData from '@/mixins/initData'
import { del, downloadChemicalFibeDeviceGroup, edit } from '@/api/chemicalFibeDeviceGroup'
import eForm from './form'
import deviceIndex from '../index'
export default {
  components: { eForm, deviceIndex },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'name', display_name: '设备分组名称' }
        // { key: 'status', display_name: '使用状态：0：停用 1：正常' }
      ]
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
      this.url = 'api/chemicalFibeDeviceGroup'
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
        status: data.status
      }
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadChemicalFibeDeviceGroup(this.params).then(result => {
        downloadFile(result, 'ChemicalFibeDeviceGroup列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    changeEnabled(data) {
      edit(data).then(res => {
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    handleCurrentChange(data) {
      if (data) {
        this.$refs.deviceIndex.data = []
        this.$refs.deviceIndex.initDeviceGroupId(data)
        this.$refs.deviceIndex.toQuery()
      } else {
        this.$refs.deviceIndex.data = []
      }
    },
    fatherMethod() {
      this.init()
    }
  }
}
</script>

<style scoped>
</style>
