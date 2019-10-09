<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>酒店管理员列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-row>

        <div style="display:inline-block;width:200px">
          <el-input v-model="hotelLikeName" placeholder="请输入酒店名称"></el-input>
        </div>

        <el-button type="primary" @click="searchHotel">搜索</el-button>
      </el-row>
      <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">

        <el-table-column label="前台账号" align="center" >
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="前台密码"  align="center">
          <template slot-scope="scope">
            <span>{{scope.row.password}}</span>
          </template>
        </el-table-column>
        <el-table-column label="酒店名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.hotelName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="酒店地址" align="center" >
          <template slot-scope="scope">
            <span>{{ scope.row.hotelArea }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 修改账号 -->
      <el-dialog title="修改账号" :visible.sync="upDialogFormVisible">

        <el-form :model="upform" ref="upform">
          <el-form-item label="用户名称" :label-width="formLabelWidth">
            <el-input v-model="upform.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" :label-width="formLabelWidth">
            <el-input v-model="upform.password" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateUser">确定</el-button>
          <el-button @click="upDialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>
      <div class="pagecontainer">
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[15]" layout="total, sizes, prev, pager, next, jumper"
          :total=dataSize>
        </el-pagination>
      </div>
    </div>
  </div>


</template>

<script>
  import {
    isEmpty
  } from '../../../static/js/util.js'
  export default {

    //写上name参数会被缓存
    name: "agehotelfront",
    data() {

      return {
  

        upDialogFormVisible: false,
        formLabelWidth: "150px",
        tableData: [],
  
        hotelLikeName: "",
        agentId: sessionStorage.agentId+"",
        currentPage: 1,
        dataSize: 1,
        upform: {
          userId: "",
          username: "",
          password: ""
        }
      }
    },

    methods: {
      searchHotel() {
        this.currentPage = 1;
        this.getHotel();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getHotel();
      },

      handleEdit(index, row) {
        this.upform.userId = row.userId,
          this.upform.username = row.username,
          this.upform.password = row.password,
          this.upDialogFormVisible = true
      },
      updateUser() {
        let data={
          userId:this.upform.userId+"",
          username:this.upform.username,
          password:this.upform.password
        }
        this.$axios
          .post("/api/houser/changeFrontUser", data)
          .then(res => {
            console.log(res.data);
            if(res.data.code==0){
              this.upDialogFormVisible=false
              this.getHotel()
            }else{
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getHotel() {
        this.tableData = [];
        this.$axios
          .get("/api/houser/getFrontUser", {
            params: {
              curPage: this.currentPage,
              agentId: this.agentId + "",
              hotelLikeName: this.hotelLikeName
            }
          })
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tableData.push({
                username: res.data.data[i].username,
                password: res.data.data[i].password,
                hotelArea: res.data.data[i].hotelArea,
                hotelName: res.data.data[i].hotelName,
                userId: res.data.data[i].id

              })
            }
            this.dataSize = res.data.dataSize
          }).catch((err) => {
            console.log(err + "错误");
          });

      },
    
    },

    created() {
    
      this.getHotel();
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
