<template>
  <div class="content">
    <div class="header">
      <!-- 折叠按钮 -->
      <div class="collapse-btn">
        <i class="el-icon-menu"></i>
      </div>
      <div class="logo">{{ hotelName }}</div>
      <div class="header-right">
        <div class="header-user-con">
          <!-- 用户头像 -->
          <div class="user-avator"><img src="static/img/img.jpg"></div>
          <!-- 用户名下拉菜单 -->
          <el-dropdown class="user-name" trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              {{username}} <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <a href="http://blog.gdfengshuo.com/about/" target="_blank">
                <el-dropdown-item>关于作者</el-dropdown-item>
              </a>
              <a href="https://github.com/lin-xin/vue-manage-system" target="_blank">
                <el-dropdown-item>项目仓库</el-dropdown-item>
              </a> -->
              <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

      <div class="container">
        <el-tabs type="card">

          <el-tab-pane label="消息管理" >
            <vappmsgmanager></vappmsgmanager>
          </el-tab-pane>
        
        </el-tabs>
      </div>
    </div>

</template>

<script>

  import vappmsgmanager from "../appconfig/AppMsgManager.vue"
  export default {
    name: "fronthotelindex",
    data() {
      return {
        name: 'linxin',
        msg: 'Welcome to Your Vue.js App',
        hotelName:""
      }
    },
    methods: {
      handleCommand(command) {
        if (command == 'loginout') {
          sessionStorage.removeItem('ms_username')
          this.$router.push('/login');
        }
      },
    },
    computed: {
      username() {
        let username = sessionStorage.getItem('ms_username');
        return username ? username : this.name;
      }
    },
    created() {
      if (sessionStorage.eleToken == null || sessionStorage.eleToken == "") {
        this.$router.push({
          path: "/login"
        })
      }
      let data = {
        token: sessionStorage.eleToken,
      }
      this.$axios
        .post("/api/houser/checkFrontMsg", data)
        .then(res => {
          console.log(res.data);
          if (res.data.code == 0) {
            sessionStorage.hotelId = res.data.data.hotelId
            sessionStorage.agentId = res.data.data.agentId
            this.hotelName = res.data.data.hotelName + "TV后台管理系统"
          } else {
            this.$router.push({
              path: "/login"
            })
          }
        }).catch((err) => {
          console.log(err + "错误");
        });
    },
    components: {
  
      vappmsgmanager
    },
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
  }

  .collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
  }

  .header .logo {
    float: left;
    width: 400px;
    line-height: 70px;
  }

  .header-right {
    float: right;
    padding-right: 50px;
  }

  .header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
  }

  .btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
  }

  .btn-bell,
  .btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
  }

  .btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
  }

  .btn-bell .el-icon-bell {
    color: #fff;
  }

  .user-name {
    margin-left: 10px;
  }

  .user-avator {
    margin-left: 20px;
  }

  .user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .el-dropdown-link {
    color: #fff;
    cursor: pointer;
  }

  .el-dropdown-menu__item {
    text-align: center;
  }

</style>
