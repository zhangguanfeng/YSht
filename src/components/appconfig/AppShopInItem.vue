<template>
  <div>
    <el-tabs type="border-card" @tab-click="handleTagClick" v-model="currentTagName">
      <el-tab-pane v-for="(item,index) in tags" :key="item.typeId" :label="item.typeName" :name="item.typeName">

        <div>
          <div v-for="(item, index) in datas_upload" :key="index" class="shop-item-div">

            <div class="width:150px">
              <img :src="serverIp+item.iconUrl" class="shop-item-img" @click='getImgTag(item, index)'>
              <div style="background-color:#8c939d;height:30px;width:150px;margin-top:-4px;line-height:30px">
                <span style="margin-left:10px">{{ item.itemName}}</span>
                <span style="float:right;margin-right:10px">￥ {{item.price}}元</span>
              </div>
            </div>
            <div style="margin-top:3px">
              <div class="edit-shop-div " @click='editShopItem(item, index)'>
                <span style="font-size:14px;color:#ffffff">添加到商品列表</span>
              </div>

            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 修改对话框 -->
    <el-dialog title="修改商品" :visible.sync="upDialogVisible">
      <el-form :model="upform" ref="upform">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="upform.itemName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品类别" :label-width="formLabelWidth">
          <el-select v-model="valueType" placeholder="请选择">
            <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
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
        <el-form-item label="图标" :label-width="formLabelWidth">

          <img :src="serverIp+upform.iconUrl" class="avatar">

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
    isEmpty
  } from '../../../static/js/util.js'
  export default {
    //写上name参数会被缓存

    data() {
      return {
        serverIp:this.$store.state.serverIp,
        inDialogVisible: false,
        upDialogVisible: false,
        hotelId: sessionStorage.hotelId,
        fileList: [],
        formLabelWidth: "120px",
        currentTagName: "",
        tags: [],
        datas_upload: [],
        optionsType: [],
        valueType: "",
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
      editShopItem(item, index) {
        this.upform.time = []
        this.upform.time.push("00:00");
        this.upform.time.push("23:59");
        this.valueType=''
        this.upform.typeName = this.currentTagName;
        this.upform.itemId = item.itemId;
        this.upform.introduce = item.introduce;
        this.upform.iconUrl = item.iconUrl;
        this.upform.price = item.price;
        this.upform.itemName = item.itemName;
        this.upDialogVisible = true;
        this.getType();
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
        if (isEmpty(this.valueType + "")) {
          this.$message.error("请选择商品类别")
          return;
        }
        let data = {
          inItemId: this.upform.itemId + "",
          price: this.upform.price,
          introduce: this.upform.introduce,
          itemName: this.upform.itemName,
          beginTime:this.upform.time[0],
          endTime:this.upform.time[1],
         
          hotelId: this.hotelId + "",
          typeId: this.valueType + ""
        };

        console.log(data.inItemId)
        this.$axios
          .post("/api/hoAppShopItem/insertInItem", data)
          .then(res => {
            if (res.data.code == 0) {
              this.$message.success("添加成功");
              this.upDialogVisible = false;
            }
            console.log(res.data);
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getInType() {
        this.tableData = [];
        this.$axios
          .get("/api/hoInShopItem/getType/")
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
          .get("/api/hoInShopItem/getItem/" + typeId)
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
              })

            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getType() {
        this.optionsType = [];
        this.$axios
          .get("/api/hoAppShopItem/getType/" + this.hotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {

              this.optionsType.push({
                value: res.data.data[i].id,
                label: res.data.data[i].typeName,
              })

            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
    },

    created() {
      console.log("hello");
      this.getInType()
      //   this.getType()
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
    width: 150px;
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
