<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>服务配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">

      <el-row>
        <el-button type="primary" @click="inDialogFormVisible = true">添加服务</el-button>
      </el-row>
      <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">
        <el-table-column label="服务名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.service_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图标" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.picurl" style="width:70px;height:70px;" />
          </template>
        </el-table-column>
        <el-table-column label="App响应内容" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>姓名: {{ scope.row.app_mes }}</p>
              <p>住址: {{ scope.row.window_mes }}</p>
              <div slot="reference" class="name-wrapper">
                <span>{{ scope.row.app_mes }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="平台响应内容" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>姓名: {{ scope.row.app_mes }}</p>
              <p>住址: {{ scope.row.window_mes }}</p>
              <div slot="reference" class="name-wrapper">
                <span>{{ scope.row.window_mes }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>



      <!-- 添加对话框 -->
      <el-dialog title="添加服务" :visible.sync="inDialogFormVisible">
        <el-form :model="inform">
          <el-form-item label="服务名称" :label-width="formLabelWidth">
            <el-input v-model="inform.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="app信息" :label-width="formLabelWidth">
            <el-input type="textarea" :rows="4" v-model="inform.appmes" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="平台信息" :label-width="formLabelWidth">
            <el-input type="textarea" :rows="4" v-model="inform.windowmes" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="图标上传" :label-width="formLabelWidth">
            <el-upload action="" list-type="picture-card" ref="uploada" :limit="1" :name="inform.imgfilename"
              :file-list="fileList" :auto-upload="false" :on-change="imgChange" :on-remove="onRemove" :on-preview="handlePictureCardPreview">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="inform.imgDialogVisible" :append-to-body='true'>
              <img width="100%" :src="inform.imgDialogUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">

          <el-button type="primary" @click="inSubmit">确 定</el-button>
          <el-button @click="inDialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
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
    name: "admhotelservice",
    data() {
      return {
        serverIp:this.$store.state.serverIp,
        fileList: [],
        picfile: null,
        inDialogFormVisible: false,
        formLabelWidth: "120px",
        inform: {
          imgDialogUrl: "",
          imgDialogVisible: false,
          imgfilename: "file",
          name: "",
          appmes: '',
          windowmes: ""
        },
        tableData: []
      }
    },
    methods: {
      imgChange(file, fileList) {
        this.picfile = file.raw;
      },
      onRemove(file) {

      },
      handlePictureCardPreview() {

      },

      inSubmit() {
        if (this.picfile == null) {
          this.$message.error("请选择图标");
          return;
        }
        if (isEmpty(this.inform.name)) {
          this.$message.error("请输入服务名称");
          return;
        }
        if (isEmpty(this.inform.appmes)) {
          this.$message.error("请输入app确认信息");
          return;
        }
        if (isEmpty(this.inform.windowmes)) {
          this.$message.error("请输入前台确认信息");
          return;
        }
        if (limitImg(this.picfile)) {
          var formdata = new FormData(); // 创建form对象
          formdata.append('file', this.picfile);
          formdata.append("name", this.inform.name);
          formdata.append("appmes", this.inform.appmes);
          formdata.append("windowmes", this.inform.windowmes);
          this.$axios
            .post("/api/hoInService/submit", formdata)
            .then(res => {
              console.log(res.data);
              this.inDialogFormVisible = false;
              this.getService();
            }).catch((err) => {
              console.log(err + "错误");
            });
        }

      },
      getService() {
        this.tableData = [];
        this.$axios
          .get("/api/hoInService/getService")
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tableData.push({
                id: res.data.data[i].id,
                service_name: res.data.data[i].serviceName,
                app_mes: res.data.data[i].appMes,
                window_mes: res.data.data[i].windowMes,
                picurl: this.serverIp + res.data.data[i].picUrl
              });
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },

      deletePic(picid) {

      },
      handleEdit(index, row) {

      },
      handleDelete(index, row) {
        console.log(row.id);
        let data = {
          "id": row.id
        };
        this.$axios
          .post("/api/hoInService/delete", data)
          .then(res => {
            console.log(res.data);
            this.getService();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
    },

    created() {
      this.getService();
    }
  }

</script>

<style scoped>


</style>
