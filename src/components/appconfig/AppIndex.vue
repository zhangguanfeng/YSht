<template>
  <div class="">


    <el-form ref="form" :model="form" label-width="180px">
      <el-form-item>
        <el-button type="primary" @click.native.prevent="onSubmit">保存</el-button>
      </el-form-item>
      <el-form-item label="界面风格配置">
        <el-select v-model="form.pageStyle" placeholder="请选择界面风格">
          <el-option label="风格1" value="1"></el-option>
          <el-option label="风格2" value="2"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="背景图片模糊开关">
        <el-switch v-model="form.isBlur" @change="isBlurChange" active-value="0" inactive-value="1">
        </el-switch>
      </el-form-item>
      <el-form-item label="是否需要首页">
        <el-switch v-model="form.needFirstpage" @change="isFirstPageChange" active-value="0" inactive-value="1">
        </el-switch>
      </el-form-item> -->
      <!-- <el-form-item label="天气区域">
        <el-cascader :options="options" v-model="form.area" @change="handleAreaChange" filterable>
        </el-cascader>
      </el-form-item> -->
      <el-form-item label="是否开启WiFi">
        <el-switch v-model="form.wifiEnable" active-value="0" inactive-value="1" @change="wifiChange"></el-switch>
      </el-form-item>
      <el-form-item label="WiFi名称配置">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="form.wifiName"></el-input>
          </el-col>
          <el-col :span="14">不超过16个字符，以@开头表示WiFi前缀，名称会自动加上房间号</el-col>
        </el-row>
       
      </el-form-item>
      <el-form-item label="WiFi密码配置">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="form.wifiPwd"></el-input>
          </el-col>
          <el-col :span="14">@表示随机密码，为空表示不设密码，密码长度为8-16位</el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="背景图片配置">
        <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="uploadBgPic" name="file"
          :before-upload="beforeUpload" accept=".jpg,.jpeg,.png,.JPG,.JPEG">
          <img v-if="form.bgUrl" :src="serverIp+form.bgUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="温馨提示文字配置">
        <el-input v-model="form.warmMes" type="textarea" :row="4"></el-input>
      </el-form-item>
      <el-form-item label="滚动消息文字配置">
        <el-input v-model="form.rollMes" type="textarea" :row="4"></el-input>
      </el-form-item>
      <!-- <el-form-item label="滚动广告图片间隔时间配置">
        <el-input v-model="form.adpicRollTime"></el-input>
      </el-form-item> -->
      <el-form-item label="小窗口配置">
        <el-radio-group v-model="form.smallWindowType" @change="smallWindowTypeChange">
          <el-radio :label="1">广告图片</el-radio>
          <el-radio :label="2">广告视频(将播放欢迎页中的视频)</el-radio>
          <!-- <el-radio :label="3">频道播放</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="广告图片配置">
        <div>
          <el-button type="primary" @click="addAdFrame">增加</el-button>
        </div>
        <div v-for="(item, index) in datas_upload" :key="index" class="avatar-div">
          <el-upload class="avator-uploader" action="" :show-file-list="false" :http-request="uploadAdPic" name="file"
            :on-change="imgChange">
            <img v-if="item.url" :src="serverIp+item.url" class="avatar" @click='getAdTag(item, index)'>
            <i v-else class="el-icon-plus avatar-uploader-icon" @click='getAdTag(item, index)'></i>
          </el-upload>
          <div class="delete-img-div " @click='deleteAdPic(item, index)'>
            <span style="font-size:14px">删除</span>
          </div>
        </div>
      </el-form-item>
      <!-- <el-form-item label="广告视频配置">
        <el-button type="primary" @click="chooseVideo">选择文件</el-button>
        <input type="file" class="upload" ref="video" @change="uploadVideo" id="videoId" style="display: none;" />
        <span> {{ form.videoName }}</span>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click.native.prevent="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>
  import {
    area
  } from "../../../static/js/area.js"
  import {
    isEmpty,
    limitImg,
    limitVideo
  } from '../../../static/js/util.js'
  export default {
    name: "admindex",
    data() {
      return {
        serverIp: this.$store.state.serverIp,
        adIndex: "",
        adFile: null,
        datas_upload: [],
        hotelId: sessionStorage.hotelId,
        options: area,
        bgfile: null,
        form: {
          pageStyle: "",
          isBlur: "",
          needFirstpage: "",
          wifiEnable: "",
          wifiName: "",
          wifiPwd: "",
          bgUrl: "",
          warmMes: "",
          rollMes: "",
          adpicRollTime: "",
          smallWindowType: "",
          videoName: "",
          area: []
        },
      }
    },
    methods: {
      chooseVideo() {
        document.getElementById("videoId").click();
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
      isBlurChange(value) {
        this.form.isBlur = value;
      },
      isFirstPageChange(value) {
        this.form.needFirstPage = value;
      },
      wifiChange(value) {
        this.form.wifiEnable = value;
      },
      smallWindowTypeChange(value) {
        this.form.smallWindowType = value;
      },
      beforeUpload(file) {
        this.bgfile = file;
      },
      uploadBgPic() {
        if (limitImg(this.bgfile)) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("hotelId", this.hotelId)
          formdata.append("file", this.bgfile)

          this.$axios
            .post("/api/hoAppIndex/uploadBgPic", formdata)
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
      uploadVideo() {
        let inputDOM = this.$refs.video;
        if (limitVideo(inputDOM.files[0])) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("hotelId", this.hotelId)
          formdata.append("file", inputDOM.files[0])
          this.$axios
            .post("/api/hoAppIndex/uploadVideo", formdata)
            .then(res => {
              console.log(res.data);
              this.form.videoName = res.data.data.name
              console.log(this.form.videoName)
              this.$message.success("上传成功");
            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },
      imgChange(file) {
        this.adFile = file.raw;
        console.log(this.adFile)
      },
      getAdTag(item, index) {
        this.adIndex = index;
      },

      uploadAdPic() {
        if (limitImg(this.adFile)) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("hotelId", this.hotelId)
          formdata.append("file", this.adFile)
          formdata.append("imgId", this.datas_upload[this.adIndex].imgId + "")
          this.$axios
            .post("/api/hoAppIndex/uploadAdPic", formdata)
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
          .post("/api/hoAppIndex/deleteAdPic", data)
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
      onSubmit() {

      },
      handleAreaChange(value) {
        console.log(this.form.area)
        console.log(value)
      },
      getIndex() {
        this.$axios
          .get("/api/hoAppIndex/getIndex/" + this.hotelId)
          .then(res => {
            console.log(res.data);

            this.form.pageStyle = res.data.data.hoAppIndex.pageStyle + ""
            this.form.isBlur = res.data.data.hoAppIndex.isBlur + ""
            this.form.needFirstpage = res.data.data.hoAppIndex.needFirstpage + ""
            this.form.wifiEnable = res.data.data.hoAppIndex.wifiEnable + ""
            this.form.smallWindowType = res.data.data.hoAppIndex.smallWindowType
            this.form.wifiName = res.data.data.hoAppIndex.wifiName
            this.form.wifiPwd = res.data.data.hoAppIndex.wifiPwd
            this.form.bgUrl = res.data.data.hoAppIndex.bgUrl
            this.form.warmMes = res.data.data.hoAppIndex.warmMes
            this.form.rollMes = res.data.data.hoAppIndex.rollMes
            this.form.adpicRollTime = res.data.data.hoAppIndex.adpicRollTime
            this.form.videoName = res.data.data.videoName
            this.form.area = [res.data.data.hoAppIndex.provinceCode + "",
              res.data.data.hoAppIndex.cityCode + "", res.data.data.hoAppIndex.areaCode + ""
            ]

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getAdPic() {
        this.$axios
          .get("/api/hoAppIndex/getAdPic/" + this.hotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.datas_upload.push({
                "imgId": res.data.data[i].id,
                "url": res.data.data[i].url,
              })

            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      onSubmit() {

        if (isEmpty(this.form.pageStyle)) {
          this.$message.error("请选择界面风格");
          return;
        }

        if (isEmpty(this.form.area[2])) {
          this.$message.error("请选择天气区域");
          return;
        }
        if (isEmpty(this.form.wifiName)) {
          this.$message.error("请输入wifi名称");
          return;
        }
       
        if (isEmpty(this.form.warmMes)) {
          this.$message.error("请输入温馨提示文字");
          return;
        }
        if (isEmpty(this.form.rollMes)) {
          this.$message.error("请输入滚动消息文字");
          return;
        }
        if (isEmpty(this.form.adpicRollTime + "")) {
          this.$message.error("请输入滚动广告图片间隔时间");
          return;
        }


        let data = {
          hotelId: this.hotelId + "",
          pageStyle: this.form.pageStyle + "",
          isBlur: this.form.isBlur + "",
          needFirstpage: this.form.needFirstpage + "",
          wifiEnable: this.form.wifiEnable + "",
          wifiName: this.form.wifiName + "",
          wifiPwd: this.form.wifiPwd + "",
          warmMes: this.form.warmMes + "",
          rollMes: this.form.rollMes + "",
          adpicRollTime: this.form.adpicRollTime + "",
          smallWindowType: this.form.smallWindowType + "",
          area: this.form.area,
        }
        this.$axios
          .post("/api/hoAppIndex/saveIndex", data)
          .then(res => {
            if (res.data.code == 0) {
              this.$message.success("保存成功")
            }
            console.log(res.data)

          }).catch((err) => {
            console.log(err + "错误");
          });
      }
    },
    created() {
      this.getIndex()
      this.getAdPic()

    }

  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
