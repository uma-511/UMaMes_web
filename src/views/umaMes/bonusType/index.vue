<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
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
    <el-row :gutter="15">
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">类型列表</span>
          </div>
          <el-table v-loading="loading" :data="data" size="small" style=" width: 100%;" @current-change="handleCurrentChange">
            <el-table-column prop="type" label="奖金类别"/>
            <el-table-column prop="price" label="金额"/>
            <!--<el-table-column prop="createTime" label="创建日期">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>-->
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
            <el-table-column label="操作" width="150px" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
                <!--<el-popover
                  v-permission="['admin','bonusType:del']"
                  :ref="scope.row.id"
                  placement="top"
                  width="180">
                  <p>确定删除本条数据吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                    <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
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
            @current-change="pageChange"/>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="1">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定类型分配周期" placement="top">
              <span class="role-span">周期分配</span>
            </el-tooltip>
            <el-button
              :disabled="!showButton"
              :loading="cycleLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveCycle">保存</el-button>
          </div>
          <el-tree
            ref="cycle"
            :data="cycleTree"
            :default-checked-keys="cycleIds"
            :props="defaultProps"
            check-strictly
            accordion
            show-checkbox
            node-key="id"/>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定类型分配周期" placement="top">
              <span class="role-span">岗位分配</span>
            </el-tooltip>
            <el-button
              :disabled="!showButton"
              :loading="bonusJobLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveBonusJob">保存</el-button>
          </div>
          <el-tree
            ref="bonusJob"
            :data="bonusJobTree"
            :default-checked-keys="bonusJobIds"
            :props="defaultJobProps"
            check-strictly
            accordion
            show-checkbox
            node-key="id"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, getCycleMenusTree, getBonusJobsTree, editCycle, editBonusJob, get } from '@/api/bonusType'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      defaultProps: {
        label: 'label'
      },
      defaultJobProps: {
        label: 'label'
      },
      cycleTree: [],
      bonusJobTree: [],
      delLoading: false,
      currentId: 0,
      cycleLoading: false,
      bonusJobLoading: false,
      showButton: false,
      bonusJobs: [],
      bonusJobIds: [],
      cycleIds: [],
      queryTypeOptions: [
        { key: 'type', display_name: '奖金类别' }
      ]
    }
  },
  created() {
    this.getCycleTree()
    this.getJobTree()
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/bonusType'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      // 清空菜单的选中
      this.$refs.cycle.setCheckedKeys([])
      this.$refs.bonusJob.setCheckedKeys([])
      return true
    },
    handleCurrentChange(val) {
      if (val) {
        const _this = this
        // 清空菜单的选中
        this.$refs.cycle.setCheckedKeys([])
        this.$refs.bonusJob.setCheckedKeys([])
        // 保存当前的类型id
        this.currentId = val.id
        // 点击后显示按钮
        this.showButton = true
        // 初始化
        this.cycleIds = []
        this.bonusJobIds = []
        // 菜单数据需要特殊处理
        val.cycles.forEach(function(data, index) {
          _this.cycleIds.push(data.id)
        })
        val.bonusJobs.forEach(function(data, index) {
          _this.bonusJobIds.push(data.id)
        })
      }
    },
    saveCycle() {
      this.cycleLoading = true
      const bonusType = { id: this.currentId, cycles: [] }
      // 得到半选的父节点数据，保存起来
      this.$refs.cycle.getHalfCheckedNodes().forEach(function(data, index) {
        const cycle = { id: data.id }
        bonusType.cycles.push(cycle)
      })
      // 得到已选中的 key 值
      this.$refs.cycle.getCheckedKeys().forEach(function(data, index) {
        const cycle = { id: data }
        bonusType.cycles.push(cycle)
      })
      editCycle(bonusType).then(res => {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        this.cycleLoading = false
        this.updateCycle()
      }).catch(err => {
        this.cycleLoading = false
        console.log(err.response.data.message)
      })
    },
    updateCycle() {
      // 无刷新更新 表格数据
      get(this.currentId).then(res => {
        for (let i = 0; i < this.data.length; i++) {
          if (res.id === this.data[i].id) {
            this.data[i].cycles = res.cycles
          }
        }
      })
    },
    saveBonusJob() {
      this.bonusJobLoading = true
      const bonusType = { id: this.currentId, bonusJobs: [] }
      // 得到半选的父节点数据，保存起来
      this.$refs.bonusJob.getHalfCheckedNodes().forEach(function(data, index) {
        const job = { id: data.id }
        bonusType.bonusJobs.push(job)
      })
      // 得到已选中的 key 值
      this.$refs.bonusJob.getCheckedKeys().forEach(function(data, index) {
        const job = { id: data }
        bonusType.bonusJobs.push(job)
      })
      editBonusJob(bonusType).then(res => {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        this.bonusJobLoading = false
        this.updateBonusJob()
      }).catch(err => {
        this.bonusJobLoading = false
        console.log(err.response.data.message)
      })
    },
    updateBonusJob() {
      // 无刷新更新 表格数据
      get(this.currentId).then(res => {
        for (let i = 0; i < this.data.length; i++) {
          if (res.id === this.data[i].id) {
            this.data[i].bonusJobs = res.bonusJobs
          }
        }
      })
    },
    getCycleTree() {
      getCycleMenusTree().then(res => {
        this.cycleTree = res
      })
    },
    getJobTree() {
      getBonusJobsTree().then(res => {
        this.bonusJobTree = res
      })
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
        type: data.type,
        price: data.price,
        createTime: data.createTime,
        enable: data.enable
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
