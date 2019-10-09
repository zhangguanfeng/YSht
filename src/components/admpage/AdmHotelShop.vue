<template>

  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>商城配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="商品列表" name="first" :key="'first'">
          <vadmshopitem v-if="isChildUpdate1"></vadmshopitem>
        </el-tab-pane>
        <el-tab-pane label="类别列表" name="second" :key="'second'">
          <vadmshoptype v-if="isChildUpdate2"></vadmshoptype>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import vadmshoptype from './AdmHotelShopType.vue';
  import vadmshopitem from './AdmHotelShopItem.vue';
  export default {
    //写上name参数会被缓存
    name: "admhotelshop",

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
      vadmshoptype,
      vadmshopitem
    },
    created() {

    }
  }

</script>

<style scoped>


</style>
