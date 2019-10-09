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
        <el-button type="primary" @click="openCreateFollowerDialog()">创建业务人</el-button>
        <el-button type="primary" @click="openCreateProjectDialog()">创建项目</el-button>
        <el-button type="primary" @click="openListFollowerDialog()">业务人列表</el-button>
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

        <el-table-column label="操作" align="center" width="450px">
          <template slot-scope="scope">
            <!-- <el-button type="primary">续点</el-button> -->
            <el-button size="mini" type="primary" @click="handleEditDialog(scope.$index, scope.row)"
              v-if="scope.row.projectStatusNum==1">编辑</el-button>
            <el-button size="mini" type="primary" @click=" handleProjectMesDialog(scope.$index, scope.row)">跟进信息
            </el-button>
            <el-button size="mini" type="primary" @click="uploadProjectMesDialog(scope.$index, scope.row)"
              v-if="scope.row.projectStatusNum==1">上传跟进
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
      <!-- 创建账号 -->
      <el-dialog title=" 创建账号" :visible.sync="createFollowerDialogFormVisible">

        <el-form :model="followerform" ref="followerform">
          <el-form-item label="用户名称" :label-width="formLabelWidth">
            <el-input v-model="followerform.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" :label-width="formLabelWidth">
            <el-input v-model="followerform.password" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createFollower">确定</el-button>
          <el-button @click="createFollowerDialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>

      <!--业务人列表 -->
      <el-dialog title=" 业务人列表" :visible.sync="followerListDialogFormVisible">

        <el-table :data="tableFollowerData" stripe style="width: 100%"
          :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">

          <el-table-column label="账号名称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column label="账号密码" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.password }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="followerListDialogFormVisible = false">确定</el-button>
          <el-button @click="followerListDialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>
      <!--创建项目 -->
      <el-dialog title=" 创建项目" :visible.sync="createProjectDialogFormVisible">

        <el-form :model=" projectform" ref=" projectform">
          <el-form-item label="项目名称" :label-width="formLabelWidth">
            <el-input v-model="projectform.projectName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="项目类别" :label-width="formLabelWidth">
            <el-radio v-model="projectform.projectType" label="0">营业中</el-radio>
            <el-radio v-model="projectform.projectType" label="1">装修中</el-radio>
          </el-form-item>
          <el-form-item label="项目星级" :label-width="formLabelWidth">
            <el-rate v-model="projectform.projectLevel"></el-rate>
          </el-form-item>
          <el-form-item label="项目区域" :label-width="formLabelWidth">
            <el-cascader :options="options" v-model="projectform.area" filterable>
            </el-cascader>
          </el-form-item>
          <el-form-item label="项目地址" :label-width="formLabelWidth">
            <el-input v-model="projectform.projectAddr" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="房间数" :label-width="formLabelWidth">
            <el-input v-model="projectform.roomTotal" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人一姓名" :label-width="formLabelWidth">
            <el-input v-model="projectform.oneName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人一职位" :label-width="formLabelWidth">
            <el-input v-model="projectform.oneRole" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人一电话" :label-width="formLabelWidth">
            <el-input v-model="projectform.onePhone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人二姓名" :label-width="formLabelWidth">
            <el-input v-model="projectform.twoName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人二职位" :label-width="formLabelWidth">
            <el-input v-model="projectform.twoRole" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人二电话" :label-width="formLabelWidth">
            <el-input v-model="projectform.twoPhone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人三姓名" :label-width="formLabelWidth">
            <el-input v-model="projectform.threeName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人三职位" :label-width="formLabelWidth">
            <el-input v-model="projectform.threeRole" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人三电话" :label-width="formLabelWidth">
            <el-input v-model="projectform.threePhone" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createProject()">确定</el-button>
          <el-button @click="createProjectDialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>


      <!--编辑项目 -->
      <el-dialog title=" 更新项目" :visible.sync="updateProjectDialogFormVisible">

        <el-form :model="updateProjectForm" ref=" updateProjectForm">

          <el-form-item label="联系人一姓名" :label-width="formLabelWidth">
            <el-input v-model="updateProjectForm.oneName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人一职位" :label-width="formLabelWidth">
            <el-input v-model="updateProjectForm.oneRole" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人一电话" :label-width="formLabelWidth">
            <el-input v-model="updateProjectForm.onePhone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人二姓名" :label-width="formLabelWidth">
            <el-input v-model="updateProjectForm.twoName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人二职位" :label-width="formLabelWidth">
            <el-input v-model="updateProjectForm.twoRole" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人二电话" :label-width="formLabelWidth">
            <el-input v-model="updateProjectForm.twoPhone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人三姓名" :label-width="formLabelWidth">
            <el-input v-model="updateProjectForm.threeName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人三职位" :label-width="formLabelWidth">
            <el-input v-model="updateProjectForm.threeRole" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人三电话" :label-width="formLabelWidth">
            <el-input v-model="updateProjectForm.threePhone" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateProject()">确定</el-button>
          <el-button @click="updateProjectDialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>

      <!--上传报表 -->
      <el-dialog title=" 上传报表" :visible.sync="updateFollowDialogFormVisible">

        <el-form :model="updateFollowForm" ref=" updateProjectForm">

          <el-form-item label="报备信息" :label-width="formLabelWidth">

            <el-input type="textarea" :rows="6" v-model="updateFollowForm.followMes" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="报备图片" :label-width="formLabelWidth">
            <el-upload action="#" list-type="picture-card" :auto-upload="false" :on-change="imgChange">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="uploadFollow()">确定</el-button>
          <el-button @click="updateFollowDialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>

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
          <el-button type="primary" @click="giveUpFollw()" v-if="projectStatusNum==1">放弃跟进</el-button>
          <el-button type="primary" @click="followProject()" v-if="projectStatusNum==2">我来跟进</el-button>
          <el-button type="primary" @click="finishFollw()" v-if="projectStatusNum==1">结束跟进</el-button>
          <el-button @click="followDialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>


      <!--方案列表 -->
      <el-dialog title="方案列表" :visible.sync="planListDialogFormVisible">
        <el-button type="primary" @click="choosePlan">上传方案</el-button>
        <input type="file" class="upload" ref="plan" @change="uploadPlan" id="planId" style="display: none;" />
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
    isEmpty,
    strLength,
    limitImg,
    limitFile
  } from '../../../static/js/util.js'
  export default {
    //写上name参数会被缓存
    name: "ageproject",
    data() {
      return {
        selectedOptions3: [],
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
          area: []
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
      downloadPlan(index, row) {
        window.open(this.serverIp + row.url)
      },
      choosePlan() {
        document.getElementById("planId").value = null
        document.getElementById("planId").click();
      },
      uploadPlan() {
        let inputDOM = this.$refs.plan;
        if (limitFile(inputDOM.files[0])) {
          console.log(1)
          var formdata = new FormData(); // 创建form对象
          formdata.append("projectId", this.projectId + "")
          formdata.append("file", inputDOM.files[0])
          this.$axios
            .post("/api/hoProject/insertProjectPlan", formdata)
            .then(res => {
              console.log(res.data);
              this.$message.success("上传成功");
              this.getPlan();

            }).catch((err) => {
              console.log(err + "错误");
            });
        } else {
          console.log(2)
        }


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
      giveUpFollw() {
        this.$confirm('此操作将会暴露所有信息给其他人进行跟进, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            projectId: this.projectId + ""
          }
          this.$axios
            .post("/api/hoProject/giveUpFollow", data)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.followDialogFormVisible = false,
                  this.$message.success("提交成功")
                this.getProject()
              }

            }).catch((err) => {
              console.log(err + "错误");
            });
        }).catch(() => {

        });

      },
      followProject() {
        let data = {
          projectId: this.projectId + "",
          agentId: sessionStorage.agentId + "",
          followerId: sessionStorage.agentId + "",
        }
        this.$axios
          .post("/api/hoProject/followProject", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.followDialogFormVisible = false,
                this.$message.success("提交成功")
              this.getProject()
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      finishFollw() {
        this.$confirm('此操作会提交资料进行最后审核验收, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            projectId: this.projectId + "",
          }
          this.$axios
            .post("/api/hoProject/finishFollw", data)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.followDialogFormVisible = false,
                  this.$message.success("提交成功")
                this.getProject()
              }

            }).catch((err) => {
              console.log(err + "错误");
            });
        }).catch(() => {

        });


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

        if (limitImg(file.raw)) {

        } else {
          this.fileList.pop()
          console.log(fileList)
        }
      },
      uploadProjectMesDialog(index, row) {
        this.updateFollowDialogFormVisible = true
        this.projectId = row.id
      },
      uploadFollow() {
        if (isEmpty(this.updateFollowForm.followMes)) {
          this.$message.error("请填写跟进信息")
          return
        }
        if (this.fileList.length == 0) {
          this.$message.error("请上传图片")
          return
        }

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
                this.$message.success("上传成功,下次跟进截止时间将会延长")
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      updateProject() {
        let data = {
          projectId: this.projectId + "",
          oneName: this.updateProjectForm.oneName,
          onePhone: this.updateProjectForm.onePhone,
          oneRole: this.updateProjectForm.oneRole,
          twoName: this.updateProjectForm.twoName,
          twoPhone: this.updateProjectForm.twoPhone,
          twoRole: this.updateProjectForm.twoRole,
          threeName: this.updateProjectForm.threeName,
          threePhone: this.updateProjectForm.threePhone,
          threeRole: this.updateProjectForm.threeRole,
        }
        this.$axios
          .post("/api/hoProject/updateProject", data)
          .then(res => {
            if (res.data.code == 0) {
              this.$message.success("修改成功")
              this.updateProjectDialogFormVisible = false,
                this.getProject()
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleEditDialog(index, row) {
        this.projectId = row.id
        this.updateProjectDialogFormVisible = true
        this.$axios
          .get("/api/hoProject/getProjectById/" + this.projectId)
          .then(res => {
            if (res.data.code == 0) {
              this.updateProjectForm.oneName = res.data.data.oneName,
                this.updateProjectForm.oneRole = res.data.data.oneRole,
                this.updateProjectForm.onePhone = res.data.data.onePhone,
                this.updateProjectForm.twoName = res.data.data.twoName,
                this.updateProjectForm.twoRole = res.data.data.twoRole,
                this.updateProjectForm.twoPhone = res.data.data.twoPhone,
                this.updateProjectForm.threeName = res.data.data.threeName,
                this.updateProjectForm.threeRole = res.data.data.threeRole,
                this.updateProjectForm.threePhone = res.data.data.threePhone
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      createProject() {

        if (isEmpty(this.projectform.projectName)) {
          this.$message.error("请输入项目名称")
          return
        }
        if (isEmpty(this.projectform.projectType)) {
          this.$message.error("请选择项目类别")
          return
        }

        if (this.projectform.area.length == 0) {
          this.$message.error("请选择区域")
          return
        }
        if (isEmpty(this.projectform.roomTotal)) {
          this.$message.error("请输入房数")
          return
        }
        if (isEmpty(this.projectform.projectAddr)) {
          this.$message.error("请输入地址")
          return
        }
        let data = {
          agentId: sessionStorage.agentId + "",

          followerId: sessionStorage.agentId + "",

          projectName: this.projectform.projectName,
          projectType: this.projectform.projectType + "",
          projectLevel: this.projectform.projectLevel + "",
          area: this.projectform.area,
          roomTotal: this.projectform.roomTotal,
          projectAddr: this.projectform.projectAddr,
          oneName: this.projectform.oneName,
          onePhone: this.projectform.onePhone,
          oneRole: this.projectform.oneRole,
          twoName: this.projectform.twoName,
          twoPhone: this.projectform.twoPhone,
          twoRole: this.projectform.twoRole,
          threeName: this.projectform.threeName,
          threePhone: this.projectform.threePhone,
          threeRole: this.projectform.threeRole
        }
        this.$confirm('一旦编写不可以再修改项目信息，除了联系人信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios
            .post("/api/hoProject/insertProject", data)
            .then(res => {
              if (res.data.code == 0) {
                this.createProjectDialogFormVisible = false
                this.$message.success("创建成功")
                this.getProject()
              } else {
                this.$message.error(res.data.msg)
              }
            }).catch((err) => {
              console.log(err + "错误");
            });
        }).catch(() => {

        });

      },
      openCreateProjectDialog() {
        this.createProjectDialogFormVisible = true
      },
      openListFollowerDialog() {
        this.tableFollowerData = []
        this.followerListDialogFormVisible = true
        let data = {
          agentId: sessionStorage.agentId + "",
        }
        this.$axios
          .post("/api/hoProject/getFollowers", data)
          .then(res => {
            if (res.data.code == 0) {
              this.tableFollowerData = res.data.data
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      createFollower() {
        if (strLength(this.followerform.username) < 6) {
          this.$message.error("账号不少于6位")
          return
        }
        if (strLength(this.followerform.password) < 6) {
          this.$message.error("密码不少于6位")
          return
        }
        let data = {
          agentId: sessionStorage.agentId + "",
          username: this.followerform.username,
          password: this.followerform.password,
        }
        this.$axios
          .post("/api/hoProject/insertFollower", data)
          .then(res => {
            if (res.data.code == 0) {
              this.createFollowerDialogFormVisible = false
              this.$message.success("创建成功")
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      openCreateFollowerDialog() {
        this.createFollowerDialogFormVisible = true
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getProject()
      },
      getProject() {
        this.tableProjectData = [];
        this.$axios
          .get("/api/hoProject/getProject", {
            params: {
              curPage: this.currentPage,
              agentId: sessionStorage.agentId + "",
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
      this.selectedOptions3.push("1")
      this.selectedOptions3.push("1")
      this.selectedOptions3.push("1")
      console.log(this.selectedOptions3);
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
