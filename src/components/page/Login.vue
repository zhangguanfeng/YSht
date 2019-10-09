<template>
  <div class="logincontainer">

    <div class="headers">
      <!-- <div class="head_login"> -->
        <div class="logoimg">
          <img :src="logo">
        </div>

        <div class="loginname">
          <span style="font-size:26px">引视商用系统桌面</span>
        </div>

      <!-- </div> -->
    </div>

    <!-- <div class="slogan">
      <img :src="text">
    </div> -->
    <!-- <div class="slogan">
      <span style="font-size:35px">微妙之间，完美之中</span>
    </div> -->
    <div class="logins" style="">
      <div class="box_tab">
        <span class="active">账号登录</span>
      </div>
      <el-form :model="form">
        <el-form-item label="">
          <el-input v-model="form.username" auto-complete="off" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="form.password" auto-complete="off" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item size="large">

          <el-button type="primary" style="width:300px" @click.native.prevent="handleLogin">登录</el-button>

        </el-form-item>
        <el-form-item size="large">

          <a href="#/register" class="margin-left:30px">注册代理商账号</a>
        </el-form-item>
      </el-form>

    </div>

    <div class="foot_bottom tc">
      <!-- <input type="text" v-model="$store.state.user_id"> -->
      <!-- <div>Copyright © 2012 - 2018 iKuai. All Rights Reserved. 京ICP备13042604号</div> -->
      <!-- <div>版权所有 广东纳秒流科技有限公司</div> -->
    </div>
  </div>


</template>
<script>
  import logo from "../../assets/images/logo_company.png"
  //  import bg from "../../assets/images/login_bgs.png"
  // import text from "../../assets/images/slogan2.png"
  import {
    isEmpty
  } from '../../../static/js/util.js'
  export default {
    name: "login",
    data() {
      return {
        logo: logo,
        // text: text,
        // bg:bg,
        form: {
          username: '',
          password: ''
        },
        // formLabelWidth: '80px'
      }
    },
    methods: {
      handleLogin() {
        if (isEmpty(this.form.username)) {
          this.$message.error('请输入账号名称');
          return;
        }
        if (isEmpty(this.form.password)) {
          this.$message.error('请输入密码');
          return;
        }
        let data = {
          "username": this.form.username,
          "password": this.form.password
        }
        this.$axios
          .post("/api/houser/login", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              sessionStorage.roleId = res.data.data.roleId;
              sessionStorage.ms_username = res.data.data.username
              sessionStorage.pointNum = res.data.data.pointNum
              if (res.data.data.roleId == 1) { //管理员
                sessionStorage.eleToken = res.data.data.token
                sessionStorage.removeItem("hotelId")
                sessionStorage.roleId = 998
                this.$message.success("登录成功");
                this.$router.push({
                  path: '/admindex'
                })
              } else if (res.data.data.roleId == 2) { //代理商
                if (res.data.data.status == 0) {
                  sessionStorage.eleToken = res.data.data.token
                  sessionStorage.agentId = res.data.data.id
                  sessionStorage.removeItem("hotelId")
                  this.$message.success("登录成功");
                  this.$router.push({
                    path: '/ageindex'
                  })

                } else {
                  this.$message.error("还没审核");
                }
              } else if (res.data.data.roleId == 3) { //酒店管理员用户
                sessionStorage.eleToken = res.data.data.token
                sessionStorage.hotelId = res.data.data.hotelId
                sessionStorage.agentId = res.data.data.agentId
                this.$message.success("登录成功");
                this.$router.push({
                  path: '/fronthotelindex'
                })
              } else if (res.data.data.roleId == 4) { //酒店前台用户
                sessionStorage.eleToken = res.data.data.token
                sessionStorage.hotelId = res.data.data.hotelId
                sessionStorage.agentId = res.data.data.agentId
                this.$message.success("登录成功");
                this.$router.push({
                  path: '/fronthotelindex/frontmsg'
                })
              }
              else if (res.data.data.roleId == 5) { //业务员
                sessionStorage.eleToken = res.data.data.token
                sessionStorage.userId=res.data.data.id
                sessionStorage.agentId = res.data.data.agentId
                this.$message.success("登录成功");
                this.$router.push({
                  path: '/follower/msg'
                })
              }
               else if (res.data.data.roleId == 6) { //业务员
                sessionStorage.eleToken = res.data.data.token
                sessionStorage.removeItem("hotelId")
                sessionStorage.roleId = 998
                sessionStorage.businessid=res.data.data.roleId
                this.$message.success("登录成功");
                this.$router.push({
                  path: '/admhotellist'
                })
              }

            } else {
              this.$message.error(res.data.msg);
            }
          }).catch((err) => {
            console.log(err + "错误");
          });

      },
      keyupSubmit() {
        document.onkeydown = e => {
          let _key = window.event.keyCode;
          if (_key === 13) {

            // this.handleLogin()
            if (this.$route.path == "/login") {
              this.handleLogin()
            }

          }
        }
      },
    },
    created() {
      //  sessionStorage.removeItem("eleToken")
      // sessionStorage.removeItem("roleId")
      // sessionStorage.removeItem("hotelId ")
      // sessionStorage.removeItem("agentId")
      this.keyupSubmit()
    },

  }

</script>
<style scoped>
  .logincontainer {

    background: rgba(0, 0, 0, 0) url(../../assets/images/login_bgs.png) no-repeat center center / cover;
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0;
    right: 0;

  }

  .headers {
    background: #fff;
  }

  .head_login {
    width: 1220px;
    padding: 0 0 10px 0;
    margin: 0 auto;
    height: 60px;
    line-height: 60px
  }

  img {
    display: inline-block;
    vertical-align: middle
  }

  .foot_bottom {
    background: #fff;
    bottom: 0;
    color: #999999;
    font-size: 14px;
    padding: 25px 0 30px;
    position: fixed;
    width: 100%;
  }

  .tc {
    text-align: center
  }

  .logins {
    height: auto;
    right: 13%;
    padding: 0 50px 25px 50px;
    position: absolute;
    top: 25%;
    width: 300px;
    z-index: 5;
    background: #fff;
    border-radius: 2px;
    font-size: 14px;
    text-align: center
  }

  .box_tab {
    text-align: center;
    margin: 25px 0 20px 0;
    font-size: 18px;
  }

  .box_tab span {
    cursor: pointer;
    margin-left: 0;
  }

  .box_tab .active {
    color: #23a9f6;
    cursor: pointer;
  }

  .slogan {
    position: absolute;
    right: 48%;
    top: 40%;

  }

  .loginname {
  display: inline-block;
     margin: 20px
    /* height: 60px;
    width: 400px;
    line-height: 60px;
    margin-top: 10px; */
  }

  .logoimg {
   float: left;
   margin-left: 200px;
   margin-top: 15px
  }

</style>
