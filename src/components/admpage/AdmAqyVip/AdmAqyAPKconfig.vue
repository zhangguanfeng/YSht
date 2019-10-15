<template>
  <div class="AdmAqyAPKconfig">
    <el-form  label-width="150px">
      <el-form-item label="启动器图片配置">
        <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="uploadBgPic" name="file"
          :before-upload="beforeUpload" multiple :limit="1" accept=".jpg,.jpeg,.png,.JPG,.JPEG">
          <img v-if="form.url" :src="serverIp+form.url" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    isEmpty,
    limitImg
  } from '../../../../static/js/util'
  export default {
    data() {
      return {
        bgfile: null,
        form: [],
        serverIp: this.$store.state.serverIp,

      }
    },
    created () {
      this.getStarterImg()
    },
    methods: {
      uploadBgPic() {
        if (limitImg(this.bgfile)) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("file", this.bgfile)
          this.$axios
            .post("api/hoHotelAqyvipApk/uploadStarterImg", formdata)
            .then(res => {
              if (res.data.code == 0) {
                this.form = res.data.data
                this.$message.success("上传成功")
              }

            }).catch((err) => {
              console.log(err + "错误");
            });
        }
      },
      beforeUpload(file) {
        this.bgfile = file;
      },
      getStarterImg(){
        this.$axios
            .get("api//hoHotelAqyvipApk/getStarterImg")
            .then(res => {
              if (res.data.code == 0) {
                this.form = res.data.data
              }
            }).catch((err) => {
              console.log(err + "错误");
            });
      }
    },
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
