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
      <el-date-picker
        v-model="dateQuery"
        class="el-range-editor--small filter-item"
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
      >搜索</el-button>
    </div>
    <!--表格渲染-->
    <el-table  v-loading="loading"
               :data="data"
               size="small"
               max-height="530"
               @row-click="detailList($event)"
                >
      <el-table-column prop="palletNumber" width="125px" label="托板号"/>
      <el-table-column prop="prodModel" label="料号"/>
      <el-table-column prop="prodName" label="品名"/>
      <el-table-column prop="prodColor" label="色号"/>
      <el-table-column prop="prodFineness" label="纤度"/>
      <el-table-column prop="totalBag" width="55px" label="包数"/>
      <el-table-column prop="totalNumber" width="55px" label="个数"/>
      <el-table-column :formatter="kgformatter" width="55px" prop="netWeight" label="净重"/>
      <el-table-column prop="tare" width="55px" label="皮重"/>
      <el-table-column prop="grossWeight" width="55px" label="毛重"/>
      <el-table-column prop="totalBag" label="出库包数"/>
      <el-table-column prop="totalNumber" label="出库个数"/>
      <el-table-column prop="packer" label="包装员"/>
      <el-table-column prop="printStatus" label="打印状态">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag
              :type="typePrintStatus[scope.row.printStatus]"
              size="medium"
            >{{ typePrintStatusValue[scope.row.printStatus] }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="printNumber" label="打印次数"/>
      <el-table-column prop="printTime" width="135px" label="打印时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.printTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="printEndTime" width="135px" label="最后打印时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.printEndTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-tickets"
            @click="exportPoundExcel(scope.row)"
            @click.stop
          >打印</el-button>

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
      max-height="400"
      @current-change="pageChange"
    />
    <el-table v-loading="dataLoading"
              :data="dataList"
              size="small"
              max-height="530">
      <el-table-column prop="labelNumber" width="125px" label="条码号" />
      <el-table-column prop="prodModel" label="料号"/>
      <el-table-column prop="prodName" label="品名"/>
      <el-table-column prop="color" label="纤度"/>
      <el-table-column prop="fineness" label="色号"/>
      <el-table-column prop="factPerBagNumber" label="个数"/>
      <el-table-column prop="netWeight" label="净重"/>
      <el-table-column prop="tare" label="皮重"/>
      <el-table-column prop="grossWeight" label="毛重"/>
      <el-table-column prop="shifts" label="班次"/>
      <el-table-column prop="machine" label="机台号"/>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag
              :type="typeMapping[scope.row.status]"
              size="medium"
            >{{ typeValue[scope.row.status] }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="packer" label="包装员"/>
    </el-table>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import { parseTime, downloadFile } from '@/utils/index'
import { getPalletDateilList } from '@/api/chemicalFiberPalletDetail'
import { exportPoundExcel } from '@/api/chemicalFiberPallet'
export default {
  mixins: [initData],
  data() {
    return {
      loading: false,
      dataLoading:false,dateQuery: '',
      form: {
        palletId: ''
      },
      queryTypeOptions: [
        { key: 'palletNumber', display_name: '条码号' },
        { key: 'packer', display_name: '包装员' },
        { key: 'fineness', display_name: '纤度' },
        { key: 'color', display_name: '色号' },
      ],
      typeMapping: {
        0: '',
        1: 'success',
        2: '',
        3: 'info',
        4: 'warning',
        5: 'danger',
        11: 'success',
        10: ''
      },
      typeValue: {
        0: '待入仓',
        1: '已入仓',
        9: '托板入仓',
        10: '托板-',
        11: '托板+',
        2: '已出仓',
        3: '已作废',
        4: '已返仓',
        5: '已退货'
      },
      typePrintStatus: {
        0: 'danger',
        1: 'success'
      },
      typePrintStatusValue: {
        0: '未打印',
        1: '已打印'
      }
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
      const query = this.query
      const type = query.type
      const value = query.value
      const status = query.status
      const dateQuery = this.dateQuery
      if (type && value) {
        this.params[type] = value
      }
      if (status) {
        this.params['status'] = status
      }
      if (dateQuery) {
        this.params['tempStartTime'] = dateQuery[0].getTime()
        this.params['tempEndTime'] = dateQuery[1].getTime()
      }
      return true
    },
    detailList(data) {
      this.form.palletId = data.palletNumber
      this.dataLoading = true
      getPalletDateilList(this.form).then(res => {
        this.dataList = res
        for (var i = 0; i < res.length; i++) {
          this.dataList[i].prodModel = res[i].color + "-" + res[i].fineness
          this.dataList[i].prodName = res[i].color + "-" + res[i].fineness

        }
        this.dataLoading = false
      })
    },
    exportPoundExcel(data) {
      this.loading = true
      exportPoundExcel(data).then(result => {
        this.init();
        this.loading = false
        downloadFile(result, '磅码单导出', 'xls')
      }).catch(() => {
        this.loading = false
      })
    },

  }
}
</script>

<style>
  .el-table .warning-row {
    background: #c5c8ce;
  }

  .el-table .success-row {
    background: #ffffff;
  }

  body .el-table th.gutter {
    display: table-cell !important
  }


</style>
