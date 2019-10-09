<template>


  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>酒店列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!-- <span>酒店列表</span> -->
      <el-row>
        <div style="display:inline-block;width:200px">
          <el-input v-model="hotelLikeName" placeholder="请输入酒店名称"></el-input>
        </div>
        <el-button type="primary" @click="searchHotel">搜索</el-button>
        <el-button type="primary" @click="openInDialog">创建酒店</el-button>
        <el-button type="primary" @click="handleMultiDialog()">批量续点</el-button>
          <el-button type="primary" @click="multiLicenseHotel">批量修改授权时间</el-button>
          <el-button type="text" disabled>授权时间是可以改变桌面APP的使用状态，但并不影响续点时间</el-button>
      </el-row>
      <el-table :data="tableData" stripe style="width: 100%"
        :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">
        <el-table-column label="酒店ID" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.hotelId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="酒店名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.hotelName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="酒店地址" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.hotelArea }}</span>
          </template>
        </el-table-column>
        <el-table-column label="房间数目" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.roomTotal}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="试用时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.tryTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="授权时间" align="center">
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.expireTime" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
              :clearable="false" value-format="yyyy-MM-dd" @change="changeExpireTime(scope.row)">
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="app是否显示" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isAppshow" active-value="0" inactive-value="1"
              @change=" switchChange($event, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="350px">
          <template slot-scope="scope">
            <!-- <el-button type="primary">续点</el-button> -->
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click=" handleDetailEdit(scope.$index, scope.row)">详细配置</el-button>
            <el-button size="mini" type="danger" @click="deleteHotel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagecontainer">
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[15]"
          layout="total, sizes, prev, pager, next, jumper" :total=dataSize>
        </el-pagination>
      </div>
      <!-- 添加酒店对话框 -->
      <el-dialog title="创建酒店" :visible.sync="inDialogFormVisible">

        <el-form :model="inform" ref="inform">
          <el-form-item label="酒店名称" :label-width="formLabelWidth" prop="hotelName">

            <el-input v-model="inform.hotelName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="酒店地址" :label-width="formLabelWidth" prop="hotelArea">

            <el-input v-model="inform.hotelArea" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="直播列表区域选择" :label-width="formLabelWidth">
            <el-cascader placeholder="请选择直播源区域" :options="options" v-model="aa" filterable 
              @change="selectArea2"></el-cascader>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="insertHotel">确定</el-button>
          <el-button @click="inDialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>
      <!-- 修改酒店 -->
      <el-dialog title="修改酒店" :visible.sync="upDialogFormVisible">

        <el-form :model="upform" ref="upform">
          <el-form-item label="酒店名称" :label-width="formLabelWidth">

            <el-input v-model="upform.hotelName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="酒店地址" :label-width="formLabelWidth">

            <el-input v-model="upform.hotelArea" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="稳定更新" :label-width="formLabelWidth">

            <el-switch v-model="upform.hotelStatus" active-value="0" inactive-value="1">
            </el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateHotel">确定</el-button>
          <el-button @click="upDialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>

      <!-- 批量授权到期时间 -->
      <el-dialog title="批量授权到期时间" :visible.sync="licenseDialogFormVisible">



        <el-date-picker v-model="licenseTime" type="date" placeholder="选择授权日期" format="yyyy 年 MM 月 dd 日"
          :clearable="false" value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入酒店名称搜索" v-model="value2"
          :data="data2" style="margin-top:30px" :titles="['代理商酒店列表', '待授权酒店列表']" :button-texts="['到左边', '到右边']">
        </el-transfer>



        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="licenseSubmit">确 定</el-button>
          <el-button @click="licenseDialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>

       <el-dialog title="批量续点" :visible.sync="multiPayDialogVisible">
      <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入酒店名称搜索" v-model="value2"
        :data="data2" style="margin-top:30px" :titles="['全部酒店列表', '待续点酒店列表']" :button-texts="['到左边', '到右边']"
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
    </div>
  </div>

</template>

<script>
  import {
    isEmpty
  } from '../../../static/js/util.js'
  import bus from '../common/bus';
  export default {

    //写上name参数会被缓存
    name: "agehotellist",
    data() {

      return {
        agentId: sessionStorage.agentId,
        hotelLikeName: "",
        aa: [],
        areaHotelId: "",
        options: [],
        inDialogFormVisible: false,
        upDialogFormVisible: false,
        formLabelWidth: "150px",
        tableData: [],
        inform: {
          hotelName: "",
          hotelArea: "",
          channelArea: ""
        },
        upform: {
          hotelId: "",
          hotelName: "",
          hotelArea: "",
          hotelStatus: ""
        },
        currentPage: 1,
        dataSize: 1,
        licenseDialogFormVisible: false,
        data2: [],
        value2: [],
        filterMethod(query, item) {
          return item.value.indexOf(query) > -1;
        },
        licenseAgentId: "",
        licenseTime: "",
        licenseOptions: [],
         multipayform: {
          roomDay: "",
          roomId: ""
        },
          mulitpayoptions: [{
          value: '180',
          label: '180天'
        },  {
          value: '365',
          label: '365天'
        }],
        multiPayDialogVisible: false,
      }
    },

    methods: {
      changeMultiPayDay(){
        this.multipayform.payPoint=0
          console.log(this.value2[0].split("-"))
          for(var i=0;i<this.value2.length;i++){
            var b=this.value2[i].split("-");
             this.multipayform.payPoint = b[1] * 0.033*this.multipayform.roomDay+ this.multipayform.payPoint 
          }
           this.multipayform.payPoint= this.multipayform.payPoint.toFixed(3);
      },
      rightPayChange(){
        this.multipayform.payPoint=0
        
          for(var i=0;i<this.value2.length;i++){
            var b=this.value2[i].split("-");
             this.multipayform.payPoint = b[1] * 0.033*this.multipayform.roomDay+ this.multipayform.payPoint 
          }
           this.multipayform.payPoint= this.multipayform.payPoint.toFixed(3);
      },
      handleMultiDialog(){
        this.multipayform.roomDay = "180"
        this.multipayform.payPoint = ""
        this.value2 = []
        this.data2 = []
        this.multiPayDialogVisible = true
         this.$axios
          .get("/api/hoHotelMes/getHotel/" + this.agentId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.data2.push({
                value: res.data.data[i].hotelName,
                label: res.data.data[i].hotelName + " -- " + res.data.data[i].roomTotal,
                key: res.data.data[i].id+"-"+res.data.data[i].roomTotal
              })
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      checkMultiPay(){
              if (this.value2.length <= 0) {
          this.$message.error("请选择酒店")
        }
        var multiroom = []
        for (var i = 0; i < this.value2.length; i++) {
           var b=this.value2[i].split("-");
          multiroom.push({
            agentId: this.agentId,
            hotelId: b[0],
            payDay: this.multipayform.roomDay
          })
        }
        this.$axios
          .post("/api/hoHotelMes/changeMultiPayTime", multiroom)
          .then(res => {
            if (res.data.code == 0) {
              this.multiPayDialogVisible = false
              bus.$emit('pointNum', (sessionStorage.pointNum - this.multipayform.payPoint).toFixed(3))
              sessionStorage.pointNum = (sessionStorage.pointNum - this.multipayform.payPoint).toFixed(3)
              this.getHotel()
              this.$message.success("续点成功")
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      licenseSubmit() {
        if (this.value2.length <= 0) {
          this.$message.error("请选择酒店")
          return;
        }
        if (isEmpty(this.licenseTime + "")) {
          this.$message.error("请选择到期时间")
          return;
        }
        let data = []
        for (var i = 0; i < this.value2.length; i++) {
          data.push({
            hotelId: this.value2[i] + "",
            licenseTime: this.licenseTime
          })

        }
        this.$axios
          .post("/api/hoHotelMes/multiExpireTime", data)
          .then(res => {
            if (res.data.code == 0) {
              this.getHotel()
              this.licenseDialogFormVisible = false;
              this.$message.success("授权成功")
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      multiLicenseHotel() {
        this.licenseDialogFormVisible = true
        this.licenseAgentId = ""
        this.data2 = []
        this.value2 = []
        this.licenseTime = ""
        this.$axios
          .get("/api/hoHotelMes/getHotel/" + this.agentId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.data2.push({
                value: res.data.data[i].hotelName,
                label: res.data.data[i].hotelName + " -- " + res.data.data[i].expireTime,
                key: res.data.data[i].id
              })
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      changeExpireTime(row) {
        let data = {
          hotelId: row.hotelId + "",
          expireTime: row.expireTime
        }
        this.$axios
          .post("/api/hoHotelMes/changeExpireTime", data)
          .then(res => {
            console.log(res.data);
          }).catch((err) => {
            console.log(err + "错误");
          });
        console.log(row)
      },
      deleteHotel(index, row) {
        this.$confirm('此操作将删除该酒店的所有资料, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            hotelId: row.hotelId + "",
          }
          this.$axios
            .post("/api/hoHotelMes/deleteHotel", data)
            .then(res => {

              this.getHotel()
            }).catch((err) => {
              console.log(err + "错误");
            });
        }).catch(() => {

        });


        // console.log(row.hotelId)
      },
      updateHotel() {
        let data = {
          hotelId: this.upform.hotelId + "",
          hotelName: this.upform.hotelName,
          hotelArea: this.upform.hotelArea,
          hotelStatus: this.upform.hotelStatus
        }
        this.$axios
          .post("/api/hoHotelMes/updateHotel", data)
          .then(res => {
            this.upDialogFormVisible = false;
            this.getHotel()
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getHotel()
      },
      handleEdit(index, row) {
        this.upDialogFormVisible = true;
        this.upform.hotelId = row.hotelId;
        this.upform.hotelName = row.hotelName;
        this.upform.hotelArea = row.hotelArea;
        this.upform.hotelStatus = row.hotelStatus;
      },

      searchHotel() {
        this.currentPage = 1;
        this.getHotel();
      },
      handleDetailEdit(index, row) {
        sessionStorage.hotelName = row.hotelName;
        sessionStorage.hotelId = row.hotelId;
        this.$router.push({
          path: "/agehoteldetail"
        })
      },
      switchChange(value, row) {

        let data = {
          hotelId: row.hotelId + "",
          status: value + "",
        }
        this.$axios
          .post("/api/hoHotelMes/changeAppShow", data)
          .then(res => {
            console.log(res.data);
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      openInDialog() {
        this.areaHotelId = ""
        this.aa = [];
        this.inDialogFormVisible = true;
        if (this.$refs["inform"] !== undefined) {
          this.$refs["inform"].resetFields();
        }
      },
      selectArea2(value) {
        console.log(value)
        if (value.length == 3) {
          var arr = value[2].split("-");
          this.areaHotelId = arr[0];
        }
      },
      getChannelArea() {
        this.options = [];
        this.$axios
          .get("/api/hoInChannelArea/getV2ChannelArea")
          .then(res => {
            console.log(res.data);
            this.options = res.data.data;

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      insertHotel() {

        if (isEmpty(this.inform.hotelName)) {
          this.$message.error("请输入酒店名称")
          return;
        }
        if (isEmpty(this.inform.hotelArea)) {
          this.$message.error("请输入酒店地址")
          return;
        }
        if (isEmpty(this.areaHotelId)) {
          this.$message.error("请选择直播列表区域")
          return;
        }
        let data = {
          agentId: sessionStorage.agentId + "",
          areaHotelId: this.areaHotelId + "",
          hotelName: this.inform.hotelName,
          hotelArea: this.inform.hotelArea
        }
        this.$axios
          .post("/api/hoHotelMes/insert", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.inDialogFormVisible = false;
              this.getHotel();
            } else {
              this.$message.error(res.data.msg);
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getHotel() {

        this.tableData = [];
        this.$axios
          .get("/api/hoHotelMes/getHotel", {
            params: {
              curPage: this.currentPage,
              agentId: sessionStorage.agentId + "",
              hotelLikeName: this.hotelLikeName
            }
          })
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              var a = ""
              if (res.data.data[i].hotelStatus == null || res.data.data[i].hotelStatus == "1") {
                a = "1"
              } else {
                a = "0"
              }
              this.tableData.push({
                hotelName: res.data.data[i].hotelName,
                hotelArea: res.data.data[i].hotelArea,
                roomTotal: res.data.data[i].roomTotal,
                expireTime: res.data.data[i].expireTime,
                createTime: res.data.data[i].createTime,
                tryTime: res.data.data[i].tryTime,
                isAppshow: res.data.data[i].isAppshow + "",
                hotelStatus: a,
                hotelId: res.data.data[i].id
              })
            }
            this.dataSize = res.data.dataSize
          }).catch((err) => {
            console.log(err + "错误");
          });
      }
    },

    created() {
      this.getChannelArea();
      this.getHotel();
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
