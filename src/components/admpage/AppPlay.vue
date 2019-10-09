<template>
  <div>
    <div>
      <el-button type="text"  disabled>播放器默认版本 上传的名称一定要这样(文件名称-版本号.apk)</el-button>
      <el-button type="primary" @click="chooseTvCustomApp">上传播放器APP</el-button>
      <input type="file" class="upload" ref="customtvapk" @change="uploadTvCustomApk" id="customTvApkId" style="display: none;" />
    </div>

    <el-table :data="customTvTableData" stripe style="width: 100%" :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}"
      :key="customTvTableData.date">
      <el-table-column label="App名称"  align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.appName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本号"  align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.appVersion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.appMes }}</span>
        </template>
      </el-table-column>

    </el-table>
    <hr>
    <div>
      <el-button type="text" disabled>播放器测试版本  上传的名称一定要这样(文件名称-版本号.apk)</el-button>
      <el-button type="primary" @click="chooseTvTestApp">上传播放器APP</el-button>
      <input type="file" class="upload" ref="testtvapk" @change="uploadTvTestApk" id="testTvApkId" style="display: none;" />
    </div>
    <el-table :data="testTvTableData" stripe style="width: 100%" :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}"
      :key="testTvTableData.date">
      <el-table-column label="App名称"  align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.appName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本号"  align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.appVersion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.appMes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleTvDetail(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 详情对话框 -->
    <el-dialog :title="tvDialogTitle" :visible.sync="dialogTvFormVisible">

      <el-tabs type="border-card" @tab-click="handleTvTagClick" v-model="currentTvTagName">
        <el-tab-pane v-for="item in tvTags" :key="item.id" :label="item.name" :name="item.name">
          <el-table :data="hotelTvTableData" style="width: 100%">
            <el-table-column label="开/关" align="center">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.isVersion" @change="switchTvVersion($event, scope.row)">
                </el-switch>
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
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTvFormVisible = false">确 定</el-button>
        <el-button @click="dialogTvFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    isEmpty
  } from '../../../static/js/util.js'
  export default {
    data() {
      return {
        customTvTableData: [],
        testTvTableData: [],
        hotelTvTableData: [],
        currentTvTagName: "",
        dialogTvFormVisible: false,
        tvTags: [],
        agentTvId: "",
        appTvId: "",
        tvDialogTitle:""
      }
    },
    methods: {
   
      handleTvDetail(index, row) {
        this.tvDialogTitle="itv播放器"+row.appVersion+"版本详情"
        this.dialogTvFormVisible = true;
        this.appTvId = row.appId;
        this.tvTags=[]
        this.hotelTvTableData=[]
        this.currentTvTagName=""
        this.getTvAgent();
      },
      handleTvTagClick(tab, event) {
        console.log(tab.name);
        let data = this.tvTags.find(item => {
          return item.name == tab.name;
        })
        this.agentTvId = data.id;
        this.getTvHotel();

      },
      switchTvVersion(value, row) {
        var isSwitch=""
        if(value){
          isSwitch=this.appTvId
        }else{
          isSwitch=0
        }
         let data={
           "hotelId":row.hotelId+"",
           "tvId":isSwitch+""
         }
          this.$axios
            .post("/api/hoHotelAppTv/switchAppVersion", data)
            .then(res => {
              console.log(res.data);
            }).catch((err) => {
              console.log(err + "错误");
            });
      },
      chooseTvCustomApp() {
          document.getElementById("customApkId").value = null
        document.getElementById("customTvApkId").click();
      },
      chooseTvTestApp() {
         document.getElementById("testApkId").value = null
        document.getElementById("testTvApkId").click();
      },
      uploadTvCustomApk(e) {
        
        const files = e.target.files
        const rawFile = files[0]
        var a = rawFile.name.split("-");
        var appVersion = a[1].substring(0, a[1].length - 4)
        if (isEmpty(appVersion)) {
          this.$message.error("app版本号不对")
          return;
        }
        this.$prompt('请输入备注信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern:/^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {
          var formdata = new FormData(); // 创建form对象
          formdata.append("appMes", value)
          formdata.append("file", rawFile)
          formdata.append("appVersion", appVersion)
          this.$axios
            .post("/api/hoHotelAppTv/insertCustomApk", formdata)
            .then(res => {
              console.log(res.data);
              this.getCustomTvApk();
              this.$message.success("上传成功");
            }).catch((err) => {
              console.log(err + "错误");
            });

        }).catch(() => {

        });
      },
      uploadTvTestApk(e) {
        const files = e.target.files
        const rawFile = files[0]
        var a = rawFile.name.split("-");
        var appVersion = a[1].substring(0, a[1].length - 4)
        if (isEmpty(appVersion)) {
          this.$message.error("app版本号不对")
          return;
        }
        this.$prompt('请输入备注信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {
          var formdata = new FormData(); // 创建form对象
          formdata.append("appMes", value)
          formdata.append("file", rawFile)
          formdata.append("appVersion", appVersion)
          this.$axios
            .post("/api/hoHotelAppTv/insertTestApk", formdata)
            .then(res => {
              console.log(res.data);
              this.getTestTvApk();
              this.$message.success("上传成功");
            }).catch((err) => {
              console.log(err + "错误");
            });

        }).catch(() => {

        });
      },
      getCustomTvApk() {
        this.customTvTableData = []
        this.$axios
          .get("/api/hoHotelAppTv/getCustomApk")
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.customTvTableData.push({
                appId: res.data.data[i].id,
                appMes: res.data.data[i].appMes,
                appName: res.data.data[i].appName,
                appVersion: res.data.data[i].appVersion
              })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getTestTvApk() {
        this.testTvTableData = []
        this.$axios
          .get("/api/hoHotelAppTv/getTestApk")
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.testTvTableData.push({
                appId: res.data.data[i].id,
                appMes: res.data.data[i].appMes,
                appName: res.data.data[i].appName,
                appVersion: res.data.data[i].appVersion
              })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getTvAgent() {
        this.tvTags = []
        this.$axios
          .get("/api/houser/getAgent")
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tvTags.push({
                "id": res.data.data[i].id,
                "name": res.data.data[i].username
              })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getTvHotel() {
        this.hotelTvTableData = []
        this.$axios
          .get("/api/hoHotelMes/getHotel/" + this.agentTvId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.hotelTvTableData.push({
                "hotelId": res.data.data[i].id,
                "hotelName": res.data.data[i].hotelName,
                "hotelArea": res.data.data[i].hotelArea,
                "isVersion": this.appTvId === res.data.data[i].tvId ? true : false
              })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      }
    },
    created() {
      this.getCustomTvApk();
      this.getTestTvApk();
    }

  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
