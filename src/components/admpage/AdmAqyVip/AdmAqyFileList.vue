<template>
  <div class="AdmAqyFileList">
    <el-button type="primary" @click="dialog_file_number_show()">添加文件序号</el-button>
    <div>
      <el-table :data="tableData" stripe style="width: 100%"
        :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column property="mac" label="Mac" align="center">
        </el-table-column>
        <el-table-column property="onlineNum" label="在线终端数" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
            <el-button size="mini" type="primary" @click="handleClick(scope.row)">文件管理</el-button>
            <el-button size="mini" type="danger" @click="handleDele(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagecontainer">
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[15]"
          layout="total, sizes, prev, pager, next, jumper" :total="dataSize">
        </el-pagination>
      </div>
    </div>
    <!-- 文件管理对话框 -->
      <el-dialog title="修改mac" :visible.sync="dialog_file_edit">
        <el-form :model="file_edit_form">
          <el-form-item label="mac" :label-width="formLabelWidth">
            <el-input v-model="file_edit_form.mac" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="文件名" :label-width="formLabelWidth">
            <div v-for="(item,index) in this.file_edit_formList" :key="index">
              <el-input v-model="item.fileName" :disabled="true" autocomplete="off" style=" padding-bottom: 10px;">
              </el-input>
              <div>
                <el-button type="primary" @click="chooseTestApp(item)">上传</el-button>
                <input type="file" class="upload" ref="testapk" @change="uploadTestApk" id="testApkId"
                  style="display: none;" />
                <el-button type="primary" @click="handleDownload(item)">下载</el-button>
              </div>
            </div>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialog_file_edit = false">取 消</el-button>
          <el-button type="primary" @click="handlefile_edit">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加文件序号对话框 -->
      <el-dialog title="添加文件序号" :visible.sync="dialog_file_number" width="30%">
        <el-form :model="file_number_form">
          <el-form-item label="mac" :label-width="formLabelWidth">
            <el-input v-model="file_number_form.mac" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="文件列表" :label-width="formLabelWidth">
            <el-upload class="upload-demo" action="1111" :auto-upload=false :before-remove="beforeRemove" multiple
              :limit="2" :on-change="handleChange" :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialog_file_number = false">取 消</el-button>
          <el-button type="primary" @click="handlefile_number">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import {
    isEmpty,
    limitApk
  } from '../../../../static/js/util'
  export default {
    name: "AdmAqyFileList",
    data() {
      return {
        dataSize: null,
        curPage: 1,
        currentPage4: 1,
        serverIp: this.$store.state.serverIp,
        aqyVipId: '',
        tableData: [],
        dialog_file_number: false,
        dialog_file_edit: false,
        file_edit_form: {},
        file_edit_formList: [],
        fileId: null,
        fileUrl: '',
        file_number_form: {
          mac: ''
        },
        fileList: [],
        formLabelWidth: "120px"
      }
    },
    created() {
      this.getAqyVip()
    },
    methods: {
      // 分页
      handleCurrentChange(val) {
        this.curPage = val
        this.getAqyVip()
      },
      getAqyVip() {
        this.$axios
          .get("api/hoHotelAqyvip/getAqyVip", {
            params: {
              curPage: this.curPage
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.dataSize = res.data.dataSize
              this.tableData = res.data.data

            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },

      // 添加文件序号对话框开始
      dialog_file_number_show() {
        this.dialog_file_number = true;
        this.fileList = []
        this.file_number_form.mac = null
      },
      beforeRemove(file, fileList) {
        this.fileList = fileList
      },
      handlefile_number() {
        if (!this.file_number_form.mac) {
          this.$message.error('mac不能为空！');
        } else if (this.fileList.length !== 2) {
          this.$message.error('上传文件必须两个！');
        } else {
          var formbody = new FormData();
          for (let i = 0; i < this.fileList.length; i++) {
            formbody.append('file', this.fileList[i].raw)
          }
          formbody.append('mac', this.file_number_form.mac)
          this.$axios
            .post("api/hoHotelAqyvip/insertAqyVip", formbody)
            .then(res => {

              if (res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                });
                this.getAqyVip()
                this.dialog_file_number = false
              }
            }).catch((err) => {
              console.log(err + "错误");
            });

        }

      },
      handleChange(file, fileList) {
        let isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 2MB!');
        } else {
          this.fileList = fileList
        }
      },
      // 添加文件序号对话框结束


      // 文件管理对话框开始
      getAqyVipFile() {
        this.$axios
          .get("api/hoHotelAqyvip/getAqyVipFile/" + this.aqyVipId)
          .then(res => {
            if (res.data.code === 0) {
              this.file_edit_formList = res.data.data
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      // 文件下载
      handleDownload(item) {
        let url = this.serverIp + item.fileUrl
        window.open(url);
      },
      handleClick(row) {
        this.dialog_file_edit = true;
        this.file_edit_form = {
          ...row
        }
        this.aqyVipId = row.id
        this.getAqyVipFile()
      },
      chooseTestApp(item) {
        this.fileId = item.id
        document.getElementById("testApkId").value = null
        document.getElementById("testApkId").click();
      },
      uploadTestApk(e) {
        const files = e.target.files
        const rawFile = files[0]
        let isLt2M = rawFile.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 2MB!');
        } else {
          const formdata = new FormData()
          formdata.append('file', rawFile)
          formdata.append('fileId', this.fileId)
          this.$axios
            .post("api/hoHotelAqyvip/updateAqyVipFile", formdata)
            .then(res => {
              if (res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '上传成功!'
                });
                this.getAqyVipFile()
              }
            }).catch((err) => {
              console.log(err + "错误");
            });
        }
      },

      handlefile_edit() {
        let {
          id,
          mac
        } = this.file_edit_form
        let vipMac = {
          aqyVipId: id + '',
          mac: mac
        }
        if (!vipMac.mac) {
          this.$message.error('mac不能为空');
        } else {
          this.$axios
            .post("api/hoHotelAqyvip/updateAqyVipMac", vipMac)
            .then(res => {
              if (res.data.code === 0) {
                this.dialog_file_edit = false
                this.getAqyVip()
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
              }
            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },
      handleDele(index, row) {
        this.file_edit_form = row
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let {
            id
          } = this.file_edit_form
          let delVip = {
            aqyVipId: id + ''
          }
          this.$axios
            .post("api/hoHotelAqyvip/deleteAqyVip", delVip)
            .then(res => {
              if (res.data.code === 0) {
                // this.getAqyVip()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.tableData.splice(this.tableData.indexOf(row), 1);
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
      },
      // 文件管理对话框结束
    },
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
</style>
