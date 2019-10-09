<template>
  <div class="">

    <el-row>
      <el-button type="primary" @click="openInDialog">添加服务</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="服务名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标" align="center">
        <template slot-scope="scope">
          <img :src="serverIp+scope.row.iconUrl" style="width:70px;height:70px;" />
        </template>
      </el-table-column>
      <el-table-column label="App提示内容" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appHint }}</span>
        </template>
      </el-table-column>
      <el-table-column label="前台提示内容" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.foregroundHint }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 添加对话框 -->
    <el-dialog title="添加服务" :visible.sync="inDialogVisible">
      <el-form :model="inform" ref="inform">
        <el-form-item label="服务名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="inform.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="app提示内容" :label-width="formLabelWidth" prop="appHint">
          <el-input type="textarea" :rows="4" v-model="inform.appHint" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="前台提示内容" :label-width="formLabelWidth" prop="foregroundHint">
          <el-input type="textarea" :rows="4" v-model="inform.foregroundHint" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标上传" :label-width="formLabelWidth">
          <el-upload action="" list-type="picture-card" :limit="1" name="file" :auto-upload="false" :on-change="inImgChange"
            :on-remove="inOnRemove" ref="upload" :file-list="fileList">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="inSubmit">确 定</el-button>
        <el-button @click="inDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 修改对话框 -->
    <el-dialog title="修改服务" :visible.sync="upDialogVisible">
      <el-form :model="upform">
        <el-form-item label="服务名称" :label-width="formLabelWidth">
          <el-input v-model="upform.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="app提示内容" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="4" v-model="upform.appHint" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="前台提示内容" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="4" v-model="upform.foregroundHint" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标上传" :label-width="formLabelWidth">
          <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="uploadPic" name="file"
            :before-upload="beforeUpload" accept=".jpg,.jpeg,.png,.JPG,.JPEG">
            <img v-if="upform.iconUrl" :src="serverIp+upform.iconUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateService">确 定</el-button>
        <el-button @click="upDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    isEmpty,
    limitImg
  } from '../../../static/js/util.js'
  export default {
    //写上name参数会被缓存
    name: "admindex",
    data() {
      return {
        serverIp:this.$store.state.serverIp,
        fileList: [],
        serviceId: "",
        hotelId: sessionStorage.hotelId,
        inDialogVisible: false,
        upDialogVisible: false,
        inPicFile: null,
        upPicFile: null,
        formLabelWidth: "120px",
        inform: {
          name: "",
          foregroundHint: "",
          appHint: ""
        },
        upform: {
          name: "",
          foregroundHint: "",
          appHint: "",
          iconUrl: ""
        },
        tableData: [{
            serviceId: "",
            name: "",
            appHint: "",
            foregroundHint: "",
            iconUrl: ""
          }

        ]
      }
    },
    methods: {
      openInDialog() {
        this.inDialogVisible = true;
        if (this.$refs["inform"] !== undefined) {
          this.$refs["inform"].resetFields();
        }
        this.fileList = []

      },
      inImgChange(file) {
        this.inPicFile = file.raw;
      },
      inOnRemove() {
        this.inPicFile = null;
      },
      inSubmit() {
        if (isEmpty(this.inform.name)) {
          this.$message.error("请输入服务名称")
          return;
        }
        if (isEmpty(this.inform.appHint)) {
          this.$message.error("请输入app提示信息")
          return;
        }
        if (isEmpty(this.inform.foregroundHint)) {
          this.$message.error("请输入前台提示信息")
          return;
        }
        if (limitImg(this.inPicFile)) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("hotelId", this.hotelId + "")
          formdata.append("file", this.inPicFile)
          formdata.append("name", this.inform.name)
          formdata.append("foregroundHint", this.inform.foregroundHint)
          formdata.append("appHint", this.inform.appHint)
          this.$axios
            .post("/api/hoAppService/saveService/", formdata)
            .then(res => {
              if (res.data.code == 0) {
                this.$message.success("添加成功");
                this.inDialogVisible = false;
                this.getService();
              }
              console.log(res.data);

            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },
      beforeUpload(file) {
        this.upPicFile = file;
      },
      uploadPic() {

        if (limitImg(this.upPicFile)) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("serviceId", this.serviceId + "")
          formdata.append("file", this.upPicFile)

          this.$axios
            .post("/api/hoAppService/uploadImg", formdata)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.upform.iconUrl = res.data.data.iconUrl
                console.log(this.upform.iconUrl)
                this.$message.success("上传成功")
                this.getService();
              }

            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },
      handleEdit(index, row) {
        this.serviceId = row.serviceId + "";
        this.upform.name = row.name;
        this.upform.foregroundHint = row.foregroundHint;
        this.upform.appHint = row.appHint;
        this.upform.iconUrl = row.iconUrl;
        this.upDialogVisible = true;
      },
      handleDelete(index, row) {
        this.serviceId = row.serviceId + "";
        var data = {
          serviceId: this.serviceId + "",

        }

        this.$axios
          .post("/api/hoAppService/deleteService", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {

              this.$message.success("删除成功")
              this.getService();
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getService() {
        this.tableData = []
        this.$axios
          .get("/api/hoAppService/getService/" + this.hotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tableData.push({
                serviceId: res.data.data[i].id,
                name: res.data.data[i].name,
                appHint: res.data.data[i].appHint,
                foregroundHint: res.data.data[i].foregroundHint,
                iconUrl: res.data.data[i].iconUrl
              })

            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      updateService() {
        if (isEmpty(this.upform.name)) {
          this.$message.error("请输入服务名称")
          return;
        }
        if (isEmpty(this.upform.appHint)) {
          this.$message.error("请输入app提示信息")
          return;
        }
        if (isEmpty(this.upform.foregroundHint)) {
          this.$message.error("请输入前台提示信息")
          return;
        }

        var data = {
          serviceId: this.serviceId + "",
          name: this.upform.name,
          appHint: this.upform.appHint,
          foregroundHint: this.upform.foregroundHint
        }

        this.$axios
          .post("/api/hoAppService/updateService", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {

              this.$message.success("修改成功")
              this.getService();
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      }
    },

    created() {
      this.getService();
    }
  }

</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .delete-img-div {
    width: 178px;
    height: 20px;
    color: #ff0000;
    text-align: center;
    background-color: #8c939d;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }

  .avatar-div {
    width: 178px;
    height: 178px;
    padding: 10px;
    display: inline-block;
  }

</style>
