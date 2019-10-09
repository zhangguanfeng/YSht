<template>
  <div class="">
    <el-row>
      <!-- <el-select v-model="selectareaHotelId" placeholder="请选择列表区域">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select> -->
      <el-cascader placeholder="请选择直播源" :options="options" filterable v-model="selectedOptions" :change-on-select="false"></el-cascader>
      <el-button type="primary" @click="resumeChannel">确定</el-button>
      <el-button type="primary" @click="openInTypeDialog">添加类别</el-button>
      <el-button type="primary" @click="openListType">类别管理</el-button>
      <el-button type="primary" @click="openAllChannelDialog">全部频道排序</el-button>
      <el-switch v-model="value3" active-text="双列表" inactive-text="单列表" active-color="#13ce66" inactive-color="#ff4949"
      active-value="0" inactive-value="1" @change="switchOneTwo($event)">
      </el-switch>
    </el-row>
    <el-tabs type="border-card" @tab-click="handleTagClick" v-model="currentTagName">
      <el-tab-pane v-for="item in tags" :key="item.id" :label="item.name" :name="item.name">
        <el-button type="primary" @click="openInChannelInDialog">添加预置频道</el-button>
        <el-button type="primary" @click="inChannelDialogFormVisible=true">添加自定义频道</el-button>
        <el-button type="primary" @click="openSortChannelDialog">排序</el-button>

        <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">
          <el-table-column label="开/关" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isAppShow" active-value="0" inactive-value="1" @change="switchChannel($event, scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="频道名称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.urlName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="频道类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.isIn }}</span>
            </template>
          </el-table-column>
          <el-table-column label="频道网络源" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.netUrl }}</span>
            </template>
          </el-table-column>
          <el-table-column label="播放时长" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.playTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleChannelEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" @click="handleChanneldelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 类别管理 -->
    <el-dialog title="类别列表" :visible.sync="listTypeDialogFormVisible">
      <el-button type="primary" @click="openSortTypeDialog">排序</el-button>
      <el-table :data="listTypeData" style="width: 100%">
        <el-table-column label="开/关" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isAppShow" active-value="0" inactive-value="1" @change="switchType($event, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="类别名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类别类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.typeType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleTypeEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" @click="handleTypedelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 类别排序 -->
    <el-dialog title="类别排序" :visible.sync="sortTypeDialogFormVisible">
      <div class="drag-box">
        <div class="drag-box-item">
          <div class="item-title">拖曳可以移动类别</div>
          <draggable v-model="listsortTypeData" :options="dragOptions">
            <div v-for="(item,index) in listsortTypeData" class="drag-list" :key="index">
              {{item.name}}--{{item.typeType}}
            </div>
          </draggable>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sortType" type="primary">确定</el-button>
        <el-button @click="sortTypeDialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 添加类别对话框 -->
    <el-dialog title="添加类别" :visible.sync="inTypeDialogFormVisible">
      <el-form :model="typeform">
        <el-form-item label="类别名称" :label-width="formLabelWidth">
          <el-input v-model="typeform.typeName" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="typeInsert">确 定</el-button>
        <el-button @click="inTypeDialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加频道对话框 -->
    <el-dialog title="添加自定义频道" :visible.sync="inChannelDialogFormVisible">
      <el-form :model="channelform">
        <el-form-item label="频道名称" :label-width="formLabelWidth">
          <el-input v-model="channelform.urlName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="网络源地址" :label-width="formLabelWidth">
          <el-input v-model="channelform.netUrl" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="channelInsert">确 定</el-button>
        <el-button @click="inChannelDialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 频道编辑对话框 -->
    <el-dialog title="频道编辑" :visible.sync="upChannelDialogFormVisible">
      <el-form :model="upchannelform">
        <el-form-item  label="频道名称" :label-width="formLabelWidth">
          <el-input v-model="upchannelform.urlName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="网络源地址" :label-width="formLabelWidth">
          <el-input v-model="upchannelform.netUrl" autocomplete="off" :disabled="upchannelform.inChannelId==null?false:true"></el-input>
        </el-form-item>
        <el-form-item label="频道类别" :label-width="formLabelWidth">
          <el-select v-model="upchannelform.channelType" placeholder="请选择频道类别">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="channelUpdate">确 定</el-button>
        <el-button @click="upChannelDialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 频道排序对话框 -->
    <el-dialog title="频道排序" :visible.sync="sortChannelDialogFormVisible">
      <div class="drag-box">
        <div class="drag-box-item">
          <div class="item-title">拖曳可以移动模块</div>
          <draggable v-model="listsortChannelData" :options="dragOptions">
            <div v-for="(item,index) in listsortChannelData" class="drag-list" :key="index">
              {{item.name}}--{{item.channelType}}
            </div>
          </draggable>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sortChannel" type="primary">确定</el-button>
        <el-button @click="sortChannelDialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 全部频道排序 -->
    <el-dialog title="全部频道排序" :visible.sync="sortAllChannelDialogFormVisible">
      <div class="drag-box">
        <div class="drag-box-item">
          <div class="item-title">拖曳可以移动模块</div>
          <draggable v-model="listsortAllChannelData" :options="dragOptions">
            <div v-for="(item,index) in listsortAllChannelData" class="drag-list" :key="index">
              {{item.name}}--{{item.channelType}}
            </div>
          </draggable>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sortAllChannel" type="primary">确定</el-button>
        <el-button @click="sortAllChannelDialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 添加预置频道 -->
    <el-dialog title="添加预置频道" :visible.sync="inChannelInDialogVisible">
      <el-table ref="multipleTable" :data="tableInData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="350">
        </el-table-column>
        <el-table-column label="频道名称" width="350">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>

      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="chooseInChannel" type="primary">确定</el-button>
        <el-button @click="inChannelInDialogVisible=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    isEmpty
  } from '../../../static/js/util.js'
  import draggable from 'vuedraggable'
  export default {

    data() {
      return {
        dragOptions: {
          animation: 120,
          scroll: true,
          group: 'sortlist',
          ghostClass: 'ghost-style'
        },
        options: [],
        selectedOptions: [],
        typeOptions: [],
        value: '',
        value3: true,
        currentTagName: "",
        tags: [],
        tableData: [],
        agentId: sessionStorage.agentId,
        areaHotelId: "",
        hotelId: sessionStorage.hotelId,
        formLabelWidth: "120px",
        listTypeData: [],
        listTypeDialogFormVisible: false,
        sortTypeDialogFormVisible: false,
        inTypeDialogFormVisible: false,
        inChannelDialogFormVisible: false,
        upChannelDialogFormVisible: false,
        sortChannelDialogFormVisible: false,
        sortAllChannelDialogFormVisible: false,
        inChannelInDialogVisible: false,
        listsortTypeData: [],
        typeform: {
          typeName: ""
        },
        typeId: "",
        typeName: "",
        channelform: {
          urlName: "",
          netUrl: "",
        },
        upchannelform: {
          channelId: "",
          urlName: "",
          netUrl: "",
          inChannelId: null,
          channelType: "",
        },
        listsortChannelData: [],
        listsortAllChannelData: [],
        tableInData: [],
        multipleSelection: []
      }
    },
    methods: {
      resumeChannel() {
        this.$confirm('此操作将把所有的频道删除再重新引入, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.areaHotelId = this.selectedOptions[2]
          console.log(this.areaHotelId)
          let data = {
            operatorId:this.selectedOptions[0],
            areaId:this.selectedOptions[1],
            hotelId: this.hotelId + "",
            areaHotelId: this.areaHotelId + "",
          }
          this.$axios
            .post("/api/hoAppChannelType/resumeChannel", data)
            .then(res => {
              console.log(res.data);
              this.$message.success("添加成功")
              this.currentTagName= "",
              this.getChannelType()
            }).catch((err) => {
              console.log(err + "错误");
            });
        }).catch(() => {

        });
      },
      chooseInChannel() {
        this.$axios
          .post("/api/hoAppChannelUrl/insertInChannel", this.multipleSelection)
          .then(res => {
            console.log(res.data);
            this.inChannelInDialogVisible = false
            this.getChannel()
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      openInChannelInDialog() {
        this.inChannelInDialogVisible = true
        this.tableInData = []
        this.$axios
          .get("/api/hoAppChannelUrl/getInChannel/" + this.areaHotelId+"/"+this.hotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tableInData.push({
                "id": res.data.data[i].id,
                "name": res.data.data[i].name,
                "hotelId": this.hotelId + "",
                "typeId": this.typeId + "",
              })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection)
      },
      openAllChannelDialog() {
        this.sortAllChannelDialogFormVisible = true;
        this.listsortAllChannelData = []
        this.$axios
          .get("/api/hoAppChannelUrl/getAllChannel/" + this.hotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {

              this.listsortAllChannelData.push({
                "id": res.data.data[i].id,
                "name": res.data.data[i].name,
                "channelType": res.data.data[i].inChannelId == null ? "自定义" : "内置"
              })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      sortAllChannel() {
        this.$axios
          .post("/api/hoAppChannelUrl/sortAllChannel", this.listsortAllChannelData)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.$message.success("保存成功")
            } else {
              this.$message.success(res.data.msg)
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      openSortChannelDialog() {
        this.sortChannelDialogFormVisible = true;
        this.listsortChannelData = [];
        for (var i = 0; i < this.tableData.length; i++) {
          this.listsortChannelData.push({
            id: this.tableData[i].id,
            name: this.tableData[i].urlName,
            channelType: this.tableData[i].inChannelId == null ? "自定义" : "内置"
          })
        }
      },
      sortChannel() {
        this.$axios
          .post("/api/hoAppChannelUrl/sortChannel", this.listsortChannelData)
          .then(res => {
            console.log(res.data);
            this.sortChannelDialogFormVisible = false;
            this.getChannel();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      switchType(value, row) {
        let data = {
          typeId: row.id + "",
          isAppShow: value + ""
        }
        this.$axios
          .post("/api/hoAppChannelType/switchType", data)
          .then(res => {
            console.log(res.data);
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      switchOneTwo(value){
    let data = {
          hotelId: this.hotelId+"",
          isOneTwo: value + ""
        }
        this.$axios
          .post("/api/hoAppChannelUrl/switchChannelOneTwo", data)
          .then(res => {
            console.log(res.data);

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      switchChannel(value, row) {
        let data = {
          channelId: row.id + "",
          isAppShow: value + ""
        }
        this.$axios
          .post("/api/hoAppChannelUrl/switchChannel", data)
          .then(res => {
            console.log(res.data);

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      channelUpdate() {
        if (isEmpty(this.upchannelform.urlName)) {
          this.$message.error("请输入名称")
          return
        }
        if (this.upchannelform.channelId == null) {
          if (isEmpty(this.upchannelform.netUrl)) {
            this.$message.error("请输入地址")
            return
          }
        }

        let data = {

          channelId: this.upchannelform.channelId + "",
          urlName: this.upchannelform.urlName,
          netUrl: this.upchannelform.netUrl,
          channelType: this.upchannelform.channelType + ""
        }
        this.$axios
          .post("/api/hoAppChannelUrl/updateChannel", data)
          .then(res => {
            console.log(res.data);
            this.upChannelDialogFormVisible = false;
            this.getChannel();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleChanneldelete(index, row) {
        let data = {
          channelId: row.id + "",
        }
        this.$axios
          .post("/api/hoAppChannelUrl/deleteChannel", data)
          .then(res => {
            console.log(res.data);
            this.getChannel();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleChannelEdit(index, row) {
        this.upchannelform.channelId = row.id
        this.upchannelform.urlName = row.urlName
        this.upchannelform.netUrl = row.netUrl
        this.upchannelform.inChannelId = row.inChannelId
        this.upchannelform.channelType = row.channelType + ""
        this.upChannelDialogFormVisible = true;
      },
      handleTagClick(tab, event) {
        let data = this.tags.find(item => {
          return item.name == tab.name;
        })
        this.typeId = data.id;
        this.typeName = data.name;
        this.getChannel();
        console.log(this.typeId, this.typeName);
      },

      channelInsert() {
        if (isEmpty(this.channelform.urlName)) {
          this.$message.error("请输入名称")
          return
        }
        if (isEmpty(this.channelform.netUrl)) {
          this.$message.error("请输入网络源")
          return
        }
        let data = {
          hotelId: this.hotelId + "",
          typeId: this.typeId + "",
          urlName: this.channelform.urlName,

          netUrl: this.channelform.netUrl,
        }
        this.$axios
          .post("/api/hoAppChannelUrl/insertChannel", data)
          .then(res => {
            console.log(res.data);
            this.inChannelDialogFormVisible = false;
            this.getChannel();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      typeInsert() {
        if (isEmpty(this.typeform.typeName)) {
          this.$message.error("请输入名称")
          return
        }

        let data = {
          "hotelId": this.hotelId + "",
          "typeName": this.typeform.typeName
        }
        this.$axios
          .post("/api/hoAppChannelType/inserType", data)
          .then(res => {
            console.log(res.data);
            this.inTypeDialogFormVisible = false;
            this.getChannelType();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      sortType() {
        this.$axios
          .post("/api/hoAppChannelType/sortType", this.listsortTypeData)
          .then(res => {
            console.log(res.data);
            this.sortTypeDialogFormVisible = false;
            this.getChannelType();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      openInTypeDialog() {

        this.inTypeDialogFormVisible = true;
      },
      openSortTypeDialog() {
        this.listsortTypeData = []
        this.sortTypeDialogFormVisible = true;
        for (var i = 0; i < this.listTypeData.length; i++) {
          this.listsortTypeData.push({
            "id": this.listTypeData[i].id,
            "name": this.listTypeData[i].name,
            "typeType": this.listTypeData[i].inTypeId == null ? "自定义" : "内置"
          })
        }
      },
      handleTypeEdit(index, row) {
        this.$prompt("编辑类别姓名", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: row.name,
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {
          console.log(value)
          let data = {
            hotelId: this.hotelId + "",
            typeId: row.id + "",
            typeName: value
          }
          this.$axios
            .post("/api/hoAppChannelType/updateType", data)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.getChannelType();
              } else {
                this.$message.error(res.data.msg)
              }
            }).catch((err) => {
              console.log(err + "错误");
            });
        }).catch(() => {

        });
      },
      handleTypedelete(index, row) {
        let data = {
          typeId: row.id + "",
        }
        this.$axios
          .post("/api/hoAppChannelType/deleteType", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.getChannelType();
            } else {

            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      openListType() {

        this.listTypeDialogFormVisible = true;

      },
      getChannelType() {
        this.typeOptions = []
        this.tags = [];
        this.listTypeData = [];
        this.$axios
          .get("/api/hoAppChannelType/getType/" + this.hotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tags.push({
                "id": res.data.data[i].id,
                "name": res.data.data[i].name
              })
              this.listTypeData.push({
                "id": res.data.data[i].id,
                "name": res.data.data[i].name,
                "typeType": res.data.data[i].inTypeId == null ? "自定义" : "内置",
                "inTypeId": res.data.data[i].inTypeId,
                "isAppShow": res.data.data[i].isAppShow + ""
              })
              this.typeOptions.push({
                "value": res.data.data[i].id + "",
                "label": res.data.data[i].name
              })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getChannel() {
        this.tableData = [];
        this.$axios
          .get("/api//hoAppChannelUrl/getChannelByType/" + this.typeId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tableData.push({
                "id": res.data.data[i].id,
                "netUrl": res.data.data[i].outNetUrl,
                "urlName": res.data.data[i].name,
                "isAppShow": res.data.data[i].isAppShow + "",
                "isIn": res.data.data[i].inChannelId == null ? "自定义" : "内置",
                "playTime": res.data.data[i].playTime,
                "inChannelId": res.data.data[i].inChannelId,
                "channelType": res.data.data[i].typeId + ""
              })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getAreaHotel() {
        this.tableData = [];
        this.$axios
          .get("/api/hoInChannelArea/getAppChannelArea/" + this.agentId)
          .then(res => {
            console.log(res.data);
            this.options = res.data.data;
            this.getChannelMes();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getChannelMes() {
        this.tableData = [];
        this.$axios
          .get("/api/hoAppChannelMes/getAppChannelMes/" + this.hotelId)
          .then(res => {
            console.log(res.data);
            this.selectedOptions.push(res.data.data.operatorId + "")
            this.selectedOptions.push(res.data.data.areaId + "")
            this.selectedOptions.push(res.data.data.areaHotelId + "")
            this.value3=res.data.data.isOneTwo+""
            this.areaHotelId=res.data.data.areaHotelId+""
            this.getChannelType()
          }).catch((err) => {
            console.log(err + "错误");
          });
      }
    },
    created() {
      // this.getChannelType()
      this.getAreaHotel();
    },
    components: {
      draggable
    },
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
