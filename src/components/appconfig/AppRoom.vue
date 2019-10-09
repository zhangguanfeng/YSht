<template>
  <div class="">

    <el-row>
      <div style="display:inline-block;width:200px">
        <el-input v-model="roomLikeName" placeholder="请输入房间号码"></el-input>
      </div>
      <el-button type="primary" @click="searchHotel">搜索</el-button>
      <el-button type="primary" @click="openSingleDialog">添加房间</el-button>
      <el-button type="primary" @click="openMultiDialog">批量添加房间</el-button>
      <el-button type="primary" @click="handleMultiDialog()" v-if="roleId==2">批量续点</el-button>
      <!-- <el-button type="primary" @click="handleStatusDialog()">批量修改使用状态</el-button> -->
    </el-row>
    <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}"
      :key="tableData.roomId">
      <el-table-column label="房间号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roomNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="桌面版本" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.destVersion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="播放器版本" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tvVersion }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="ip地址" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="mac" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.mac }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column v-if="roleId==998" label="房间位置" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.roomArea }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="是否在线" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.liveTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="型号" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.roomModel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="mac" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.mac }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否绑定" align="center">
        <template slot-scope="scope">
          <el-switch v-model=" scope.row.isBind" active-value="0" inactive-value="1"
            @change="switchBindChange($event, scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column v-if="roleId==998" label="是否禁用" align="center">
        <template slot-scope="scope">
          <el-switch v-model=" scope.row.isBan" active-value="0" inactive-value="1"
            @change="switchBanChange($event, scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="wifi名称" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.wfName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="wifi密码" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.wfPwd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="wifi状态" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.isWifiMes }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="住户姓名" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.roomName }}</span>
        </template>
      </el-table-column> -->


      <el-table-column label="到期时间" align="center" width="100px">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.expireTime }}</span>
        </template>
      </el-table-column>
       <!-- <el-table-column label="余下天数" align="center" width="100px">
        <template slot-scope="scope">
           <span style="margin-left: 10px">{{ scope.row.pauseTime }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="使用状态" align="center" width="120px">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.isStopPay==0"
            @click="changeSinglePayStatus(scope.$index, scope.row)">正常中</el-button>
          <el-button type="danger" v-else @click="changeSinglePayStatus(scope.$index, scope.row)">
            暂停中剩{{scope.row.distanceTime}}天</el-button>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" width="450px">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleSinglePayDialog(scope.$index, scope.row)" v-if="roleId==2">续点</el-button>
          <el-button type="primary" @click="handleWifiDialog(scope.$index, scope.row)">wifi管理</el-button>
          <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑房号</el-button>
          <!-- <el-button type="primary" @click="handleLiveEdit(scope.$index, scope.row)">编辑住户</el-button> -->
          <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagecontainer">
      <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[15]"
        layout="total, sizes, prev, pager, next, jumper" :total=dataSize>
      </el-pagination>
    </div>
    <!-- 批量添加对话框 -->
    <el-dialog title="批量添加房间" :visible.sync="inDialogVisible">
      <el-form :model="inform" ref="inform">
        <el-form-item label="最小楼层" :label-width="formLabelWidth" prop="moduleName">
          <el-input v-model="inform.minFloor" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="最大楼层" :label-width="formLabelWidth">
          <el-input v-model="inform.maxFloor" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="每层最小房间号码" :label-width="formLabelWidth">
          <el-input v-model="inform.minNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="每层最大房间号码" :label-width="formLabelWidth">
          <el-input v-model="inform.maxNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="房间补位" :label-width="formLabelWidth">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-input v-model="inform.coverNum" autocomplete="off"></el-input>
            </el-col>
            <el-col :span="14">比如房间号码是11，补位2,房间号码变成1001</el-col>
          </el-row>

        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="inSubmit">确 定</el-button>
        <el-button @click="inDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="请确认要增加的房间" :visible.sync="checkRoomDialogVisible">
      <el-tag v-for="tag in tags" :key="tag.roomNum" closable :disable-transitions="false" @close="handleClose(tag)">
        {{tag.roomNum}}
      </el-tag>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkRoomSubmit">确 定</el-button>
        <el-button @click="checkRoomDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- wifi管理 -->
    <el-dialog title="wifi管理" :visible.sync="checkWifiRoomDialogVisible">
      <el-form :model="wifiform" ref="inform">
        <el-form-item label="wifi名称" :label-width="formLabelWidth" prop="moduleName">
          <el-input v-model="wifiform.wfName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="wifi密码" :label-width="formLabelWidth">
          <el-input v-model="wifiform.wfPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="wifi开关" :label-width="formLabelWidth">
          <el-switch v-model="wifiform.isWifi" active-value="0" inactive-value="1"></el-switch>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkWifiSubmit">确 定</el-button>
        <el-button @click="checkWifiRoomDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 单个房间续点 -->
    <el-dialog title="续点管理" :visible.sync="singlePayRoomDialogVisible">
      <el-form :model="singlePayForm">
        <el-form-item label="房间名称" :label-width="formLabelWidth" prop="moduleName">
          <el-input v-model="singlePayForm.roomName" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="续点天数" :label-width="formLabelWidth">
          <el-select v-model="singlePayForm.roomDay" placeholder="请选择" @change="changeSinglePayDay">
            <el-option v-for="item in singlepayoptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="续点点数" :label-width="formLabelWidth">
          <el-input v-model="singlePayForm.payPoint" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkSinglePaySubmit">确 定</el-button>
        <el-button @click="singlePayRoomDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 批量续点 -->
    <el-dialog title="批量续点" :visible.sync="multiPayDialogVisible">
      <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入房间名称搜索" v-model="value2"
        :data="data2" style="margin-top:30px" :titles="['全部房间列表', '待续点房间列表']" :button-texts="['到左边', '到右边']"
        @change="rightPayChange()">
      </el-transfer>
      <el-form :model="multipayform">
        <el-form-item label="续点天数" :label-width="formLabelWidth">
          <el-select v-model="multipayform.roomDay" placeholder="请选择" @change="changeMultiPayDay">
            <el-option v-for="item in mulitpayoptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="续点点数" :label-width="formLabelWidth">
          <el-input v-model="multipayform.payPoint" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkMultiPay">确 定</el-button>
        <el-button @click="multiPayDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 批量修改使用状态 -->
    <el-dialog title="批量修改使用状态" :visible.sync="multiStatusDialogVisible">
      <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入房间名称搜索" v-model="value2"
        :data="data2" style="margin-top:30px" :titles="['全部房间列表', '待修改房间列表']" :button-texts="['到左边', '到右边']">
      </el-transfer>
      <el-form :model="multistatusform">
        <el-form-item label="修改为" :label-width="formLabelWidth">
          <el-select v-model="multistatusform.status" placeholder="请选择">
            <el-option v-for="item in mulitstatusoptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkStatusSubmit">确 定</el-button>
        <el-button @click="multiStatusDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    isEmpty
  } from '../../../static/js/util.js'
  import bus from '../common/bus';


  export default {
    //写上name参数会被缓存
    name: "admindex",
    data() {
      return {
        roleId: sessionStorage.roleId,
        hotelId: sessionStorage.hotelId,
        agentId: sessionStorage.agentId,
        visibleDialog: false,
        tableData: [],
        formLabelWidth: "150px",
        inDialogVisible: false,
        tags: [],
        inform: {
          minFloor: "",
          maxFloor: "",
          minNum: "",
          maxNum: "",
          coverNum: ""
        },
        currentPage: 1,
        dataSize: 15,
        roomLikeName: "",
        checkRoomDialogVisible: false,
        checkWifiRoomDialogVisible: false,
        wifiform: {
          isWifi: "",
          wfName: "",
          wfPwd: "",
          roomId: ""
        },
        singlePayRoomDialogVisible: false,
        multiPayDialogVisible: false,
        multiStatusDialogVisible: false,
        singlePayForm: {
          roomId: "",
          roomName: "",
          roomDay: "",
          payPoint: ""
        },
        multipayform: {
          roomDay: "",
          roomId: ""
        },
        multistatusform: {
          status: ""
        },
        singlepayoptions: [{
          value: '180',
          label: '180天'
        },{
          value: '365',
          label: '365天'
        }],
        mulitpayoptions: [{
          value: '180',
          label: '180天'
        },{
          value: '365',
          label: '365天'
        }],
        mulitstatusoptions: [{
          value: '0',
          label: '正常中'
        }, {
          value: '1',
          label: '暂停中'
        }],
        value2: [],
        data2: [],
        filterMethod(query, item) {
          return item.value.indexOf(query) > -1;
        },
      }
    },
    methods: {
      handleStatusDialog() {
        this.value2 = []
        this.data2 = []
        this.multiStatusDialogVisible = true
        this.$axios
          .get("/api/hoHotelRoom/getAllRoom", {
            params: {
              hotelId: this.hotelId + "",
            }
          })
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              var status;
              if (res.data.data[i].isStopPay == 0) {
                status = "正常中"
              } else {
                status = "暂停中"
              }
              this.data2.push({
                value: res.data.data[i].roomNum,
                label: res.data.data[i].roomNum + "  --  " + status,
                key: res.data.data[i].id
              })
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      checkStatusSubmit() {
        // var data = []
        // for (var i = 0; i < this.value2.length; i++) {
        //   data.push({
        //     "roomId": this.value2[i],
        //     "status": this.multistatusform.status + ""
        //   })
        // }
        // // console.log(data)
        // this.$axios
        //   .post("/api/hoHotelRoom/changeMultiStatus", data)
        //   .then(res => {
        //     if (res.data.code == 0) {
        //       this.multiStatusDialogVisible = false
        //       this.getRoom()
        //     } else {
        //       this.$message.error(res.data.msg)
        //     }
        //   }).catch((err) => {
        //     console.log(err + "错误");
        //   });
      },
      handleMultiDialog() {
        this.multipayform.roomDay = "180"
        this.multipayform.payPoint = ""
        this.value2 = []
        this.data2 = []
        this.multiPayDialogVisible = true
        this.$axios
          .get("/api/hoHotelRoom/getAllRoom", {
            params: {
              hotelId: this.hotelId + "",
            }
          })
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.data2.push({

                value: res.data.data[i].roomNum,
                label: res.data.data[i].roomNum + "  --  " + res.data.data[i].expireTime,
                key: res.data.data[i].id
              })
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      checkMultiPay() {
        if (this.value2.length <= 0) {
          this.$message.error("请选择房间")
        }
        var multiroom = []
        for (var i = 0; i < this.value2.length; i++) {
          multiroom.push({
            agentId: this.agentId,
            roomId: this.value2[i],
            payDay: this.multipayform.roomDay
          })
        }
        this.$axios
          .post("/api/hoHotelRoom/payMultiRoom", multiroom)
          .then(res => {
            if (res.data.code == 0) {
              this.multiPayDialogVisible = false
             bus.$emit('pointNum', (sessionStorage.pointNum - this.multipayform.payPoint).toFixed(3))
              sessionStorage.pointNum = (sessionStorage.pointNum - this.multipayform.payPoint).toFixed(3)
              this.getRoom()
               this.$message.success("续点成功")
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      changeMultiPayDay() {
        this.multipayform.payPoint = this.value2.length * this.multipayform.roomDay * 0.033
        this.multipayform.payPoint= this.multipayform.payPoint.toFixed(3);
      },
      rightPayChange() {
        this.multipayform.payPoint = this.value2.length * this.multipayform.roomDay * 0.033
        this.multipayform.payPoint= this.multipayform.payPoint.toFixed(3);
      },
      changeSinglePayStatus(index, row) {
        // let data = {
        //   roomId: row.roomId + "",

        // }
        // this.$axios
        //   .post("/api/hoHotelRoom/changeSinglePayStatus", data)
        //   .then(res => {
        //     console.log(res.data);
        //     if (res.data.code == 0) {
        //       this.getRoom()
        //     } else {
        //       this.$message.error(res.data.msg)
        //     }
        //   }).catch((err) => {
        //     console.log(err + "错误");
        //   });
      },
      changeSinglePayDay(value) {
        this.singlePayForm.payPoint = (0.033 * value).toFixed(3)
      },
      handleSinglePayDialog(index, row) {
        this.singlePayRoomDialogVisible = true
        this.singlePayForm.roomName = row.roomNum
        this.singlePayForm.roomId = row.roomId
        this.singlePayForm.payPoint = 0.033
        this.singlePayForm.roomDay = "180"
      },
      checkSinglePaySubmit() {
        let data = {
          roomId: this.singlePayForm.roomId + "",
          agentId: sessionStorage.agentId + "",
          roomDay: this.singlePayForm.roomDay
        }
        this.$axios
          .post("/api/hoHotelRoom/paySingleRoom", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.$message.success("续费成功")
              this.singlePayRoomDialogVisible = false
              bus.$emit('pointNum', (sessionStorage.pointNum - this.singlePayForm.payPoint).toFixed(3))
              sessionStorage.pointNum =(sessionStorage.pointNum - this.singlePayForm.payPoint).toFixed(3) 
              this.getRoom()
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleWifiDialog(index, row) {
        this.checkWifiRoomDialogVisible = true
        this.wifiform.isWifi = row.isWifi,
          this.wifiform.wfName = row.wfName,
          this.wifiform.wfPwd = row.wfPwd,
          this.wifiform.roomId = row.roomId
      },
      checkWifiSubmit() {
        let data = {
          roomId: this.wifiform.roomId + "",
          wfName: this.wifiform.wfName,
          wfPwd: this.wifiform.wfPwd,
          isWifi: this.wifiform.isWifi + ""
        }
        this.$axios
          .post("/api/hoHotelRoom/editWifi", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.$message.success("保存成功")
              this.checkWifiRoomDialogVisible = false
              this.getRoom()
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleEdit(index, row) {
        this.$prompt('请输入房间号码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: row.roomNum + "",
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {
          let data = {
            hotelId: this.hotelId + "",
            roomNum: value + "",
            roomId: row.roomId + ""
          }
          this.$axios
            .post("/api/hoHotelRoom/editRoom", data)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.getRoom()
              } else {
                this.$message.error("房间号重复了")
              }
            }).catch((err) => {
              console.log(err + "错误");
            });

        }).catch(() => {

        });
      },
      handleLiveEdit(index, row) {
        this.$prompt('请输入住户姓名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: row.roomName + "",
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {
          let data = {
            roomName: value + "",
            roomId: row.roomId + ""
          }
          this.$axios
            .post("/api/hoHotelRoom/editLive", data)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.getRoom()
              } else {

              }
            }).catch((err) => {
              console.log(err + "错误");
            });

        }).catch(() => {

        });
      },
      searchHotel() {
        console.log(this.roleId == 998)
        this.currentPage = 1;
        this.getRoom();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getRoom();
      },
      openSingleDialog() {
        this.$prompt('请输入房间号码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {
          let data = {
            hotelId: this.hotelId + "",
            roomNum: value
          }
          this.$axios
            .post("/api/hoHotelRoom/insertRoom", data)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.getRoom()
              } else {
                this.$message.error("房间号重复了")
              }
            }).catch((err) => {
              console.log(err + "错误");
            });

        }).catch(() => {

        });
      },
      openMultiDialog() {
        this.inDialogVisible = true;
        this.inform.minFloor = "";
        this.inform.maxFloor = "";
        this.inform.minNum = "";
        this.inform.maxNum = "";
        this.inform.coverNum = "";
        this.tags = []
      },
      checkRoomSubmit() {
        if (this.tags.length == 0) {
          this.$message.error("没有房间");
          return
        }
        this.$axios
          .post("/api/hoHotelRoom/insertMultiRoom", this.tags)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.inDialogVisible = false;
              this.checkRoomDialogVisible = false;
              this.getRoom();
            } else {
              this.$message.error(res.data.msg)
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleClose(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
      },
      inSubmit() {
        this.changeNum();
        this.checkRoomDialogVisible = true;

      },
      changeNum() {
        this.tags = [];
        var minFloor = parseInt(this.inform.minFloor);
        var maxFloor = parseInt(this.inform.maxFloor);
        var minNum = parseInt(this.inform.minNum);
        var maxNum = parseInt(this.inform.maxNum);
        var coverNum = parseInt(this.inform.coverNum)
        var multinum = "";
        for (var i = 0; i < coverNum; i++) {
          multinum += "0";
        }
        for (var i = minFloor; i < (maxFloor + 1); i++) {
          for (var j = minNum; j < (maxNum + 1); j++) {
            if (j >= 10) {
              var a = multinum.substring(0, multinum.length - 1);
              this.tags.push({
                hotelId: this.hotelId,
                roomNum: i + a + j
              })
            } else {
              this.tags.push({
                hotelId: this.hotelId,
                roomNum: i + multinum + j
              })
            }

          }
        }
      },

      handleDelete(index, row) {
          this.$confirm('此操作将删除该房间,续点的点数是不会退还的, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        
        let data = {
          roomId: row.roomId + ""
        }
        this.$axios
          .post("/api/hoHotelRoom/deleteRoom", data)
          .then(res => {
            console.log(res.data);
            this.tableData.splice(this.tableData.indexOf(row), 1);
          }).catch((err) => {
            console.log(err + "错误");
          });
        }).catch(() => {

        });

      },
      switchBindChange(value, row) {
        let data = {
          roomId: row.roomId + "",
          isBind: value
        }
        this.$axios
          .post("/api/hoHotelRoom/switchBind", data)
          .then(res => {
            console.log(res.data);

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      switchBanChange(value, row) {
        let data = {
          roomId: row.roomId + "",
          isBan: value
        }
        this.$axios
          .post("/api/hoHotelRoom/switchBan", data)
          .then(res => {
            console.log(res.data);

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getRoom() {
        this.tableData = []
        this.$axios
          .get("/api/hoHotelRoom/getRoom", {
            params: {
              curPage: this.currentPage,
              hotelId: this.hotelId + "",
              roomLikeName: this.roomLikeName
            }
          })
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              var a = ""
              if (res.data.data[i].isWifi == null) {
                a = ""
              } else if (res.data.data[i].isWifi == 0) {
                a = "开"
              } else {
                a = "关"
              }
              this.tableData.push({
                roomId: res.data.data[i].id,
                roomNum: res.data.data[i].roomNum,
                destVersion: res.data.data[i].destVersion,
                tvVersion: res.data.data[i].tvVersion,
                mac: res.data.data[i].mac,
                ip: res.data.data[i].ip,
                isBind: res.data.data[i].isBind + "",
                isBan: res.data.data[i].isBan + "",
                roomArea: res.data.data[i].roomArea,
                isWifiMes: a,
                isWifi: res.data.data[i].isWifi == 0 ? "0" : "1",
                wfName: res.data.data[i].wfName,
                wfPwd: res.data.data[i].wfPwd,
                roomName: res.data.data[i].roomName,
                roomModel: res.data.data[i].roomModel,
                liveTime: res.data.data[i].liveTime == 1 ? "在线" : "",
                expireTime: res.data.data[i].expireTime,
                isStopPay: res.data.data[i].isStopPay,
                distanceTime: res.data.data[i].distanceTime + "",
                pauseTime:res.data.data[i].pauseTime
              })
            }
            this.dataSize = res.data.dataSize
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      checkHotel() {
        // let data = {
        //   hotelId: this.hotelId + "",
        //   token: sessionStorage.eleToken
        // }
        // this.$axios
        //   .post("/api/hoHotelMes/checkHotel", data)
        //   .then(res => {
        //     console.log(res.data);
        //     if (res.data.code != 0) {
        //       this.$router.push({
        //         path: "/login"
        //       })
        //     }
        //   }).catch((err) => {
        //     console.log(err + "错误");
        //   });
      }

    },
    created() {
      // this.checkHotel()
      this.getRoom()
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

</style>
