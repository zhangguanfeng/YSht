// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import '../static/css/icon.css';
import axios from "./http"
Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small' });
Vue.prototype.$axios=axios;
/* eslint-disable no-new */
import Vuex from 'vuex';
Vue.use( Vuex )
// serverIp:"http://localhost:9191"
// serverIp:"http://cloud.nhw6.com:9191"
// serverIp:"http://47.106.218.143:9191"
const store = new Vuex.Store({
  state:{ 
    // serverIp:"http://cloud.nhw6.com:9191"
    serverIp:"http://192.168.0.88:9191"
  }
})
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
