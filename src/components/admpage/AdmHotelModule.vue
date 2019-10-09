<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>模块配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">

      <el-row>
        <el-button type="primary" @click="openAppDialog">模块App配置</el-button>
        <!-- <el-button type="primary" @click="openModuleDialog">添加模块</el-button> -->
        <el-button type="primary" @click="sortDialogFormVisible = true">排序模块</el-button>

      </el-row>
      <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">

        <el-table-column label="模块名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.moduleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模块图标" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.modulePic" style="width:70px;height:70px;background-color:#a5b3c6;padding:15px" />
          </template>
        </el-table-column>
        <el-table-column label="模块类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.typeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="App名称" align="center">
          <template slot-scope="scope">

            <span>{{ scope.row.appName }}</span>

          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handModuleEidt(scope.$index, scope.row)">编辑</el-button>
            <!-- <el-button size="mini" type="danger" @click="handModuleDelete(scope.$index, scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>


      <!-- 添加App对话框 -->
      <el-dialog title="模块App配置" :visible.sync="appDialogFormVisible">
        <!-- <input type="file" class="upload" @change="addImg" ref="inputer" /> -->
        <el-form ref="appform" :model="appform" label-width="180px">
          <el-form-item label="点播视频APP配置">
            <el-button type="primary" @click="choosetDianBoApp">添加App</el-button>
            <span>文件名称:{{ dianbofilename }}</span>
            <input type="file" class="upload" @change="insertDianBoName" ref="inputerDianBo" style="display: none;" id="dianboid" />
            <el-input v-model="appform.appDianBoName"></el-input>
          </el-form-item>
          <el-form-item label="音乐APP配置">
            <el-button type="primary" @click="choosetMusicApp">添加App</el-button>
             <span>文件名称:{{ musicfilename }}</span>
            <input type="file" class="upload" @change="insertMusicApp" ref="inputerMusic" style="display: none;" id="musicid" />
            <el-input v-model="appform.appMusicName"></el-input>
          </el-form-item>
          <el-form-item label="投屏互动APP配置">
            <el-button type="primary" @click="choosetHuDongApp">添加App</el-button>
            <span>文件名称:{{ hudongfilename }}</span>
            <input type="file" class="upload" @change="insertHuDongApp" ref="inputerHuDong" style="display: none;" id="hudongid" />
            <el-input v-model="appform.appHuDongName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editApp" type="primary">保存</el-button>
          <el-button @click="appDialogFormVisible = false">关闭</el-button>
        </div>
      </el-dialog>

      <!-- 添加模块对话框 -->
      <el-dialog title="添加模块" :visible.sync="moDialogFormVisible">
        <el-form :model="moform">
          <el-form-item label="模块名称" :label-width="formLabelWidth">

            <el-input v-model="moform.moduleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="模块类型" :label-width="formLabelWidth">
            <el-select v-model="moform.typeId" placeholder="请选择模块类型">
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
          <el-form-item label="选择app" :label-width="formLabelWidth" v-show="moform.moduleType==1">
            <el-select v-model="moform.appId" placeholder="请选择app">
              <el-option v-for="item in apps" :key="item.id" :label="item.appName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图标上传" :label-width="formLabelWidth">
            <el-upload action="" list-type="picture-card" :limit="1" :name="moform.imgfilename" :auto-upload="false"
              :on-change="onChange" :on-remove="onRemove" ref="upload">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="moform.imgDialogVisible" :append-to-body='true'>
              <img width="100%" :src="moform.imgDialogUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="inSubmit" type="primary">确定</el-button>
          <el-button @click="moDialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>


      <!-- 修改模块对话框 -->
      <el-dialog title="修改模块" :visible.sync="moEditDialogFormVisible">
        <el-form :model="moEditForm">
          <el-form-item label="模块名称" :label-width="formLabelWidth">

            <el-input v-model="moEditForm.moduleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="模块类型" :label-width="formLabelWidth">
            <el-select v-model="moEditForm.typeId" placeholder="请选择模块类型" :disabled="true">
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

          <el-form-item label="图标上传" :label-width="formLabelWidth">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="updateModulePic" :name="moEditForm.imgfilename"
              :before-upload="beforeUpload">
              <img v-if="moEditForm.imageUrl" :src="moEditForm.imageUrl" class="avatar" style="background-color:#a5b3c6">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-dialog :visible.sync="moEditForm.imgDialogVisible" :append-to-body='true'>
              <img width="100%" :src="moEditForm.imageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="upSubmit" type="primary">确定</el-button>
          <el-button @click="moEditDialogFormVisible = false">取消</el-button>
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
    </div>
  </div>



</template>

<script>
  import draggable from 'vuedraggable'
  import {
    isEmpty,
    limitImg,
    limitApk
  } from '../../../static/js/util.js'
  export default {
    //写上name参数会被缓存
    name: "admhotelmodule",
    data() {
      return {
        serverIp:this.$store.state.serverIp,
        dragOptions: {
          animation: 120,
          scroll: true,
          group: 'sortlist',
          ghostClass: 'ghost-style'
        },
        imageUrl: "",
        sortModule: [],
        picfile: null,
        upPicFile: null,
        apps: [],
        formLabelWidth: "120px",
        tableData: [],
        appTableData: [],
        appDialogFormVisible: false,
        moDialogFormVisible: false,
        moEditDialogFormVisible: false,
        sortDialogFormVisible: false,
        moform: {
          appId: "",
          moduleName: "",
          typeId: "",
          appName: "",
          imgfilename: "file",
          imgDialogUrl: "",
          imgDialogVisible: false,
        },
        moEditForm: {
          imageUrl: "",
          moduleName: "",
          typeId: "",
          moduleId: "",
          imgfilename: "file",
          imgDialogUrl: "",
          imgDialogVisible: false,
        },
        appform: {
          appDianBoName: "",
          appMusicName: "",
          appHuDongName: "",
        },
        hudongfilename:"",
        dianbofilename:"",
        musicfilename:"",
      }
    },
    components: {
      draggable
    },
    methods: {
      choosetDianBoApp() {
        document.getElementById("dianboid").value = null
        document.getElementById("dianboid").click();
      },
      choosetMusicApp() {
        document.getElementById("musicid").value = null
        document.getElementById("musicid").click();
      },
      choosetHuDongApp() {
        document.getElementById("hudongid").value = null
        document.getElementById("hudongid").click();
      },
      openModuleDialog() {
        this.moDialogFormVisible = true
        this.moform.moduleName = ""
        this.moform.typeId = ""
        this.picfile = null;
      },
      editApp() {
        if (isEmpty(this.appform.appDianBoName)) {
          this.$message.error("请输入app名称");
          return;
        }
        if (isEmpty(this.appform.appMusicName)) {
          this.$message.error("请输入app名称");
          return;
        }
        if (isEmpty(this.appform.appHuDongName)) {
          this.$message.error("请输入app名称");
          return;
        }
        let data = {
          "appDianBoName": this.appform.appDianBoName + "",
          "appMusicName": this.appform.appMusicName + "",
          "appHuDongName": this.appform.appHuDongName + "",
        }
        this.$axios
          .post("/api/hoInModule/editApp", data)
          .then(res => {
            console.log(res.data);

            this.$message.success("保存成功");

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      insertDianBoName(event) {

        let inputDOM = this.$refs.inputerDianBo;
        // 通过DOM取文件数据
        if (limitApk(inputDOM.files[0])) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("file", inputDOM.files[0]);
          formdata.append("appId", 1 + "")
          this.$axios
            .post("/api/hoInModule/uploadApp", formdata)
            .then(res => {
              console.log(res.data);
              this.dianbofilename=inputDOM.files[0].name
              this.$message.success("上传成功");

            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },
      insertMusicApp(event) {
        let inputDOM = this.$refs.inputerMusic;
        // 通过DOM取文件数据
        if (limitApk(inputDOM.files[0])) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("file", inputDOM.files[0]);
          formdata.append("appId", 2 + "")
          this.$axios
            .post("/api/hoInModule/uploadApp", formdata)
            .then(res => {
              console.log(res.data);
                 this.musicfilename=inputDOM.files[0].name
              this.$message.success("上传成功");
            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },
      insertHuDongApp(event) {
        let inputDOM = this.$refs.inputerHuDong;
        // 通过DOM取文件数据
        if (limitApk(inputDOM.files[0])) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("file", inputDOM.files[0]);
          formdata.append("appId", 3 + "")
          this.$axios
            .post("/api/hoInModule/uploadApp", formdata)
            .then(res => {
              console.log(res.data);
                 this.hudongfilename=inputDOM.files[0].name
              this.$message.success("上传成功");
            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },

      onChange(file) {
        this.picfile = file.raw;

      },
      onRemove(file) {
        this.picfile = null;
      },
      beforeUpload(file) {
        this.upPicFile = file;
      },
      updateModulePic() {
        if (limitImg(this.upPicFile)) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("file", this.upPicFile);
          formdata.append("moduleId", this.moEditForm.moduleId)
          this.$axios
            .post("/api/hoInModule/updateModulePic", formdata)
            .then(res => {
              console.log(res.data);
              this.moEditForm.imageUrl = this.serverIp + res.data.data.modulePic;
            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },

      inSubmit() {

        if (isEmpty(this.moform.moduleName)) {
          this.$message.error("请输入模块名称")
          return;
        }
        if (isEmpty(this.moform.typeId)) {
          this.$message.error("请选择类型")
          return;
        }
        if (this.picfile == null) {
          this.$message.error("请选择图标")
          return;
        }
        if (limitImg(this.picfile)) {
          var formdata = new FormData(); // 创建form对象
          formdata.append("file", this.picfile);
          formdata.append("appId", this.moform.appId)
          formdata.append("typeId", this.moform.typeId + "")
          formdata.append("moduleName", this.moform.moduleName)

          this.$axios
            .post("/api/hoInModule/uploadModule", formdata)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.moDialogFormVisible = false;
                this.$refs.upload.clearFiles()
                this.getModule();
              } else {
                this.$message.error(res.data.msg)
              }

            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },
      upSubmit() {
        if (isEmpty(this.moEditForm.moduleName)) {
          this.$message.error("请输入模块名称")
          return;
        }

        var formdata = new FormData(); // 创建form对象
        formdata.append("moduleId", this.moEditForm.moduleId)
        formdata.append("moduleName", this.moEditForm.moduleName)

        this.$axios
          .post("/api/hoInModule/editModule", formdata)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.moEditDialogFormVisible = false;
              this.getModule();
            } else {
              this.$message.error(res.data.msg)
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getModule() {
        this.tableData = [];
        this.sortModule = [];
        this.$axios
          .get("/api/hoInModule/getModule")
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tableData.push({
                "moduleId": res.data.data[i].id,
                "moduleName": res.data.data[i].moduleName,
                "typeName": res.data.data[i].typeName,
                "appName": res.data.data[i].appName,
                "typeId": res.data.data[i].typeId + "",
                "modulePic": this.serverIp+ res.data.data[i].modulePic
              })
              this.sortModule.push({
                "id": res.data.data[i].id,
                "moduleName": res.data.data[i].moduleName,
              });
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      openAppDialog() {
        this.appDialogFormVisible = true;
        this.getApp();
      },
      getApp() {
        this.$axios
          .get("/api/hoInModule/getApp")
          .then(res => {
            console.log(res.data);
            this.appform.appDianBoName = res.data.data[0].appName;
            this.appform.appMusicName = res.data.data[1].appName;
            this.appform.appHuDongName = res.data.data[2].appName;
            this.dianbofilename=res.data.data[0].fileName;
             this.musicfilename=res.data.data[1].fileName;
              this.hudongfilename=res.data.data[2].fileName;
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      sortModuleNum() {
        this.$axios
          .post("/api/hoInModule/sortModule", this.sortModule)
          .then(res => {
            console.log(res.data);
            this.sortDialogFormVisible = false
            this.getModule();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handModuleDelete(index, row) {
        let data = {
          "moduleId": row.moduleId
        }
        this.$axios
          .post("/api/hoInModule/deleteModule", data)
          .then(res => {
            console.log(res.data);
            this.getModule();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handModuleEidt(index, row) {
        this.moEditFileList = [],
          this.moEditForm.moduleName = row.moduleName;
        this.moEditForm.typeId = row.typeId + "";
        this.moEditForm.moduleId = row.moduleId + "",
          this.moEditForm.imageUrl = row.modulePic,
          this.moEditDialogFormVisible = true;
      }
    },

    created() {
      this.getModule();
    }
  }

</script>

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
