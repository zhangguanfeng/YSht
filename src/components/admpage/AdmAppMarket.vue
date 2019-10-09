<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 应用市场</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-button type="primary" @click="openinsertTypeDialog">添加类别</el-button>
      <el-button type="primary" @click="openTypeManagerDialog">类别管理</el-button>

      <div style="height:20px"></div>
      <el-tabs type="border-card" @tab-click="handleTagClick" v-model="currentTagName">
        <el-tab-pane v-for="item in tags" :key="item.id" :label="item.name" :name="item.name">
          <el-button type="primary" @click="chooseApp">添加App</el-button>
          <input type="file" class="upload" ref="apk" @change="uploadApk" id="apkId" style="display: none;" />
          <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">
            <el-table-column label="是否启用" align="center">
              <template slot-scope="scope">
                <el-switch v-model=" scope.row.isSwitch" active-value="0" inactive-value="1" @change="switchChange($event, scope.row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="APP名称" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.appName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="APP包名" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.packageName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="介绍" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.introduce }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" @click="handleAppEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" @click="handleAppdelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 添加APP对话框 -->
    <el-dialog title="添加apk" :visible.sync="inAppDialogFormVisible" :show-close="false" :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :model="inAppform">
        <el-form-item label="App名称" :label-width="formLabelWidth">
          <el-input v-model="inAppform.appName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="App包名" :label-width="formLabelWidth">
          <el-input v-model="inAppform.packageName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="App介绍" :label-width="formLabelWidth">
          <el-input v-model="inAppform.introduce" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="inAppSubmit()">确定</el-button>
        <el-button @click="inAppDialogFormVisible=false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 修改APP对话框 -->
    <el-dialog title="编辑apk" :visible.sync="upAppDialogFormVisible" :show-close="false" :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :model="upAppform">
        <el-form-item label="App名称" :label-width="formLabelWidth">
          <el-input v-model="upAppform.appName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="App包名" :label-width="formLabelWidth">
          <el-input v-model="upAppform.packageName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="App介绍" :label-width="formLabelWidth">
          <el-input v-model="upAppform.introduce" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="App" :label-width="formLabelWidth">
          <el-button type="primary" @click="chooseUpApp">重新上传App</el-button>
          <input type="file" class="upload" @change="uploadUpApk" id="upApkId" style="display: none;" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="upAppSubmit()">确定</el-button>
        <el-button @click="upAppDialogFormVisible=false">关闭</el-button>
      </div>
    </el-dialog>


    <!-- 类别管理 -->
    <el-dialog title="类别管理" :visible.sync="typeDialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-table :data="tableTypeData" stripe style="width: 100%" :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">

        <el-table-column label="类别名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.typeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleTypeEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" @click="handleTypeDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import {
    isEmpty,
    limitApk
  } from '../../../static/js/util.js'
  export default {
    data() {
      return {
        typeDialogFormVisible: false,
        upAppDialogFormVisible: false,
        inAppDialogFormVisible: false,
        currentTagName: "",
        tags: [],
        tableData: [],
        typeId: "",
        typeName: "",
        formLabelWidth: "120px",
        inAppform: {
          appName: "",
          packageName: "",
          introduce: "",
          appId: ""
        },
        upAppform: {
          appName: "",
          packageName: "",
          introduce: "",
          appId: ""
        },
        tableTypeData: [],
        appFile: null,
      }
    },
    methods: {
      openTypeManagerDialog() {
        this.typeDialogFormVisible = true
      },
      handleTypeEdit(index, row) {
        this.$prompt('请输入类别名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue:row.typeName,
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {
         
          let data={
              typeId:row.typeId+"",
              typeName:value
          }
          this.$axios
            .post("/api/hoInAppType/updateType",data)
            .then(res => {
              this.$message.success("修改成功");
              this.getAppType()
            }).catch((err) => {
              console.log(err + "错误");
            });

        }).catch(() => {

        });
      },
      handleTypeDelete(index, row) {
        let data={
          typeId:row.typeId+""
        }
        this.$axios
          .post("/api/hoInAppType/deleteType", data)
          .then(res => {
              this.getAppType()
          }).catch((err) => {
            console.log(err + "错误");
          });
          
      },
      switchChange(value, row) {
        let data = {
          appId: row.appId + "",
          isSwitch: value + ""
        }
        this.$axios
          .post("/api/hoInApp/switchApp", data)
          .then(res => {

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleAppdelete(index, row) {
        let data = {
          appId: row.appId + ""
        }
        this.$axios
          .post("/api/hoInApp/deleteApp", data)
          .then(res => {
            this.getApp()
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleAppEdit(index, row) {
        this.upAppDialogFormVisible = true
        this.upAppform.appName = row.appName
        this.upAppform.packageName = row.packageName
        this.upAppform.introduce = row.introduce
        this.upAppform.appId = row.appId
      },
      chooseUpApp() {
        document.getElementById("upApkId").value = null
        document.getElementById("upApkId").click();
      },
      uploadUpApk(e) {
        const files = e.target.files
        const rawFile = files[0]
        if (limitApk(rawFile)) { //为真
          var formdata = new FormData(); // 创建form对象
          formdata.append("appId", this.upAppform.appId + "")
          formdata.append("file", rawFile)
          this.$axios
            .post("/api/hoInApp/updateApp", formdata)
            .then(res => {
              this.$message.success("上传成功");
            }).catch((err) => {
              console.log(err + "错误");
            });
        } else {

        }
      },
      upAppSubmit() {
        let data = {
          appName: this.upAppform.appName,
          appId: this.upAppform.appId + "",
          packageName: this.upAppform.packageName,
          introduce: this.upAppform.introduce
        }
        this.$axios
          .post("/api/hoInApp/updateAppMes", data)
          .then(res => {
            this.$message.success("修改成功");
            this.upAppDialogFormVisible = false;
            this.getApp()
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      inAppSubmit() {
        if (isEmpty(this.inAppform.appName)) {
          this.$message.error("请输入app名称")
          return;
        }
        if (limitApk(this.appFile)) { //为真
          var formdata = new FormData(); // 创建form对象
          formdata.append("typeId", this.typeId + "")
          formdata.append("appName", this.inAppform.appName)
          formdata.append("packageName", this.inAppform.packageName)
          formdata.append("introduce", this.inAppform.introduce)
          formdata.append("file", this.appFile)
          this.$axios
            .post("/api/hoInApp/insertApp", formdata)
            .then(res => {
              this.$message.success("上传成功");
              this.inAppDialogFormVisible = false;
              this.getApp()
            }).catch((err) => {
              console.log(err + "错误");
            });
        } else {

        }
      },
      chooseApp() {
        document.getElementById("apkId").value = null
        document.getElementById("apkId").click();
      },
      uploadApk(e) {
        // let inputDOM = this.$refs.apk;
        const files = e.target.files
        const rawFile = files[0]
        this.appFile = rawFile
        this.inAppDialogFormVisible = true;

      },

      openinsertTypeDialog() {
        this.$prompt("请输入类别", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {
          console.log(value)
          let data = {
            typeName: value
          }
          this.$axios
            .post("/api/hoInAppType/inserType", data)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.getAppType();
              } else {
                this.$message.error(res.data.msg)
              }
            }).catch((err) => {
              console.log(err + "错误");
            });
        }).catch(() => {

        });
      },
      getAppType() {
        this.tableTypeData=[];
        this.tags = [];
        this.currentTagName = ""
        this.$axios
          .get("/api/hoInAppType/getType")
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              for (var i = 0; i < res.data.data.length; i++) {
                this.tags.push({
                  "id": res.data.data[i].id,
                  "name": res.data.data[i].typeName
                })
                this.tableTypeData.push({
                typeId: res.data.data[i].id,
                typeName: res.data.data[i].typeName
              })
              }
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getApp() {

        this.$axios
          .get("/api/hoInAppType/getTypeById/" + this.typeId)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.tableData = []
              for (var i = 0; i < res.data.data.length; i++) {
                this.tableData.push({
                  appId: res.data.data[i].id,
                  appName: res.data.data[i].appName,
                  packageName: res.data.data[i].packageName,
                  introduce: res.data.data[i].introduce,
                  isSwitch: res.data.data[i].isSwitch + ""
                })
              }
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleTagClick(tab, event) {
        console.log(tab.name);
        let data = this.tags.find(item => {
          return item.name == tab.name;
        })
        this.typeId = data.id;
        this.typeName = data.name;
        this.getApp()
        console.log(this.typeId, this.typeName);
      },

    },
    created() {
      this.getAppType()
    },
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
