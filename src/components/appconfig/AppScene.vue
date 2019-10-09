<template>
  <div class="">


    <el-row>
      <el-button type="primary" @click="openInDialog">添加风景</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="风景名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="风景介绍" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.introduce }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handlerDetail(scope.$index, scope.row)">详情</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 添加对话框 -->
    <el-dialog title="添加风景" :visible.sync="inDialogFormVisible">
      <el-form :model="inform">
        <el-form-item label="风景名称" :label-width="formLabelWidth">
          <el-input v-model="inform.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="风景介绍" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="4" v-model="inform.introduce" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="inSubmit">确 定</el-button>
        <el-button @click="inDialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 编辑对话框 -->
    <el-dialog title="风景详情" :visible.sync="mesDialogFormVisible" :show-close="false" :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :model="mesform">
        <el-form-item label="风景名称" :label-width="formLabelWidth">
          <el-input v-model="mesform.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="风景介绍" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="4" v-model="mesform.introduce" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片详情" :label-width="formLabelWidth">
          <div>
            <el-button type="primary" @click="addImgFrame">添加</el-button>
          </div>
          <div v-for="(item, index) in datas_upload" :key="index" class="avatar-div">
            <el-upload class="avator-uploader" action="" :show-file-list="false" :http-request="uploadImgPic" name="file"
              :on-change="imgChange">
              <img v-if="item.url" :src="serverIp+item.url" class="avatar" @click='getImgTag(item, index)'>
              <i v-else class="el-icon-plus avatar-uploader-icon" @click='getImgTag(item, index)'></i>
            </el-upload>
            <div class="delete-img-div " @click='deleteImgPic(item, index)'>
              <span style="font-size:14px">删除</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="upSubmit">确定</el-button>
        <el-button @click="mesDialogFormVisible=false">关闭</el-button>
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
        hotelId: sessionStorage.hotelId,

        imgIndex: "",
        imgFile: null,
        datas_upload: [],
        mesDialogFormVisible: false,
        inDialogFormVisible: false,
        formLabelWidth: "120px",
        tableData: [],
        inform: {
          viewId: "",
          name: "",
          introduce: '',
        },
        mesform: {
          viewId: "",
          name: "",
          introduce: '',


        }
      }
    },
    methods: {
      openInDialog() {
        this.inDialogFormVisible = true;
        this.inform.name = "",
          this.inform.introduce = ""
      },
      addImgFrame() {
        if (this.datas_upload.length >= 8) {
          return;
        }
        this.datas_upload.push({
          imgId: '',
          url: ''
        })
      },
      imgChange(file) {
        this.imgFile = file.raw;

      },
      getImgTag(item, index) {
        this.imgIndex = index;
      },
      uploadImgPic() {
        if (limitImg(this.imgFile)) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("viewId", this.mesform.viewId + "")
          formdata.append("hotelId", this.hotelId + "")
          formdata.append("file", this.imgFile)
          formdata.append("imgId", this.datas_upload[this.imgIndex].imgId + "")
          this.$axios
            .post("/api/hoAppView/uploadViewPic", formdata)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.datas_upload[this.imgIndex].url = res.data.data.viewUrl,
                  this.datas_upload[this.imgIndex].imgId = res.data.data.id,
                  this.$message.success("上传成功")
              }

            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },
      deleteImgPic(item, index) {
        if (isEmpty(this.datas_upload[index].imgId + "")) {
          this.datas_upload.splice(index, 1);
          this.$message.success("删除成功")
          return
        }
        var data = {
          "imgId": this.datas_upload[index].imgId + ""
        }

        this.$axios
          .post("/api/hoAppView/deleteViewPic", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.datas_upload.splice(index, 1);
              this.$message.success("删除成功")
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getImgPic(viewId) {
        this.datas_upload = []
        this.$axios
          .get("/api/hoAppView/getViewPic/" + viewId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.datas_upload.push({
                "imgId": res.data.data[i].id,
                "url": res.data.data[i].viewUrl,
              })

            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      inSubmit() {
        if (isEmpty(this.inform.name)) {
          this.$message.error("请输入风景名称")
          return;
        }
        if (isEmpty(this.inform.introduce)) {
          this.$message.error("请输入风景介绍")
          return;
        }
        let data = {
          "hotelId": this.hotelId + "",
          "name": this.inform.name,
          "introduce": this.inform.introduce
        }
        this.$axios
          .post("/api/hoAppView/saveView", data)
          .then(res => {
            if (res.data.code == 0) {
              this.$message.success("添加成功")
              this.inDialogFormVisible = false;
              this.getView()
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      upSubmit() {
        if (isEmpty(this.mesform.name)) {
          this.$message.error("请输入风景名称")
          return;
        }
        if (isEmpty(this.mesform.introduce)) {
          this.$message.error("请输入风景介绍")
          return;
        }
        let data = {
          "viewId": this.mesform.viewId + "",
          "name": this.mesform.name,
          "introduce": this.mesform.introduce
        }
        this.$axios
          .post("/api/hoAppView/editView", data)
          .then(res => {
            if (res.data.code == 0) {
              this.$message.success("修改成功")
              this.getView()
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handlerDetail(index, row) {
        this.mesDialogFormVisible = true;
        this.mesform.viewId = row.viewId
        this.mesform.name = row.name
        this.mesform.introduce = row.introduce
        this.getImgPic(this.mesform.viewId)
      },
      handleDelete(index, row) {
        let data = {
          "viewId": row.viewId + ""
        }
        this.$axios
          .post("/api/hoAppView/deleteView", data)
          .then(res => {
            console.log(res.data);
            this.getView();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getView() {
        this.tableData = []
        this.$axios
          .get("/api/hoAppView/getView/" + this.hotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tableData.push({
                viewId: res.data.data[i].id,
                name: res.data.data[i].name,
                introduce: res.data.data[i].introduce
              })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      }
    },

    created() {
      this.getView();
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
