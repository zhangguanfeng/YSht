<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style>
    @import "../static/css/main.css";
    @import "../static/css/color-dark.css";   /*  深色主题 */
    /* @import "../static/css/theme-green/color-green.css";   浅绿色主题 */
    .el-transfer-panel{
  width: 300px!important
}
.el-collapse-item__header  {
  color: #ff0000 !important;
}
.hide .el-upload--picture-card {
    display: none;
}
.growth .el-transfer-panel__list.is-filterable{
  height: 400px;
}
.growth .el-transfer-panel__body{
  height: 447px;
}
</style>