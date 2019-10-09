<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <v-tags></v-tags>
      <div class="content">
        <transition name="move" mode="out-in">
          <keep-alive :include="tagsList">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import vHead from './Header.vue';
  import vSidebar from './Sidebar.vue';
  import vTags from './Tags.vue';
  import bus from './bus';
 
  export default {
    data() {
      return {
        tagsList: [],
        collapse: false
      }
    },
    components: {
      vHead,
      vSidebar,
      vTags
    },
    created() {

      
      bus.$on('collapse', msg => {
        this.collapse = msg;
      })

      // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
      bus.$on('tags', msg => {
        let arr = [];
        for (let i = 0, len = msg.length; i < len; i++) {
          msg[i].name && arr.push(msg[i].name);
        }
        this.tagsList = arr;
        console.log("缓存页面" + this.tagsList);
      })
    },
      // beforeRouteEnter(to, from, next) {
      //   console.log(5)
      //   next()
      // }
    // beforeRouteEnter(to, from, next) {
    //   var adm = ["/admindex","/admhotellist",'/apphoteldetail','/admhotelindex','/admhotelmodule','/admhotelview',
    //   '/admhotelabout','/admhotelservice',
    //   '/admhotelplayer','/admupdateapp','/admhotelchannel','/admhotelagent','/admhotelfront',]
    //   var age = ["/ageindex",'/agehotellist','/apphoteldetail']
    //   if(from.path=="/login"){
    //       next()
    //       return;
    //   }
    //   if (sessionStorage.eleToken == null || sessionStorage.eleToken == "") {
    //     next("/login");
    //   } else {
          
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
    //               next()
    //             } else {
    //               next("/login");
    //             }
    //           } else if (res.data.data.roleId == 2) {
    //             var i = age.indexOf(to.path)
    //             if (i != -1) {
    //                 sessionStorage.agentId=res.data.data.id;
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
