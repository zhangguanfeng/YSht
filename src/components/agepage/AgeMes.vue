<template>

  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>个人资料</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <span>个人资料</span>
      <el-form :model="form">

        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input v-model="form.userName" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="别名" :label-width="formLabelWidth">
          <el-input v-model="form.otherName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属区域" :label-width="formLabelWidth">
          <el-input v-model="form.area" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话号码" :label-width="formLabelWidth">
          <el-input v-model="form.telephone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
  import {
    isEmpty
  } from '../../../static/js/util.js'
  export default {
    //写上name参数会被缓存
    name: "agemes",
    data() {
      return {
        agentId: sessionStorage.agentId,
        msg: 'admhotelshop',
        formLabelWidth: '120px',
        form: {
            userName:"",
            realName:"",
            otherName:"",
            area:"",
            telephone:""
        }
      }
    },
    methods: {
      onSubmit() {
        if (isEmpty(this.form.realName)) {
          this.$message.error("请输入姓名");
          return;
        }
        if (isEmpty(this.form.otherName)) {
          this.$message.error("请输入别名");
          return;
        }
        if (this.form.otherName.length > 4) {
          this.$message.error("别名最长只能4位");
          return;
        }
        if (isEmpty(this.form.telephone)) {
          this.$message.error("请输入电话号码");
          return;
        }
        let data = {
          "agentId": this.agentId + "",
          "telephone": this.form.telephone,
          "realName": this.form.realName,
          "otherName": this.form.otherName
        }
        this.$axios
          .post("/api/houser/updateAgent", data)
          .then(res => {
            if (res.data.code == 0) {
              this.$message.success("保存成功")
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getAgentMes() {
        this.$axios
          .get("/api/houser/getAgent/" + this.agentId)
          .then(res => {
            console.log(res.data);
            this.form.userName = res.data.data.username;
            this.form.otherName = res.data.data.otherName;
            this.form.realName = res.data.data.realName;
            this.form.telephone = res.data.data.telephone;
            this.form.area = res.data.data.provinceName + "/" + res.data.data.cityName + "/" + res.data.data.areaName
          }).catch((err) => {
            console.log(err + "错误");
          });
      },


    },
    created() {
      this.getAgentMes()
    }
  }

</script>

<style scoped>


</style>
