<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
      text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                  {{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import axios from "../../../src/http"
  import bus from '../common/bus';
  export default {
    data() {
      return {
        collapse: false,
        admItems: [
          {
            icon: 'el-icon-lx-home',
            index: 'admindex',
            title: '系统首页'
          },
          {
            icon: 'el-icon-lx-home',
            index: 'admhotellist',
            title: '酒店列表'
          },
          {
            icon: 'el-icon-lx-home',
            index: 'admhoteldetail',
            title: '酒店详情'
          },
          {
            icon: 'el-icon-lx-calendar',
            index: '3',
            title: '默认APP配置',
            subs: [{
                index: 'admhotelindex',
                title: '首页配置'
              },
              {
                index: 'admhotelmodule',
                title: '模块配置'
              },
              {
                index: 'admhotelview',
                title: '风景配置'
              },
              {
                index: 'admhotelabout',
                title: '关于配置'
              },
              {
                index: 'admhotelservice',
                title: '服务配置'
              },
              {
                index: 'admhotelshop',
                title: '商城配置'
              },
              {
                index: 'admhotelplayer',
                title: '播放器配置'
              }
            ]
          },
          {
            icon: 'el-icon-lx-home',
            index: 'admupdateapp',
            title: '更新APP配置'
          },
          {
            icon: 'el-icon-lx-home',
            index: 'admhotelchannel',
            title: '默认列表配置'
          },
          {
            icon: 'el-icon-lx-home',
            index: 'admappmarket',
            title: '应用市场'
          },
          {
            icon: 'el-icon-lx-home',
            index: 'admhotelagent',
            title: '代理商列表'
          },
          {
            icon: 'el-icon-lx-home',
            index: 'admhotelfront',
            title: '酒店管理员列表'
          },
           {
            icon: 'el-icon-lx-home',
            index: 'admhotelfrontmsg',
            title: '酒店前台列表'
          },
          {
            icon: 'el-icon-lx-home',
            index: 'admorder',
            title: '充值详情'
          },
          {
            icon: 'el-icon-lx-home',
            index: 'admproject',
            title: '项目跟进管理'
          },{
            icon: 'el-icon-lx-home',
            index: 'admaqyvip',
            title: '点播vip管理'
          }
          //  {
          //   icon: 'el-icon-lx-home',
          //   index: '9',
          //   title: '频道源管理',
          //   subs: [{
          //       index: 'admsyschannelnet',
          //       title: '网络源列表'
          //     },
          //     {
          //       index: 'admsyschannelgroup',
          //       title: '组播源列表'
          //     },
             
          //   ]
          // }
        ],
        agentItems: [{
            icon: 'el-icon-lx-home',
            index: 'ageindex',
            title: '系统首页'
          },
          {
            icon: 'el-icon-lx-home',
            index: 'agehotellist',
            title: '酒店列表'
          },
          {
            icon: 'el-icon-lx-home',
            index: 'agehoteldetail',
            title: '酒店详情'
          },
          {
            icon: 'el-icon-lx-home',
            index: 'agehotelfront',
            title: '酒店管理员列表'
          },
           {
            icon: 'el-icon-lx-home',
            index: 'agehotelfrontmsg',
            title: '酒店前台列表'
          },
           {
            icon: 'el-icon-lx-home',
            index: 'agemes',
            title: '个人资料'
          },
          {
            icon: 'el-icon-lx-home',
            index: 'buydetail',
            title: '充值详情'
          },
          {
            icon: 'el-icon-lx-home',
            index: 'orderdetail',
            title: '订单详情'
          },
           {
            icon: 'el-icon-lx-home',
            index: 'ageproject',
            title: '项目跟进管理'
          }
        ],
        frontItems: [],
        items: []
      }
    },
    computed: {
      onRoutes() {
        return this.$route.path.replace('/', '');
      }
    },
    created() {
     if(sessionStorage.getItem("businessid")==6){
       this.admItems=[{
          
          
            icon: 'el-icon-lx-home',
            index: 'admhotellist',
            title: '酒店列表'
          },
          {
            icon: 'el-icon-lx-home',
            index: 'admhoteldetail',
            title: '酒店详情'
          },
          
         
          {
            icon: 'el-icon-lx-home',
            index: 'admhotelagent',
            title: '代理商列表'
          },
         
          {
            icon: 'el-icon-lx-home',
            index: 'admorder',
            title: '订单详情'
          },
          {
            icon: 'el-icon-lx-home',
            index: 'admproject',
            title: '项目跟进管理'
          }
       ]
     }
      var adm = ["/admindex", "/admhotellist", '/admhoteldetail', '/admhotelindex', '/admhotelmodule', '/admhotelview',
        '/admhotelabout', '/admhotelservice',
        '/admhotelplayer', '/admupdateapp', '/admhotelchannel', '/admhotelagent', '/admhotelfront','/admsyschannelnet','/admsyschannelgroup',
        "/admhotelshop","/admhotelfrontmsg","/admappmarket",'/admorder',"/admproject","/admaqyvip"
      ]
      var age = ["/ageindex", '/agehotellist', '/agehoteldetail',"/agehotelfront",'/agehotelfrontmsg',"/agemes","/buydetail","/orderdetail","/ageproject"]

      if (sessionStorage.eleToken == null || sessionStorage.eleToken == "") {

        this.$router.push({
          path: "/login"
        })
      } else {

        let data = {
          token: sessionStorage.eleToken,
        }
        axios
          .post("/api/houser/checkToken", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              if (res.data.data.roleId == 1||res.data.data.roleId==6) {
                var i = adm.indexOf(this.$route.path)
                if (i != -1) {

                  this.items = this.admItems

                } else {
                  this.$router.push({
                    path: "/login"
                  })
                }
              } else if (res.data.data.roleId == 2) {
                var i = age.indexOf(this.$route.path)
                if (i != -1) {
                  sessionStorage.agentId = res.data.data.id;
                  this.items = this.agentItems

                } else {
                  this.$router.push({
                    path: "/login"
                  })
                }
              }
            } else {
              this.$router.push({
                path: "/login"
              })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      }
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏

      bus.$on('collapse', msg => {
        console.log("折叠"+msg)
        this.collapse = msg;
      })
    },
    //  beforeRouteEnter(to, from, next) {

    //   var adm = ["/admindex", "/admhotellist", '/apphoteldetail', '/admhotelindex', '/admhotelmodule', '/admhotelview',
    //     '/admhotelabout', '/admhotelservice',
    //     '/admhotelplayer', '/admupdateapp', '/admhotelchannel', '/admhotelagent', '/admhotelfront',
    //   ]
    //   var age = ["/ageindex", '/agehotellist', '/apphoteldetail']
    //   console.log("验证1")
    //   if (sessionStorage.eleToken == null || sessionStorage.eleToken == "") {
    //     console.log("验证2")
    //     next("/login");
    //   } else {
    //     console.log("验证3")
    //     let data = {
    //       token: sessionStorage.eleToken,
    //     }
    //     axios
    //       .post("/api/houser/checkToken", data)
    //       .then(res => {
    //         console.log(res.data);
    //         if (res.data.code == 0) {
    //           if (res.data.data.roleId == 1) {
    //             var i = adm.indexOf(to.path)
    //             if (i != -1) {
    //               this.items = this.admItems
    //               next()
    //             } else {
    //               next("/login");
    //             }
    //           } else if (res.data.data.roleId == 2) {
    //             var i = age.indexOf(to.path)
    //             if (i != -1) {
    //               sessionStorage.agentId = res.data.data.id;
    //               this.items = this.agentItems
    //               next()
    //             } else {
    //               next("/login");
    //             }
    //           }
    //         }
    //       }).catch((err) => {
    //         console.log(err + "错误");
    //       });
    //   }
    // },
  }

</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
  }

  .sidebar::-webkit-scrollbar {
    width: 0;
  }

  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 200px;
  }

  .sidebar>ul {
    height: 100%;
  }

</style>
