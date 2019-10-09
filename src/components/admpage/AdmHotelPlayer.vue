<template>

  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>播放器配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">

      <el-form ref="form" :model="form" label-width="180px">
        <el-form-item label="是否开启节目预告">
          <el-switch v-model="form.isPlayback" active-value="0" inactive-value="1" @change="isPlayBackChange"></el-switch>
        </el-form-item>
        <el-form-item label="启动图片配置">
          <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="uploadBgPic" name="file"
            :before-upload="beforeUpload" accept=".jpg,.jpeg,.png,.JPG,.JPEG">
            <img v-if="form.bgUrl" :src="serverIp+form.bgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="滚动消息文字配置">
          <el-input v-model="form.rollMes" type="textarea" :row="4"></el-input>
        </el-form-item>
         <el-form-item label="滚动消息时长配置">
          <el-input v-model="form.rollTime" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="onSubmit">保存</el-button>
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
    name: "admhotelplayer",
    data() {
      return {
        serverIp:this.$store.state.serverIp,
        form: {
          isPlayback: "0",
          bgUrl: "",
          rollMes: "",
          rollTime:""
        },
        bgfile: null,
      }
    },
    methods: {
      isPlayBackChange() {
        let data = {
          "isPlayback": this.form.isPlayback + ""
        }
        this.$axios
          .post("/api/hoInPlayerConfig/switchIsPlayback", data)
          .then(res => {
            console.log(res.data);
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      beforeUpload(file) {
        this.bgfile = file;
      },
      uploadBgPic() {
        if (limitImg(this.bgfile)) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("file", this.bgfile)
          this.$axios
            .post("/api/hoInPlayerConfig/uploadStartImg", formdata)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.form.bgUrl = res.data.data.bgUrl
                this.$message.success("上传成功")
              }

            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },
      getPlayerConfig() {
        this.$axios
          .get("/api/hoInPlayerConfig/getPlayerConfig")
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.form.bgUrl = res.data.data.bgUrl
              this.form.isPlayback = res.data.data.isPlayback + ""
              this.form.rollMes = res.data.data.rollMes
              this.form.rollTime=res.data.data.rollTime
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      onSubmit() {
        let data = {
          "rollMes": this.form.rollMes + "",
          "rollTime":this.form.rollTime+""
        }
        this.$axios
          .post("/api/hoInPlayerConfig/updatePlayerConfig", data)
          .then(res => {
            this.$message.success("保存成功")
          }).catch((err) => {
            console.log(err + "错误");
          });
      }
    },
    created() {
      this.getPlayerConfig()
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

</style>
