<template>
  <div class="">

    <el-row>

      <el-button type="primary" @click="inDialogChannel">添加采集任务</el-button>
      <el-button type="primary" @click="upUploadTime">上传间隔配置</el-button>
      <el-button type="primary" @click="openRouterDialog">路由器管理</el-button>
      <el-button type="primary" @click="openMaxGroup">最大组播数量配置 </el-button>
      <el-switch v-model="valueNeedHot" active-text="热门频道分类开关" inactive-text="" active-value="0" inactive-value="1"
        @change="switchNeedHot($event)" style="margin-left:50px">
      </el-switch>
      <el-switch v-model="valueAutoCol" active-text="自动换频道采集开关" inactive-text="" active-value="0" inactive-value="1"
        @change="switchAutoCol($event)" style="margin-left:50px">
      </el-switch>
      <!-- <el-button type="primary" @click="refresh">刷新</el-button> -->
    </el-row>
    <el-row :gutter="24">
      <el-col :span="10">{{ cpumes }}</el-col>
      <el-col :span="7">{{ memsize }}</el-col>
      <el-col :span="7">{{ hardsize }}</el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="10">{{ cputerm }}℃</el-col>
      <el-col :span="7">{{ cpuusage }}%</el-col>
      <el-col :span="7">{{ memusage }}%</el-col>
    </el-row>
    <el-table :data="ethtableData" stripe style="width: 100%"
      :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">
      <el-table-column label="eth网卡" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.eth }}</span>
        </template>
      </el-table-column>
      <el-table-column label="eth类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ethType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ip" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ethIp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="eth状态" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ethStatus }}</span>
        </template>
      </el-table-column>

    </el-table>
    <el-button type="primary" style="margin-top：30px" @click="deleteAllTask">删除全部任务</el-button>
    <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">
       <el-table-column
      type="index"
      width="50">
    </el-table-column>
      <el-table-column label="是否启用" align="center">
        
        <template slot-scope="scope">
          <el-switch v-model=" scope.row.isSwitch" active-value="0" inactive-value="1"
            @change="switchChange($event, scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="频道名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="频道类别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.collectType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采集类别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channelType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="固定类别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isMust }}</span>
        </template>
      </el-table-column>
      <el-table-column label="观看用户" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.live }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网卡eth" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.eth }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网卡类型" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ethType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网卡状态" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ethStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采集状态" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.collectStatus }}</span>
        </template>
      </el-table-column>
        <el-table-column label="上传时间" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.uploadTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="danger" @click="deleteTask(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加采集任务 -->
    <el-dialog title="添加采集任务" :visible.sync="inDialogVisible">
      <!-- <el-form :model="inform" ref="inform">
        <el-form-item label="频道名称" :label-width="formLabelWidth">
          <el-select v-model="channelvalue" placeholder="请选择" filterable>
            <el-option v-for="item in channeloptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="采集类型" :label-width="formLabelWidth">
          <el-select v-model="typevalue" placeholder="请选择">
            <el-option v-for="item in typeoptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否固定采集类型" :label-width="formLabelWidth">
          <el-switch v-model="typelock" active-value="0" inactive-value="1"></el-switch>
        </el-form-item>
      </el-form> -->
      <el-select v-model="typevalue" placeholder="请选择采集类型">
        <el-option v-for="item in typeoptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>

      </el-select>
      <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入频道名称搜索" v-model="value2"
        :data="data2" style="margin-top:30px" :titles="['全部频道列表', '待采集频道列表']" :button-texts="['到左边', '到右边']">
      </el-transfer>



      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="inSubmit">确 定</el-button>
        <el-button @click="inDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 路由器管理 -->
    <el-dialog title="路由器管理" :visible.sync="listRouterVisible">
      <el-table :data="listRouterData" style="width: 100%" stripe
        :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">
        <el-table-column label="路由SN" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.sn }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" @click="handleRouterdelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import {
    isEmpty,formatDate
  } from '../../../static/js/util.js'
  export default {

    data() {
      return {
        instance: null,
        hotelId: sessionStorage.hotelId,
        formLabelWidth: "150px",
        tableData: [],
        listRouterData: [],
        listRouterVisible: false,
        inDialogVisible: false,
        channeloptions: [],
        uploadTime: "",
        typeoptions: [{
          value: '1',
          label: '互联网源'
        }, {
          value: '2',
          label: '运营商源'
        }],
        typevalue: "",
        channelvalue: "",
        typelock: "1",
        inform: {

        },
        ethtableData: [],
        cpumes: "",
        memsize: "",
        hardsize: "",
        cputerm: "",
        cpuusage: "",
        memusage: "",
        hardInterval: null,
        ethInterval: null,
        taskInterval: null,
        maxGroup: "",
        data2: [],
        value2: [],
        filterMethod(query, item) {
          return item.value.indexOf(query) > -1;
        },
        valueNeedHot: "",
        valueAutoCol: "",
      }
    },
    methods: {
     deleteAllTask() {
        this.$confirm('此操作将删除该酒店的所有采集任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            hotelId: this.hotelId + "",
          }
          this.$axios
            .post("/api/hoV2AppChannelTask/deleteAllTask", data)
            .then(res => {

              this.getTask()
            }).catch((err) => {
              console.log(err + "错误");
            });
        }).catch(() => {

        });


        // console.log(row.hotelId)
      },
      switchNeedHot(value) {
        let data = {
          hotelId: this.hotelId + "",
          isNeedHot: value + ""
        }
        this.$axios
          .post("/api/hoAppChannelMes/config/isNeedHot", data)
          .then(res => {
            console.log(res.data);

          }).catch((err) => {
            console.log(err + "错误");
          });
      },

      switchAutoCol(value) {
        let data = {
          hotelId: this.hotelId + "",
          isAutoCol: value + ""
        }
        this.$axios
          .post("/api/hoAppChannelMes/config/isAutoCol", data)
          .then(res => {
            console.log(res.data);

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      openMaxGroup() {

        this.$prompt('请输入能采集最大组播数量', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: this.maxGroup,
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {
          let data = {
            hotelId: this.hotelId + "",
            maxGroup: value + ""
          }
          this.$axios
            .post("/api/hoAppChannelMes/config/MaxGroup", data)
            .then(res => {
              this.$message.success("修改成功")
              this.getMaxGroup()
            }).catch((err) => {
              console.log(err + "错误");
            });

        }).catch(() => {

        });

      },
      getMaxGroup() {

        this.$axios
          .get("/api/hoAppChannelMes/getAppChannelMes/" + this.hotelId)
          .then(res => {
            this.maxGroup = res.data.data.maxGroup
            this.valueNeedHot = res.data.data.isNeedhot
            this.valueAutoCol = res.data.data.isAutocol
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      openRouterDialog() {
        this.listRouterVisible = true;
        this.getRouter()
      },
      getRouter() {
        this.listRouterData = []
        this.$axios
          .get("/api/hoV2AppChannelTask/getRouter/" + this.hotelId)
          .then(res => {
            if (res.data.data.sn != null && res.data.data.sn != "") {
              this.listRouterData.push({
                "sn": res.data.data.sn
              })
            }
            console.log(res.data.data.sn)
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleRouterdelete(index, row) {
        let data = {
          hotelId: this.hotelId + "",
        }
        this.$axios
          .post("/api/hoV2AppChannelTask/deleteRouter", data)
          .then(res => {
            this.getRouter()
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      deleteTask(index, row) {

        let data = {
          hotelId: this.hotelId + "",
          taskId: row.id + "",
        }
        this.$axios
          .post("/api/hoV2AppChannelTask/deleteTask", data)
          .then(res => {
            this.getTask()
          }).catch((err) => {
            console.log(err + "错误");
          });

      },
      switchChange(value, row) {
        let data = {
          hotelId: this.hotelId + "",
          taskId: row.id + "",
          isSwitch: value
        }
        this.$axios
          .post("/api/hoV2AppChannelTask/switchTask", data)
          .then(res => {
            this.$message.success("修改成功")
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      refresh() {

      },
      inDialogChannel() {
        this.channeloptions = []
        this.inDialogVisible = true
        this.typevalue = ""
        this.channelvalue = ""
        this.typelock = "1"
        this.data2 = []
        this.value2 = []
        this.$axios
          .get("/api/hoV2AppChannelTask/getAppChannelUrl/" + this.hotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              var isin = res.data.data[i].channelId == null ? "自定义" : "内置"
              // this.channeloptions.push({
              //   "value": res.data.data[i].id,
              //   "label": res.data.data[i].name + "  --  " + isin,
              // })
              this.data2.push({
                channelId: res.data.data[i].id,
                value: res.data.data[i].name,
                label: res.data.data[i].name + "  --  " + isin,
                key: res.data.data[i].id
              })
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      inSubmit() {
        // if (isEmpty(this.channelvalue + "")) {
        //   this.$message.error("请选择频道")
        //   return;
        // }
        // if (isEmpty(this.typevalue + "")) {
        //   this.$message.error("请选择频道类型")
        //   return;
        // }
        // let data = {
        //   hotelId: this.hotelId + "",
        //   channelId: this.channelvalue + "",
        //   channelType: this.typevalue + "",
        //   isMust: 0 + ""
        // }
        // this.$axios
        //   .post("/api/hoV2AppChannelTask/insertTask", data)
        //   .then(res => {
        //     if (res.data.code == 0) {
        //       this.getTask()
        //       this.inDialogVisible = false;
        //       this.$message.success("添加成功")
        //     } else {
        //       this.$message.error(res.data.msg)
        //     }
        //   }).catch((err) => {
        //     console.log(err + "错误");
        //   });
        console.log(this.value2)
        if (this.value2.length <= 0) {
          this.$message.error("请选择频道")
          return;
        }
        if (isEmpty(this.typevalue + "")) {
          this.$message.error("请选择频道类型")
          return;
        }
        let data = []
        for (var i = 0; i < this.value2.length; i++) {
          data.push({
            hotelId: this.hotelId + "",
            channelId: this.value2[i] + "",
            channelType: this.typevalue + "",
            isMust: 0 + "",
          })

        }
        this.$axios
          .post("/api/hoV2AppChannelTask/insertMultiTask", data)
          .then(res => {
            if (res.data.code == 0) {
              this.getTask()
              this.inDialogVisible = false;
              this.$message.success("添加成功")
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getEth() {
        this.ethtableData = []
        this.instance
          .get("/api/hoV2AppChannelTask/getEth/" + this.hotelId)
          .then(res => {

            for (var i = 0; i < res.data.data.length; i++) {
              this.ethtableData.push({
                eth: res.data.data[i].eth,
                ethType: res.data.data[i].type,
                ethIp: res.data.data[i].ip,
                username: res.data.data[i].username,
                password: res.data.data[i].password,
                ethStatus: res.data.data[i].status == 0 ? "连通" : "不连通",
              })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getTask() {
        this.tableData = []
        this.instance
          .get("/api/hoV2AppChannelTask/getTask/" + this.hotelId)
          .then(res => {

            for (var i = 0; i < res.data.data.length; i++) {

              this.tableData.push({
                id: res.data.data[i].id,
                isSwitch: res.data.data[i].isSwitch + "",
                channelName: res.data.data[i].name,
                channelType: res.data.data[i].channelType,
                live: res.data.data[i].live,
                eth: res.data.data[i].eth,
                ethType: res.data.data[i].ethType,
                ethStatus: res.data.data[i].ethStatus,
                collectStatus: res.data.data[i].channelStatus,
                isMust: res.data.data[i].isMust == 0 ? "固定" : "不固定",
                collectType: res.data.data[i].collectType,
                 uploadTime:formatDate(res.data.data[i].uploadTime)
              })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getUploadTime() {
        this.$axios
          .get("/api/hoV2AppChannelTask/getUploadTime/" + this.hotelId)
          .then(res => {
            this.uploadTime = res.data.data.uploadTime
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getHard() {
        this.instance
          .get("/api/hoV2AppChannelTask/getHard/" + this.hotelId)
          .then(res => {
            this.cpumes = "cpu信息:" + res.data.data.cpu;
            this.memsize = "内存信息:" + res.data.data.memorysize;
            this.hardsize = "硬盘信息:" + res.data.data.harddisksize;
            this.cputerm = "cpu温度:" + res.data.data.cpuTerm;
            this.cpuusage = "cpu使用率:" + res.data.data.cpuUsge;
            this.memusage = "内存使用大小:" + res.data.data.memUsge
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      upUploadTime() {
        this.$prompt('请输入上传时间间隔', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: this.uploadTime,
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {
          let data = {
            hotelId: this.hotelId + "",
            uploadTime: value
          }
          this.$axios
            .post("/api/hoV2AppChannelTask/setUploadTime", data)
            .then(res => {
              this.$message.success("修改成功")
              this.getUploadTime()
            }).catch((err) => {
              console.log(err + "错误");
            });

        }).catch(() => {

        });
      }
    },
    created() {
      this.instance = axios.create({
        timeout: 10000,
      });
      this.getEth()
      this.getTask()
      this.getUploadTime()
      this.getHard();
      this.hardInterval = setInterval(this.getHard, 15000)
      this.ethInterval = setInterval(this.getEth, 15000)
      this.taskInterval = setInterval(this.getTask, 15000)
      this.getMaxGroup()
    },

    beforeDestroy: function () {
      clearInterval(this.hardInterval);
      clearInterval(this.ethInterval);
      clearInterval(this.taskInterval);
    },

  }

</script>

<style scoped>
  .el-tag+.el-tag {
    margin-left: 10px;
    margin-top: 10px;
  }

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

  .el-transfer-panel {
    width: 300px !important
  }

</style>
