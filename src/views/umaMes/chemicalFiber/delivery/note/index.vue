<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input
        v-longpress="showInvoice"
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
      <el-checkbox
        v-model="showUnEnable"
        @change="toQuery"
      >查询失效单</el-checkbox>
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
          v-permission="['admin','chemicalFiberDeliveryNote:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <!-- 导出 -->
      <!-- <div style="display: inline-block;">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出</el-button>
      </div>-->
    </div>
    <!--表单组件-->
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      :summary-method="getDataSummaries"
      size="small"
      show-summary
      style="width: 100%;"
      @row-click="detail($event)"
    >
      <el-table-column prop="scanNumber" label="出库单号"/>
      <el-table-column prop="customerName" label="客户名称"/>
      <el-table-column prop="customerCode" label="客户编号"/>
      <el-table-column prop="contacts" label="联系人"/>
      <el-table-column prop="contactPhone" label="联系电话"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column prop="totalPrice" label="总金额"/>
      <el-table-column prop="seller" label="业务员"/>
      <el-table-column prop="createDate" label="制单日期">
        <template slot-scope="scope">
          <span>{{ parseTimeToDate(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" label="制单人"/>
      <el-table-column prop="noteStatus" label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.enable == false">
            <el-tag
              type="info"
              size="medium"
            >{{ statusValue[0] }}</el-tag>
          </div>
          <div v-else>
            <!--待打印-->
            <div v-if="scope.row.noteStatus == 1">
              <el-tag
                size="medium"
              >{{ statusValue[1] }}</el-tag>
            </div>
            <!--待出库-->
            <div v-if="scope.row.noteStatus == 2">
              <el-tag
                size="medium"
              >{{ statusValue[2] }}</el-tag>
            </div>
            <!--待签收-->
            <div v-if="scope.row.noteStatus == 3">
              <el-tag
                type="warning"
                size="medium"
              >{{ statusValue[3] }}</el-tag>
            </div>
            <!--待结款-->
            <div v-if="scope.row.noteStatus == 4">
              <el-tag
                type="danger"
                size="medium"
              >{{ statusValue[4] }}</el-tag>
            </div>
            <!--结款中-->
            <div v-if="scope.row.noteStatus == 5">
              <el-tag
                type="danger"
                size="medium"
              >{{ statusValue[5] }}</el-tag>
            </div>
            <!--完结-->
            <div v-if="scope.row.noteStatus == 6">
              <el-tag
                type="success"
                size="medium"
              >{{ statusValue[6] }}</el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission(['admin','chemicalFiberDeliveryNote:edit','chemicalFiberDeliveryNote:del'])"
        width="280px"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['admin','chemicalFiberDeliveryNote:edit']"
            size="mini"
            type="success"
            icon="el-icon-tickets"
            @click="detail(scope.row)"
            @click.stop
          >详情</el-button>
          <el-popover
            :ref="'doInvalidRef' + scope.row.id"
            placement="top"
          >
            <p v-if="scope.row.enable == true">是否删除</p>
            <p v-if="scope.row.enable == false">是否恢复</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs['doInvalidRef' + scope.row.id].doClose()">取消</el-button>
              <el-button
                v-if="scope.row.enable == true"
                :loading="sutmitDetailLoading"
                type="danger"
                size="mini"
                @click="doInvalid(scope.row.id)"
              >确定</el-button>
              <el-button
                v-if="scope.row.enable == false"
                :loading="sutmitDetailLoading"
                type="primary"
                size="mini"
                @click="unInvalid(scope.row.id)"
              >确定</el-button>
            </div>
            <el-button
              v-permission="['admin','chemicalFiberDeliveryNote:edit']"
              v-if="scope.row.enable == true"
              slot="reference"
              :style="{ display: hideInvalidButton }"
              size="mini"
              type="warning"
              icon="el-icon-tickets"
              @click.stop
            >删除</el-button>
            <el-button
              v-permission="['admin','chemicalFiberDeliveryNote:edit']"
              v-if="scope.row.enable == false"
              slot="reference"
              :style="{ display: hideInvalidButton }"
              size="mini"
              type="warning"
              icon="el-icon-tickets"
              @click.stop
            >恢复</el-button>
          </el-popover>

          <el-popover
            :ref="'reRecived' + scope.row.id"
            placement="top"
          >
            <p>是否重新签收</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs['reRecived' + scope.row.id].doClose()">取消</el-button>
              <el-button
                :loading="sutmitDetailLoading"
                type="primary"
                size="mini"
                @click="reRecived(scope.row.id)"
              >确定</el-button>
            </div>
            <el-button
              v-permission="['admin','chemicalFiberDeliveryNote:edit']"
              v-if="scope.row.enable == true"
              slot="reference"
              :style="{ display: hideInvalidButton }"
              size="mini"
              type="warning"
              icon="el-icon-tickets"
              @click.stop
            >重签</el-button>
          </el-popover>
          <!-- <el-popover
            v-permission="['admin','chemicalFiberDeliveryNote:del']"
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
      @current-change="pageChange"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :modal="true"
      title="送货单详情"
      width="80%"
    >
      <el-row style="width: 100%">
        <el-form ref="form1" :model="form" size="mini" label-width="80px" >
          <el-form :inline="true" size="mini">
            <el-form-item label="客户编号">
              <el-select
                v-model="form.customerCode"
                :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true"
                :loading="customerCodeLoading"
                :remote-method="customerCodeMethod"
                filterable
                remote
                reserve-keyword
                placeholder="输入客户编号关键词"
                style="width: 150px;"
                @change="setCustomerName($event)"
              >
                <el-option
                  v-for="item in customerCodeOptions"
                  :key="item.name"
                  :label="item.code"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="客户名称">
              <el-select
                v-model="form.customerName"
                :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true"
                :loading="customerLoading"
                :remote-method="customerRemoteMethod"
                filterable
                remote
                reserve-keyword
                placeholder="输入客户关键词"
                style="width: 150px;"
                @change="setCustomerId($event)"
              >
                <el-option
                  v-for="item in customerOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="联系人员" >
              <el-input v-model="form.contacts" :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true" style="width: 150px;" @input="buttonType"/>
            </el-form-item>
            <el-form-item label="客户电话" >
              <el-input v-model="form.contactPhone" :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true" style="width: 150px;" @input="buttonType"/>
            </el-form-item>
            <el-form-item label="出库单号" >
              <el-input v-model="form.scanNumber" :disabled="true" style="width: 150px;" @input="buttonType"/>
            </el-form-item>
          </el-form>
          <el-form :inline="true" size="mini">
            <el-form-item label="客户地址" >
              <el-input v-model="form.customerAddress" :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true" style="width: 382px;" @input="buttonType"/>
            </el-form-item>
            <el-form-item label="业务人员" >
              <el-select
                v-model="form.seller"
                :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true"
                :loading="userLoading"
                :remote-method="sellerRemoteMethod"
                multiple:false
                filterable
                remote
                reserve-keyword
                placeholder="输入业务员关键词"
                style="width: 150px;"
                @change="buttonType"
                @focus="cleanUpOptions"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.realname"
                  :label="item.realname"
                  :value="item.realname"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="发票类型" >
              <el-select
                v-model="form.invoiceType"
                :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true"
                placeholder="选择发票类型"
                style="width: 156px;"
                @change="handelSelectChange"
              >
                <el-option
                  v-for="item in localInvoiceOption"
                  :key="item.key"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="订单号码" >
              <el-input v-model="form.externalNumber" :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true" style="width: 150px;" @input="buttonType"/>
            </el-form-item>
          </el-form>
          <el-form :inline="true" size="mini">
            <el-form-item label="交货日期" >
              <el-date-picker v-model="form.deliveryDate" :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true" type="date" placeholder="选择日期时间" style="width: 150px;" maxlength="15" @change="buttonType"/>
            </el-form-item>
            <el-form-item label="主 司 机" >
              <el-select
                v-model="form.driverMain"
                :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true"
                :loading="userLoading"
                :remote-method="transporterRemoteMethod"
                filterable
                remote
                reserve-keyword
                placeholder="输入主司机关键词"
                style="width: 157px;"
                @change="checkDriverDeputy($event)"
                @focus="cleanUpOptions"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.realname"
                  :label="item.realname"
                  :value="item.realname"
                  @blur="userOptions"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="装载员1" >
              <el-select
                v-model="form.loaderOne"
                :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true"
                :loading="userLoading"
                :remote-method="transporterRemoteMethod"
                filterable
                remote
                reserve-keyword
                placeholder="输入装卸员1关键词"
                style="width: 156px;"
                @change="checkLoader2($event)"
                @focus="cleanUpOptions"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.realname"
                  :label="item.realname"
                  :value="item.realname"
                  @blur="userOptions"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="发票号码" >
              <el-input v-model="form.invoiceNumber" :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true" style="width: 150px;" @input="buttonType"/>
            </el-form-item>
            <el-form-item label="付款方式" >
              <el-select
                v-model="form.payment"
                :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true"
                placeholder="选择付款方式"
                style="width: 156px;"
                @change="buttonType"
              >
                <el-option
                  v-for="item in accountOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                  @blur="carOptions"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <el-form :inline="true" size="mini"/>
          <el-form :inline="true" size="mini">
            <el-form-item label="车 牌 号" >
              <el-select
                v-model="form.carNumber"
                :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true"
                :loading="carLoading"
                :remote-method="carRemoteMethod"
                filterable
                remote
                reserve-keyword
                placeholder="输入车牌关键词"
                style="width: 156px;"
                @change="buttonType"
                @focus="cleanUpOptions"
              >
                <el-option
                  v-for="item in carOptions"
                  :key="item.carNumber"
                  :label="item.carNumber"
                  :value="item.carNumber"
                  @blur="carOptions"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="副 司 机" >
              <el-select
                v-model="form.driverDeputy"
                :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true"
                :loading="userLoading"
                :remote-method="transporterRemoteMethod"
                filterable
                remote
                reserve-keyword
                placeholder="输入副司机关键词"
                style="width: 158px;"
                @change="checkDriverMain($event)"
                @focus="cleanUpOptions"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.realname"
                  :label="item.realname"
                  :value="item.realname"
                  @blur="userOptions"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="装载员2" >
              <el-select
                v-model="form.loaderTwo"
                :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true"
                :loading="userLoading"
                :remote-method="transporterRemoteMethod"
                filterable
                remote
                reserve-keyword
                placeholder="输入装卸员2关键词"
                style="width: 156px;"
                @change="checkLoader1"
                @focus="cleanUpOptions"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.realname"
                  :label="item.realname"
                  :value="item.realname"
                  @blur="userOptions"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="上期欠款" >
              <el-input v-model="customerForm.totalArrears" :disabled="true" style="width: 150px;" @input="buttonType"/>
            </el-form-item>
            <el-form-item label="本月欠款" >
              <el-input v-model="customerForm.currentArrears" :disabled="true" style="width: 150px;" @input="buttonType"/>
            </el-form-item>
          </el-form>
          <el-form :inline="true" size="mini">
            <el-form-item label="单据应收账款" >
              <el-input v-model="form.balance" :disabled="true" style="width: 150px;" @input="buttonType"/>
            </el-form-item>
            <el-form-item label="发货地" >
              <el-select
                :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true"
                v-model="form.startPlace"
                :loading="customerLoading"
                :remote-method="customerRemoteMethod"
                filterable
                allow-create
                remote
                reserve-keyword
                placeholder="输入发货地关键词"
                style="width: 150px;"
                @visible-change="$forceUpdate()"
                @focus="cleanUpOptions"
                @change="buttonType"
              >
                <el-option
                  v-for="item in customerOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="目的地" >
              <el-select
                :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true"
                v-model="form.endPlace"
                :loading="customerLoading"
                :remote-method="customerRemoteMethod"
                filterable
                allow-create
                remote
                reserve-keyword
                placeholder="输入目的地关键词"
                style="width: 150px;"
                @visible-change="$forceUpdate()"
                @focus="cleanUpOptions"
                @change="buttonType"
              >
                <el-option
                  v-for="item in customerOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="备 注" >
              <el-input v-model="form.remark" :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true" style="width: 403px;" @input="buttonType"/>
            </el-form-item>
          </el-form>
        </el-form>
      </el-row>
      <el-row>
        <el-table
          v-loading="detailLoading"
          :data="detailList"
          :summary-method="getSummaries"
          style="width: 100%"
          show-summary
          highlight-current-row
          row-key="id"
          @current-change="handleCurrentChange"
        >
          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="50px"/>
          <el-table-column prop="prodModel" label="产品编号" align="center" width="100px"/>
          <el-table-column prop="prodName" label="产品名称" align="center" width="150px"/>
          <el-table-column prop="unit" label="单位" width="50px" align="center"/>
          <el-table-column prop="totalNumber" label="计划数量" width="125px" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.totalNumber" :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true" :min="0" type="number" @input = "sum(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="realQuantity" label="实收数量" width="125px" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.realQuantity" :disabled="form.noteStatus == 4 || form.noteStatus == 5 || form.noteStatus == 6?true : false" :min="0" type="number" @input = "sum(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="sellingPrice" label="单价" width="130px" align="center">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.sellingPrice"
                :disabled="form.noteStatus == 1 || form.noteStatus == 2 || form.noteStatus == 3?false : true"
                :min="0"
                type="number"
                class = "login-form-input"
                @input = "sum(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="预计金额" width="120px" align="center"/>
          <el-table-column prop="realPrice" label="应收金额" width="120px" align="center"/>
          <el-table-column prop="remark" label="备注" width="250px" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" :disabled="form.noteStatus == 1 || form.noteStatus == 2?false : true" placeholder="备注" @input="buttonType"/>
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkPermission(['admin','chemicalFiberDeliveryDetail:edit','chemicalFiberDeliveryDetail:del'])
            && (form.noteStatus == 1 || form.noteStatus == 2 )"
            label="操作"
            align="center"
            width="170%"
          >
            <template slot-scope="scope">
              <el-popover
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
                    @click="delNoteDetail(scope.row.id)"
                  >确定</el-button>
                </div>
                <el-button slot="reference" type="warning" icon="el-icon-delete" size="mini">删除</el-button>
              </el-popover>
              <!--<el-button
                size="mini"
                type="primary"
                icon="el-icon-download"
                @click="exportPoundExcel(scope.row)"
              >磅码单</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-table
          v-loading="payDetailLoading"
          :data="payDetailList"
          :summary-method="getPaySummaries"
          style="width: 100%"
          show-summary
          highlight-current-row
        >
          <!--<el-form-item label="交货日期" >
            <el-date-picker v-model="form.deliveryDate" type="date" placeholder="选择日期时间" style="width: 150px;" maxlength="15" @change="buttonType"/>
          </el-form-item>-->
          <el-table-column
            :formatter="formatDate"
            prop="payDate"
            label="结款日期"
            align="center"
            width="500px"
          />
          <el-table-column prop="amount" label="结款金额" width="300px" align="center"/>
          <el-table-column prop="inputUser" label="操作人" width="400px" align="center"/>
        </el-table>
      </el-row>
      <span v-if="form.enable == 1" slot="footer" class="dialog-footer">
        <el-button v-if="form.enable == 1" :loading="loading" :type="typeButton" icon="el-icon-edit" @click="addAll">保存</el-button>
        <el-button v-if="form.noteStatus == 1 && form.enable == 1 && isAdd != 1" @click="addTable" >添加产品</el-button>
        <el-button :loading="downloadLoading" type="primary" @click="exportDelivery()">导出送货单</el-button>
        <el-popover
          :ref="form.id"
          placement="top"
        >
          <p>是否发货</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popoverClose(form.id)">取消</el-button>
            <el-button
              :loading="sutmitDetailLoading"
              type="primary"
              size="mini"
              @click="sendOut(form.id)"
            >确定</el-button>
          </div>
          <el-button slot="reference" :disabled="form.noteStatus != 2 ? true : false" :type="form.noteStatus != 2 ? 'info' : 'success'" icon="el-icon-truck">发货</el-button>
        </el-popover>
        <el-popover
          :ref="form.customerName"
          placement="top"
        >
          <p>确认签收前，请确认回填信息</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popoverClose(form.customerName)">取消</el-button>
            <el-button
              :loading="sutmitDetailLoading"
              type="primary"
              size="mini"
              @click="recived(form.id)"
            >确定</el-button>
          </div>
          <el-button slot="reference" :disabled="form.noteStatus != 3 ? true : false" :type="form.noteStatus != 3 ? 'info' : 'warning'" icon="el-icon-suitcase">签收</el-button>
        </el-popover>
        <template v-if="form.noteStatus == 5">
          <el-button :disabled="form.noteStatus != 5 ? true : false" :type="form.noteStatus != 5 ? 'info' : 'warning'" icon="el-icon-s-finance" @click="showPayDialog">继续结款</el-button>
        </template>
        <template v-else>
          <el-button :disabled="form.noteStatus != 4 ? true : false" :type="form.noteStatus != 4 ? 'info' : 'warning'" icon="el-icon-s-finance" @click="showPayDialog">结款</el-button>
        </template>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>

      <el-dialog
        :visible.sync="addTableFrom"
        :append-to-body = "true"
        width="550px"
        title="添加产品" >
        <el-input
          v-model="tableForm.innerName"
          style="width: 500px"
          placeholder="请输入产品关键词"
          @input="getProdList"
        />
        <el-table
          v-loading="payDetailLoading"
          :data="prodList"
          style="width: 100%"
          highlight-current-row
          @row-click="addToDetail"
        >
          <el-table-column prop="prodModel" label="产品编号" align="center" width="150px"/>
          <el-table-column prop="prodName" label="产品名称" align="center" width="150px"/>
          <el-table-column prop="prodUnit" label="单位" align="center" width="100px"/>
          <el-table-column prop="totalNumber" label="库存数量" align="center" width="100px"/>
        </el-table>
        <!--<div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="addTableFrom = false">取消</el-button>
          <el-button :loading="delLoading" type="primary" size="mini" @click="addTableRow">确定</el-button>
        </div>-->
      </el-dialog>
      <el-dialog
        :visible.sync="payDialog"
        :append-to-body = "true"
        width="40%"
        title="结款" >
        <el-form ref="form" :model="payForm" size="small" label-width="80px">
          <el-form-item label="支付时间" >
            <el-date-picker v-model="payForm.payDate" type="datetime" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="客户余额" >
            <el-input v-model="customerForm.account" :disabled="true" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="当前欠款" >
            <el-input v-model="form.balance" :disabled="true" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="支付金额" >
            <el-input v-model="payForm.amount" style="width: 370px;"/>
          </el-form-item>
          <div style="text-align: right; margin: 0">
            <el-popover
              :ref="'final' +payForm.name"
              placement="top"
            >
              <p>是否确认完结结款</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="popoverClose('final' +payForm.name)">取消</el-button>
                <el-button
                  :loading="sutmitDetailLoading"
                  type="primary"
                  size="mini"
                  @click="finalPay"
                >确定</el-button>
              </div>
              <el-button slot="reference" type="warning" size="mini" style="margin-right: 100%;vertical-align: bottom">完结结款</el-button>
            </el-popover>
            <el-button size="mini" type="text" @click="payDialog = false">取消</el-button>
            <el-popover
              :ref="'pay' +payForm.name"
              placement="top"
            >
              <p>是否确认结款</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="popoverClose('pay' +payForm.name)">取消</el-button>
                <el-button
                  :loading="sutmitDetailLoading"
                  type="primary"
                  size="mini"
                  @click="doPay"
                >确定</el-button>
              </div>
              <el-button slot="reference" type="primary" size="mini">结款</el-button>
            </el-popover>
          </div>
        </el-form>
      </el-dialog>
    </el-dialog>
  </div>

</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadChemicalFiberDeliveryNote, downloadDeliveryNote, sendOut, recived, reRecived } from '@/api/chemicalFiberDeliveryNote'
import { editList, getChemicalFiberDeliveryDetailsList, addTableRow, delDetail } from '@/api/chemicalFiberDeliveryDetail'
import { parseTimeToDate, downloadFile, downloadFileWhithScanNumber } from '@/utils/index'
import { getUserListByDeptId } from '@/api/user'
import { add, editAll, doInvalid, unInvalid } from '@/api/chemicalFiberDeliveryNote'
import { getCustomerList, getCustomerById } from '@/api/customer'
import { getCarList } from '@/api/car'
import { getAccountList } from '@/api/accountName'
import { getSelectMaps, getByProdName } from '@/api/chemicalFiberStock'
import { doPay, finalPay, getPayDetailList } from '@/api/chemicalFiberDeliveryNotePayDetail'
import Config from '@/config'
import EllipsisTooltip from '@/views/components/EllipsisTooltip.vue'
import eForm from './form'
export default {
  components: { eForm, EllipsisTooltip },
  mixins: [initData],
  data() {
    return {
      unInvalidVisible: false,
      dateQuery: '',
      hideInvalidButton: 'none',
      checkInvalidQuery: false,
      showUnEnable: false,
      delLoading: false,
      payLoading: false,
      dialogVisible: false,
      detailLoading: false,
      payDetailLoading: false,
      sutmitDetailLoading: false,
      doPayRef: '',
      fPayRef: '',
      customerLoading: false,
      userLoading: false,
      carLoading: false,
      accountLoading: false,
      customerCodeLoading: false,
      addTableFrom: false,
      payDialog: false,
      isAdd: '',
      customerOptions: [],
      carOptions: [],
      accountOptions: [],
      carList: '',
      accountList: '',
      customerCodeOptions: [],
      userOptions: [],
      invoiceOption: [],
      invoiceList: '',
      prodList: '',
      prodOptions: [],
      prods: [],
      typeButton: '',
      visible: false,
      sumRealQuantity: '',
      sumTotalQuantity: '',
      id: '',
      form: {
        id: '',
        searchName: '',
        scanNumber: '',
        customerId: '',
        customerName: '',
        customerCode: '',
        customerAddress: '',
        contacts: '',
        contactPhone: '',
        totalPrice: '',
        remark: '',
        seller: '',
        storeKeeper: '',
        createDate: '',
        createUser: '',
        carNumber: '',
        deliveryDate: '',
        driverMain: '',
        driverDeputy: '',
        state: '',
        loaderOne: '',
        loaderTwo: '',
        totalCost: '',
        balance: '',
        payment: '',
        realPrice: '',
        noteStatus: '',
        sendOutFlag: '',
        invalid: '',
        remainder: '',
        invoiceType: '',
        invoiceNumber: '',
        enable: '',
        startPlace: '',
        endPlace: '',
        externalNumber: ''
      },
      customerForm: {
        id: '',
        scanNumber: '',
        customerId: '',
        customerName: '',
        customerCode: '',
        customerAddress: '',
        contacts: '',
        contactPhone: '',
        totalPrice: '',
        remark: '',
        seller: '',
        storeKeeper: '',
        createDate: '',
        createUser: '',
        carNumber: '',
        deliveryDate: '',
        driverMain: '',
        driverDeputy: '',
        state: '',
        loaderOne: '',
        loaderTwo: '',
        balance: '',
        totalCost: '',
        payment: '',
        realPrice: '',
        noteStatus: '',
        account: '',
        totalArrears: '',
        currentArrears: '',
        externalNumber: ''
      },
      payForm: {
        id: '',
        customerId: '',
        customerName: '',
        payment: '',
        createDate: '',
        payDate: '',
        inputUser: '',
        scanNumber: '',
        amount: ''
      },
      tableForm: {
        detailNumber: '',
        prodModel: '',
        prodName: '',
        scanNumber: '',
        searchName: '',
        unit: '',
        sellingPrice: '',
        remark: '',
        totalNumber: '',
        realQuantity: '',
        realPrice: '',
        totalPrice: '',
        id: '',
        customerName: '',
        innerName: '',
        prodUnit: ''
      },
      customerQuery: {
        name: '',
        code: ''
      },
      customerQueryName: {
        name: ''
      },
      customerQueryCode: {
        code: ''
      },
      queryTypeOptions: [
        { key: 'scanNumber', display_name: '出库单号' },
        { key: 'customerName', display_name: '客户名称' },
        { key: 'customerCode', display_name: '客户编号' },
        { key: 'customerAddress', display_name: '客户地址' },
        { key: 'contacts', display_name: '联系人' },
        { key: 'contactPhone', display_name: '联系电话' }
      ],
      statusValue: {
        0: '已失效',
        1: '待打印',
        2: '待发货',
        3: '待签收',
        4: '待结款',
        5: '结款中',
        6: '完结'
      },
      detailList: [],
      localInvoiceOption: [
        {
          label: '不开发票',
          value: '不开发票'
        }, {
          label: '增值税普通发票',
          value: '增值税普通发票'
        }, {
          label: '增值税专用发票',
          value: '增值税专用发票'
        }, {
          label: '增值税电子普通发票',
          value: '增值税电子普通发票'
        }
      ],
      option: [
        {
          value: '吨',
          label: '吨'
        }, {
          value: '支',
          label: '支'
        }, {
          value: '箱',
          label: '箱'
        }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTimeToDate,
    checkPermission,
    beforeInit() {
      this.url = 'api/chemicalFiberDeliveryNote'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      const dateQuery = this.dateQuery
      const checkEnables = this.showUnEnable
      if (type && value) { this.params[type] = value }
      this.params['showUnEnable'] = checkEnables
      if (dateQuery) {
        this.params['tempStartTime'] = dateQuery[0].getTime()
        this.params['tempEndTime'] = dateQuery[1].getTime()
      }
      if (type != '' || value != '') {
        return true
      } else {
        this.hideInvalidButton = 'none'
      }
      return true
    },
    sendOut(id) {
      var notNullFalg = true
      for (var i = 0; i < this.detailList.length; i++) {
        if (this.detailList[i].totalNumber == '' || this.detailList[i].totalNumber == 0 || this.detailList[i].totalNumber == null) {
          notNullFalg = false
          break
        }
        if (this.detailList[i].sellingPrice == '' || this.detailList[i].sellingPrice == 0 || this.detailList[i].sellingPrice == null) {
          notNullFalg = false
          break
        }
      }
      if (!notNullFalg) {
        // 有空值，不允许打印
        this.$notify({
          title: '请补充产品相关信息',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (this.typeButton == 'danger') {
        this.$notify({
          title: '请先保存',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.sutmitDetailLoading = true
      sendOut(id).then(res => {
        this.sutmitDetailLoading = false
        this.$refs[this.form.id].doClose()
        this.dialogVisible = false
        this.init()
        this.$notify({
          title: '状态变更为已发货',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.sutmitDetailLoading = false
        console.log(err.response.data.message)
      })
    },
    recived(id) {
      if (this.typeButton == 'danger') {
        this.$notify({
          title: '请先保存',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.sutmitDetailLoading = true
      recived(id).then(res => {
        this.sutmitDetailLoading = false
        this.$refs[this.form.customerName].doClose()
        this.dialogVisible = false
        this.init()
        this.$notify({
          title: '确认签收成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.sutmitDetailLoading = false
        console.log(err.response.data.message)
      })
    },
    initDetail() {
      var params = { 'scanNumber': this.form.scanNumber }
      this.detailLoading = true
      getChemicalFiberDeliveryDetailsList(params).then(res => {
        this.detailList = res
        this.addAll()
        this.detailLoading = false
      })
    },
    delNoteDetail(id) {
      this.sutmitDetailLoading = true
      delDetail(id).then(res => {
        this.sutmitDetailLoading = false
        this.$refs[id].doClose()
        this.initDetail()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.sutmitDetailLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
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
    // 新增按钮的弹出事件
    add() {
      this.isAdd = 1
      this.resetForm()
      this.dialogVisible = true
      this.detailLoading = false
      this.form.enable = true
      this.form.startPlace = Config.globalCompanyName
      this.form.noteStatus = 1
      this.form.invoiceType = '不开发票'
      this.customerForm.currentArrears = ''
      this.customerForm.totalArrears = ''
      this.detailList = []
      this.payDetailList = []
      this.buttonType()
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadChemicalFiberDeliveryNote(this.params).then(result => {
        downloadFile(result, 'ChemicalFiberDeliveryNote列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
        this.$notify.error({
          title: '请确保已选择单位',
          duration: 2500
        })
      })
    },
    // 点击添加产品的弹出框并清空里面的数据
    addTable() {
      this.addTableFrom = {
        innerName: ''
      }
      this.prodList = []
      this.getProdList()
      this.addTableFrom = true
    },
    showPayDialog() {
      this.payDialog = true
      let initAmount = 0
      if (this.customerForm.account > this.form.balance) {
        initAmount = this.form.balance
      } else {
        initAmount = this.customerForm.account
      }
      this.payForm = {
        id: '',
        customerId: '',
        customerName: '',
        payment: '',
        createDate: '',
        payDate: new Date(),
        inputUser: '',
        scanNumber: '',
        amount: initAmount
      }
    },
    doPay() {
      this.$refs['pay' + this.payForm.name].doClose()
      this.payForm = {
        customerId: this.form.customerId,
        customerName: this.form.customerName,
        scanNumber: this.form.scanNumber,
        payDate: this.payForm.payDate,
        amount: this.payForm.amount
      }
      if (!this.payForm.amount || this.payForm.amount === '' || this.payForm.amount === '0') {
        this.$notify({
          title: '请填写金额',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (!this.customerForm.account || this.customerForm.account === '' || this.customerForm.account === '0') {
        this.$notify({
          title: '客户余额为0，无法执行该操作',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.payLoading = true
      doPay(this.payForm).then(res => {
        this.$notify({
          title: '付款成功',
          type: 'success',
          duration: 2500
        })
        this.payDialog = false
        this.init()
      }).catch(err => {
        this.payDialog = false
        console.log(err.response.data.message)
      })
      this.payLoading = false
      this.payDialog = false
      this.dialogVisible = false
    },
    finalPay() {
      this.$refs['final' + this.payForm.name].doClose()
      this.payForm = {
        customerId: this.form.customerId,
        customerName: this.form.customerName,
        scanNumber: this.form.scanNumber,
        payDate: this.payForm.payDate,
        amount: this.payForm.amount
      }
      if (!this.payForm.amount || this.payForm.amount === '') {
        this.$notify({
          title: '请填写金额',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (!this.customerForm.account || this.customerForm.account === '' || this.customerForm.account === '0') {
        this.$notify({
          title: '客户余额为0，无法执行该操作',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.payLoading = true
      finalPay(this.payForm).then(res => {
        this.$notify({
          title: '付款成功',
          type: 'success',
          duration: 2500
        })
        this.payDialog = false
        this.init()
      }).catch(err => {
        this.payDialog = false
        console.log(err.response.data.message)
      })
      this.payLoading = false
      this.payDialog = false
      this.dialogVisible = false
    },
    // 传添加产品数据给后端
    addTableRow() {
      this.tableForm = {
        detailNumber: this.detailList.length + 1,
        prodModel: this.tableForm.prodModel,
        prodName: this.tableForm.prodName,
        scanNumber: this.form.scanNumber,
        unit: this.tableForm.prodUnit,
        sellingPrice: this.tableForm.sellingPrice,
        remark: this.tableForm.remark,
        totalNumber: this.tableForm.totalNumber,
        realQuantity: this.tableForm.realQuantity,
        customerName: this.form.customerName,
        totalPrice: this.tableForm.totalPrice,
        realPrice: this.tableForm.realPrice,
        deliveryNoteId: this.form.id
      }
      if (!this.tableForm.prodModel == '' && !this.tableForm.prodName == '') {
        addTableRow(this.tableForm).then(res => {
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.addTableFrom = true
          this.buttonType()
          this.dataiList(this.form.scanNumber)
          this.addTableFrom = false
          this.$parent.init()
        }).catch(err => {
          this.addTableFrom = false
          console.log(err.response.data.message)
        })
        this.addTableFrom = false
      } else {
        this.$notify({
          title: '请选择产品',
          type: 'warning',
          duration: 2500
        })
      }
    },
    // 添加成功后关联产品数据到送货单
    dataiList(scanNumber) {
      var params = { 'scanNumber': scanNumber }
      getChemicalFiberDeliveryDetailsList(params).then(res => {
        // this.detailList = res
        this.detailList = []
        var data = []
        for (var i = 0; i < res.length; i++) {
          var obj = {}
          obj.prodModel = res[i].prodModel
          obj.id = res[i].id
          obj.prodName = res[i].prodName
          obj.scanNumber = res[i].scanNumber
          obj.unit = res[i].unit
          obj.sellingPrice = res[i].sellingPrice
          obj.remark = res[i].remark
          obj.totalNumber = res[i].totalNumber
          obj.realQuantity = res[i].realQuantity
          obj.totalPrice = res[i].totalPrice
          obj.realPrice = res[i].realPrice
          data[i] = obj
        }
        this.detailLoading = false
        this.detailList = data
      })
      // this.$set(this.detailList,res[i].prodModel,this.detailList.prodModel)
      this.detailLoading = true
    },
    handleNodeClick(data) {
      this.tableForm.prodName = data.prodName
      this.tableForm.prodModel = data.prodModel
    },
    // 取消按钮触发事件
    popoverClose(id) {
      this.$refs[id].doClose()
    },
    // 把详情的数据传给后端
    addAll() {
      // 判断客户Id不为空才进行下一步
      if (this.form.customerId === null || this.form.customerId === '') {
        this.$notify({
          title: '请选择客户',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (this.form.deliveryDate === null || this.form.deliveryDate === '') {
        this.form.deliveryDate = new Date()
      }
      // 后期可能要修改上面已经有判断了
      if (this.form.customerId !== '') {
        this.id = this.form.customerId
      }
      if (this.form.startPlace == this.form.endPlace) {
        this.$notify({
          title: '发货地不能与目的地相同',
          type: 'success',
          duration: 2500
        })
        return
      }
      this.customerForm = {
        id: this.form.id,
        scanNumber: this.form.scanNumber,
        customerId: this.id,
        customerName: this.form.customerName,
        customerCode: this.form.customerCode,
        customerAddress: this.form.customerAddress,
        contacts: this.form.contacts,
        contactPhone: this.form.contactPhone,
        totalPrice: this.sumRealQuantity,
        remark: this.form.remark,
        seller: this.form.seller,
        storeKeeper: this.form.storeKeeper,
        createDate: this.form.createDate,
        createUser: this.form.createUser,
        carNumber: this.form.carNumber,
        deliveryDate: this.form.deliveryDate,
        driverMain: this.form.driverMain,
        driverDeputy: this.form.driverDeputy,
        state: this.form.state,
        loaderOne: this.form.loaderOne,
        loaderTwo: this.form.loaderTwo,
        balance: this.form.balance,
        payment: this.form.payment,
        realPrice: this.form.realPrice,
        noteStatus: this.form.noteStatus,
        totalNumber: this.form.totalNumber,
        realQuantity: this.form.realQuantity,
        account: this.form.account,
        totalCost: this.sumTotalQuantity,
        invoiceType: this.form.invoiceType,
        invoiceNumber: this.form.invoiceNumber,
        totalArrears: this.customerForm.totalArrears,
        currentArrears: this.customerForm.currentArrears,
        startPlace: this.form.startPlace,
        endPlace: this.form.endPlace,
        externalNumber: this.form.externalNumber
      }
      console.log(this.sumTotalQuantity)
      if (this.isAdd == 1) {
        this.doAdd(this.customerForm)
      }
      // form表单保存
      // this.doEdit(this.customerForm)
      var ifNull = true
      // 循环列表里面的数据判断
      for (var i = 0; i < this.detailList.length; i++) {
        // 判断是否有写计划数量
        if (this.detailList[i].totalNumber == '' || this.detailList[i].totalNumber == 0 || this.detailList[i].totalNumber == null) {
          ifNull = false
          this.$notify({
            title: '请填写计划数量',
            type: 'warning',
            duration: 2500
          })
          break
        }
        // 判断是否有写单价
        if (this.detailList[i].sellingPrice == '' || this.detailList[i].sellingPrice == 0 || this.detailList[i].sellingPrice == null) {
          ifNull = false
          this.$notify({
            title: '请填写单价',
            type: 'warning',
            duration: 2500
          })
          break
        }
        // 判断实际数量是否为空，为空赋值0
        if (this.detailList[i].realQuantity == '' || this.detailList[i].realQuantity == null) {
          this.detailList[i].realQuantity = 0
        }
        // 判断最后一次并没有空值才进行修改
        if (i < this.detailList.length && ifNull == true) {
          editList(this.detailList).then(res => {
            if (this.isAdd == 2) {
              this.doEdit(this.customerForm)
            }
            this.init()
            this.detailLoading = false
          })
        }
      }
      if (this.isAdd == 2) {
        this.doEdit(this.customerForm)
      }
      // 可能要改因为修改错误肯也很显示保存成功
      if (ifNull) {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        this.typeButton = 'success'
      }
    },
    // 显示详情列表的数据
    detail(data) {
      this.isAdd = 2
      this.typeButton = 'success'
      this.form = {
        id: data.id,
        customerName: data.customerName,
        customerAddress: data.customerAddress,
        scanNumber: data.scanNumber,
        contactPhone: data.contactPhone,
        contacts: data.contacts,
        createDate: data.createDate,
        customerCode: data.customerCode,
        seller: data.seller,
        storeKeeper: data.storeKeeper,
        createUser: data.createUser,
        carNumber: data.carNumber,
        driverMain: data.driverMain,
        driverDeputy: data.driverDeputy,
        state: data.state,
        loaderOne: data.loaderOne,
        loaderTwo: data.loaderTwo,
        totalPrice: data.totalPrice,
        totalCost: data.totalCost,
        realPrice: data.realPrice,
        customerId: data.customerId,
        deliveryDate: data.deliveryDate,
        noteStatus: data.noteStatus,
        payment: data.payment,
        balance: data.balance,
        remark: data.remark,
        invalid: data.invalid,
        remainder: data.remainder,
        account: data.account,
        invoiceType: data.invoiceType,
        invoiceNumber: data.invoiceNumber,
        enable: data.enable,
        startPlace: data.startPlace,
        endPlace: data.endPlace,
        externalNumber: data.externalNumber
      }
      // 初始化付款方式下拉列表
      const accountListParams = {}
      getAccountList(accountListParams).then(res => {
        this.accountLoading = false
        this.accountList = res
        this.accountOptions = this.accountList.filter(item => {
          return item
        })
      })
      // 查询详情列表数据
      var params = { 'scanNumber': data.scanNumber }
      getChemicalFiberDeliveryDetailsList(params).then(res => {
        this.detailLoading = false
        var data = []
        for (var i = 0; i < res.length; i++) {
          var obj = {}
          obj.prodModel = res[i].prodModel
          obj.prodName = res[i].prodName
          obj.scanNumber = res[i].scanNumber
          obj.unit = res[i].unit
          obj.id = res[i].id
          obj.sellingPrice = res[i].sellingPrice
          obj.remark = res[i].remark
          obj.totalNumber = res[i].totalNumber
          obj.realQuantity = res[i].realQuantity
          obj.totalPrice = res[i].totalPrice
          obj.realPrice = res[i].realPrice
          data[i] = obj
        }
        this.detailList = res
      })
      const paramCustomer = { id: this.form.customerId }
      getCustomerById(paramCustomer).then(res => {
        this.customerForm.account = res.account
        this.customerForm.totalArrears = res.totalArrears
        this.customerForm.currentArrears = res.currentArrears
      })
      const paramPay = { scanNumber: this.form.scanNumber }
      getPayDetailList(paramPay).then(res => {
        this.payDetailLoading = false
        var data = []
        for (var i = 0; i < res.length; i++) {
          var obj = {}
          obj.payDate = res[i].payDate
          obj.amount = res[i].amount
          obj.inputUser = res[i].amount
          data[i] = obj
        }
        this.payDetailList = res
      })
      this.payDetailLoading = true
      this.detailLoading = true
      this.dialogVisible = true
    },
    showInvoice(event) {
      if (this.hideInvalidButton == 'none') {
        this.hideInvalidButton = ''
      } else {
        this.hideInvalidButton = 'none'
      }
    },
    formatDate(row, column) {
      // 获取单元格数据
      const data = row[column.property]
      if (data == null) {
        return null
      }
      const dt = new Date(data)
      return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
    },
    doInvalid(id) {
      doInvalid(id).then(res => {
        this.sutmitDetailLoading = false
        this.$refs['doInvalidRef' + id].doClose()
        this.dialogVisible = false
        this.hideInvalidButton = 'none'
        this.init()
        this.$notify({
          title: '状态设置为失效',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.sutmitDetailLoading = false
        console.log(err.response)
      })
    },
    reRecived(id) {
      reRecived(id).then(res => {
        this.sutmitDetailLoading = false
        this.$refs['reRecived' + id].doClose()
        this.dialogVisible = false
        this.hideInvalidButton = 'none'
        this.init()
        this.$notify({
          title: '设置成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.sutmitDetailLoading = false
        console.log(err.response.data.message)
      })
    },
    unInvalid(id) {
      this.sutmitDetailLoading = true
      unInvalid(id).then(res => {
        this.sutmitDetailLoading = false
        this.$refs['doInvalidRef' + id].doClose()
        this.hideInvalidButton = 'none'
        this.init()
        this.$notify({
          title: '状态设置为生效',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.sutmitDetailLoading = false
        console.log(err.response.data.message)
      })
    },
    handleCurrentChange(val) {
      this.currentChangeItem = val
    },
    // 触发输入框后自动计算预计金额和实际金额
    sum(data) {
      // this.typeButton = 'danger'
      this.buttonType()
      if (data.totalNumber == '' || data.totalNumber == 0) {
        this.$notify({
          title: '请填写计划数量',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.detailLoading = true
      // 判断实际数量不为空时预计金额也是实际金额
      /* if (data.realQuantity == '' || data.realQuantity == 0 || data.realQuantity == null) {
        data.totalPrice = data.totalNumber * data.sellingPrice
        data.realPrice = data.realQuantity * data.sellingPrice
      } else {
        data.totalPrice = data.realQuantity * data.sellingPrice
        data.realPrice = data.realQuantity * data.sellingPrice
      }*/
      data.totalPrice = (data.totalNumber * data.sellingPrice).toFixed(2)
      data.realPrice = (data.realQuantity * data.sellingPrice).toFixed(2)
      this.detailLoading = false
    },
    checkDriverDeputy(data) {
      if (data == this.form.driverDeputy) {
        this.form.driverMain = ''
        this.$notify({
          title: '司机、押运不能重复选择',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (data == this.form.loaderOne || data == this.form.loaderTwo) {
        this.form.driverMain = ''
        this.$notify({
          title: '司机、押运不能重复选择',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.typeButton = 'danger'
    },
    checkDriverMain(data) {
      if (data == this.form.driverMain) {
        this.form.driverDeputy = ''
        this.$notify({
          title: '司机不能重复选择',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (data == this.form.loaderOne || data == this.form.loaderTwo) {
        this.form.driverDeputy = ''
        this.$notify({
          title: '司机、押运不能重复选择',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.typeButton = 'danger'
    },
    checkLoader2(data) {
      if (data == this.form.loaderTwo) {
        this.form.loaderOne = ''
        this.$notify({
          title: '装卸员不能重复选择',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (data == this.form.driverMain || data == this.form.driverDeputy) {
        this.form.loaderOne = ''
        this.$notify({
          title: '司机、押运不能重复选择',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.typeButton = 'danger'
    },
    handelSelectChange() {
      this.$forceUpdate()
    },
    checkLoader1(data) {
      if (data == this.form.loaderOne) {
        this.form.loaderTwo = ''
        this.$notify({
          title: '司装卸员不能重复选择',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (data == this.form.driverMain || data == this.form.driverDeputy) {
        this.form.loaderTwo = ''
        this.$notify({
          title: '司机、押运不能重复选择',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.typeButton = 'danger'
    },
    // 改变保存按钮的状态方法
    buttonType() {
      this.typeButton = 'danger'
    },
    // 单号列表的合计显示
    getDataSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (index === 7) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          sums[index] += ' 元'
        }
      })
      return sums
    },
    getPaySummaries(param) {
      const { columns, data } = param
      const sums = []
      sums[0] = '客户账户余额：' + this.customerForm.account
      columns.forEach((column, index) => {
        const values = data.map(item => Number(item[column.property]))
        if (index === 1) {
          sums[index] = '总结款金额：' + values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          sums[index] += ' 元'
        }
        if (index === 2) {
          if (this.form.remainder == null) {
            this.form.remainder = 0
          }
          sums[index] = '损数：' + this.form.remainder + '元'
        }
      })
      return sums
    },
    // 详情列表的合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (index === 7) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          this.sumTotalQuantity = sums[index]
          sums[index] += ' 元'
        }
        if (index === 8) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          sums[index] += ' 元'
        }
        this.sumRealQuantity = sums[index]
      })
      return sums
    },
    // 导出送货单
    exportDelivery() {
      if (this.typeButton == 'danger') {
        this.$notify({
          title: '请先保存',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (this.form.customerName === null) {
        this.$notify({
          title: '请返回填写客户信息',
          type: 'warning',
          duration: 2500
        })
        return
      }
      if (this.detailList.length < 1) {
        this.$notify({
          title: '请添加产品',
          type: 'warning',
          duration: 2500
        })
        return
      }
      var notNullFalg = true
      for (var i = 0; i < this.detailList.length; i++) {
        if (this.detailList[i].totalNumber == '' || this.detailList[i].totalNumber == 0 || this.detailList[i].totalNumber == null) {
          notNullFalg = false
          break
        }
        if (this.detailList[i].sellingPrice == '' || this.detailList[i].sellingPrice == 0 || this.detailList[i].sellingPrice == null) {
          notNullFalg = false
          break
        }
      }
      if (!notNullFalg) {
        // 有空值，不允许打印
        this.$notify({
          title: '请补充产品相关信息',
          type: 'warning',
          duration: 2500
        })
        return
      }
      this.downloadLoading = true
      downloadDeliveryNote(this.form.id).then(result => {
        this.downloadLoading = false
        this.dialogVisible = false
        this.init()
        downloadFileWhithScanNumber(result, this.form.scanNumber + '送货单导出', 'xls')
      }).catch(() => {
        this.downloadLoading = false
        this.$notify({
          title: '请保存产品信息',
          type: 'warning',
          duration: 2500
        })
      })
    },
    kgformatter(row, column, cellValue, index) {
      return cellValue + ' KG'
    },
    // 输入客户名称自动填入客户编号
    setCustomerId(event) {
      this.customerQueryCode.code = event
      getCustomerList(this.customerQueryCode).then(res => {
        this.customerLists = res
        this.form.customerCode = event
        this.form.contacts = this.customerLists[0].contacts
        this.form.customerName = this.customerLists[0].name
        this.form.contactPhone = this.customerLists[0].contactPhone
        this.form.customerAddress = this.customerLists[0].address
        this.form.customerId = this.customerLists[0].id
        this.id = this.customerLists[0].id
        this.form.endPlace = this.customerLists[0].name
        this.customerQueryCode.code = ''
        this.customerForm.totalArrears = this.customerLists[0].totalArrears
        this.customerForm.currentArrears = this.customerLists[0].currentArrears
      })
      this.buttonType()
    },
    // 输入客户编号自动填入客户名称
    setCustomerName(event) {
      this.customerQueryName.name = event
      getCustomerList(this.customerQueryName).then(res => {
        this.customerLists = res
        this.form.customerName = event
        this.form.customerCode = this.customerLists[0].code
        this.form.contacts = this.customerLists[0].contacts
        this.form.contactPhone = this.customerLists[0].contactPhone
        this.form.customerAddress = this.customerLists[0].address
        this.form.customerId = this.customerLists[0].id
        this.form.endPlace = this.customerLists[0].name
        this.id = this.customerLists[0].id
        this.customerQueryName.name = ''
        this.customerForm.totalArrears = this.customerLists[0].totalArrears
        this.customerForm.currentArrears = this.customerLists[0].currentArrears
      })
      this.buttonType()
    },
    // 清空下拉框
    cleanUpOptions() {
      this.userOptions = []
      this.prodOptions = []
      this.customerOptions = []
      this.carOptions = []
      this.accountOptions = []
    },
    // 查询客户名称的下拉列表
    customerRemoteMethod(query) {
      if (query !== '') {
        this.customerLoading = true
        this.customerQuery.name = query
        this.customerOptions = []
        getCustomerList(this.customerQuery).then(res => {
          this.customerLoading = false
          this.customerQuery.name = ''
          this.customerList = res
          this.customerOptions = this.customerList.filter(item => {
            return item.name.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        })
      } else {
        this.customerOptions = []
      }
    },
    // 查询客户编号的下拉列表
    customerCodeMethod(query) {
      this.customerCodeLoading = false
      if (query !== '') {
        this.customerCodeLoading = true
        this.customerQuery.code = query
        this.customerCodeOptions = []
        getCustomerList(this.customerQuery).then(res => {
          this.customerCodeLoading = false
          this.customerList = res
          this.customerQuery.code = ''
          this.customerCodeOptions = this.customerList.filter(item => {
            return item.code.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        })
      } else {
        this.customerOptions = []
      }
    },
    // 查询业务员的下拉列表
    sellerRemoteMethod(query) {
      // 业务员deptId为19
      const idList = [19]
      const params = { deptIdList: idList + '', realname: query }
      this.userLoading = true
      getUserListByDeptId(params).then(res => {
        this.userLoading = false
        this.userList = res
        this.userOptions = this.userList.filter(item => {
          return item.realname.toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        })
      })
    },
    // 查询仓管员的下拉列表
    storeKeeperRemoteMethod(query) {
      // 仓管员deptId为16
      const idList = [16]
      const params = { deptIdList: idList + '', realname: query }
      this.userLoading = true
      getUserListByDeptId(params).then(res => {
        this.userLoading = false
        this.userList = res
        this.userOptions = this.userList.filter(item => {
          return item.realname.toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        })
      })
    },
    // 查询产品把产品信息填入框
    fullWithProd(event) {
      const params = { prodName: event }
      getByProdName(params).then(res => {
        this.prodList = res
        this.tableForm.prodName = this.prodList[0].prodName
        this.tableForm.prodModel = this.prodList[0].prodModel
      })
    },
    addToDetail(row) {
      this.tableForm = {
        detailNumber: this.detailList.length + 1,
        prodModel: row.prodModel,
        prodName: row.prodName,
        scanNumber: this.form.scanNumber,
        unit: row.prodUnit
      }
      // 产品重复选择
      /* this.detailList.forEach((item) => {
        if (item.prodName === row.prodName && item.unit === row.prodUnit) {
          this.$notify({
            title: '有相同记录，无法添加',
            type: 'warning',
            duration: 2500
          })
          throw Error()
        }
      })*/
      addTableRow(this.tableForm).then(res => {
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.addTableFrom = true
        this.buttonType()
        this.dataiList(this.form.scanNumber)
        this.addTableFrom = false
        this.$parent.init()
      }).catch(err => {
        this.addTableFrom = false
        console.log(err.response.data.message)
      })
      this.addTableFrom = false
    },
    getProdList() {
      const data = { prodName: this.tableForm.innerName }
      getSelectMaps(data).then(res => {
        this.payDetailLoading = false
        var data = []
        for (var i = 0; i < res.length; i++) {
          var obj = {}
          obj.prodname = res[i].prodName
          obj.prodModel = res[i].prodModel
          obj.unit = res[i].unit
          data[i] = obj
        }
        this.prodList = res
      })
    },
    carRemoteMethod(query) {
      const params = { carNumber: query }
      this.carLoading = true
      getCarList(params)
        .then(res => {
          this.carLoading = false
          this.carList = res
          this.carOptions = this.carList.filter(item => {
            return item
          })
        })
    },
    accountRemoteMethod(query) {
      const params = { name: query }
      this.accountLoading = true
      getAccountList(params)
        .then(res => {
          this.accountLoading = false
          this.accountList = res
          this.accountOptions = this.accountList.filter(item => {
            return item
          })
        })
    },
    // 查询运输的下拉列表
    transporterRemoteMethod(query) {
      // 运输部deptId为18
      const idList = [18]
      const params = { deptIdList: idList + '', realname: query }
      this.userLoading = true
      getUserListByDeptId(params).then(res => {
        this.userLoading = false
        this.userList = res
        this.userOptions = this.userList.filter(item => {
          return item.realname.toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        })
      })
    },
    // 保存按钮，保存form表单数据
    doEdit(customerForm) {
      if (this.detailList.length == 0) {
        customerForm.totalPrice = 0
      }
      editAll(customerForm).then(res => {
        this.customerOptions = []
        this.customerOptions = []
        this.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    // 保存按钮，新增数据
    doAdd(customerForm) {
      customerForm.scanNumber = ''
      add(customerForm).then(res => {
        this.isAdd = 2
        this.form.scanNumber = res.scanNumber
        this.form.id = res.id
        this.form.noteStatus = 1
        this.form.customerId = res.customerId
        this.init()
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    // 清空form表单的数据
    resetForm() {
      this.form = {
        id: '',
        scanNumber: '',
        customerId: '',
        customerName: '',
        customerCode: '',
        customerAddress: '',
        contacts: '',
        contactPhone: '',
        totalCost: '',
        totalPrice: '',
        remark: '',
        seller: '',
        storeKeeper: '',
        createDate: '',
        createUser: '',
        carNumber: '',
        deliveryDate: '',
        driverMain: '',
        driverDeputy: '',
        state: '',
        loaderOne: '',
        loaderTwo: '',
        invalid: 0,
        enable: 0
      }
    }
  }
}
</script>

<style>
  .tooltip-wrap {
    height: 16px;
    display: inline-block;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
  }
  .el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: left;
    line-height: 10px;
  }
  .el-container {
    height: 160px;
  }
  .el-dialog{
    display: flex;
    flex-direction: column;
    margin:0 !important;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    /*height:600px;*/
    max-height:calc(100% - 30px);
    max-width:calc(100% - 30px);
  }
  .el-dialog .el-dialog__body{
    flex:1;
    overflow: auto;
  }
  .el-table{
    overflow:visible !important;
  }
</style>
