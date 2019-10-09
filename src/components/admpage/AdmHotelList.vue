<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>酒店列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-row>
        <el-select v-model="agentId" filterable placeholder="请选择代理商">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <div style="display:inline-block;width:200px">
          <el-input v-model="hotelLikeName" placeholder="请输入酒店名称"></el-input>
        </div>

        <el-button type="primary" @click="searchHotel">搜索</el-button>
        <!-- <el-button type="primary" @click="multiLicenseHotel">批量授权酒店时间</el-button> -->
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
        <el-table-column label="所属代理商" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.agentName }}</span>
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
        <!-- <el-table-column label="到期时间" align="center">
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.expireTime" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
              :clearable="false" value-format="yyyy-MM-dd" @change="changeExpireTime(scope.row)">
            </el-date-picker>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
            <el-button size="mini" type="primary" @click="handleDetailEdit(scope.$index, scope.row)">详细配置</el-button>
            <!-- <el-button size="mini" type="danger">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagecontainer">
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[15]"
          layout="total, sizes, prev, pager, next, jumper" :total=dataSize>
        </el-pagination>
      </div>

      <!-- 批量授权到期时间 -->
      <el-dialog title="批量授权到期时间" :visible.sync="licenseDialogFormVisible">


        <el-select v-model="licenseAgentId" filterable placeholder="请选择代理商">
          <el-option v-for="item in licenseOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" @click="searchLicenseHotel">搜索</el-button>
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
    </div>
  </div>


</template>

<script>
  import {
    isEmpty
  } from '../../../static/js/util.js'
  export default {

    //写上name参数会被缓存
    name: "admhotellist",
    data() {

      return {
        areaId: "",
        options: [],
        inDialogFormVisible: false,
        formLabelWidth: "150px",
        tableData: [],
        inform: {
          hotelName: "",
          hotelArea: "",
          channelArea: ""
        },
        options: [],
        hotelLikeName: "",
        agentId: 0,
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
      }
    },

    methods: {
      searchLicenseHotel() {
        this.data2 = []
        this.$axios
          .get("/api/hoHotelMes/getHotel/" + this.licenseAgentId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.data2.push({
                value: res.data.data[i].hotelName,
                label: res.data.data[i].hotelName,
                key: res.data.data[i].id
              })
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
        this.data2=[]
        this.value2=[]
        this.licenseTime = ""
      },
      searchHotel() {
        this.currentPage = 1;
        this.getHotel();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getHotel();
      },
      handleDetailEdit(index, row) {
        sessionStorage.hotelName = row.hotelName;
        sessionStorage.hotelId = row.hotelId;
        sessionStorage.agentId = row.agentId;
        this.$router.push({
          path: "/admhoteldetail"
        })
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

      getHotel() {
        this.tableData = [];
        this.$axios
          .get("/api/hoHotelMes/getAllHotel", {
            params: {
              curPage: this.currentPage,
              agentId: this.agentId + "",
              hotelLikeName: this.hotelLikeName
            }
          })
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tableData.push({
                hotelName: res.data.data[i].hotelName,
                hotelArea: res.data.data[i].hotelArea,
                roomTotal: res.data.data[i].roomTotal,
                expireTime: res.data.data[i].expireTime,
                createTime:res.data.data[i].createTime,
                isAppshow: res.data.data[i].isAppshow == 0 ? true : false,
                agentId: res.data.data[i].agentId,
                hotelId: res.data.data[i].id,
                agentName: res.data.data[i].agentName
              })
            }
            this.dataSize = res.data.dataSize
          }).catch((err) => {
            console.log(err + "错误");
          });

      },
      getAgent() {
        this.options = []
        this.$axios
          .get("/api/houser/getAgent")
          .then(res => {
            console.log(res.data);
            this.options.push({
              "label": "全部代理商",
              "value": 0
            })
            for (var i = 0; i < res.data.data.length; i++) {
              this.options.push({
                "label": res.data.data[i].username,
                "value": res.data.data[i].id + ""
              })
              this.licenseOptions.push({
                "label": res.data.data[i].username,
                "value": res.data.data[i].id + ""
              })
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      }
    },

    created() {
      this.getAgent();
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
