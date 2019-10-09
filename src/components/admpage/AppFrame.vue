<template>
  <div>
    <div>
      <el-button type="text" disabled  >主桌面默认版本  上传的名称一定要这样(文件名称-版本号.apk)</el-button>
      <el-button type="primary" @click="chooseCustomApp">上传桌面APP  </el-button>
      <input type="file" class="upload" ref="customapk" @change="uploadCustomApk" id="customApkId" style="display: none;" />
    </div>

    <el-table :data="customTableData" stripe style="width: 100%" :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}"
      :key="customTableData.date">
      <el-table-column label="App名称"  align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.appName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本号" align="center">
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
      <el-button type="text" disabled>主桌面测试版本  上传的名称一定要这样(文件名称-版本号.apk)</el-button>
      <el-button type="primary" @click="chooseTestApp">上传桌面APP</el-button>
      <input type="file" class="upload" ref="testapk" @change="uploadTestApk" id="testApkId" style="display: none;" />
    </div>
    <el-table :data="testTableData" stripe style="width: 100%" :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}"
      :key="testTableData.date">
      <el-table-column label="App名称"  align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.appName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本号" align="center">
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
          <el-button type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 详情对话框 -->
    <el-dialog :title="deskDialogTitle" :visible.sync="dialogFormVisible">

      <el-tabs type="border-card" @tab-click="handleTagClick" v-model="currentTagName">
        <el-tab-pane v-for="item in tags" :key="item.id" :label="item.name" :name="item.name">
          <el-table :data="hotelTableData" style="width: 100%">
            <el-table-column label="开/关"  align="center">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.isVersion" @change="switchVersion($event, scope.row)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="酒店名称" align="center" >
              <template slot-scope="scope">
                <span>{{ scope.row.hotelName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="酒店地址" align="center" >
              <template slot-scope="scope">
                <span>{{ scope.row.hotelArea }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    isEmpty,limitApk
  } from '../../../static/js/util.js'
  export default {

    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        customTableData: [],
        testTableData: [],
        hotelTableData: [],
        currentTagName: "",
        dialogFormVisible: false,
        tags: [],
        agentId: "",
        appId: "",
        deskDialogTitle:""
      }
    },
    methods: {
   
      handleDetail(index, row) {
        this.deskDialogTitle="itv桌面"+row.appVersion+"版本详情"
        this.dialogFormVisible = true;
        this.appId = row.appId;
        this.tags=[]
        this.hotelTableData=[]
        this.currentTagName=""
        this.getAgent();
      },
      handleTagClick(tab, event) {
        console.log(tab.name);
        let data = this.tags.find(item => {
          return item.name == tab.name;
        })
        this.agentId = data.id;
        this.getHotel();

      },
      switchVersion(value, row) {
        var isSwitch=""
        if(value){
          isSwitch=this.appId
        }else{
          isSwitch=0
        }
         let data={
           "hotelId":row.hotelId+"",
           "deskId":isSwitch+""
         }
          this.$axios
            .post("/api/hoWeb/hoHotelAppDesk/switchAppVersion", data)
            .then(res => {
              console.log(res.data);
            }).catch((err) => {
              console.log(err + "错误");
            });
      },
      chooseCustomApp() {
        document.getElementById("customApkId").value = null
        document.getElementById("customApkId").click();
      },
      chooseTestApp() {
        document.getElementById("testApkId").value = null
        document.getElementById("testApkId").click();
      },
      uploadCustomApk(e) {
        // let inputDOM = this.$refs.customapk;
        // // 通过DOM取文件数据
        // let file = inputDOM.files;
        // console.log(file)

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
    
        }).then(({
          value
        }) => {
          var formdata = new FormData(); // 创建form对象
          formdata.append("appMes", value)
          formdata.append("file", rawFile)
          formdata.append("appVersion", appVersion)
          this.$axios
            .post("/api/hoWeb/hoHotelAppDesk/insertCustomApk", formdata)
            .then(res => {
              console.log(res.data);
              this.getCustomApk();
              this.$message.success("上传成功");
            }).catch((err) => {
              console.log(err + "错误");
            });

        }).catch(() => {

        });
      },
      uploadTestApk(e) {
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
            .post("/api/hoWeb/hoHotelAppDesk/insertTestApk", formdata)
            .then(res => {
              console.log(res.data);
              this.getTestApk();
              this.$message.success("上传成功");
            }).catch((err) => {
              console.log(err + "错误");
            });

        }).catch(() => {

        });
      },
      getCustomApk() {
        this.customTableData = []
        this.$axios
          .get("/api/hoWeb/hoHotelAppDesk/getCustomApk")
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.customTableData.push({
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
      getTestApk() {
        this.testTableData = []
        this.$axios
          .get("/api/hoWeb/hoHotelAppDesk/getTestApk")
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.testTableData.push({
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
      getAgent() {
        this.tags = []
        this.$axios
          .get("/api/houser/getAgent")
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tags.push({
                "id": res.data.data[i].id,
                "name": res.data.data[i].username
              })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getHotel() {
        this.hotelTableData = []
        this.$axios
          .get("/api/hoHotelMes/getHotel/" + this.agentId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.hotelTableData.push({
                "hotelId": res.data.data[i].id,
                "hotelName": res.data.data[i].hotelName,
                "hotelArea": res.data.data[i].hotelArea,
                "isVersion": this.appId === res.data.data[i].deskId ? true : false
              })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      }
    },
    created() {
      this.getCustomApk();
      this.getTestApk();
    }

  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
