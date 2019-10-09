<template>
  <div class="">
    <el-form :model="aboutform">
      <el-form-item label="酒店简介" :label-width="formLabelWidth">
        <el-input type="textarea" :rows="6" v-model="aboutform.introduce" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="服务热线" :label-width="formLabelWidth">
        <el-input v-model="aboutform.telephone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="酒店图片" :label-width="formLabelWidth">
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
      <el-form-item :label-width="formLabelWidth">
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </el-form-item>
    </el-form>
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
        formLabelWidth: '120px',
        aboutform: {
          introduce: "",
          telephone: "",

        }
      }
    },
    methods: {
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
        console.log(this.adFile)
      },
      getImgTag(item, index) {
        this.imgIndex = index;
      },
      uploadImgPic() {
        if (limitImg(this.imgFile)) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("hotelId", this.hotelId + "")
          formdata.append("file", this.imgFile)
          formdata.append("imgId", this.datas_upload[this.imgIndex].imgId + "")
          this.$axios
            .post("/api/hoAppAbout/uploadPic", formdata)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.datas_upload[this.imgIndex].url = res.data.data.url,
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
          .post("/api/hoAppAbout/deletePic", data)
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
      getImgPic() {
        this.$axios
          .get("/api/hoAppAbout/getPic/" + this.hotelId)
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
        if (isEmpty(this.aboutform.introduce)) {
          this.$message.error("请输入酒店简介");
          return;
        }
        if (isEmpty(this.aboutform.telephone)) {
          this.$message.error("请输入服务热线");
          return;
        }
        let data = {
          "hotelId": this.hotelId + "",
          "introduce": this.aboutform.introduce,
          "telephone": this.aboutform.telephone
        }
        this.$axios
          .post("/api/hoAppAbout/saveAbout", data)
          .then(res => {
            if (res.data.code == 0) {
              this.$message.success("保存成功")
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getAbout() {
        this.$axios
          .get("/api/hoAppAbout/getAbout/" + this.hotelId)
          .then(res => {
            console.log(res.data);
            this.aboutform.introduce = res.data.data.introduce;
            this.aboutform.telephone = res.data.data.telephone;
          }).catch((err) => {
            console.log(err + "错误");
          });
      },


    },

    created() {
      this.getAbout();
      this.getImgPic();
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
