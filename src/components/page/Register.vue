<template>
  <div class="registerdiv">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="登录账号">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名">
        <el-input v-model="form.realname"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.pwd"></el-input>
      </el-form-item>
      <el-form-item label="重复密码">
        <el-input v-model="form.repwd"></el-input>
      </el-form-item>
      <el-form-item label="区域">
        <el-cascader :options="options" v-model="form.area" @change="handleChange"  filterable>
        </el-cascader>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="form.telephone"></el-input>
      </el-form-item>
      <el-form-item label="别名">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="form.othername"></el-input>
          </el-col>
          <el-col :span="14">小写英文字母或数字组成,用于桌面输入账号</el-col>
        </el-row>

      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    area
  } from "../../../static/js/area.js"
  import {
    isEmpty,
    isMobile,
    isOtherName
  } from '../../../static/js/util.js'
  export default {

    data() {
      return {
        options: area,
        form: {
          name: '',
          realname: "",
          pwd: '',
          repwd: '',
          area: [],
          telephone: "",
          othername: ""
        }
      }

    },
    created() {
      // console.log(area);
    },
    methods: {
      handleChange(value) {
        console.log(value);
      },
      onSubmit() {

        if (isEmpty(this.form.name)) {
          this.$message.error('请输入账号名称');
          return;
        }
        if (isEmpty(this.form.realname)) {
          this.$message.error('请输入真实姓名');
          return;
        }
        if (isEmpty(this.form.pwd)) {
          this.$message.error('请输入密码');
          return;
        }
        if (isEmpty(this.form.repwd)) {
          this.$message.error('请输入第二次密码');
          return;
        }
        if (this.form.area.length == 0) {
          this.$message.error('请选择所在区域');
          return;
        }

        if (isEmpty(this.form.telephone)) {
          this.$message.error('请输入电话号码');
          return;
        }
        if (isEmpty(this.form.othername)) {
          this.$message.error('请输入别名');
          return;
        }
        if (!isOtherName(this.form.othername)) {
          this.$message.error("小写英文字母或数字组成")
          return;
        }
        if (this.form.othername.length > 5) {
          this.$message.error("别名最长只能5位");
          return;
        }
        if (isMobile(this.form.telephone)) {
          this.$message.error('电话号码不对');
          return;
        }
        if (this.form.pwd != this.form.repwd) {
          this.$message.error('两次密码不匹配');
          return;
        }

        this.$axios
          .post("/api/houser/register", this.form)
          .then(res => {

            if (res.data.code == 0) {
              this.$message.success("你的资料已提交，请等待审核");
              this.$router.push({
                path: '/login'
              })

            } else {
              this.$message.error(res.data.data.msg);

            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .registerdiv {

    width: 600px;
    margin: 0 auto;
    margin-top: 60px;
  }

</style>
