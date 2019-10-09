<template>
  <div>
    <el-row>
      <el-button type="primary" @click="openInDialog">添加类别</el-button>
    </el-row>
    <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}"
      :key="tableData.typeId">
      <el-table-column label="类别名称"  align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
        hotelId: sessionStorage.hotelId,
        e: "478269761@qq.com",
        tableData: []
      }
    },
    methods: {
      openInDialog() {
        this.$prompt('添加类别', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        }).then(({
          value
        }) => {
          let data = {
            hotelId: this.hotelId+"",
            typeName:value
          }
          this.$axios
            .post("/api/hoAppShopItem/insertType", data)
            .then(res => {
              console.log(res.data);
              this.getType()

            }).catch((err) => {
              console.log(err + "错误");
            });
        }).catch(() => {

        });
      },
      handleEdit(index, row) {
        this.$prompt('修改列表', '提示', {
          inputValue: row.typeName,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        }).then(({
          value
        }) => {
        let data = {
            typeId: row.typeId+"",
            typeName:value
          }
          this.$axios
            .post("/api/hoAppShopItem/updateType", data)
            .then(res => {
              console.log(res.data);
              this.getType()
            }).catch((err) => {
              console.log(err + "错误");
            });
        }).catch(() => {

        });
      },
      handleDelete(index, row) {
           this.$confirm('此操作将会被此类别的商品都删掉, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         let data = {
          typeId: row.typeId + ""
        }
        this.$axios
          .post("/api/hoAppShopItem/deleteType", data)
          .then(res => {
            if (res.data.code == 0) {
              this.getType();
            }
            console.log(res.data);
          }).catch((err) => {
            console.log(err + "错误");
          });
        }).catch(() => {

        });
        
      },
      getType() {
        this.tableData = [];
        this.$axios
          .get("/api/hoAppShopItem/getType/" + this.hotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {

              this.tableData.push({
                typeId: res.data.data[i].id,
                typeName: res.data.data[i].typeName,
              })

            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      }
    },

    created() {
       console.log("hello2");
      this.getType()
    }

  }

</script>

<style scoped>

</style>
