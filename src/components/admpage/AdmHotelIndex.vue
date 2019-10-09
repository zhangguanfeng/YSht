<template>


  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>首页配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">

      <el-form :model="bgform">
        <!-- <el-form-item label="背景图片上传" :label-width="formLabelWidth">
        <el-upload action="" list-type="picture-card" ref="bguploada" :limit="1" :name="bgform.imgfilename" :file-list="bgfileList"
          :auto-upload="true" :on-change="bgimgChange" :on-remove="bgonRemove" :on-preview="bghandlePictureCardPreview"
          :http-request="uploadBg">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="bgform.imgDialogVisible" :append-to-body='true'>
          <img width="100%" :src="bgform.imgDialogUrl" alt="">
        </el-dialog>
      </el-form-item> -->
        <el-form-item label="背景图片上传">
          <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="uploadBgPic" name="file"
            :before-upload="beforeUpload" accept=".jpg,.jpeg,.png,.JPG,.JPEG">
            <img v-if="bgform.bgurl" :src="this.$store.state.serverIp+bgform.bgurl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>


        <el-form-item label="广告图片上传">
          <div>
            <el-button type="primary" @click="addAdFrame">增加</el-button>
          </div>
          <div v-for="(item, index) in datas_upload" :key="index" class="avatar-div">
            <el-upload class="avator-uploader" action="" :show-file-list="false" :http-request="uploadAdPic" name="file"
              :on-change="imgChange" accept=".jpg,.jpeg,.png,.JPG,.JPEG">
              <img v-if="item.url" :src="serverIp+item.url" class="avatar" @click='getAdTag(item, index)'>
              <i v-else class="el-icon-plus avatar-uploader-icon" @click='getAdTag(item, index)'></i>
            </el-upload>
            <div class="delete-img-div " @click='deleteAdPic(item, index)'>
              <span style="font-size:14px">删除</span>
            </div>
          </div>
        </el-form-item>
      </el-form>


    </div>
  </div>

</template>

<script>
  import {
    isEmpty,
    limitImg
  } from '../../../static/js/util.js'
  export default {
    //写上name参数会被缓存
    name: "admhotelindex",
    data() {
      return {
        serverIp:this.$store.state.serverIp,
        bgimgfile: null,
        adimgfile: null,
        formLabelWidth: '120px',
        bgfile: null,
        adFile: null,
        adIndex: "",
        datas_upload: [],
        bgform: {
          bgurl: "",
        },

      }
    },
    methods: {
      uploadAdPic() {
        if (limitImg(this.adFile)) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("file", this.adFile)
          formdata.append("imgId", this.datas_upload[this.adIndex].imgId + "")
          this.$axios
            .post("/api/hoInIndex/uploadad", formdata)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.datas_upload[this.adIndex].url = res.data.data.url,
                  this.datas_upload[this.adIndex].imgId = res.data.data.id,
                  this.$message.success("上传成功")
              }

            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },
      deleteAdPic(item, index) {
        if (isEmpty(this.datas_upload[index].imgId + "")) {
          this.datas_upload.splice(index, 1);
          this.$message.success("删除成功")
          return
        }

        var data = {
          "imgId": this.datas_upload[index].imgId + ""
        }
        this.$axios
          .post("/api/hoInIndex/deletead", data)
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
      getAdTag(item, index) {
        this.adIndex = index;
      },
      imgChange(file) {
        this.adFile = file.raw;
        console.log(this.adFile)
      },
      addAdFrame() {
        if (this.datas_upload.length >= 8) {
          return;
        }
        this.datas_upload.push({
          imgId: '',
          url: ''
        })
      },
      beforeUpload(file) {
        // const isJPG = file.type === 'image/jpeg';
        // const isLt2M = file.size / 1024 / 1024 < 2;

        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!');
        // }
        // return isJPG && isLt2M;
        this.bgfile = file;
      },
      uploadBgPic() {
        if (limitImg(this.bgfile)) {
          var formdata = new FormData(); // 创建form对象
          formdata.append('file', this.bgfile);
          this.$axios
            .post("/api/hoInIndex/uploadbg", formdata)
            .then(res => {
              console.log(res + "成功");
              this.bgform.bgurl = res.data.data.bgurl
            }).catch((err) => {
              console.log(err + "错误");
            });
        }

        console.log(limitImg(this.bgfile))
      },

      getIndex() {

        this.$axios
          .get("/api/hoInIndex/getindex")
          .then(res => {
            console.log(res.data)
            this.bgform.bgurl = res.data.data.bgurl;
            for (var i = 0; i < res.data.data.hoInIndexAds.length; i++) {
              this.datas_upload.push({
                "imgId": res.data.data.hoInIndexAds[i].id,
                "url": res.data.data.hoInIndexAds[i].url,
              })
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      }
    },

    created() {
      this.getIndex();
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
