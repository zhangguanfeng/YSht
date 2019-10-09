<template>
  <div>
    <el-row>
      <el-button type="primary" @click="openInDialog">添加模块</el-button>
      <el-button type="primary" @click="sortDialogFormVisible = true">排序模块</el-button>
    </el-row>

    <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}"
      :key="tableData.date">
      <el-table-column label="图标" align="center">
        <template slot-scope="scope">
          <img :src="serverIp+scope.row.iconUrl" style="width:90px;height:90px;background-color:#a5b3c6" />
        </template>
      </el-table-column>

      <el-table-column label="模块名称" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.moduleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模块类型" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Apk名称" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.appName }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="是否启用" align="center">
        <template slot-scope="scope">
          <el-switch v-model=" scope.row.isShow" active-value="0" inactive-value="1" @change="switchChange($event, scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="primary" @click="handleApp(scope.$index, scope.row)" v-show="scope.row.moduleType==1||scope.row.moduleType==2||
          scope.row.moduleType==6||scope.row.moduleType==7||scope.row.moduleType==8">选择APP</el-button>
          <el-button type="danger" @click="handleDelete(scope.$index, scope.row)" v-show="scope.row.moduleType==1">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 添加对话框 -->
    <el-dialog title="添加模块" :visible.sync="inDialogVisible">
      <el-form :model="inform" ref="inform">
        <el-form-item label="模块名称" :label-width="formLabelWidth" prop="moduleName">
          <el-input v-model="inform.moduleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="模块类型" :label-width="formLabelWidth">
            <el-select v-model="inform.typeId" placeholder="请选择模块类型">
              <el-option label="自定义" value="1"></el-option>
              <el-option label="直播" value="2"></el-option>
              <el-option label="风景" value="3"></el-option>
              <el-option label="关于" value="4"></el-option>
              <el-option label="商城" value="5"></el-option>
              <el-option label="点播" value="6"></el-option>
              <el-option label="音乐" value="7"></el-option>
              <el-option label="投屏" value="8"></el-option>
              <el-option label="服务" value="9"></el-option>
               <el-option label="评分" value="10"></el-option>
            </el-select>
          </el-form-item>
        <!-- <el-form-item label="模块类别" :label-width="formLabelWidth">
          <el-input autocomplete="off" :disabled="true" value="第三方app"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="选择App" :label-width="formLabelWidth" prop="appId">
          <el-select v-model="inform.appId" placeholder="请选择app">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
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
    <el-dialog title="修改模块" :visible.sync="upDialogVisible">
      <el-form :model="upform">
        <el-form-item label="模块名称" :label-width="formLabelWidth">
          <el-input v-model="upform.moduleName" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="模块类别" :label-width="formLabelWidth">
          <el-input autocomplete="off" :disabled="true" v-model="upform.typeName"></el-input>
        </el-form-item> -->
          <el-form-item label="模块类型" :label-width="formLabelWidth">
            <el-select v-model="upform.moduleType" placeholder="请选择模块类型">
              <el-option label="自定义" value="1"></el-option>
              <el-option label="直播" value="2"></el-option>
              <el-option label="风景" value="3"></el-option>
              <el-option label="关于" value="4"></el-option>
              <el-option label="商城" value="5"></el-option>
              <el-option label="点播" value="6"></el-option>
              <el-option label="音乐" value="7"></el-option>
              <el-option label="投屏" value="8"></el-option>
              <el-option label="服务" value="9"></el-option>
                 <el-option label="评分" value="10"></el-option>
            </el-select>
          </el-form-item>
        <!-- <el-form-item label="选择App" :label-width="formLabelWidth" prop="appId" v-show="upform.moduleType==1">
          <el-select v-model="upform.appId" placeholder="请选择app">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="图标上传" :label-width="formLabelWidth">
          <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="uploadPic" name="file"
            :before-upload="beforeUpload" accept=".jpg,.jpeg,.png,.JPG,.JPEG">
            <img v-if="upform.iconUrl" :src="serverIp+upform.iconUrl" class="avatar" style="background-color:#a5b3c6">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="upsubmit">确 定</el-button>
        <el-button @click="upDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 排序对话框 -->
    <el-dialog title="模块排序" :visible.sync="sortDialogFormVisible">
      <div class="drag-box">
        <div class="drag-box-item">
          <div class="item-title">拖曳可以移动模块</div>
          <draggable v-model="sortModule" :options="dragOptions">
            <div v-for="(item,index) in sortModule" class="drag-list" :key="index">
              {{item.moduleName}}
            </div>
          </draggable>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sortModuleNum" type="primary">确定</el-button>
        <el-button @click="sortDialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>


    <!-- App选择对话框 -->
    <el-dialog title="选择APP" :visible.sync="dialogMultiAppFormVisible">
      <el-tabs type="border-card" @tab-click="handleTagClick" v-model="currentTagName">
        <el-tab-pane v-for="item in tags" :key="item.id" :label="item.name" :name="item.name">
          <el-table :data="multiAppTableData" style="width: 100%">
            <el-table-column label="开/关" align="center">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.isSwitch" active-value="0" inactive-value="1" @change="switchApp($event, scope.row)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="App名称" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.appName }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import {
    isEmpty,
    limitImg
  } from '../../../static/js/util.js'
  export default {

    data() {
      return {
        serverIp: this.$store.state.serverIp,
        dragOptions: {
          animation: 120,
          scroll: true,
          group: 'sortlist',
          ghostClass: 'ghost-style'
        },
        types: ["", "第三方app", "直播", "风景", "关于", "商城", "点播", "音乐", "投屏", "服务","评分"],
        hotelId: sessionStorage.hotelId,
        dialogMultiAppFormVisible: false,
        upDialogVisible: false,
        inDialogVisible: false,
        sortDialogFormVisible: false,
        formLabelWidth: "120px",
        currentTagName: "",
        fileList: [],
        options: [],
        sortModule: [],
        tableData: [],
        multiAppTableData: [],
        inPicFile: null,
        upPicFile: null,
        inform: {
          appId: "",
          moduleName: "",
        },
        upform: {
          moduleId: "",
          moduleName: "",
          moduleType: "",
          typeName: "",
          appName: "",
          appId: "",
          iconUrl: "",
          isShow: ""
        },
        tags: [],
        curModuleId: "",
        curModuelApp: [],
        curTagId: "",
      }
    },
    methods: {
      getMultiModuleApp() {
        this.curModuelApp = []
        this.$axios
          .get("/api/hoAppModuleMultiapp/getModuleApp/" + this.curModuleId)
          .then(res => {
            if (res.data.code == 0) {
              for (var i = 0; i < res.data.data.length; i++) {
                this.curModuelApp.push({
                  "appId": res.data.data[i].appId,
                  "appType": res.data.data[i].appType
                })
              }
              this.getTagApp()
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getTagApp() {
        this.multiAppTableData = []
        if (this.curTagId == 0) {
          this.$axios
            .get("/api/hoAppModule/getAppModuleApk/" + this.hotelId)
            .then(res => {
              console.log(res.data);

              for (var i = 0; i < res.data.data.length; i++) {
                var some = this.curModuelApp.some(function (data) {
                  if (data.appType == 0 && data.appId == res.data.data[i].id) {
                    return true;
                  } else {
                    return false;
                  }
                })
                this.multiAppTableData.push({
                  appType: 0,
                  appId: res.data.data[i].id,
                  appName: res.data.data[i].appName,
                  appUrl: res.data.data[i].appUrl,
                  isSwitch: some == true ? "0" : "1"
                })
              }
            }).catch((err) => {
              console.log(err + "错误");
            });
        } else {
          this.$axios
            .get("/api/hoInAppType/getTypeByIdSwitch/" + this.curTagId)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                for (var i = 0; i < res.data.data.length; i++) {
                  var some = this.curModuelApp.some(function (data) {
                    if (data.appType == 1 && data.appId == res.data.data[i].id) {
                      return true;
                    } else {
                      return false;
                    }
                  })
                  this.multiAppTableData.push({
                    appType: 1,
                    appId: res.data.data[i].id,
                    appName: res.data.data[i].appName,
                    appUrl: res.data.data.appUrl,
                    isSwitch: some == true ? "0" : "1"
                  })
                }
              } else {
                this.$message.error(res.data.msg)
              }
            }).catch((err) => {
              console.log(err + "错误");
            });
        }
      },
      handleApp(index, row) {
        this.tags = []
        this.currentTagName = ""
        this.curModuleId = row.moduleId
        this.dialogMultiAppFormVisible = true
        this.$axios
          .get("/api/hoInAppType/getType")
          .then(res => {
            console.log(res.data);
            this.tags.push({
              "id": 0,
              "name": "自定义"
            })
            if (res.data.code == 0) {
              for (var i = 0; i < res.data.data.length; i++) {
                this.tags.push({
                  "id": res.data.data[i].id,
                  "name": res.data.data[i].typeName
                })
              }
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      switchApp(value, row) {
        let data = {
          appId: row.appId + "",
          appType: row.appType + "",
          moduleId: this.curModuleId + "",
        }
        if (value == "0") {
          this.$axios
            .post("/api/hoAppModuleMultiapp/insertModuleApp", data)
            .then(res => {
              console.log(res.data);
            }).catch((err) => {
              console.log(err + "错误");
            });
        } else {
          this.$axios
            .post("/api/hoAppModuleMultiapp/deleteModuleApp", data)
            .then(res => {
              console.log(res.data);
            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },
      handleTagClick(tab, event) {
        let data = this.tags.find(item => {
          return item.name == tab.name;
        })
        console.log(data.id + "//" + data.name)
        this.curTagId = data.id
        this.getMultiModuleApp()
      },

      handleDelete(index, row) {
        var data = {
          moduleId: row.moduleId + "",
        }
        this.$axios
          .post("/api/hoAppModule/deleteModule", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.$message.success("删除成功")
              this.getModule()
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleEdit(index, row) {
        this.upform.moduleId = row.moduleId
        this.upform.moduleName = row.moduleName
        this.upform.typeName = row.typeName
        this.upform.moduleType = row.moduleType+""
        this.upform.appId = row.appId + ""
        this.upform.iconUrl = row.iconUrl
        this.upDialogVisible = true;
      },
      upsubmit() {
        if (isEmpty(this.upform.moduleName)) {
          this.$message.error("请输入模块名称")
          return;
        }
          if(isEmpty(this.upform.moduleType)){
          this.$message.error("请选择类别")
          return;
        }
        var data = {
          moduleId: this.upform.moduleId + "",
          moduleName: this.upform.moduleName,
          typeId:this.upform.moduleType+""
        }
        this.$axios
          .post("/api/hoAppModule/editModule", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.$message.success("修改成功")
              this.upDialogVisible = false;
              this.getModule();
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      beforeUpload(file) {
        this.upPicFile = file;
      },
      uploadPic() {
        if (limitImg(this.upPicFile)) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("moduleId", this.upform.moduleId + "")
          formdata.append("file", this.upPicFile)

          this.$axios
            .post("/api/hoAppModule/uploadPic", formdata)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.upform.iconUrl = res.data.data.iconUrl
                console.log(this.upform.iconUrl)
                this.$message.success("上传成功")
                this.getModule();
              }

            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },
      switchChange(value, row) {
        let data = {
          "moduleId": row.moduleId + "",
          "isShow": value
        }
        this.$axios
          .post("/api/hoAppModule/switchModule", data)
          .then(res => {
            console.log(res.data);
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
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
        if (isEmpty(this.inform.moduleName)) {
          this.$message.error("请输入模块名称")
          return;
        }
        if (this.inPicFile == null) {
          this.$message.error("请选择图标")
          return;
        }
        if(isEmpty(this.inform.typeId)){
          this.$message.error("请选择类别")
          return;
        }
        if (limitImg(this.inPicFile)) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("hotelId", this.hotelId + "")
          formdata.append("file", this.inPicFile)
          formdata.append("moduleName", this.inform.moduleName)
          formdata.append("typeId",this.inform.typeId+"")
          this.$axios
            .post("/api/hoAppModule/saveModule", formdata)
            .then(res => {
              if (res.data.code == 0) {
                this.$message.success("添加成功");
                this.inDialogVisible = false;
                this.getModule();
              }
              console.log(res.data);

            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },
      getApk() {
        this.tableData = [];
        this.$axios
          .get("/api/hoAppModule/getAppModuleApk/" + this.hotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {

              this.options.push({
                "value": res.data.data[i].id + "",
                "label": res.data.data[i].appName + "   ------   " + res.data.data[i].fileName,
              })

            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getModule() {
        this.sortModule = []
        this.tableData = []
        this.$axios
          .get("/api/hoAppModule/getAppModule/" + this.hotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tableData.push({
                moduleId: res.data.data[i].id,
                moduleName: res.data.data[i].moduleName,
                moduleType: res.data.data[i].moduleType,
                typeName: this.types[res.data.data[i].moduleType],
                appName: res.data.data[i].appName,
                appId: res.data.data[i].appId,
                iconUrl: res.data.data[i].iconUrl,
                isShow: res.data.data[i].isShow + ""
              })
              this.sortModule.push({
                "id": res.data.data[i].id + "",
                "moduleName": res.data.data[i].moduleName + "  -----  " + this.types[res.data.data[i].moduleType],
              });
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      sortModuleNum() {
        this.$axios
          .post("/api/hoAppModule/sortModule", this.sortModule)
          .then(res => {
            console.log(res.data);
            this.sortDialogFormVisible = false
            this.getModule();
          }).catch((err) => {
            console.log(err + "错误");
          });
      }
    },
    components: {
      draggable
    },
    created() {
      this.getModule()
      this.getApk()
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .drag-box {
    display: flex;
    user-select: none;
  }

  .drag-box-item {
    flex: 1;
    max-width: 330px;
    min-width: 300px;
    background-color: #eff1f5;
    margin-right: 16px;
    border-radius: 6px;
    border: 1px #e1e4e8 solid;
  }

  .item-title {
    padding: 8px 8px 8px 12px;
    font-size: 14px;
    line-height: 1.5;
    color: #24292e;
    font-weight: 600;
  }

  .item-ul {
    padding: 0 8px 8px;
    height: 500px;
    overflow-y: scroll;
  }

  .item-ul::-webkit-scrollbar {
    width: 0;
  }

  .drag-list {
    border: 1px #e1e4e8 solid;
    padding: 10px;
    margin: 5px 0 10px;
    list-style: none;
    background-color: #fff;
    border-radius: 6px;
    cursor: pointer;
    -webkit-transition: border .3s ease-in;
    transition: border .3s ease-in;
  }

  .drag-list:hover {
    border: 1px solid #20a0ff;
  }

  .drag-title {
    font-weight: 400;
    line-height: 25px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
  }

  .ghost-style {
    display: block;
    color: transparent;
    border-style: dashed
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background-color: #ff0000
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
