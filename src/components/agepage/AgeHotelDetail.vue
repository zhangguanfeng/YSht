<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i> {{ hotelName }}详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs type="card">

        <el-tab-pane label="房间管理">
          <vapproom></vapproom>
        </el-tab-pane>
        <el-tab-pane label="欢迎页配置" :lazy="true">
          <vappwelcome></vappwelcome>
        </el-tab-pane>
        <el-tab-pane label="公告页配置" :lazy="true">
          <vappnotify></vappnotify>
        </el-tab-pane>
        <el-tab-pane label="首页配置" :lazy="true">
          <vappindex></vappindex>
        </el-tab-pane>
        <el-tab-pane label="模块配置" :lazy="true">
          <vappmodule></vappmodule>
        </el-tab-pane>
        <el-tab-pane label="直播列表配置" :lazy="true">
          <vappchannel></vappchannel>
        </el-tab-pane>
        <el-tab-pane label="关于我们配置" :lazy="true">
          <vappabout></vappabout>
        </el-tab-pane>
        <el-tab-pane label="风景配置" :lazy="true">
          <vappscene></vappscene>
        </el-tab-pane>
        <el-tab-pane label="服务配置" :lazy="true">
          <vappservice></vappservice>
        </el-tab-pane>
        <el-tab-pane label="购物配置" :lazy="true">
          <vappshop></vappshop>
        </el-tab-pane>
        <el-tab-pane label="播放器配置" :lazy="true">
          <vappplayer></vappplayer>
        </el-tab-pane>
                <el-tab-pane label="评分配置" :lazy="true">
          <vappcomment></vappcomment>
        </el-tab-pane>
        <el-tab-pane label="多语言配置" :lazy="true">
          <vapplanguage></vapplanguage>
        </el-tab-pane>
        <el-tab-pane label="消息管理" :lazy="true">
          <vappmsgmanager></vappmsgmanager>
        </el-tab-pane>
        <el-tab-pane label="采集配置" :lazy="true">
          <vappcollect></vappcollect>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import vappabout from '../appconfig/AppAbout.vue';
  import vappchannel from '../appconfig/AppV2Channel.vue';
  import vappcollect from '../appconfig/AppCollect.vue';
  import vappindex from '../appconfig/AppIndex.vue';
  import vappmodule from '../appconfig/AppModule.vue';
  import vapproom from '../appconfig/AppRoom.vue';
  import vappscene from '../appconfig/AppScene.vue';
  import vappservice from '../appconfig/AppService.vue';
  import vappshop from '../appconfig/AppShop.vue';
  import vappmsg from '../appconfig/AppMsg.vue';
  import vappmsgmanager from "../appconfig/AppMsgManager.vue"

  import vappplayer from "../appconfig/AppPlayer.vue"
  import vappwelcome from "../appconfig/AppWelcome.vue"
  import vappnotify from "../appconfig/AppNotify.vue"
  import vapplanguage from "../appconfig/AppLanguage.vue"
   import vappcomment from "../appconfig/AppComment.vue"
  import {
    Message
  } from 'element-ui';
  import axios from "../../../src/http"
  export default {
    //写上name参数会被缓存
    // name: "apphoteldetail",
    data() {
      return {
        hotelName: sessionStorage.hotelName,
        msg: 'Welcome to Your Vue.js App'
      }
    },
    components: {
      vappabout,
      vappchannel,
      vappcollect,
      vappmodule,
      vapproom,
      vappscene,
      vappindex,
      vappservice,
      vappshop,
      vappplayer,
      vappmsg,
      vappmsgmanager,
      vappwelcome,
      vappnotify,
      vapplanguage,
       vappcomment
    },
    created() {
      // console.log("admhoteldetail");
    },
    beforeRouteEnter(to, from, next) {

      if (sessionStorage.eleToken == null || sessionStorage.eleToken == "") {
        next("/login")
      }
      if (sessionStorage.hotelId == null || sessionStorage.hotelId == "") {
        Message.error("请从酒店列表的详细配置点击进去")
        next("/agehotellist")
      } else {
        let data = {
          "hotelId": sessionStorage.hotelId + "",
          "token": sessionStorage.eleToken
        }
        axios
          .post("/api/hoHotelMes/checkHotel", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              next()
            } else {
              next("/login")
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      }
    }

  }

</script>

<style scoped>


</style>
