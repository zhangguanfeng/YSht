<template>

  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>组播源列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">

      <el-button type="primary" @click="insertType">添加类别</el-button>
      <el-button type="primary" @click="typeManager">类别管理</el-button>
      <div style="display:inline-block;width:200px">
        <el-input v-model="channelLikeName" placeholder="请输入频道名称"></el-input>
      </div>

      <el-button type="primary" @click="searchChannel">搜索</el-button>
      <div style=" height:20px"></div>
      <el-tabs type="card" @tab-click="handleTagClick" v-model="currentTagName" v-show="typeId!=0">
        <el-tab-pane v-for="item in tags" :key="item.id" :label="item.name" :name="item.name">
          <el-button type="primary" @click="handleInsertChannel">添加频道</el-button>
        </el-tab-pane>
      </el-tabs>

      <el-table :data="tableData5" style="width: 100%;font-size: 20px" ref="refTable" @expand-change="toggleRowExpansion"
        :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table class="demo-table-expand" :data="scope.row.hoSysChannelGroupUrlList" border style="width: 100% "
              :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">
              <el-table-column prop="groupUrl" label="组播地址">
              </el-table-column>
              <el-table-column prop="telecomId" label="电信ID">
              </el-table-column>
              <el-table-column prop="mes" label="备注信息">
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button size="small" type="primary" @click="handleUpdateUrl(scope.$index,scope.row)">修改
                  </el-button>
                  <el-button size="small" type="danger" @click="handleDeleteUrl(scope.$index,scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column align="center" label="频道名称" prop="channelName">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="handleInsertUrl(scope.$index,scope.row)">添加地址
            </el-button>
            <el-button size="small" type="primary" @click="handleUpdateChannel(scope.$index,scope.row)">修改
            </el-button>
            <el-button size="small" type="danger" @click="handleDeleteChannel(scope.$index,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagecontainer" v-show="typeId!=-1">
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[15]" layout="total, sizes, prev, pager, next, jumper"
          :total=dataSize>
        </el-pagination>
      </div>
      <el-dialog title="添加地址" :visible.sync="inUrlDialogVisible">
        <el-form :model="inUrlform" ref="inUrlform">
          <el-form-item label="频道名称" :label-width="formLabelWidth">
            <el-input v-model="inUrlform.channelName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="组播地址" :label-width="formLabelWidth">
            <el-input v-model="inUrlform.groupUrl" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电信ID" :label-width="formLabelWidth">
            <el-input v-model="inUrlform.telecomId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="地址备注" :label-width="formLabelWidth">
            <el-input v-model="inUrlform.mes" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="inUrlSubmit">确 定</el-button>
          <el-button @click="inUrlDialogVisible = false">取 消</el-button>
        </div>
      </el-dialog>

      <el-dialog title="修改地址" :visible.sync="upUrlDialogVisible">
        <el-form :model="upUrlform" ref="inUrlform">
          <el-form-item label="频道名称" :label-width="formLabelWidth">
            <el-input v-model="upUrlform.channelName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="组播地址" :label-width="formLabelWidth">
            <el-input v-model="upUrlform.groupUrl" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电信ID" :label-width="formLabelWidth">
            <el-input v-model="upUrlform.telecomId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="地址备注" :label-width="formLabelWidth">
            <el-input v-model="upUrlform.mes" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="upUrlSubmit">确 定</el-button>
          <el-button @click="upUrlDialogVisible = false">取 消</el-button>
        </div>
      </el-dialog>


      <!-- 类别管理 -->
      <el-dialog title="类别列表" :visible.sync="typeDialogFormVisible">

        <el-table :data="typeTableData" style="width: 100%">
          <el-table-column label="类别名称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.typeName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleTypeEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" @click="handleTypedelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    isEmpty,
    isNumber
  } from '../../../static/js/util.js'
  export default {
    //写上name参数会被缓存
    name: "admsyschannelgroup",
    data() {
      return {
        inUrlDialogVisible: false,
        upUrlDialogVisible: false,
        typeDialogFormVisible: false,
        typeTableData: [],
        formLabelWidth: "150px",
        inUrlform: {},
        upUrlform: {},
        typeId: -1,
        currentTagName: "",
        tags: [],
        tableData5: [],
        expands: [],
        curChildIndex: "",
        curChildId: "",
        curParentIndex: "",
        curChildId: "",
        getRowKeys(row) {
          console.log(row.id + "//")
          return row.id;
        },
        currentPage: 1,
        dataSize: 0,
        channelLikeName: "",
      }
    },
    methods: {
      searchChannel() {
        if (isEmpty(this.channelLikeName)) {
          this.currentPage = 1;
          this.getType()
          return;
        }
        this.currentPage = 1;
        this.typeId = 0 + ""
        console.log(this.typeId == 0)
        this.getChannel()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getChannel()
      },
      handleTypeEdit(index, row) {
        this.$prompt('请输入类别名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: row.typeName,
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {

          let data = {
            typeName: value,
            typeId: row.id + ""
          }
          this.$axios
            .post("/api/hoSysChannelGroupType/updateType", data)
            .then(res => {
              this.$message.success("修改成功")

              this.getType();
            }).catch((err) => {
              console.log(err + "错误");
            });

        }).catch(() => {

        });
      },
      handleTypedelete(index, row) {

        let data = {
          typeId: row.id + ""
        }
        this.$axios
          .post("/api/hoSysChannelGroupType/deleteType", data)
          .then(res => {
            this.$message.success("删除成功")

            this.getType();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      typeManager() {
        this.typeDialogFormVisible = true;
      },
      insertType() {
        this.$prompt('请输入类别名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {

          let data = {
            typeName: value,

          }
          this.$axios
            .post("/api/hoSysChannelGroupType/insertType", data)
            .then(res => {
              this.$message.success("添加成功")

              this.getType();

            }).catch((err) => {
              console.log(err + "错误");
            });

        }).catch(() => {

        });
      },
      handleInsertChannel() {
        this.$prompt('请输入频道名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {

          let data = {
            channelName: value,
            typeId: this.typeId + ""
          }
          this.$axios
            .post("/api/hoSysChannelGroupChannel/insertChannel", data)
            .then(res => {
              if (res.data.code == 0) {
                if (this.tableData5.length == 15) {
                  this.currentPage++;
                  this.getChannel()
                } else {
                  this.tableData5.push(res.data.data)
                }

                this.dataSize++
                this.$message.success("添加成功");
              } else {
                this.$message.error(res.data.msg)
              }

            }).catch((err) => {
              console.log(err + "错误");
            });

        }).catch(() => {

        });
      },
      handleUpdateChannel(index, row) {
        this.$prompt('请输入频道名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: row.channelName,
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {

          let data = {
            channelName: value,
            channelId: row.id + ""
          }
          this.$axios
            .post("/api/hoSysChannelGroupChannel/updateChannel", data)
            .then(res => {
              if (res.data.code == 0) {
                console.log(res.data);
                this.tableData5[index].channelName = value;
                this.$message.success("修改成功");
              } else {
                this.$message.error(res.data.msg)
              }

            }).catch((err) => {
              console.log(err + "错误");
            });

        }).catch(() => {

        });
      },
      handleDeleteChannel(index, row) {
        let data = {
          channelId: row.id + ""
        }
        this.$axios
          .post("/api/hoSysChannelGroupChannel/deleteChannel", data)
          .then(res => {
            console.log(res.data);
            if (this.tableData5.length == 1) {
              this.currentPage--;
              console.log(this.currentPage)
              this.getChannel()
            } else {
              this.tableData5.splice(index, 1)
            }

            this.dataSize--
            this.$message.success("删除成功");
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleDeleteUrl(index, row) {
        let data = {
          urlId: row.id + "",
        }
        this.$axios
          .post("/api/hoSysChannelGroupUrl/deleteUrl", data)
          .then(res => {
            if (res.data.code == 0) {
              this.tableData5[this.curParentIndex].hoSysChannelGroupUrlList.splice(index, 1)
              this.$message.success("删除成功")

            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleInsertUrl(index, row) {
        this.inUrlform.groupUrl = ""
        this.inUrlform.mes = ""
        this.inUrlform.telecomId = ""
        this.inUrlform.channelName = row.channelName
        this.curParentIndex = index
        this.inUrlDialogVisible = true
      },
      handleUpdateUrl(index, row) {
        this.curChildIndex = index
        this.upUrlDialogVisible = true
        this.upUrlform.channelName = this.tableData5[this.curParentIndex].channelName
        this.upUrlform.groupUrl = row.groupUrl
        this.upUrlform.mes = row.mes
        this.upUrlform.channelId = row.channelId
        this.upUrlform.telecomId = row.telecomId
        this.upUrlform.id = row.id
      },
      upUrlSubmit() {
        if (!isEmpty(this.upUrlform.telecomId) && !isNumber(this.upUrlform.telecomId)) {
          this.$message.error("电信ID请输入数字")
          return;
        }
        if (isEmpty(this.upUrlform.groupUrl)) {
          this.$message.error("请输入组播地址")
          return;
        }
        if (isEmpty(this.upUrlform.telecomId)) {
          this.upUrlform.telecomId = 0;
        }
        let data = {
          urlId: this.upUrlform.id + "",
          groupUrl: this.upUrlform.groupUrl,
          mes: this.upUrlform.mes,
          telecomId: this.upUrlform.telecomId + "",
        }
        this.$axios
          .post("/api/hoSysChannelGroupUrl/updateUrl", data)
          .then(res => {
            if (res.data.code == 0) {
              this.tableData5[this.curParentIndex].hoSysChannelGroupUrlList.splice(this.curChildIndex, 1, res.data.data)
              this.$message.success("修改成功")
              this.upUrlDialogVisible = false
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      inUrlSubmit() {

        if (!isEmpty(this.inUrlform.telecomId) && !isNumber(this.inUrlform.telecomId)) {
          this.$message.error("电信ID请输入数字")
          return;
        }
        if (isEmpty(this.inUrlform.groupUrl)) {
          this.$message.error("请输入组播地址")
          return;
        }
        if (isEmpty(this.inUrlform.telecomId)) {
          this.inUrlform.telecomId = 0;
        }
        let data = {
          channelId: this.tableData5[this.curParentIndex].id + "",
          mes: this.inUrlform.mes,
          groupUrl: this.inUrlform.groupUrl,
          telecomId: this.inUrlform.telecomId + "",
        }
        this.$axios
          .post("/api/hoSysChannelGroupUrl/insertUrl", data)
          .then(res => {
            if (res.data.code == 0) {
              this.tableData5[this.curParentIndex].hoSysChannelGroupUrlList.push(res.data.data)
              this.$message.success("添加成功")
              this.inUrlDialogVisible = false
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      toggleRowExpansion(row, expandedRows) {
        this.curParentIndex = this.tableData5.indexOf(row);
        if (expandedRows.length > 1) {
          expandedRows.shift()
        }
      },
      handleTagClick(tab, event) {

        let data = this.tags.find(item => {
          return item.name == tab.name;
        })
        this.typeId = data.id;
        this.currentPage = 1;
        this.getChannel();
        console.log(this.typeId);
      },
      getType() {
        this.typeId = -1
        this.tableData5 = []
        this.$axios
          .get("/api/hoSysChannelGroupType/getType")
          .then(res => {
            if (res.data.code == 0) {

              this.tags = []
              this.currentTagName = ""
              this.typeTableData = res.data.data
              for (var i = 0; i < res.data.data.length; i++) {
                this.tags.push({
                  id: res.data.data[i].id,
                  name: res.data.data[i].typeName
                })
              }
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getChannel() {
        this.tableData5 = []
        this.$axios
          .get("/api/hoSysChannelGroupType/getChannel", {
            params: {
              curPage: this.currentPage,
              typeId: this.typeId + "",
              channelLikeName: this.channelLikeName + ""
            }
          })
          .then(res => {
            console.log(res.data)
            this.dataSize = res.data.dataSize
            this.tableData5 = res.data.data;
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      //  clickTable(row,index,e){
      //       this.expands = [];
      //       this.expands.push(row.id);
      // }
    },

    created() {
      this.getType()
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

</style>
