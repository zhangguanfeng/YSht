<template>
  <div class="">
    <el-button type="primary" @click="openLanDialog">语言管理</el-button>

    <el-tabs type="border-card" @tab-click="handleTagClick" v-model="currentTagName">
      <el-tab-pane v-for="item in tags" :key="item.id" :label="item.name" :name="item.name">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-form label-position="top" label-width="80px" :model="baseMesForm" size="mini">
          <el-form-item :label="baseMesForm.hotelName">
            <el-input v-model="baseMesForm.lanhotelName" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <el-form-item :label="baseMesForm.welText">
            <el-input v-model="baseMesForm.lanwelText" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
            <el-form-item label="公告栏">
            <el-input v-model="baseMesForm.lannotifyBoard" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <el-form-item :label="baseMesForm.notifyMes">
            <el-input v-model="baseMesForm.lannotifyMes" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <el-form-item :label="baseMesForm.rollMes">
            <el-input v-model="baseMesForm.lanrollMes" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <el-form-item :label="baseMesForm.warmText">
            <el-input v-model="baseMesForm.lanwarmText" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <el-form-item :label="baseMesForm.introduce">
            <el-input v-model="baseMesForm.lanintroduce" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <el-form-item label="房间号码">
            <el-input v-model="baseMesForm.lanroomMes" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <!-- <el-form-item label="房间欢迎">
            <el-input v-model="baseMesForm.lanroomName" :placeholder="'@代表此房间的住户姓名'+item.name"></el-input>
          </el-form-item> -->
          <el-form-item label="确认">
            <el-input v-model="baseMesForm.lancheckMes" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <el-form-item label="返回">
            <el-input v-model="baseMesForm.lanbackMes" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <el-form-item label="再按一次返回">
            <el-input v-model="baseMesForm.lantwoBackMes" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
           <el-form-item label="关于我们">
            <el-input v-model="baseMesForm.lanaboutTitle" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
           <el-form-item label="查看更多">
            <el-input v-model="baseMesForm.lancheckMore" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <el-form-item label="星期一">
            <el-input v-model="baseMesForm.lanweekOne" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <el-form-item label="星期二">
            <el-input v-model="baseMesForm.lanweekTwo" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <el-form-item label="星期三">
            <el-input v-model="baseMesForm.lanweekThree" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <el-form-item label="星期四">
            <el-input v-model="baseMesForm.lanweekFour" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <el-form-item label="星期五">
            <el-input v-model="baseMesForm.lanweekFive" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <el-form-item label="星期六">
            <el-input v-model="baseMesForm.lanweekSix" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <el-form-item label="星期天">
            <el-input v-model="baseMesForm.lanweekSeven" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <div v-for="(itemm, index) in baseMesForm.lanModuleBeanList" :key="itemm.id">
            <el-form-item :label="itemm.moduleName">
              <el-input v-model="itemm.lanmoduleName" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
            </el-form-item>
          </div>
           <el-form-item label="非常满意">
            <el-input v-model="baseMesForm.lanpleasure" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <el-form-item label="满意">
            <el-input v-model="baseMesForm.lansatisfied" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>
          <el-form-item label="不满意">
            <el-input v-model="baseMesForm.lanunsatisfied" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
          </el-form-item>

          <div v-for="(itemm, index) in baseMesForm.lanCommentBeanList" :key="itemm.id">
            <el-form-item :label="itemm.commentTitle">
              <el-input v-model="itemm.lancommentTitle" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
            </el-form-item>
          </div>
          <div v-for="(items, index) in baseMesForm.lanServiceBeanList" :key="items.id">
            <el-form-item :label="items.serviceName">
              <el-input v-model="items.lanserviceName" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
            </el-form-item>
            <el-form-item :label="items.appHintText">
              <el-input v-model="items.lanappHintText" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
            </el-form-item>
          </div>
          <div v-for="(itemv, index) in baseMesForm.lanViewBeanList" :key="itemv.id">
            <el-form-item :label="itemv.viewName">
              <el-input v-model="itemv.lanviewName" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
            </el-form-item>
            <el-form-item :label="itemv.viewIntroduce">
              <el-input v-model="itemv.lanviewIntroduce" :placeholder="'请对照上面的中文输入'+item.name"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-tab-pane>
    </el-tabs>

    <!-- 语言管理 -->
    <el-dialog title="语言列表" :visible.sync="listLanDialogFormVisible">
      <el-button type="primary" @click="insertLan">添加语言</el-button>
      <el-button type="primary" @click="sortLanDialog">排序</el-button>
      <el-table :data="listLanData" style="width: 100%">
        <el-table-column label="开/关" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isAppShow" active-value="0" inactive-value="1"
              @change="switchLan($event, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="语言名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.lanName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleLanEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" @click="handleLanDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="语言排序" :visible.sync="sortlanDialogFormVisible">
      <div class="drag-box">
        <div class="drag-box-item">
          <div class="item-title">拖曳可以移动</div>
          <draggable v-model="listsortlanData" :options="dragOptions">
            <div v-for="(item,index) in listsortlanData" class="drag-list" :key="index">
              {{item.name}}
            </div>
          </draggable>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sortLan" type="primary">确定</el-button>
        <el-button @click="sortlanDialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    isEmpty,
    limitImg,
    limitVideo
  } from '../../../static/js/util.js'
  import draggable from 'vuedraggable'
  export default {
    //写上name参数会被缓存
    name: "applanguage",
    data() {
      return {
        dragOptions: {
          animation: 120,
          scroll: true,
          group: 'sortlist',
          ghostClass: 'ghost-style'
        },
        hotelId: sessionStorage.hotelId,
        listLanDialogFormVisible: false,
        sortlanDialogFormVisible: false,
        listLanData: [],
        currentTagName: "",
        tags: [],
        listsortlanData: [],
        baseMesForm: {},
        lanId: ""
      }
    },
    methods: {
      onSubmit() {
        var data = {
          "lanMes": JSON.stringify(this.baseMesForm)
        }
        this.$axios
          .post("/api/hoAppLanMes/saveLan", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.$message.success("保存成功")
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      openLanDialog() {
        this.listLanDialogFormVisible = true

      },
      insertLan() {
        this.$prompt("请输入语言名称", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {
          console.log(value)
          let data = {
            hotelId: this.hotelId + "",
            lanName: value,
          }
          this.$axios
            .post("/api/hoAppLanMes/insertLan", data)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.getLanType()
              } else {
                this.$message.error(res.data.msg)
              }
            }).catch((err) => {
              console.log(err + "错误");
            });
        }).catch(() => {

        });
      },
      handleLanEdit(index, row) {
        this.$prompt("请输入语言名称", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: row.lanName,
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {
          console.log(value)
          let data = {
            hotelId: this.hotelId + "",
            lanId: row.id + "",
            lanName: value,
          }
          this.$axios
            .post("/api/hoAppLanMes/editLan", data)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.getLanType()
              } else {
                this.$message.error(res.data.msg)
              }
            }).catch((err) => {
              console.log(err + "错误");
            });
        }).catch(() => {

        });
      },
      handleLanDelete(index, row) {
        let data = {
          hotelId: this.hotelId + "",
          lanId: row.id + "",
        }
        this.$axios
          .post("/api/hoAppLanMes/deleteLan", data)
          .then(res => {
            console.log(res.data);
            this.getLanType()
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      switchLan(value, row) {
        let data = {
          hotelId: this.hotelId + "",
          lanId: row.id + "",
          isAppShow: row.isAppShow + ""
        }
        this.$axios
          .post("/api/hoAppLanMes/switchLan", data)
          .then(res => {
            console.log(res.data);
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleTagClick(tab, event) {
        let data = this.tags.find(item => {
          return item.name == tab.name;
        })
        this.lanId = data.id
        this.getLanMes()
        // this.typeId = data.id;
        // this.typeName = data.name;
        // this.getChannel();
        // console.log(this.typeId, this.typeName);
      },
      getLanMes() {
        this.$axios
          .get("/api/hoAppLanMes/getLan/" + this.hotelId + "/" + this.lanId)
          .then(res => {
            this.baseMesForm = res.data.data
            console.log(this.baseMesForm)
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getLanType() {
        this.listsortlanData = []
        this.listLanData = []
        this.lanId = ""
        this.tags = []
        this.$axios
          .get("/api/hoAppLanMes/getLanType/" + this.hotelId)
          .then(res => {
            console.log(res.data)
            for (var i = 0; i < res.data.data.length; i++) {
              this.tags.push({
                "id": res.data.data[i].id,
                "name": res.data.data[i].lanName
              })
              this.listLanData.push({
                  "id": res.data.data[i].id,
                  "hotelId": res.data.data[i].hotelId,
                  "lanName": res.data.data[i].lanName,
                  "isAppShow": res.data.data[i].isAppShow == 0 ? "0" : "1"
                }),
                this.listsortlanData.push({
                  "id": res.data.data[i].id,
                  "name": res.data.data[i].lanName

                })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      sortLanDialog() {
        this.sortlanDialogFormVisible = true
      },
      sortLan() {
        this.$axios
          .post("/api/hoAppLanMes/sortLan", this.listsortlanData)
          .then(res => {
            console.log(res.data);
            this.sortlanDialogFormVisible = false
            this.getLanType()
          }).catch((err) => {
            console.log(err + "错误");
          });
      }
    },

    created() {
      this.getLanType()
    },
    components: {
      draggable
    },
  }

</script>

<style scoped>
  .drag-box {
    display: flex;
    user-select: none;
  }

  .drag-box-item {
    flex: 1;
    max-width: 330px;
    min-width: 300px;
    background-color: #eff1f5;
    margin-right: 16px;
    border-radius: 6px;
    border: 1px #e1e4e8 solid;
  }

  .item-title {
    padding: 8px 8px 8px 12px;
    font-size: 14px;
    line-height: 1.5;
    color: #24292e;
    font-weight: 600;
  }

  .item-ul {
    padding: 0 8px 8px;
    height: 500px;
    overflow-y: scroll;
  }

  .item-ul::-webkit-scrollbar {
    width: 0;
  }

  .drag-list {
    border: 1px #e1e4e8 solid;
    padding: 10px;
    margin: 5px 0 10px;
    list-style: none;
    background-color: #fff;
    border-radius: 6px;
    cursor: pointer;
    -webkit-transition: border .3s ease-in;
    transition: border .3s ease-in;

  }

  .drag-list:hover {
    border: 1px solid #20a0ff;
  }

  .drag-title {
    font-weight: 400;
    line-height: 25px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
  }

  .ghost-style {
    display: block;
    color: transparent;
    border-style: dashed
  }

</style>
