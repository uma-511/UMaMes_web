<template>
  <div class="app-container">
    <div class="block">
    <el-date-picker
        v-model="time"
        :type="typeTime"
        :placeholder="timePlaceholder"
        value-format="timestamp"
      >
      </el-date-picker>
      <el-radio-group v-model="radio" @change="setRadio">
        <el-radio label="1">日</el-radio>
        <el-radio label="2">月</el-radio>
        <el-radio label="3">年</el-radio>
      </el-radio-group>
      <el-button
        class="filter-item"
        size="mini"s
        type="success"
        icon="el-icon-search"
        @click="getAdd()"
      >搜索</el-button>
    </div>
    <!--工具栏-->
    <div class="head-container">
      <el-row :gutter="40" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="ckf" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">库存包数</div>
              <count-to :start-val="0" :end-val="count.stockNumber" :duration="3600"  class="card-panel-num"/>
            </div>
            <div class="card-panel-description" style="width:150px;">
              <div class="card-panel-text">库存毛重</div>
              <count-to :start-val="0" :end-val="count.stockGrossWeight" :duration="3600" :decimals ="2" class="card-panel-num"/>
            </div>
            <div class="card-panel-description" style="width:150px;">
              <div class="card-panel-text">库存净重</div>
              <count-to :start-val="0" :end-val="count.stockNetWeight" :duration="3600" :decimals ="2" class="card-panel-num"/>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="ck2" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description" >
              <div class="card-panel-text">入库包数</div>
              <count-to :start-val="0" :end-val="count.warehousingNumber" :duration="3000"  class="card-panel-num"/>
            </div>
            <div class="card-panel-description" style="width:150px;">
              <div class="card-panel-text">入库毛重</div>
              <count-to :start-val="0" :end-val="count.warehousingGrossWeight" :duration="3000" :decimals ="2" class="card-panel-num"/>
            </div>
            <div class="card-panel-description" style="width:150px;">
              <div class="card-panel-text">入库净重</div>
              <count-to :start-val="0" :end-val="count.warehousingNetWeight" :duration="2600" :decimals ="2" class="card-panel-num"/>
            </div>
            <!--<div class="card-panel-description">
              <div class="card-panel-text">库存支数</div>
              <count-to :start-val="0" :end-val="count.stockBranchNumber" :duration="3600" class="card-panel-num"/>
            </div>-->
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="ck" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">送货单数</div>
              <count-to :start-val="0" :end-val="count.deliveryNumber" :duration="3200"  class="card-panel-num"/>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="ck" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">送货金额</div>
              <count-to :start-val="0" :end-val="count.deliveryTotalNumber" :duration="3600" :decimals ="2" class="card-panel-num"/>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="ck" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">出库包数</div>
              <count-to :start-val="0" :end-val="count.deliveryBagNumber" :duration="3600"  class="card-panel-num"/>
            </div>
            <div class="card-panel-description"style="width:300px;">
              <div class="card-panel-text">出库净重</div>
              <count-to :start-val="0" :end-val="count.deliveryNetWeight" :duration="3600" :decimals ="2" class="card-panel-num"/>
            </div>
          </div>
        </el-col>
        <!--<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="ck" class-name="card-panel-icon" />
            </div>

          </div>
        </el-col>-->
      </el-row>
      <!-- <el-row :gutter="40" class="panel-group">
         <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
           <div class="card-panel">
             <div class="card-panel-icon-wrapper icon-message">
               <svg-icon icon-class="ipvisits" class-name="card-panel-icon" />
             </div>
             <div class="card-panel-description">
               <div class="card-panel-text">入库单数</div>
               <count-to :start-val="0" :end-val="count.warehousingNumber" :duration="2600" class="card-panel-num"/>
             </div>
           </div>
         </el-col>
         <el-col :xs="12" :sm="12" :lg="9" class="card-panel-col">
           <div class="card-panel">
             <div class="card-panel-icon-wrapper icon-message">
               <svg-icon icon-class="ipvisits" class-name="card-panel-icon" />
             </div>
             <div class="card-panel-description">
               <div class="card-panel-text">入库吨数</div>
               <count-to :start-val="0" :end-val="count.warehousingTonNumber" :duration="3000" class="card-panel-num"/>
             </div>
           </div>
         </el-col>
         <el-col :xs="12" :sm="12" :lg="9" class="card-panel-col">
           <div class="card-panel">
             <div class="card-panel-icon-wrapper icon-message">
               <svg-icon icon-class="ipvisits" class-name="card-panel-icon" />
             </div>
             <div class="card-panel-description">
               <div class="card-panel-text">入库支数</div>
               <count-to :start-val="0" :end-val="count.warehousingBranchNumber" :duration="3000" class="card-panel-num"/>
             </div>

           </div>
         </el-col>
       </el-row>-->

    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { get } from '@/api/visits'
import { parseTime } from '@/utils/index'
export default {
  mixins: [initData],
  components: {
    CountTo
  },
  data() {
    return {
      typeTime: 'month',time: '',radio: '2',timePlaceholder: '选择日期',
      count: { warehousingNumber: 0, warehousingTonNumber: 0, warehousingBranchNumber: 0, deliveryNumber: 0,
        deliveryTonNumber: 0, deliveryBagNumber: 0, deliveryTotalNumber: 0, stockNumber: 0, stockNetWeight: 0,
        stockGrossWeight: 0, deliveryNetWeight: 0}
    }
  },
  created() {
    if (this.time == '') {
      const a = new Date()
      this.time = a.getTime()
    }
    const data = {
      time: this.time,
      radio: this.radio
    }
    get(data).then(res=>{
      this.count.warehousingNumber = res.warehousingNumber,
        this.count.warehousingNetWeight = res.warehousingNetWeight,
        this.count.warehousingGrossWeight = res.warehousingGrossWeight,
        this.count.deliveryNumber = res.deliveryNumber,
        this.count.deliveryTotalNumber = res.deliveryTotalNumber,
        this.count.deliveryBagNumber = res.deliveryBagNumber,
        this.count.deliveryNetWeight = res.deliveryNetWeight,
        this.count.stockNumber = res.stockNumber,
        this.count.stockNetWeight = res.stockNetWeight,
        this.count.stockGrossWeight = res.stockGrossWeight

    })
  },
  methods: {
    getAdd() {
      if (this.time == '') {
        this.$notify({
          title: '请选择时间',
          type: 'warning',
          duration: 2500
        })
        return
      }

      const data = {
        time: this.time,
        radio: this.radio
      }
      get(data).then(res=>{
        this.count.warehousingNumber = res.warehousingNumber,
          this.count.warehousingNetWeight = res.warehousingNetWeight,
          this.count.warehousingGrossWeight = res.warehousingGrossWeight,
          this.count.deliveryNumber = res.deliveryNumber,
          this.count.deliveryTotalNumber = res.deliveryTotalNumber,
          this.count.deliveryBagNumber = res.deliveryBagNumber,
          this.count.deliveryNetWeight = res.deliveryNetWeight,
          this.count.stockNumber = res.stockNumber,
          this.count.stockNetWeight = res.stockNetWeight,
          this.count.stockGrossWeight = res.stockGrossWeight

      })
    },
    setRadio() {
      if (this.radio == 1) {
        const a = new Date()
        this.time = a.getTime()
        this.typeTime = 'date'
        this.timePlaceholder = '选择日期'
      }
      if (this.radio == 2) {
        const a = new Date();
        this.time = a.getTime()
        this.typeTime = 'month'
        this.timePlaceholder = '选择月'
      }
      if (this.radio == 3) {
        const a = new Date();
        this.time = a.getTime()
        this.typeTime = 'year'
        this.timePlaceholder = '选择年'
      }
    }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .panel-group {
    margin-top: 18px;
    .card-panel-col{
      margin-bottom: 32px;
    }
    .card-panel {
      height: 108px;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      .icon-people {
        color: #40c9c6;
      }
      .icon-message {
        color: #36a3f7;
      }
      .icon-money {
        color: #f4516c;
      }
      .icon-shopping {
        color: #34bfa3
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 25px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 23px;
        }
      }
    }
  }

</style>
