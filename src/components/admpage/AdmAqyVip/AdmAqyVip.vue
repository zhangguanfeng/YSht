<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 点播vip管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs v-model="activeName" type="card"  @tab-click="handleGetContent">
        <el-tab-pane label="文件列表" name="first">
          <AdmAqyFileList/>
        </el-tab-pane>
        <el-tab-pane label="启动器管理" name="second">
          <AdmAqyAPK/>
        </el-tab-pane>
        <el-tab-pane label="启动器配置" name="third">
          <AdmAqyAPKconfig/>
        </el-tab-pane>
      </el-tabs>

      <!-- 文件管理表格 -->

    </div>
  </div>
</template>

<script>
  import {
    Col
  } from 'element-ui';
  import {
    isEmpty,
    limitApk
  } from '../../../../static/js/util'
  import AdmAqyFileList  from './AdmAqyFileList'
  import AdmAqyAPK  from './AdmAqyAPK'
  import AdmAqyAPKconfig from './AdmAqyAPKconfig'
  export default {
    //写上name参数会被缓存
    name: "admaqyvip",
    data() {
      return {
        activeName: 'first',
        
      };
    },
    methods: {
      handleGetContent(tab, event){
      },
    },
    components: {
      AdmAqyFileList,
      AdmAqyAPK,
      AdmAqyAPKconfig
    },
    watch: {},
    
  };

</script>

<style scoped>
  

</style>
