import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

function checkAdmin() {
  if (sessionStorage.roleId == null || sessionStorage.roleId == "" || sessionStorage.roleId != 6668) {

    return true;
  } else {
    return true;
  }
}

function checkAgent() {
  if (sessionStorage.roleId == null || sessionStorage.roleId == "" || sessionStorage.roleId != 2) {

    return true;
  } else {
    return true;
  }
}

export default new Router({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: {
        title: '自述文件'
      },
      children: [{
          path: '/admindex',
          component: resolve => require(['../components/admpage/AdmIndex.vue'], resolve),
          meta: {
            title: '系统首页'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {
          path: '/admhotellist',
          component: resolve => require(['../components/admpage/AdmHotelList.vue'], resolve),
          meta: {
            title: '酒店列表'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {
          path: '/admhoteldetail',
          component: resolve => require(['../components/admpage/AdmHotelDetail.vue'], resolve),
          meta: {
            title: '酒店详情'
          },

        },
        {
          path: '/admhotelindex',
          component: resolve => require(['../components/admpage/AdmHotelIndex.vue'], resolve),
          meta: {
            title: '首页配置'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {
          path: '/admhotelmodule',
          component: resolve => require(['../components/admpage/AdmHotelModule.vue'], resolve),
          meta: {
            title: '模块配置'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {
          path: '/admhotelview',
          component: resolve => require(['../components/admpage/AdmHotelView.vue'], resolve),
          meta: {
            title: '风景配置'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/admhotelabout',
          component: resolve => require(['../components/admpage/AdmHotelAbout.vue'], resolve),
          meta: {
            title: '关于配置'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/admhotelservice',
          component: resolve => require(['../components/admpage/AdmHotelService.vue'], resolve),
          meta: {
            title: '服务配置'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/admhotelshop',
          component: resolve => require(['../components/admpage/AdmHotelShop.vue'], resolve),
          meta: {
            title: '商城配置'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {
          path: '/admhotelplayer',
          component: resolve => require(['../components/admpage/AdmHotelPlayer.vue'], resolve),
          meta: {
            title: '播放器配置'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/admupdateapp',
          component: resolve => require(['../components/admpage/AdmUpdateApp.vue'], resolve),
          meta: {
            title: '更新app配置'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/admhotelchannel',
          component: resolve => require(['../components/admpage/AdmV2HotelChannel.vue'], resolve),
          meta: {
            title: '默认列表配置'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/admappmarket',
          component: resolve => require(['../components/admpage/AdmAppMarket.vue'], resolve),
          meta: {
            title: '应用市场'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/admhotelagent',
          component: resolve => require(['../components/admpage/AdmHotelAgent.vue'], resolve),
          meta: {
            title: '代理商列表'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },

        {

          path: '/admhotelfront',
          component: resolve => require(['../components/admpage/AdmHotelFront.vue'], resolve),
          meta: {
            title: '酒店管理员列表'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/admhotelfrontmsg',
          component: resolve => require(['../components/admpage/AdmHotelFrontMsg.vue'], resolve),
          meta: {
            title: '酒店前台列表'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/admorder',
          component: resolve => require(['../components/admpage/AdmOrder.vue'], resolve),
          meta: {
            title: '订单详情'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/admproject',
          component: resolve => require(['../components/admpage/AdmProject.vue'], resolve),
          meta: {
            title: '项目跟进管理'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/admsyschannelnet',
          component: resolve => require(['../components/admpage/AdmSysChannelNet.vue'], resolve),
          meta: {
            title: '网络源列表'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/admsyschannelgroup',
          component: resolve => require(['../components/admpage/AdmSysChannelGroup.vue'], resolve),
          meta: {
            title: '组播源列表'
          },
          beforeEnter: (to, from, next) => {
            if (checkAdmin()) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/ageindex',
          component: resolve => require(['../components/agepage/AgeIndex.vue'], resolve),
          meta: {
            title: '代理商首页'
          },
          beforeEnter: (to, from, next) => {
            if (checkAgent) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/agehotellist',
          component: resolve => require(['../components/agepage/AgeHotellist.vue'], resolve),
          meta: {
            title: '酒店列表'
          },
          beforeEnter: (to, from, next) => {

            if (checkAgent) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/agehoteldetail',
          component: resolve => require(['../components/agepage/AgeHotelDetail.vue'], resolve),
          meta: {
            title: '酒店详情'
          },
          beforeEnter: (to, from, next) => {

            if (checkAgent) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/agehotelfront',
          component: resolve => require(['../components/agepage/AgeHotelFront.vue'], resolve),
          meta: {
            title: '酒店管理员列表'
          },
          beforeEnter: (to, from, next) => {

            if (checkAgent) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/agehotelfrontmsg',
          component: resolve => require(['../components/agepage/AgeHotelFrontMsg.vue'], resolve),
          meta: {
            title: '酒店前台列表'
          },
          beforeEnter: (to, from, next) => {

            if (checkAgent) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/agemes',
          component: resolve => require(['../components/agepage/AgeMes.vue'], resolve),
          meta: {
            title: '个人资料'
          },
          beforeEnter: (to, from, next) => {

            if (checkAgent) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/buydetail',
          component: resolve => require(['../components/agepage/BuyDetail.vue'], resolve),
          meta: {
            title: '充值详情'
          },
          beforeEnter: (to, from, next) => {

            if (checkAgent) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/orderdetail',
          component: resolve => require(['../components/agepage/OrderDetail.vue'], resolve),
          meta: {
            title: '订单详情'
          },
          beforeEnter: (to, from, next) => {

            if (checkAgent) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/ageproject',
          component: resolve => require(['../components/agepage/AgeProject.vue'], resolve),
          meta: {
            title: '项目跟进管理'
          },
          beforeEnter: (to, from, next) => {

            if (checkAgent) {
              next();
            } else {
              next({
                path: '/login'
              });
            }
          }
        },
        {

          path: '/admaqyvip',
          component: resolve => require(['../components/admpage/AdmAqyVip/AdmAqyVip.vue'], resolve),
          meta: {
            title: '点播vip管理'
          },
        
        },
        {
          path: '/404',
          component: resolve => require(['../components/page/404.vue'], resolve),
          meta: {
            title: '404'
          }
        },

      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
      path: '/register',
      component: resolve => require(['../components/page/Register.vue'], resolve)
    },
    {
      path: '/fronthotelindex',
      component: resolve => require(['../components/page/FrontHotelIndex.vue'], resolve)

    },
    {
      path: '/fronthotelindex/frontmsg',
      component: resolve => require(['../components/page/FrontMsg.vue'], resolve)

    },
    {
      path: '/follower/msg',
      component: resolve => require(['../components/page/FollowerMsg.vue'], resolve)

    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
