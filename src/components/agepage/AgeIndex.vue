<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:252px;">
          <div class="user-info">
            <img src="static/img/icon_logo.png" class="user-avator" alt="">
            <div class="user-info-cont">
              <div class="user-info-name">{{name}}</div>
              <div>{{role}}</div>
            </div>
          </div>
          <div class="user-info-list">上次登录时间：<span>--</span></div>
          <div class="user-info-list">上次登录地点：<span>--</span></div>
        </el-card>
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>采集警报</span>
          </div>
          <el-table :data="colhotelList" :show-header="false" max-height="155px" style="width: 100%;font-size:14px;">
            <el-table-column>
              <template slot-scope="scope">
                <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.title}}</div>
              </template>
            </el-table-column>

          </el-table>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-lx-home grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{hotelTotal}}</div>
                  <div>酒店总数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="el-icon-lx-vipcard grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{roomTotal}}</div>
                  <div>房间总数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-lx-redpacket_fill grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{payPoint}}</div>
                  <div>总点数</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="mgb20">


          <el-col :span="12">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>7天内续点时间到期的酒店</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">添加</el-button> -->
              </div>
              <el-table :data="outhotelList" :show-header="false" max-height="304" style="width: 100%;font-size:14px;">

                <el-table-column>
                  <template slot-scope="scope">
                    <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.title}}</div>
                  </template>
                </el-table-column>

              </el-table>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>7天内授权时间到期的酒店</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">添加</el-button> -->
              </div>
              <el-table :data="licensehotelList" :show-header="false" max-height="304"
                style="width: 100%;font-size:14px;">

                <el-table-column>
                  <template slot-scope="scope">
                    <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.title}}</div>
                  </template>
                </el-table-column>

              </el-table>
            </el-card>
          </el-col>
        </el-row>


      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <schart ref="bar" class="schart" canvasId="bar" :data="data" type="bar" :options="options"></schart>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <!-- <schart ref="line" class="schart" canvasId="line" :data="data" type="line" :options="options2"></schart> -->
          <schart ref="ring" class="schart" canvasId="ring" :data="roomStatus" type="ring" :options="options4"></schart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Schart from 'vue-schart';
  import bus from '../common/bus';
  export default {
    name: 'dashboard',
    data() {
      return {
        name: sessionStorage.ms_username,
        payPoint: "",
        hotelTotal: "",
        roomTotal: "",

        outhotelList: [],
        licensehotelList: [],
        colhotelList: [],
        todoList: [],
        data: [],
        options: {
          // title: '最近七月每月的酒店创建量(开发中)',
          title: '每月创建酒店统计',
          showValue: true,
          fillColor: 'rgb(45, 140, 240)',
          bottomPadding: 30,
          topPadding: 30
        },
        roomStatus: [{
            name: '未绑定',
            value: 11
          },
          {
            name: '已绑定',
            value: 222
          },

        ],
        options4: {
          title: '房间绑定情况(待扣点酒店的统计)',
          titleColor: '#000000',
          legendColor: '#000000',
          radius: 110,
          innerRadius: 60,
          legendTop: 40,
          colorList: ['#FF4949', '#1E9FFF'],
        },
        agentId: sessionStorage.agentId,
      }
    },

    components: {
      Schart
    },
    computed: {
      role() {
        return this.name === 'admin' ? '超级管理员' : '代理商';
      }
    },
    created() {
      this.handleListener();
      //   this.changeDate();
      console.log("dashbord");
      this.getAgTotal()
      this.getBars()
    },
    activated() {
      this.handleListener();
    },
    deactivated() {
      window.removeEventListener('resize', this.renderChart);
      bus.$off('collapse', this.handleBus);
    },
    methods: {
      getAgTotal() {
        // this.roomStatus = []
        this.licensehotelList = []

        this.outhotelList = []

        this.$axios
          .get("/api/hoAgentIndex/getHotelTotal/" + this.agentId)
          .then(res => {
            console.log(res.data);
            this.hotelTotal = res.data.data.hotelTotal
            this.roomTotal = res.data.data.roomTotal
            this.payPoint = res.data.data.payPoint
            for (var i = 0; i < res.data.data.licenseHotelList.length; i++) {
              this.licensehotelList.push({
                "title": res.data.data.licenseHotelList[i].hotelName + " -- " + res.data.data.licenseHotelList[i]
                  .roomTotal + "房数",
                "status": res.data.data.licenseHotelList[i].status == 0 ? false : true
              })
            }

            for (var i = 0; i < res.data.data.outdateHotelList.length; i++) {
              this.outhotelList.push({
                "title": res.data.data.outdateHotelList[i].hotelName + " -- " + res.data.data.outdateHotelList[i]
                  .roomTotal + "房数",
                "status": res.data.data.outdateHotelList[i].status == 0 ? false : true
              })
            }
            for (var i = 0; i < res.data.data.colHotelList.length; i++) {
              this.colhotelList.push({
                "title": res.data.data.colHotelList[i].hotelName,
                "status": res.data.data.colHotelList[i].status == 0 ? false : true
              })
            }
            // for (var i = 0; i < res.data.data.tryHotelList.length; i++) {
            //   this.tryhotelList.push({
            //     "title": res.data.data.tryHotelList[i].hotelName + " -- " + res.data.data.tryHotelList[i]
            //       .roomTotal + "房数",
            //     "status": res.data.data.tryHotelList[i].status == 0 ? false : true
            //   })
            // }
            this.roomStatus[0].value = res.data.data.unbindRoomTotal
            this.roomStatus[1].value = res.data.data.bindRoomTotal
            this.$refs.ring.renderChart();
            // console.log(this.roomStatus)
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getBars() {

        this.$axios
          .get("/api/hoAgentIndex/getHotelMonth/"+this.agentId)
          .then(res => {
            console.log(res.data);
            this.data = res.data.data
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      changeDate() {
        const now = new Date().getTime();
        this.data.forEach((item, index) => {
          const date = new Date(now - (6 - index) * 86400000);
          item.name = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
        })
      },
      handleListener() {
        bus.$on('collapse', this.handleBus);
        // 调用renderChart方法对图表进行重新渲染
        window.addEventListener('resize', this.renderChart)
      },
      handleBus(msg) {
        setTimeout(() => {
          this.renderChart()
        }, 300);
      },
      renderChart() {
        this.$refs.bar.renderChart();
        this.$refs.line.renderChart();
      },

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
    height: 100px;
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
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
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
