<template>
   <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> app更新</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs type="card">
                <el-tab-pane label="框架app" ><vappframe></vappframe></el-tab-pane>
                <el-tab-pane label="直播app" :lazy="true"><vappplay></vappplay></el-tab-pane>
           
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import vappframe from './AppFrame.vue';
    import vappplay from './AppPlay.vue';
   
    export default {
    //写上name参数会被缓存
    name:"admupdateapp",
    data () {
        return {
            msg: 'Welcome to Your Vue.js App'
        }
    },
     components:{
            vappframe,vappplay
        },
    created(){
        console.log("admupdateapp");
    }
}
</script>

<style scoped>

    
</style>