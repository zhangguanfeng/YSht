<template>

  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>项目跟进管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-row>
        <div style="display:inline-block;width:200px">
          <el-input v-model="projectLikeName" placeholder="请输入项目名称"></el-input>
        </div>
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in statusoptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" @click="searchProject()">搜索</el-button>
      </el-row>
      <el-table :data="tableProjectData" stripe style="width: 100%"
        :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="联系人一姓名">
                <span>{{ props.row.oneName }}</span>
              </el-form-item>
              <el-form-item label="联系人一职业">
                <span>{{ props.row.oneRole }}</span>
              </el-form-item>
              <el-form-item label="联系人一电话">
                <span>{{ props.row.onePhone }}</span>
              </el-form-item>
              <el-form-item label="联系人二姓名">
                <span>{{ props.row.twoName }}</span>
              </el-form-item>
              <el-form-item label="联系人二职业">
                <span>{{ props.row.twoRole }}</span>
              </el-form-item>
              <el-form-item label="联系人二电话">
                <span>{{ props.row.twoPhone }}</span>
              </el-form-item>
              <el-form-item label="联系人三姓名">
                <span>{{ props.row.threeName }}</span>
              </el-form-item>
              <el-form-item label="联系人三职业">
                <span>{{ props.row.threeRole }}</span>
              </el-form-item>
              <el-form-item label="联系人三电话">
                <span>{{ props.row.threePhone }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="项目名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.projectName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目地址" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.projectAddr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目类别" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.projectType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目星级" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.projectLevel}}</span>
          </template>
        </el-table-column>
        <el-table-column label="房间数" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.roomTotal}}</span>
          </template>
        </el-table-column>
        <el-table-column label="跟进次数" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.followTotal}}</span>
          </template>
        </el-table-column>
        <el-table-column label="代理商" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.agentName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="跟进人" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.followerName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="跟进截止时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.followTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.finishTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="跟进状态" align="center">
          <template slot-scope="scope">
            <el-button type="primary" disabled v-if="scope.row.projectStatusNum==1">{{scope.row.projectStatus}}
            </el-button>
            <el-button type="success" disabled v-if="scope.row.projectStatusNum==4">{{scope.row.projectStatus}}
            </el-button>
            <el-button type="danger" disabled v-if="scope.row.projectStatusNum==2">{{scope.row.projectStatus}}
            </el-button>
            <el-button type="warning" disabled v-if="scope.row.projectStatusNum==3">{{scope.row.projectStatus}}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="350px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" v-if="scope.row.projectStatusNum==3"
              @click="handleCheck(scope.$index, scope.row)">通过审核
            </el-button>
            <el-button size="mini" type="primary" @click=" handleProjectMesDialog(scope.$index, scope.row)">跟进信息
            </el-button>
            <el-button size="mini" type="primary" @click="handlePlanDialog(scope.$index,scope.row)">
              方案列表--{{scope.row.planNum}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagecontainer">
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[15]"
          layout="total, sizes, prev, pager, next, jumper" :total=dataSize>
        </el-pagination>
      </div>


      <!--报备信息 -->
      <el-dialog title=" 报备信息" :visible.sync="followDialogFormVisible" center>
        <div class="block">
          <el-timeline>
            <el-timeline-item :timestamp="followDetail.createTime" placement="top"
              v-for="(followDetail, index) in followDetails" :key="index">
              <el-card>
                <h4>{{followDetail.followMes}}</h4>
                <el-upload action="#" list-type="picture-card" :auto-upload="false" :file-list="followDetail.imgList"
                  :class="{hide:hideUpload}">
                  <i slot="default" class="el-icon-plus"></i>
                  <div slot="file" slot-scope="{file}">
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                    <span class="el-upload-list__item-actions">
                      <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                        <i class="el-icon-zoom-in"></i>
                      </span>
                    </span>
                  </div>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </el-card>
            </el-timeline-item>

          </el-timeline>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="checkFinishFollow()" v-if="projectStatusNum==3" type="primary">通过</el-button>
          <el-button @click="followDialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>



      <!--方案列表 -->
      <el-dialog title="方案列表" :visible.sync="planListDialogFormVisible">

        <el-table :data="tablePlanData" stripe style="width: 100%"
          :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">

          <el-table-column label="文件名称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.fileName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="downloadPlan(scope.$index, scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="planListDialogFormVisible = false">确定</el-button>
          <el-button @click="planListDialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script>
  import {
    area
  } from "../../../static/js/area.js"
  import {
    isEmpty
  } from '../../../static/js/util.js'
  export default {
    //写上name参数会被缓存
    name: "admproject",
    data() {
      return {
        serverIp: this.$store.state.serverIp,
        statusoptions: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '跟进中'
        }, {
          value: '2',
          label: '未跟进'
        }, {
          value: '3',
          label: '结束审核中'
        }, {
          value: '4',
          label: '完成'
        }],
        projectLikeName: "",
        currentPage: 1,
        dataSize: 1,
        tableProjectData: [],
        value: "0",
        createFollowerDialogFormVisible: false,
        followerform: {
          username: "",
          password: ""
        },
        followerListDialogFormVisible: false,
        createProjectDialogFormVisible: false,
        updateProjectDialogFormVisible: false,
        updateFollowDialogFormVisible: false,
        followDialogFormVisible: false,
        tableFollowerData: [],
        projectform: {

        },
        options: area,
        formLabelWidth: "120px",
        projectId: "",
        updateProjectForm: {
          oneName: "",
          onePhone: "",
          oneRole: "",
          twoName: "",
          twoPhone: "",
          twoRole: "",
          threeName: "",
          threePhone: "",
          threeRole: ""
        },
        updateFollowForm: {
          followMes: ""
        },
        fileList: [],
        followDetails: [],
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        hideUpload: true,
        projectStatusNum: "",
        tablePlanData: [],
        planListDialogFormVisible: false
      }
    },
    methods: {
      handleCheck(index, row) {
        let data = {
          projectId: row.id + ""
        }
        this.$axios
          .post("/api/hoProject/checkProject", data)
          .then(res => {
            console.log(res.data);
            this.getProject()
            this.$message.success("提交成功")
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      downloadPlan(index, row) {
        window.open(this.serverIp + row.url)
      },
      getPlan() {
        this.tablePlanData = []
        this.$axios
          .get("/api/hoProject/getProjectPlan/" + this.projectId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tablePlanData.push({
                fileName: res.data.data[i].fileName,
                url: res.data.data[i].url,
                createTime: res.data.data[i].createTime
              })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handlePlanDialog(index, row) {
        this.planListDialogFormVisible = true
        this.projectId = row.id
        this.getPlan()
      },
      checkFinishFollow() {

      },

      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleProjectMesDialog(index, row) {

        this.projectId = row.id
        this.projectStatusNum = row.projectStatusNum
        this.followDialogFormVisible = true
        this.$axios
          .get("/api/hoProject/getFollowDetail/" + this.projectId)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              for (var i = 0; i < res.data.data.length; i++) {
                for (var j = 0; j < res.data.data[i].imgList.length; j++) {
                  res.data.data[i].imgList[j].url = this.serverIp + res.data.data[i].imgList[j].url
                }
              }
              this.followDetails = res.data.data
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      imgChange(file, fileList) {
        console.log(fileList)
        this.fileList = fileList
      },
      uploadProjectMesDialog(index, row) {
        this.updateFollowDialogFormVisible = true
        this.projectId = row.id
      },
      uploadFollow() {
        var formdata = new FormData(); // 创建form对象
        formdata.append("followId", this.projectId + "")
        for (var i = 0; i < this.fileList.length; i++) {
          formdata.append("file", this.fileList[i].raw)
        }

        formdata.append("followMes", this.updateFollowForm.followMes)
        this.$axios
          .post("/api/hoProject/uploadFollow", formdata)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.updateFollowDialogFormVisible = false,
                this.$message.success("上传成功")
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },



      openCreateProjectDialog() {
        this.createProjectDialogFormVisible = true
      },



      handleCurrentChange(val) {
        this.currentPage = val;
        this.getProject()
      },
      getProject() {
        this.tableProjectData = [];
        this.$axios
          .get("/api/hoProject/adm/getProject", {
            params: {
              curPage: this.currentPage,
              projectLikeName: this.projectLikeName,
              projectStatus: this.value + ""
            }
          })
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              let a = ""
              if (res.data.data[i].projectStatus == 1) {
                a = "跟进中"
              } else if (res.data.data[i].projectStatus == 2) {
                a = "未根进"
              } else if (res.data.data[i].projectStatus == 3) {
                a = "结束审核"
              } else if (res.data.data[i].projectStatus == 4) {
                a = "完成"
              }
              this.tableProjectData.push({
                id: res.data.data[i].id,
                projectName: res.data.data[i].projectName,
                projectAddr: res.data.data[i].proviceName + "/" + res.data.data[i].cityName + "/" + res.data
                  .data[i].areaName + "/" + res.data.data[i].projectAddr,
                projectType: res.data.data[i].projectType == 0 ? "营业中" : "装修中",
                projectLevel: res.data.data[i].projectLevel,
                roomTotal: res.data.data[i].roomTotal,
                followTotal: res.data.data[i].followTotal,
                followerName: res.data.data[i].followerName,
                agentName: res.data.data[i].agentName,
                createTime: res.data.data[i].createTime,
                followTime: res.data.data[i].followTime,
                finishTime: res.data.data[i].finishTime,
                projectStatus: a,
                oneName: res.data.data[i].oneName,
                onePhone: res.data.data[i].onePhone,
                oneRole: res.data.data[i].oneRole,
                twoName: res.data.data[i].twoName,
                twoPhone: res.data.data[i].twoPhone,
                twoRole: res.data.data[i].twoRole,
                threeName: res.data.data[i].threeName,
                threePhone: res.data.data[i].threePhone,
                threeRole: res.data.data[i].threeRole,
                projectStatusNum: res.data.data[i].projectStatus,
                planNum: res.data.data[i].planNum
              })
            }
            this.dataSize = res.data.dataSize
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      searchProject() {
        this.currentPage = 1;
        this.getProject()
      }
    },
    created() {
      this.getProject()
    }
  }

</script>

<style scoped>
  .pagecontainer {
    background-color: #fff;
    height: 80px;
    display: flex;
    justify-content: flex-end;
    align-content: center;
    align-items: center;
  }

  .el-pagination {
    display: flex;
    margin-right: 200px;

  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 90%;
  }

</style>
