<template>
  <div class="">

    <div class="">
      <!-- <span>酒店列表</span> -->
      <el-row>

        <el-button type="primary" @click="insertComment">添加评分主题</el-button>

      </el-row>
      <el-table :data="tableData" stripe style="width: 100%"
        :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">
        <el-table-column label="评分主题" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.commentTopic }}</span>
          </template>
        </el-table-column>
        <el-table-column label="评分描述" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.commentTotalMes }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="350px">
          <template slot-scope="scope">
            <!-- <el-button type="primary">续点</el-button> -->
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
            <el-button size="mini" type="primary" @click="handleResert(scope.$index, scope.row)">重置</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <!-- 类别管理 -->
    <el-dialog :title="title" :visible.sync="commentDetailDialogVisible">

      <el-table :data="listCommentData" style="width: 100%">
        <el-table-column label="房间号码" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.roomNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="评价时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="评价次数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.commentNum }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="评价状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.commentStatus }}</span>
          </template>
        </el-table-column>

      </el-table>
      <div class="pagecontainer">
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[15]"
          layout="total, sizes, prev, pager, next, jumper" :total=dataSize>
        </el-pagination>
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
    name: "appcomment",
    data() {
      return {
        serverIp: this.$store.state.serverIp,
        hotelId: sessionStorage.hotelId,
        tableData: [],
        commentDetailDialogVisible: false,
        title: "",
        listCommentData: [],
        currentPage: 1,
        dataSize: 15,
        commentId: "",
      }
    },
    methods: {
      insertComment() {
        this.$prompt('请输入评分主题', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',

          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {
          let data = {
            hotelId: this.hotelId + "",
            commentTopic: value
          }
          this.$axios
            .post("/api/hoAppComment/insertComment", data)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.$message.success("添加成功")
                this.getComment()
              }
            }).catch((err) => {
              console.log(err + "错误");
            });

        }).catch(() => {

        });
      },
      getComment() {
        this.tableData = []
        let data = {
          hotelId: this.hotelId + "",

        }
        this.$axios
          .post("/api/hoAppComment/getComment", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              for (var i = 0; i < res.data.data.length; i++) {
                this.tableData.push({
                  commentId: res.data.data[i].id,
                  commentTopic: res.data.data[i].commentTopic,
                  commentTotalMes: res.data.data[i].commentTotalMes
                })
              }
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleEdit(index, row) {
        this.$prompt('请输入评分主题', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: row.commentTopic + "",
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {
          let data = {
            commentId: row.commentId + "",
            commentTopic: value
          }
          this.$axios
            .post("/api/hoAppComment/updateComment", data)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {

                this.getComment()
              }
            }).catch((err) => {
              console.log(err + "错误");
            });

        }).catch(() => {

        });
      },
      handleDelete(index, row) {
        let data = {
          commentId: row.commentId + "",

        }
        this.$axios
          .post("/api/hoAppComment/deleteComment", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {

              this.getComment()
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleResert(index, row) {
        let data = {
          commentId: row.commentId + "",

        }
        this.$axios
          .post("/api/hoAppComment/resertComment", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {

              this.getComment()
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleDetail(index, row) {
        this.commentDetailDialogVisible = true
        this.title = row.commentTopic
        this.listCommentData = []
        this.currentPage = 1;
        this.commentId = row.commentId
        this.getCommentDetail()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getCommentDetail()
      },
      getCommentDetail() {
        this.listCommentData = []
        let data = {
          commentId: this.commentId + "",
          curPage: this.currentPage + ""
        }
        this.$axios
          .post("/api/hoAppComment/getCommentDetail", data)
          .then(res => {
            console.log(res.data);

            if (res.data.code == 0) {
              this.dataSize = res.data.dataSize
              for (var i = 0; i < res.data.data.length; i++) {
                var mes = ""
                if (res.data.data[i].commentStatus == 0) {
                  mes = "非常满意"
                } else if (res.data.data[i].commentStatus == 1) {
                  mes = "满意"
                } else if (res.data.data[i].commentStatus == 2) {
                  mes = "不满意"
                }
                this.listCommentData.push({
                  roomNum: res.data.data[i].roomNum,
                  commentStatus: mes,
                  date: res.data.data[i].date
                })
              }
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
    },

    created() {
      this.getComment()
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
