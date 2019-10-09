<template>
  <div class="">

    <el-row>
      <el-col :span="11">
        <div class="">
          <el-table :data="servicetableData" stripe style="width: 100%" :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">
            <el-table-column label="房间号码" width="80" align="center">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.roomNum }}</span>
              </template>
            </el-table-column>
            <el-table-column label="请求时间" width="150" align="center">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.createTime | formatDate }}</span>
              </template>
            </el-table-column>
            <el-table-column label="请求信息" align="center">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.serviceMes }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="80">
              <template slot-scope="scope">
                <el-button v-if="scope.row.isRead==0" @click="changeService(1,scope.row,scope.$index)" type="primary">已读</el-button>
                <el-button v-else @click="changeService(0,scope.row,scope.$index)" type="danger">未读</el-button>

              </template>
            </el-table-column>
          </el-table>
          <div class="pagecontainer">
            <el-pagination @current-change="handleServiceCurrentChange" :current-page="currentServicePage" :page-sizes="[10]"
              layout="total, sizes, prev, pager, next, jumper" :total=dataServiceSize>
            </el-pagination>
          </div>
        </div>
      </el-col>
      <el-col :span="1">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
      <el-col :span="12">
        <div class="">
          <el-table :data="shoptableData" stripe style="width: 100%" :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">
            <el-table-column label="房间号码" width="80" align="center">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.roomNum }}</span>
              </template>
            </el-table-column>
            <el-table-column label="请求时间" width="130" align="center">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.createTime | formatDate }}</span>
              </template>
            </el-table-column>
            <el-table-column label="请求信息" align="center">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.shopNumPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column label="总价" width="80" align="center">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.totalPrice }}元</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="110">
              <template slot-scope="scope">
                <el-button v-if="scope.row.isRead==0" @click="changeShop(1,scope.row,scope.$index)" type="primary">配送完成</el-button>
                <el-button v-else @click="changeShop(0,scope.row,scope.$index)" type="danger">等待配送</el-button>

              </template>
            </el-table-column>
          </el-table>
          <div class="pagecontainer">
            <el-pagination @current-change="handleShopCurrentChange" :current-page="currentShopPage" :page-sizes="[10]"
              layout="total, sizes, prev, pager, next, jumper" :total=dataShopSize>
            </el-pagination>
          </div>
          <audio id="audio" src="./../../static/audio/message_tip.mp3" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import axios from 'axios'
  import logo from "../../assets/images/logo.png"
  import {
    formatDate
  } from '../../../static/js/date.js'

  export default {
    //写上name参数会被缓存
    // name: "apphoteldetail",
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        hotelId: sessionStorage.hotelId,
        currentShopPage: 1,
        dataShopSize: 1,
        shoptableData: [],
        instance: null,
        firstShopId: 0,
        shopInterval: null,
        serviceInterval: null,
        currentServicePage: 1,
        dataServiceSize: 1,
        servicetableData: [],
        firstMsgId: 0,

      }
    },
    filters: {
      formatDate(time) {
        time = time * 1000
        let date = new Date(time)
        console.log(new Date(time))
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },

    methods: {
      aplayAudio() {
        const audio = document.getElementById('audio')
        audio.play()
      },
      handleServiceCurrentChange(val) {
        this.currentServicePage = val;
        this.getPageService()
      },
      changeService(val, row, index) {
        if (val == 1) {
          return;
        }
        let data = {
          msgId: row.msgId + "",
          isRead: val + ""
        }
        this.$axios
          .post("/api/hoAppServiceOrder/changeService", data)
          .then(res => {
            console.log(res.data);
            this.servicetableData[index].isRead = val + ""
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getService() {
        this.instance
          .get("/api/hoAppServiceOrder/getService", {
            params: {
              curPage: 1,
              hotelId: this.hotelId + ""
            }
          })
          .then(res => {
            console.log(res.data);
            if (this.firstMsgId == 0) {
              this.servicetableData = []

              this.dataServiceSize = res.data.dataSize
              for (var i = 0; i < res.data.data.length; i++) {
                this.servicetableData.push({
                  msgId: res.data.data[i].id,
                  serviceMes: res.data.data[i].serviceMes,
                  createTime: res.data.data[i].createTime,
                  roomNum: res.data.data[i].roomNum,
                  isRead: res.data.data[i].isRead + "",
                })
              }
              if (this.servicetableData.length != 0) {
                this.firstMsgId = this.servicetableData[0].msgId
                this.$message.error("你有新的服务消息")
                this.aplayAudio()
              }
              return;
            }
            if (this.currentServicePage == 1) { //等于1的时候，有新消息刷新
              console.log(this.firstMsgId)
              console.log(res.data.data[0].id)
              if (this.firstMsgId != res.data.data[0].id) {
                this.servicetableData = []
                this.$message.error("你有新的服务消息")
                this.aplayAudio()
                this.dataServiceSize = res.data.dataSize
                for (var i = 0; i < res.data.data.length; i++) {
                  this.servicetableData.push({
                    msgId: res.data.data[i].id,
                    serviceMes: res.data.data[i].serviceMes,
                    createTime: res.data.data[i].createTime,
                    roomNum: res.data.data[i].roomNum,
                    isRead: res.data.data[i].isRead + "",
                  })
                }
                this.firstMsgId = this.servicetableData[0].msgId
              }
            } else {
              if (this.firstMsgId != res.data.data[0].id) { //不等于1的时候，不刷新列表
                this.$message.error("你有新的服务消息")
                this.aplayAudio()
                this.firstMsgId = res.data.data[0].id
              }
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getPageService() {
        this.servicetableData = []
        this.$axios
          .get("/api/hoAppServiceOrder/getService", {
            params: {
              curPage: this.currentServicePage,
              hotelId: this.hotelId + ""
            }
          })
          .then(res => {
            console.log(res.data);
            this.dataServiceSize = res.data.dataSize
            for (var i = 0; i < res.data.data.length; i++) {
              this.servicetableData.push({
                msgId: res.data.data[i].id,
                serviceMes: res.data.data[i].serviceMes,
                createTime: res.data.data[i].createTime,
                roomNum: res.data.data[i].roomNum,
                isRead: res.data.data[i].isRead + "",
              })
            }
            if (this.servicetableData.length > 0) {
              if (this.currentServicePage == 1) {
                this.firstMsgId = this.servicetableData[0].msgId
              }
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },




      handleShopCurrentChange(val) {
        this.currentShopPage = val;
        this.getPageShop()
      },
      changeShop(val, row, index) {
        if (val == 1) {
          return;
        }
        let data = {
          shopId: row.shopId + "",
          isRead: val + ""
        }
        this.$axios
          .post("/api/hoAppShopOrder/changeShop", data)
          .then(res => {
            console.log(res.data);
            this.shoptableData[index].isRead = val + ""
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getShop() {
        this.instance
          .get("/api/hoAppShopOrder/getShop", {
            params: {
              curPage: 1,
              hotelId: this.hotelId + ""
            }
          })
          .then(res => {
            console.log(res.data);
            if (this.firstShopId == 0) {
              this.shoptableData = []
              this.dataShopSize = res.data.dataSize
              for (var i = 0; i < res.data.data.length; i++) {
                this.shoptableData.push({
                  shopId: res.data.data[i].id,
                  shopNumPrice: res.data.data[i].shopNumPrice,
                  createTime: res.data.data[i].createTime,
                  roomNum: res.data.data[i].roomNum,
                  isRead: res.data.data[i].isRead + "",
                  totalPrice: res.data.data[i].totalPrice
                })
              }
              if (this.shoptableData.length != 0) {
                this.firstShopId = this.shoptableData[0].shopId
                this.$message.error("你有新的订单消息")
                this.aplayAudio()
                this.mesgNotice()
              }
              return;
            }
            if (this.currentShopPage == 1) { //等于1的时候，有新消息刷新
              console.log(this.firstShopId)
              console.log(res.data.data[0].id)
              if (this.firstShopId != res.data.data[0].id) {
                this.shoptableData = []
                this.$message.error("你有新的订单消息")
                this.aplayAudio()
                this.mesgNotice()
                this.dataShopSize = res.data.dataSize
                for (var i = 0; i < res.data.data.length; i++) {
                  this.shoptableData.push({
                    shopId: res.data.data[i].id,
                    shopNumPrice: res.data.data[i].shopNumPrice,
                    createTime: res.data.data[i].createTime,
                    roomNum: res.data.data[i].roomNum,
                    isRead: res.data.data[i].isRead + "",
                    totalPrice: res.data.data[i].totalPrice
                  })
                }
                this.firstShopId = this.shoptableData[0].shopId
              }
            } else {
              if (this.firstShopId != res.data.data[0].id) { //不等于1的时候，不刷新列表
                this.$message.error("你有新的订单消息")
                this.aplayAudio()
                this.mesgNotice()
                this.firstShopId = res.data.data[0].id
              }
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getPageShop() {
        this.shoptableData = []
        this.$axios
          .get("/api/hoAppShopOrder/getShop", {
            params: {
              curPage: this.currentShopPage,
              hotelId: this.hotelId + ""
            }
          })
          .then(res => {
            console.log(res.data);
            this.dataShopSize = res.data.dataSize
            for (var i = 0; i < res.data.data.length; i++) {
              this.shoptableData.push({
                shopId: res.data.data[i].id,
                shopNumPrice: res.data.data[i].shopNumPrice,
                createTime: res.data.data[i].createTime,
                roomNum: res.data.data[i].roomNum,
                isRead: res.data.data[i].isRead + "",
                totalPrice: res.data.data[i].totalPrice
              })
            }
            if (this.shoptableData.length > 0) {
              if (this.currentShopPage == 1) {
                this.firstShopId = this.shoptableData[0].shopId
              }
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      mesgNotice() {
        // console.log("xxxx")
        // if (window.Notification && Notification.permission !== "denied") {
        //   Notification.requestPermission(function (status) {
        //     var notice_ = new Notification('你好', {
        //       body: '您有新的消息'
        //     });
        //     notice_.onclick = function () { //单击消息提示框，进入浏览器页面
        //       window.focus();
        //     }
        //   });
        // }
        // if (Notification.permission == "granted") {
        //   popNotice();
        // } else if (Notification.permission != "denied") {
        //   Notification.requestPermission(function (permission) {
        //     popNotice();
        //   });
        // }
      },
    
    },
   
    created() {
      this.instance = axios.create({
        timeout: 10000,
      });
      this.getPageShop()
      this.getPageService()
      this.serviceInterval = setInterval(this.getService, 7000)
      this.shopInterval = setInterval(this.getShop, 15000)

    },
    beforeDestroy: function () {
      clearInterval(this.serviceInterval);
      clearInterval(this.shopInterval);
    },

  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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


  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

</style>
