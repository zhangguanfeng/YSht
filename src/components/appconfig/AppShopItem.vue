<template>
  <div>
    <el-tabs type="border-card" @tab-click="handleTagClick" v-model="currentTagName">
      <el-tab-pane v-for="(item,index) in tags" :key="item.typeId" :label="item.typeName" :name="item.typeName">
        <el-button type="primary" @click="openInDialog(index)">添加商品</el-button>
        <div>
          <div v-for="(item, index) in datas_upload" :key="index" class="shop-item-div">
            <el-switch v-model="item.isAppshow" @change="switchChange($event,item)" active-value="0" inactive-value="1">
            </el-switch>
            <div class="width:150px">
              <img :src="serverIp+item.iconUrl" class="shop-item-img" @click='getImgTag(item, index)'>
              <div style="background-color:#8c939d;height:30px;width:150px;margin-top:-4px;line-height:30px">
                <span style="margin-left:10px">{{ item.itemName}}</span>
                <span style="float:right;margin-right:10px">￥ {{item.price}}元</span>
              </div>
            </div>
            <div style="margin-top:3px">
              <div class="edit-shop-div " @click='editShopItem(item, index)'>
                <span style="font-size:14px;color:#ffffff">编辑</span>
              </div>
              <div class="delete-shop-div " @click='deleteShopItem(item, index)'>
                <span style="font-size:14px;color:#ffffff">删除</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>


    <!-- 添加对话框 -->
    <el-dialog title="添加商品" :visible.sync="inDialogVisible">
      <el-form :model="inform" ref="inform">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="inform.itemName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品类别" :label-width="formLabelWidth">
          <el-input autocomplete="off" :disabled="true" :value="inform.typeName"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="inform.price"></el-input>
        </el-form-item>
        <el-form-item label="供应时间" :label-width="formLabelWidth">
          <el-time-picker is-range v-model="inform.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"
            placeholder="选择时间范围" value-format="HH:mm" format="HH:mm">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="商品介绍" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="inform.introduce"></el-input>
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
    <el-dialog title="修改商品" :visible.sync="upDialogVisible">
      <el-form :model="upform" ref="upform">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="upform.itemName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品类别" :label-width="formLabelWidth">
          <el-input autocomplete="off" :disabled="true" :value="upform.typeName"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="upform.price"></el-input>
        </el-form-item>
        <el-form-item label="供应时间" :label-width="formLabelWidth">
          <el-time-picker is-range v-model="upform.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"
            placeholder="选择时间范围" value-format="HH:mm" format="HH:mm">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="商品介绍" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="upform.introduce"></el-input>
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
        <el-button type="primary" @click="upSubmit">确 定</el-button>
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

    data() {
      return {
        serverIp:this.$store.state.serverIp,
        inDialogVisible: false,
        upDialogVisible: false,
        fileList: [],
        inPicFile: null,
        upPicFile: null,
        hotelId: sessionStorage.hotelId,
        formLabelWidth: "120px",
        currentTagName: "",
        tags: [],
        datas_upload: [],
        inform: {
          typeId: "",
          typeName: "",
          price: "",
          itemName: "",
          introduce: "",
          time: ""
        },
        upform: {
          typeId: "",
          typeName: "",
          itemId: "",
          price: "",
          itemName: "",
          introduce: "",
          time: [],
          iconUrl: "",
          beginTime: "",
          endTime: ""
        }
      }
    },
    methods: {
      openInDialog(index) {
        this.inform.typeId = this.tags[index].typeId;
        this.inform.itemName = "";
        this.inform.introduce = "",
          this.inform.price = "",
          this.inPicFile = null;
        this.inDialogVisible = true;
        this.inform.typeName = this.tags[index].typeName;
        this.fileList = []
      },
      inImgChange(file) {
        this.inPicFile = file.raw;
      },
      inOnRemove() {
        this.inPicFile = null;
      },
      inSubmit() {
        if (isEmpty(this.inform.itemName)) {
          this.$message.error("请输入商品名称")
          return;
        }
        if (isEmpty(this.inform.price)) {
          this.$message.error("请输入商品价格")
          return;
        }
        if (limitImg(this.inPicFile)) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("file", this.inPicFile)
          formdata.append("hotelId", this.hotelId + "")
          formdata.append("typeId", this.inform.typeId + "")
          formdata.append("price", this.inform.price)
          formdata.append("introduce", this.inform.introduce)
          formdata.append("itemName", this.inform.itemName)
          if (this.inform.time == null || this.inform.time == "") {
            formdata.append("beginTime", "")
            formdata.append("endTime", "")
          } else {
            formdata.append("beginTime", this.inform.time[0])
            formdata.append("endTime", this.inform.time[1])
          }

          this.$axios
            .post("/api/hoAppShopItem/insertItem", formdata)
            .then(res => {
              if (res.data.code == 0) {
                this.$message.success("添加成功");
                this.inDialogVisible = false;
                this.getItem(this.inform.typeId)
              }
              console.log(res.data);
            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },


      editShopItem(item, index) {
        this.upPicFile = null;
        if ((item.beginTime == "") && (item.endTime == "")) {
          this.upform.time = "";
        } else {
          this.upform.time = []
          this.upform.time.push(item.beginTime);
          this.upform.time.push(item.endTime);
        }

        this.upform.typeId = item.typeId;
        this.upform.typeName = this.currentTagName;
        this.upform.itemId = item.itemId;
        this.upform.introduce = item.introduce;
        this.upform.iconUrl = item.iconUrl;
        this.upform.price = item.price;
        this.upform.itemName = item.itemName;
        this.upDialogVisible = true;
      },
      deleteShopItem(item, index) {
        let data = {
          itemId: item.itemId + ""
        }
        this.$axios
          .post("/api/hoAppShopItem/deleteItem", data)
          .then(res => {
            if (res.data.code == 0) {
              this.getItem(item.typeId)
            }
            console.log(res.data);
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      uploadPic() {
        if (limitImg(this.upPicFile)) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("itemId", this.upform.itemId + "")
          formdata.append("hotelId", this.hotelId)
          formdata.append("file", this.upPicFile)
          this.$axios
            .post("/api/hoAppShopItem/uploadPic", formdata)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.upform.iconUrl = res.data.data.iconUrl
                this.$message.success("上传成功")
                this.getItem(this.upform.typeId)
              }

            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },
      beforeUpload(file) {
        this.upPicFile = file;
      },
      upSubmit() {

        if (isEmpty(this.upform.itemName)) {
          this.$message.error("请输入商品名称")
          return;
        }
        if (isEmpty(this.upform.price)) {
          this.$message.error("请输入商品价格")
          return;
        }
        var beginTime1 = ""
        var endTime1 = ""
        if (this.upform.time == null || this.upform.time == "") {

        } else {
          beginTime1 = this.upform.time[0]
          endTime1 = this.upform.time[1]
        }

        let data = {
          itemId: this.upform.itemId + "",
          price: this.upform.price,
          introduce: this.upform.introduce,
          itemName: this.upform.itemName,
          time: beginTime1 + "#" + endTime1
        };


        this.$axios
          .post("/api/hoAppShopItem/editItem", data)
          .then(res => {
            if (res.data.code == 0) {
              this.$message.success("修改成功");
              this.upDialogVisible = false;
              this.getItem(this.upform.typeId)
            }
            console.log(res.data);
          }).catch((err) => {
            console.log(err + "错误");
          });
      },


      switchChange(value, item) {
        let data = {
          itemId: item.itemId + "",
          isAppshow: value + ""
        }
        this.$axios
          .post("/api/hoAppShopItem/switchShopItem", data)
          .then(res => {
            console.log(res.data);
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getType() {
        this.tableData = [];
        this.$axios
          .get("/api/hoAppShopItem/getType/" + this.hotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {

              this.tags.push({
                typeId: res.data.data[i].id,
                typeName: res.data.data[i].typeName,
              })

            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleTagClick(tab, event) {

        let data = this.tags.find(item => {
          return item.typeName == this.currentTagName;
        })

        this.getItem(data.typeId);
      },
      getItem(typeId) {
        this.$axios
          .get("/api/hoAppShopItem/getItem/" + typeId)
          .then(res => {
            console.log(res.data);
            this.datas_upload = []
            for (var i = 0; i < res.data.data.length; i++) {
              this.datas_upload.push({
                itemId: res.data.data[i].id,
                itemName: res.data.data[i].itemName,
                typeId: res.data.data[i].typeId,
                iconUrl: res.data.data[i].iconUrl,
                price: res.data.data[i].price,
                introduce: res.data.data[i].introduce,
                beginTime: res.data.data[i].beginTime,
                endTime: res.data.data[i].endTime,
                isAppshow: res.data.data[i].isAppshow + "",
              })

            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      }
    },

    created() {
      console.log("hello");
      this.getType()
    },
    // activated(){
    //   console.log("hello");
    //   // this.getType()
    // }

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

  .edit-shop-div {
    width: 72px;
    height: 30px;
    color: #ff0000;
    text-align: center;
    background-color: #409eff;
    line-height: 30px;
    border-radius: 6px;
    display: inline-block;
  }

  .delete-shop-div {
    width: 72px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: #f56c6c;

    border-radius: 6px;
    display: inline-block;
  }

  .shop-item-img {
    width: 150px;
    height: 150px;
  }

  .shop-item-div {
    margin-top: 20px;
    width: 150px;
    height: 220px;
    margin-left: 30px;
    display: inline-block;
  }

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
