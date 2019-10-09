<template>
  <div class="">
    <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="模块列表" name="first" :key="'first'">
        <vappmodluelist v-if="isChildUpdate1"></vappmodluelist>
      </el-tab-pane>
      <el-tab-pane label="Apk列表" name="second" :key="'second'">
        <vappmodlueapk v-if="isChildUpdate2"></vappmodlueapk>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import vappmodluelist from './AppModuleList.vue';
  import vappmodlueapk from './AppModuleApk.vue';

  import {
    isEmpty,
    limitImg
  } from '../../../static/js/util.js'
  export default {
    //写上name参数会被缓存
    // name: "admindex",
    data() {
      return {
        activeName: "first",
        isChildUpdate1: true,
        isChildUpdate2: false
      }
    },
    methods: {
      handleClick(tab) {
        if (tab.name == "first") {
          this.isChildUpdate1 = true;
          this.isChildUpdate2 = false;
        } else if (tab.name == "second") {
          this.isChildUpdate1 = false;
          this.isChildUpdate2 = true;
        }
      }
    },
    components: {
      vappmodluelist,
      vappmodlueapk
    },
    created() {

    }

  }

</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .delete-img-div {
    width: 178px;
    height: 20px;
    color: #ff0000;
    text-align: center;
    background-color: #8c939d;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }

  .avatar-div {
    width: 178px;
    height: 178px;
    padding: 10px;
    display: inline-block;
  }

</style>
