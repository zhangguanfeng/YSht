<template>


  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>充值管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-date-picker v-model="value2" type="daterange" align="left" unlink-panels range-separator="至"
        start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button type="primary" @click="chooseTime">搜索</el-button>
      <el-button type="primary" @click="payDialog">充值</el-button>
      <el-table :data="payOrderData" stripe style="width: 100%"
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
        <el-table-column label="剩下点数" align="center">
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
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[15]"
          layout="total, sizes, prev, pager, next, jumper" :total="dataSize">
        </el-pagination>
      </div>
      <!-- 充值 -->
      <el-dialog title="充值" :visible.sync="agentPayDialogFormVisible">

        <el-form :model="payform" ref="payform">
          <el-form-item label="选择代理商" :label-width="formLabelWidth" prop="moduleName">
            <el-select v-model="payform.agentId" filterable placeholder="请选择代理商">
              <el-option v-for="item in agentOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="充值点数" :label-width="formLabelWidth">
            <el-input v-model="payform.payPoint" autocomplete="off"></el-input>
          </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="agentPaySubmit">确 定</el-button>
          <el-button @click="agentPayDialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  import {
    isEmpty,
    isNumber
  } from '../../../static/js/util.js'
  import bus from '../common/bus';
  export default {

    //写上name参数会被缓存
    name: "admorder",
    data() {

      return {
        value2: [],
        currentPage: "",
        dataSize: 0,
        payOrderData: [],
        payform: {
          agentId: "",
          payPoint: ""
        },
        formLabelWidth: "150px",
        agentOptions: [],
        agentPayDialogFormVisible: false,
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

      }
    },

    methods: {
      agentPaySubmit() {
        if (this.payform.agentId == "") {
          this.$message.error("请选择代理商")
          return
        }
        if (!isNumber(this.payform.payPoint)) {
          this.$message.error("请输入数字")
          return
        }
        let data = {
          payPoint: this.payform.payPoint + "",
          agentId: this.payform.agentId + "",

        }
        this.$axios
          .post("/api/hoAdmPayOrder/payOrder", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.$message.success("充值成功")
              this.agentPayDialogFormVisible = false
                bus.$emit('pointNum', (sessionStorage.pointNum - this.payform.payPoint).toFixed(3))
              sessionStorage.pointNum = (sessionStorage.pointNum - this.payform.payPoint).toFixed(3)
              this.getOrder()
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      payDialog() {
       
        this.agentPayDialogFormVisible = true
        this.agentOptions = []
        this.payform.agentId = ""
        this.payform.payPoint = ""
        this.$axios
          .get("/api/houser/getAgent")
          .then(res => {
            console.log(res.data);

            for (var i = 0; i < res.data.data.length; i++) {
              this.agentOptions.push({
                "label": res.data.data[i].username,
                "value": res.data.data[i].id + ""
              })

            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getOrder(1)
      },
      chooseTime() {
        this.currentPage = 1
        this.getOrder(1)
      },
      getOrder(val) {
        this.payOrderData = []
        let data = {
          times: this.value2,
          curPage: this.currentPage + ""
        }
        this.$axios
          .post("/api/hoAdmPayOrder/getTimeSort", data)
          .then(res => {
            console.log(res.data);

            this.dataSize = res.data.dataSize
            for (var i = 0; i < res.data.data.length; i++) {
              this.payOrderData.push({
                payNum: res.data.data[i].payNum.toFixed(3),
                payMes: res.data.data[i].payMes,
                date: res.data.data[i].date,
                unusePayNum: res.data.data[i].unusePayNum.toFixed(3)
              })
            }



          }).catch((err) => {
            console.log(err + "错误");
          });
      },
    },

    created() {

      this.value2.push(new Date())
      this.value2.push(new Date())
      this.currentPage = 1
      this.getOrder()
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
