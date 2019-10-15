<template>
  <div class="AdmAqyAPK">
    <!-- 启动器管理 -->
    <div>
      <el-button type="primary" @click="handleInitiator">上传</el-button>
      <input type="file" class="upload" ref="testapk" @change="handleInitiatorUploadTestApk" id="InitiatorApkId"
        style="display: none;">
    </div>
    <el-table :data="initiatorList" stripe style="width: 100%"
      :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column property="fileName" label="文件名" align="center">
      </el-table-column>
      <el-table-column property="version" label="版本号" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDeleApk(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
  </div>
</template>

<script>
import {
    isEmpty,
    limitApk
  } from '../../../../static/js/util'
  export default {
    data() {
      return {
        initiatorList: [],
        files:[],
        formLabelWidth: "120px"
      }
    },
    created () {
      this.getAqyVipApk()
    },
    methods: {
      
      // 启动器软件管理
      handleInitiator() {
        document.getElementById("InitiatorApkId").value = null
        document.getElementById("InitiatorApkId").click();
      },
      handleInitiatorUploadTestApk(e) {
        console.log(e,'123456');
        
        this.files = e.target.files
        const rawFile = this.files[0]
        var a = rawFile.name.split("-");
        var appVersion = ''
        if (a.length === 3) {
          appVersion = a[2].substring(0, a[2].indexOf('apk') - 1)
        } else {
          appVersion = a[1].substring(0, a[1].indexOf('apk') - 1)
        }
        if (limitApk(rawFile)) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("file", rawFile)
          formdata.append("version", appVersion)
          this.$axios
            .post("api/hoHotelAqyvipApk/insertAqyVipApk", formdata)
            .then(res => {
              if (res.data.code == 0) {
                this.getAqyVipApk()
                this.$message.success("上传成功");
              }
            }).catch((err) => {
              console.log(err + "错误");
            });
        }
      },
      // 获取启动器列表
      getAqyVipApk() {
        this.$axios
          .get("api//hoHotelAqyvipApk/getAqyVipApk")
          .then(res => {
            if (res.data.code == 0) {
              this.initiatorList = res.data.data
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      // 删除Apk
      handleDeleApk(index, row) {

        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            apkId: row.id + ''
          }
          this.$axios
            .post("api/hoHotelAqyvipApk/deleteAqyVipApk", data)
            .then(res => {
              if (res.data.code == 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getAqyVipApk()
              }
            }).catch((err) => {
              console.log(err + "错误");
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }
    },
  }

</script>

<style>

</style>
