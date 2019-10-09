<template>
  <div class="">
    <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="商品列表" name="first" :key="'first'">
        <vappshopitem v-if="isChildUpdate1"></vappshopitem>
      </el-tab-pane>
      <el-tab-pane label="类别列表" name="second" :key="'second'" :lazy="true">
        <vappshoptype v-if="isChildUpdate2"></vappshoptype>
      </el-tab-pane>
      <el-tab-pane label="内置商品列表" name="third" :key="'third'" :lazy="true">
        <vappshopInItem></vappshopInItem>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import vappshoptype from './AppShopType.vue';
  import vappshopitem from './AppShopItem.vue';
  import vappshopInItem from './AppShopInItem.vue';

  export default {
    //写上name参数会被缓存
    name: "admindex",
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
        } else if (tab.name == "third") {
          this.isChildUpdate1 = false;
          this.isChildUpdate2 = false;
        }
      }
    },
    components: {
      vappshoptype,
      vappshopitem,
      vappshopInItem
    },
    created() {

    }

  }

</script>

<style scoped>

</style>
