<template>


  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>订单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">

      <el-tabs type="card" v-model="tabname" @tab-click="handleClick">

        <el-tab-pane label="消费记录" name="first">
          <el-date-picker v-model="value2" type="daterange" align="left" unlink-panels range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd">
          </el-date-picker>
          <el-button type="primary" @click="chooseTime">搜索</el-button>
          <el-table :data="payOrderData" stripe style="width: 100%"
            :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">

            <el-table-column label="消费时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column label="消费点数" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.payNum }}</span>
              </template>
            </el-table-column>
            <el-table-column label="剩下点数" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.unusePayNum }}</span>
              </template>
            </el-table-column>
            <el-table-column label="消费信息" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.payMes }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagecontainer">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[15]"
              layout="total, sizes, prev, pager, next, jumper" :total="dataSize">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="充值记录" :lazy="true" name="second">
          <el-date-picker v-model="revalue2" type="daterange" align="left" unlink-panels range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="repickerOptions" value-format="yyyy-MM-dd">
          </el-date-picker>
          <el-button type="primary" @click="rechooseTime">搜索</el-button>
          <el-table :data="repayOrderData" stripe style="width: 100%"
            :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">

            <el-table-column label="充值时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column label="充值点数" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.payNum }}</span>
              </template>
            </el-table-column>
            <el-table-column label="总点数" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.unusePayNum }}</span>
              </template>
            </el-table-column>
            <el-table-column label="充值信息" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.payMes }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagecontainer">
            <el-pagination @current-change="rehandleCurrentChange" :current-page="recurrentPage" :page-sizes="[15]"
              layout="total, sizes, prev, pager, next, jumper" :total="redataSize">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>

</template>

<script>
  import {
    isEmpty
  } from '../../../static/js/util.js'
  export default {

    //写上name参数会被缓存
    name: "orderdetail",
    data() {

      return {
        tabname: "first",
        value2: [],
        currentPage: "",
        dataSize: 0,
        payOrderData: [],
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 0);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },


        revalue2: [],
        recurrentPage: "",
        redataSize: 0,
        repayOrderData: [],
        repickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 0);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },

    methods: {
      handleClick() {
        if (this.tabname == "second") {
          this.recurrentPage = 1;
          this.getOrder(0);
        } else {
          this.currentPage = 1;
          this.getOrder(1);
        }
      },
      rehandleCurrentChange(val) {
        this.recurrentPage = val;
        this.getOrder(0);
      },
      rechooseTime() {
        this.recurrentPage = 1
        this.getOrder(0)
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getOrder(1);
      },

      chooseTime() {
        this.currentPage = 1
        this.getOrder(1)
      },
      getOrder(val) {
        if (val == 1) {
          this.payOrderData = []
        } else {
          this.repayOrderData = []
        }

        let data = {
          times: val == 1 ? this.value2 : this.revalue2,
          agentId: sessionStorage.agentId + "",
          curPage: val == 1 ? this.currentPage + "" : this.recurrentPage + "",
          type: val + ""
        }
        this.$axios
          .post("/api/hoHotelPayOrder/getTimeSort", data)
          .then(res => {
            console.log(res.data);
            if (val == 1) {
              this.dataSize = res.data.dataSize
              for (var i = 0; i < res.data.data.length; i++) {
                this.payOrderData.push({
                  payNum: res.data.data[i].payNum.toFixed(3),
                  payMes: res.data.data[i].payMes,
                  date: res.data.data[i].date,
                  unusePayNum: res.data.data[i].unusePayNum.toFixed(3)
                })
              }
            } else {
              this.redataSize = res.data.dataSize
              for (var i = 0; i < res.data.data.length; i++) {
                this.repayOrderData.push({
                  payNum: res.data.data[i].payNum.toFixed(3),
                  payMes: res.data.data[i].payMes,
                  date: res.data.data[i].date,
                  unusePayNum: res.data.data[i].unusePayNum.toFixed(3)
                })
              }
            }


          }).catch((err) => {
            console.log(err + "错误");
          });
      },
    },

    created() {
      this.value2.push(new Date())
      this.value2.push(new Date())
      this.revalue2.push(new Date())
      this.revalue2.push(new Date())
      this.currentPage = 1
      this.recurrentPage = 1
      this.getOrder(1)
    }
  }

</script>

<style scoped>
  .pagecontainer {
    background-color: #fff;
    height: 80px;
    display: flex;
    justify-content: flex-end;
    align-content: center;
    align-items: center;
  }

  .el-pagination {
    display: flex;
    margin-right: 200px;

  }

</style>
