<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','configClassify:add']"
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
      </div> -->
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-row :gutter="7">
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">变量设置</span>
          </div>
          <el-table
            v-loading="loading"
            :data="data"
            size="small"
            style="width: 100%;"
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column prop="name" label="配置名称"/>
            <el-table-column prop="alias" label="别名"/>
            <el-table-column
              v-if="checkPermission(['admin','configClassify:edit','configClassify:del'])"
              label="操作"
              width="150px"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['admin','configClassify:edit']"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="edit(scope.row)"
                />
                <el-popover
                  v-permission="['admin','configClassify:del']"
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
        </el-card>
      </el-col>
      <!-- 授权 -->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <div slot="header" class="clearfix">
              <span class="role-span">变量值</span>
            </div>
            <listIndex ref="listIndex"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadConfigClassify } from '@/api/configClassify'
import { downloadFile } from '@/utils/index'
import eForm from './form'
import listIndex from '../list/index'
export default {
  components: { eForm, listIndex },
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
    checkPermission,
    beforeInit() {
      this.url = 'api/configClassify'
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
      this.$refs['listIndex'].initClassifyId(0)
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        name: data.name,
        alias: data.alias,
        delFlag: data.delFlag
      }
      _this.dialog = true
      this.$refs['listIndex'].initClassifyId(0)
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadConfigClassify(this.params).then(result => {
        downloadFile(result, 'ConfigClassify列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    handleCurrentChange(val) {
      if (val != null) {
        this.$refs['listIndex'].initClassifyId(val.id)
        this.$refs['listIndex'].init()
      }
    }
  }
}
</script>

<style scoped>
</style>
