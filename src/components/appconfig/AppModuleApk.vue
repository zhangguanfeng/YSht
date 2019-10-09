<template>
  <div>
    <el-row>
      <el-button type="primary" @click="chooseApp">添加App</el-button>
      <input type="file" class="upload" ref="apk" @change="uploadApk" id="apkId" style="display: none;" />

    </el-row>

    <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}"
      :key="tableData.id">
      <el-table-column label="App名称"  align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.appName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="文件名称"  align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.fileName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑对话框 -->
    <el-dialog title="编辑apk" :visible.sync="dialogFormVisible" :show-close="false" :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :model="form">
        <el-form-item label="App名称" :label-width="formLabelWidth">
          <el-input v-model="form.appName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="App" :label-width="formLabelWidth">
          <el-button type="primary" @click="upChooseApp">重新上传app</el-button>
          <input type="file" class="upload" ref="upapk" @change="editUpApk(form.appId)" id="upApkId" style="display: none;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="upSubmit(form.appId)">确定</el-button>
        <el-button @click="dialogFormVisible=false">关闭</el-button>
      </div>
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
        formLabelWidth: "120px",
        dialogFormVisible: false,
        hotelId: sessionStorage.hotelId,
        tableData: [],
        form: {
          appId: "",
          appName: ""
        }
      }
    },
    methods: {
      chooseApp() {
        document.getElementById("apkId").value = null
        document.getElementById("apkId").click();
      },
      uploadApk() {
        let inputDOM = this.$refs.apk;
        if (limitApk(inputDOM.files[0])) {
          this.$prompt('请输入App名称', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
          }).then(({
            value
          }) => {


            var formdata = new FormData(); // 创建form对象

            formdata.append("hotelId", this.hotelId + "")
            formdata.append("appName", value)
            formdata.append("file", inputDOM.files[0])
            this.$axios
              .post("/api/hoAppModule/uploadApp", formdata)
              .then(res => {
                console.log(res.data);
                this.getApk();
                this.$message.success("上传成功");
              }).catch((err) => {
                console.log(err + "错误");
              });

          }).catch(() => {

          });
        }


      },
      getApk() {
        this.tableData = [];
        this.$axios
          .get("/api/hoAppModule/getAppModuleApk/" + this.hotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {

              this.tableData.push({
                appId: res.data.data[i].id,
                appName: res.data.data[i].appName,
                fileName: res.data.data[i].fileName
              })

            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      upChooseApp() {
        document.getElementById("upApkId").click();
      },
      editUpApk(appId) {
        let inputDOM = this.$refs.upapk;
        if (limitApk(inputDOM.files[0])) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("appId", appId + "")
          formdata.append("file", inputDOM.files[0])
          this.$axios
            .post("/api/hoAppModule/updateApp", formdata)
            .then(res => {
              console.log(res.data);
              this.getApk();
              this.$message.success("更改apk成功");
            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },
      handleEdit(index, row) {
        this.form.appId = row.appId;
        this.form.appName = row.appName
        this.dialogFormVisible = true;
      },
      upSubmit(appId) {
        if (isEmpty(this.form.appName)) {
          this.$message.error("请输入app名称");
          return;
        }
        let data = {
          hotelId: this.hotelId + "",
          appId: appId + "",
          appName: this.form.appName
        }
        this.$axios
          .post("/api/hoAppModule/editAppName", data)
          .then(res => {
            console.log(res.data);
            this.getApk();
            this.dialogFormVisible = false;
            this.$message.success("修改成功");
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleDelete(index, row) {
        this.$confirm('此操作如果有模块引入次apk,则连同模块也同时删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            hotelId: this.hotelId + "",
            appId: row.appId + "",
          }
          this.$axios
            .post("/api/hoAppModule/deleteApp", data)
            .then(res => {
              console.log(res.data);
              this.getApk();
            }).catch((err) => {
              console.log(err + "错误");
            });
        }).catch(() => {

        });


      }
    },
    created() {
      this.getApk()
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
