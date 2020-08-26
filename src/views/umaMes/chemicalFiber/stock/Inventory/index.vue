<template>
  <div class="app-container">
    <el-date-picker
      v-model="dateQuery"
      size="mini"
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
    <el-button
      v-permission="['admin','chemicalFiberDeliveryNote:add']"
      class="filter-item"
      size="mini"
      type="primary"
      icon="el-icon-plus"
      @click="add">新增</el-button>
    <!--工具栏-->
    <div class="head-container">
      <el-table
        v-loading="loading"
        :data="data"
        size="small"
        style="width: 100%;"
      >
        <el-table-column
          label="序号"
          align="center"
          type="index"
          width="50px"/>
        <el-table-column prop="lnventoryNumber" label="单号"/>
        <el-table-column prop="lnventoryName" label="盘点单名称"/>
        <el-table-column prop="lnventorySurplusStr" label="盘盈数量"/>
        <el-table-column prop="lnventoryLossStr" label="盘亏数量"/>
        <el-table-column prop="warehousingStatus" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.lnventoryStatus == 1">
              <el-tag
                type="danger"
                size="medium"
              >{{ statusValue[1] }}</el-tag>
            </div>
            <div v-if="scope.row.lnventoryStatus == 2">
              <el-tag
                type="success"
                size="medium"
              >{{ statusValue[2] }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="lnventoryUser" label="制单人"/>
        <el-table-column prop="createDate" label="制单时间">
          <template slot-scope="scope">
            <span>{{ parseTimeToDate(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column
          label="操作"
          width="240px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              icon="el-icon-tickets"
              @click="edit(scope.row)"
              @click.stop
            >编辑</el-button>
            <el-popover
              v-if="scope.$index == 0"
              :ref="scope.row.id"
              placement="top"
            >
              <p>是否删除</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="popoverClose(scope.row.id)">取消</el-button>
                <el-button
                  :loading="sutmitDetailLoading"
                  type="primary"
                  size="mini"
                  @click="delect(scope.row.id)"
                >确定</el-button>
              </div>
              <el-button slot="reference" type="warning" icon="el-icon-delete" size="mini">删除</el-button>
            </el-popover>
            <!--<el-button
              size="mini"

              type="danger"
              icon="el-icon-tickets"
              @click="delect(scope.row)"
              @click.stop
            >删除</el-button>-->
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
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="dialog"
      :modal="true"
      :title="isAdd ? '盘点单新增' : '盘点单编辑'"
      width="65%">
      <el-row>
        <el-table
          v-loading="detaLoading"
          :data="detalList"
          style="width: 100%"
          show-summary
          max-height="380"
          :summary-method="getSummaries"
          highlight-current-row
          row-key="id">
          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="50px"/>
          <el-table-column prop="prodModel" label="产品编号" align="center" width="100px"/>
          <el-table-column prop="prodName" label="产品名称" align="center" width="130px"/>
          <el-table-column prop="unit" label="单位"  width="100px" align="center">
          </el-table-column>
          <el-table-column prop="prodNumber" label="数量" width="140px" align="center">
          </el-table-column>
          <el-table-column prop="lnventoryNumber" label="盘点数量" width="140px" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lnventoryNumber" :disabled="lnventoryStatus == 2?true:false" :min="0" type="number" @input = "sum(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column prop="lnventorySurplus" label="盘盈数量" width="140px" align="center"/>
          <el-table-column prop="lnventoryLoss" label="盘亏数量" width="140px" align="center"/>
        </el-table>

      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading" :type="typeButton" icon="el-icon-edit" @click="addAll">保存</el-button>
        <el-popover
          placement="top"
          v-model="visible"
        >
          <p>是否平衡库存</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button
              :loading="sutmitDetailLoading"
              type="primary"
              size="mini"
              @click="balance()"
            >确定</el-button>
          </div>
          <el-button slot="reference" :disabled="lnventoryStatus != 1 ? true : false" :type="lnventoryStatus != 1 ? 'info' : 'success'" icon="el-icon-document-checked" >平衡库存</el-button>
        </el-popover>
        <!--<el-popover
          :ref="form.id"
          placement="top"
        >
          <p>是否入库</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popoverClose(form.id)">取消</el-button>
            <el-button
              :loading="sutmitDetailLoading"
              type="primary"
              size="mini"
              @click="warehousingOut(form.id)"
            >确定</el-button>
          </div>
          <el-button slot="reference" :disabled="form.warehousingStatus != 1 ? true : false" :type="form.warehousingStatus != 1 ? 'info' : 'success'" icon="el-icon-bottom-left">入库</el-button>
        </el-popover>-->
        <el-button @click="dialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import { parseTime, parseTimeToDate} from '@/utils/index'
import { getLnventoryDateil, addLnventoryDateil, getLnventoryDateilList, addLnventoryDateilList, balanceList } from '@/api/chemicalFiberStockLnventoryDetail'
import { addLnventory, delectsStock } from '@/api/chemicalFiberStockLnventory'
export default {
  mixins: [initData],
  data() {
    return {
      isAdd:true,dialog: false,detalList: [],detaLoading: false,isAnd: '',visible: false,sutmitDetailLoading: false,
      lnventoryStatus: '',typeButton: '',dateQuery: '',checkInvalidQuery: false,sutmitDetailLoading: false,
      form: {
        prodModel: '',
        prodName: '',
        prodNumber: '',
        unit: '',
        lnventoryNumber: '',
        lnventoryLoss: '',
        lnventorySurplus: '',
      },
      statusValue: {
        0: '已失效',
        1: '未平衡',
        2: '已平衡'
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
    parseTimeToDate,
    beforeInit() {
      this.url = 'api/chemicalFiberStockLnventory'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort}
      const dateQuery = this.dateQuery
      const checkInvalidQurey = this.checkInvalidQuery
      this.params['queryWithInvalid'] = checkInvalidQurey
      if (dateQuery) {
        this.params['tempStartTime'] = dateQuery[0].getTime()
        this.params['tempEndTime'] = dateQuery[1].getTime()
      }
      /*const query = this.query
      const type = query.type
      const value = query.value
      const dateQuery = this.dateQuery
      const checkInvalidQurey = this.checkInvalidQuery
      if (type && value) { this.params[type] = value }
      this.params['queryWithInvalid'] = checkInvalidQurey
      */
      return true
    },
    buttonType(){
      this.typeButton = 'danger'
    },
    balance() {
      balanceList(this.detalList).then(res => {
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.visible = false
        this.dialog = false
        this.init()
      })
    },
    edit(data) {
      console.log(data)
      this.typeButton = 'success'
      this.lnventoryStatus = data.lnventoryStatus
      this.isAdd = false
      this.detaLoading = true
      this.isAnd = 2
      this.dialog = true
      if ( this.lnventoryStatus == 1) {
        getLnventoryDateil().then(res => {
          this.detalList = res
          getLnventoryDateilList(data).then(res => {
            for (var i = 0; i < this.detalList.length; i++) {
              this.detalList[i].lnventoryNumber = res[i].lnventoryNumber
              this.detalList[i].lnventoryLoss = res[i].lnventoryLoss
              this.detalList[i].lnventorySurplus = res[i].lnventorySurplus
              this.detalList[i].id = res[i].id
              this.detalList[i].lnventoryId = res[i].lnventoryId
              this.sum(this.detalList[i])
              this.detaLoading = false
            }
          })
        })
      } else if (this.lnventoryStatus == 2) {
        getLnventoryDateilList(data).then(res => {
          this.detalList = res
          this.detaLoading = false
        })
      }


    },
    add() {
      for (var i = 0; i < this.data.length; i ++) {
        if (this.data[i].lnventoryStatus == 1) {
          this.$notify({
            title: '请先平衡库存',
            type: 'warning',
            duration: 2500
          })
          return
        }
      }
      this.isAnd = 1
      this.typeButton = 'danger'
      this.lnventoryStatus = ''
      this.detalList = []
      this.detaLoading = true
      this.dialog = true
      console.log(this.data)
      getLnventoryDateil().then(res => {
        this.detalList = res
        this.detaLoading = false
      })
    },
    addAll() {
      this.typeButton = 'success'
      if (this.isAnd == 1) {
        this.doAdd()
      }
      if (this.isAnd == 2) {
        this.doEdit()
      }
    },
    doEdit() {
      addLnventoryDateilList(this.detalList).then(res => {
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.init()
      })
    },
    doAdd() {
      addLnventory().then(res => {
        for (var i = 0; i < this.detalList.length; i++) {
          this.detalList[i].lnventoryId = res.id
        }
        this.detaLoading = true
        addLnventoryDateil(this.detalList).then(res => {
          this.detalList = res
          this.detaLoading = false
          this.lnventoryStatus = 1
          this.init()
          this.$notify({
            title: '保存成功',
            type: 'success',
            duration: 2500
          })
        })
      })
    },
    delect(id) {
      this.sutmitDetailLoading = true
      delectsStock(id).then(res => {
        this.sutmitDetailLoading = false
        this.$refs[id].doClose()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
        this.init()
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (index === 5) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index]
        }
        if (index === 6) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          var a = 0;
          var b = 0;
          for (var i = 0; i < this.detalList.length; i++) {
            if (this.isAnd != 1) {
              if (this.detalList[i].lnventoryNumber >= this.detalList[i].prodNumber) {
                if (this.detalList[i].unit == "吨") {
                  a += this.detalList[i].lnventoryNumber - this.detalList[i].prodNumber
                } else {
                  b += this.detalList[i].lnventoryNumber - this.detalList[i].prodNumber
                }
              }
            }
          }
          sums[index] = a+"吨/"+b+ "支"
        }
        if (index === 7) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          var a = 0;
          var b = 0;
          for (var i = 0; i < this.detalList.length; i++) {
            if (this.isAnd != 1) {
              if (this.detalList[i].lnventoryNumber <= this.detalList[i].prodNumber) {
                if (this.detalList[i].unit == "吨") {
                  a += this.detalList[i].prodNumber - this.detalList[i].lnventoryNumber
                } else {
                  b += this.detalList[i].prodNumber - this.detalList[i].lnventoryNumber
                }
              }
            }

          }
          sums[index] = a+"吨/"+b+ "支"
        }
      })
      return sums
    },
    popoverClose(id) {
      this.sutmitDetailLoading = false
      this.$refs[id].doClose()
    },
    sum(data){
      // 盈亏
      if (data.lnventoryNumber <= data.prodNumber ) {
        data.lnventoryLoss = data.prodNumber - data.lnventoryNumber
        data.lnventorySurplus = 0
      }
      if (data.lnventoryNumber >= data.prodNumber) {
        data.lnventorySurplus = data.lnventoryNumber - data.prodNumber
        data.lnventoryLoss = 0
      }
    }
  }
}
</script>

<style scoped>


</style>
