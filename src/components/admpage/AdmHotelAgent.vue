<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>代理商列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
    
    <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">
      <el-table-column label="代理账号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代理密码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代理姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代理别名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.otherName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属区域" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.area }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话号码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.telephone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">

          <el-button v-if="scope.row.status==0" size="mini" type="primary" @click="handleChaStatus(scope.$index, scope.row)">
            已审核
          </el-button>
          <el-button v-else size="mini" type="danger" @click="handleChaStatus(scope.$index, scope.row)">
            未审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </div>


</template>

<script>
  export default {
    //写上name参数会被缓存
    name: "admhotelagent",
    data() {
      return {
        tableData: []
      }
    },
    methods: {
      getAgent() {
        this.tableData=[];
        this.$axios
          .get("/api//houser/getAgent")
          .then(res => {
            for (var i = 0; i < res.data.data.length; i++) {
              this.tableData.push({
                "id": res.data.data[i].id,
                "userName":res.data.data[i].username,
                "password":res.data.data[i].password,
                "realName": res.data.data[i].realName,
                "otherName": res.data.data[i].otherName,
                "area": res.data.data[i].provinceName + "/" + res.data.data[i].cityName + "/" + res.data.data[i].areaName,
                "telephone": res.data.data[i].telephone,
                "status": res.data.data[i].status
              })
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleChaStatus(index, row) {

        let data = {
          "id": row.id
        }
        this.$axios
          .post("/api//houser/changeStatus", data)
          .then(res => {
            console.log(res.data.data)
            this.getAgent();
          }).catch((err) => {
            console.log(err + "错误");
          });

      }
    },

    created() {
      this.getAgent();
    }
  }

</script>

<style scoped>


</style>
