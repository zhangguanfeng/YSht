<template>


  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>充值详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">

      <el-row :gutter="20" class="mgb20">
        <el-col :span="8">
          <el-card shadow="hover" :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-1">
              <i class="el-icon-lx-redpacket_fill grid-con-icon"></i>
              <div class="grid-cont-right">

                <div style="font-size:32px">1000.00元</div>
                <div style="font-size:16px;margin-top:10px">授权点 : 200个</div>
                <div style="font-size:16px;margin-top:10px">赠送授权点 ：0个 </div>
                <!-- <div style="margin-top:10px">
                  <el-button type="primary" @click="handleToQQ">联系客服购买</el-button>
                </div> -->
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-2">
              <i class="el-icon-lx-redpacket_fill grid-con-icon"></i>
              <div class="grid-cont-right">

                <div style="font-size:32px">2000.00元</div>
                <div style="font-size:16px;margin-top:10px">授权点 : 400个</div>
                <div style="font-size:16px;margin-top:10px">赠送授权点 ：0个 </div>
                <!-- <div style="margin-top:10px">
                  <a id="qqhref"  href="tencent://message/?Site=baidu.com&uin=478269761&Menu=yes"></a>
                  <el-button type="primary" @click="handleToQQ"> 联系客服购买</el-button>
                </div> -->
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-3">
              <i class="el-icon-lx-redpacket_fill grid-con-icon"></i>
              <div class="grid-cont-right">

                <div style="font-size:32px">3000.00元</div>
                <div style="font-size:16px;margin-top:10px">授权点 :600个</div>
                <div style="font-size:16px;margin-top:10px">赠送授权点 ：0个 </div>
                <!-- <div style="margin-top:10px">
                  <el-button type="primary" @click="handleToQQ">联系客服购买</el-button>
                </div> -->
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="充点规则" style="color:#ff0000" name="1">
          <div>5元一个点数，一个房间30天为1个点，如需充点请联系电话:18029997099这个客服，提供个人账号，付款后，会充点到你账号上。</div>

        </el-collapse-item>
        <el-collapse-item title="扣费规则" name="2">
          <div>1.试用期内的所有房间不扣取点数(新创建的酒店会有15天试用期),超过试用期后，房间就开始点数计费</div>
          <div>2.一个房间30天为一个点，</div>
          <div>3.删除房间并不会退还点数</div>
          <div>4.续点到期是点数到期，而授权到期只是个人可以控制桌面APP的使用状态的开关。</div>
        </el-collapse-item>

      </el-collapse>
    </div>
  </div>

</template>

<script>
  import {
    isEmpty
  } from '../../../static/js/util.js'
  export default {

    //写上name参数会被缓存
    name: "buydetail",
    data() {

      return {
        activeNames: ['1', '2']
      }
    },

    methods: {
      handleToQQ(){
        document.getElementById("qqhref").click();
      }
    },

    created() {

    }
  }

</script>

<style scoped>

  .el-row {
    margin-bottom: 20px;
  }

  .grid-content {
    display: flex;
    align-items: center;
    height: 200px;
  }

  .grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
  }

  .grid-num {
    font-size: 30px;
    font-weight: bold;
  }

  .grid-con-icon {
    font-size: 50px;
    width: 150px;
    height: 200px;
    text-align: center;
    line-height: 200px;
    color: #fff;
  }

  .grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
  }

  .grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
  }

  .grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
  }

  .grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
  }

  .grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
  }

  .grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
  }

  .user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
  }

  .user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }

  .user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
  }

  .user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
  }

  .user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
  }

  .user-info-list span {
    margin-left: 70px;
  }

  .mgb20 {
    margin-bottom: 20px;
  }

  .todo-item {
    font-size: 14px;
  }

  .todo-item-del {
    text-decoration: line-through;
    color: #999;
  }

  .schart {
    width: 100%;
    height: 300px;
  }

</style>
