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
          <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" @current-change="handleCurrentChange">
            <el-table-column prop="type" label="奖金类别"/>
            <el-table-column prop="price" label="金额"/>
            <el-table-column prop="createTime" label="创建日期">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="enable" label="状态"/>
            <el-table-column v-if="checkPermission(['admin','bonusType:edit','bonusType:del'])" label="操作" width="150px" align="center">
              <template slot-scope="scope">
                <el-button v-permission="['admin','bonusType:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
                <el-popover
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
            @current-change="pageChange"/>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定类型分配周期" placement="top">
              <span class="role-span">周期分配</span>
            </el-tooltip>
            <el-button
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveMenu">保存</el-button>
          </div>
          <el-tree
            ref="menu"
            :data="menus"
            :default-checked-keys="menuIds"
            :props="defaultProps"
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
import { del, downloadBonusType, getCycleMenusTree } from '@/api/bonusType'
import { parseTime, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      defaultProps: {
        label: 'label'
      },
      delLoading: false,
      currentId: 0, menuLoading: false, showButton: false, menus: [], menuIds: [],
      queryTypeOptions: [
        { key: 'type', display_name: '奖金类别' }
      ]
    }
  },
  created() {
    this.getMenus()
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
      this.$refs.menu.setCheckedKeys([])
      return true
    },
    handleCurrentChange(val) {
      if (val) {
        const _this = this
        // 清空菜单的选中
        this.$refs.menu.setCheckedKeys([])
        // 保存当前的类型id
        this.currentId = val.id
        // 点击后显示按钮
        this.showButton = true
        // 初始化
        this.menuIds = []
        // 菜单数据需要特殊处理
        val.menus.forEach(function(data, index) {
          _this.menuIds.push(data.id)
        })
      }
    },
    saveMenu() {
      this.menuLoading = true
      const role = { id: this.currentId, menus: [] }
      // 得到半选的父节点数据，保存起来
      this.$refs.menu.getHalfCheckedNodes().forEach(function(data, index) {
        const menu = { id: data.id }
        role.menus.push(menu)
      })
      // 得到已选中的 key 值
      this.$refs.menu.getCheckedKeys().forEach(function(data, index) {
        const menu = { id: data }
        role.menus.push(menu)
      })
      /*editCycleMenu(role).then(res => {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        this.menuLoading = false
        this.update()
      }).catch(err => {
        this.menuLoading = false
        console.log(err.response.data.message)
      })*/
    },
    update() {
      // 无刷新更新 表格数据
      get(this.currentId).then(res => {
        for (let i = 0; i < this.data.length; i++) {
          if (res.id === this.data[i].id) {
            this.data[i] = res
            break
          }
        }
      })
    },
    getMenus() {
      getCycleMenusTree().then(res => {
        this.menus = res
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
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadBonusType(this.params).then(result => {
        downloadFile(result, 'BonusType列表', 'xlsx')
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
