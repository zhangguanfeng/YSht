<template>
  <div class="">
    <el-row>
      <!-- <el-select v-model="selectareaHotelId" placeholder="请选择列表区域">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select> -->
      <el-cascader width="500px" placeholder="请选择直播源" :options="options" filterable v-model="selectedOptions">
      </el-cascader>
      <el-button type="primary" @click="resumeChannel">确定</el-button>
      <el-button type="primary" @click="openInTypeDialog">添加类别</el-button>
      <el-button type="primary" @click="openListType">类别管理</el-button>
      <el-button type="primary" @click="openAllChannelDialog">全部频道排序</el-button>

      <el-button type="primary" @click="openPlaySort">播放时长排行</el-button>
      <el-switch v-model="value3" active-text="双列表" inactive-text="单列表" active-color="#13ce66" inactive-color="#ff4949"
        active-value="0" inactive-value="1" @change="switchOneTwo($event)">
      </el-switch>
      <el-switch v-model="value4" active-text="时移开关" inactive-text="" active-value="0" inactive-value="1"
        @change="switchPlaySeek($event)" style="margin-left:50px">
      </el-switch>
    </el-row>
    <el-tabs type="border-card" @tab-click="handleTagClick" v-model="currentTagName">
      <el-tab-pane v-for="item in tags" :key="item.id" :label="item.name" :name="item.name">
        <el-button type="primary" @click="openInChannelInDialog">添加预置频道</el-button>
        <el-button type="primary" @click="inChannelDialogFormVisible=true">添加自定义频道</el-button>
        <el-button type="primary" @click="openSortChannelDialog">排序</el-button>
        <el-button type="primary" @click="exportExcel">自定义导出数据</el-button>
        <el-button type="primary" @click="importExcel">自定义导入数据</el-button>
        <el-table :data="tableData" stripe style="width: 100%"
          :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">
          <el-table-column label="开/关" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isAppShow" active-value="0" inactive-value="1"
                @change="switchChannel($event, scope.row)">
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
          <!-- <el-table-column label="频道网络源" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.netUrl }}</span>
            </template>
          </el-table-column>
          <el-table-column label="播放时长" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.playTime }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="地址总数" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.urlNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleChannelUrlCheck(scope.$index, scope.row)"
                v-if="scope.row.inChannelId==null">
                地址管理</el-button>
              <el-button type="primary" @click="handleChannelEdit(scope.$index, scope.row)">编辑</el-button>
              <!-- <el-button type="danger" @click="handleChanneldelete(scope.$index, scope.row)">删除</el-button> -->
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
            <el-switch v-model="scope.row.isAppShow" active-value="0" inactive-value="1"
              @change="switchType($event, scope.row)">
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
            <!-- <el-button type="danger" @click="handleTypedelete(scope.$index, scope.row)">删除</el-button> -->
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
        <!-- <el-form-item label="网络源地址" :label-width="formLabelWidth">
          <el-input v-model="channelform.netUrl" autocomplete="off"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="channelInsert">确 定</el-button>
        <el-button @click="inChannelDialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 频道编辑对话框 -->
    <el-dialog title="频道编辑" :visible.sync="upChannelDialogFormVisible">
      <el-form :model="upchannelform">
        <el-form-item v-if="upchannelform.inChannelId==null" label="频道名称" :label-width="formLabelWidth">
          <el-input v-model="upchannelform.urlName" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="网络源地址" :label-width="formLabelWidth">
          <el-input v-model="upchannelform.netUrl" autocomplete="off" :disabled="upchannelform.inChannelId==null?false:true"></el-input>
        </el-form-item> -->
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
      <!-- <div class="drag-box">
        <div class="drag-box-item">
          <div class="item-title">拖曳可以移动模块</div>
          <draggable v-model="listsortChannelData" :options="dragOptions">
            <div v-for="(item,index) in listsortChannelData" class="drag-list" :key="index">
              {{item.name}}--{{item.channelType}}
            </div>
          </draggable>
        </div>
      </div> -->
      <el-transfer filterable filter-placeholder="请输入频道" v-model="NewlistsortChannelData" :data="listsortChannelData"
        target-order=push :props="{
        key: 'id'
        }" :titles="['待排序列表', '已排序列表']" :class="{ growth : growthShow}">
      </el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sortChannel" type="primary">确定</el-button>
        <el-button @click="sortChannelDialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 全部频道排序对话框 -->
    <el-dialog title="全部频道排序" :visible.sync="sortAllChannelDialogFormVisible">
      <!-- <div class="drag-box">
        <div class="drag-box-item">
          <div class="item-title">拖曳可以移动模块</div>
          <draggable v-model="listsortAllChannelData" :options="dragOptions">
            <div v-for="(item,index) in listsortAllChannelData" class="drag-list" :key="index">
              {{item.name}}--{{item.channelType}}
            </div>
          </draggable>
        </div>
      </div> -->
      <el-transfer filterable filter-placeholder="请输入频道" v-model="NewlistsortAllChannelData"
        :data="listsortAllChannelData" target-order=push :props="{
        key: 'id'
        }" :titles="['待排序列表', '已排序列表']" :class="{ growth : growthShow}"  >
      </el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sortAllChannel" type="primary">确定</el-button>
        <el-button @click="sortAllChannelDialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 添加预置频道 -->
    <el-dialog title="添加预置频道" :visible.sync="inChannelInDialogVisible">
      <el-table ref="multipleTable" :data="tableInData" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange">
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

    <!-- 查看地址 -->
    <el-dialog :title="channelName+'地址列表'" :visible.sync="urlDialogFormVisible" width="80%">
      <el-button type="primary" @click="insertDialogUrl">添加地址</el-button>
      <el-table :data="urlData" style="width: 100%">
        <el-table-column label="开/关" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isAppShow" active-value="0" inactive-value="1"
              @change="switchUrl($event, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="地址" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.url }}</span>
          </template>
        </el-table-column>
        <el-table-column label="源性质" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.urlType }}</span>
          </template>
        </el-table-column>

        <el-table-column label="报错次数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.errNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleUrlEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" @click="handleUrlErrdelete(scope.$index, scope.row)">清除报错</el-button>
            <el-button type="danger" @click="handleUrldelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- txt对话框 -->
    <el-dialog title="数据导入/导出" :visible.sync="txtDialogFormVisible" :close-on-click-modal="false"
      :close-on-press-escape="false" width="80%">
      <div v-html='placeTxt'></div>
      <el-input type="textarea" v-model="txtMes" :rows="30"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importMes" v-show="txtCheckVisible">确 定</el-button>
        <el-button @click="txtDialogFormVisible=false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 播放时长排行 -->
    <el-dialog title="播放时长排行" :visible.sync="channelTimeDialogFormVisible" :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-date-picker v-model="value2" type="daterange" align="left" unlink-panels range-separator="至"
        start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button type="primary" @click="chooseTime">确 定</el-button>
      <el-table :data="timeChannelData" stripe style="width: 100%"
        :header-cell-style="{background:'#a5b3c6', color:'#ffffff'}">

        <el-table-column label="排行序号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.channelNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="频道名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.channelName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="播放时长" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.playTime }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button>关闭</el-button>
      </div>
    </el-dialog>
    <!-- 添加地址 -->
    <el-dialog title="添加地址" :visible.sync="inUrlDialogFormVisible">
      <el-form :model="urlform">
        <el-form-item label="频道名称" :label-width="formLabelWidth">
          <el-input v-model="urlform.name" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="地址url" :label-width="formLabelWidth">
          <el-input v-model="urlform.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址类型" :label-width="formLabelWidth">
          <el-radio v-model="urlform.isNet" label="0">互联网源</el-radio>
          <el-radio v-model="urlform.isNet" label="1">运营商源</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="urlInsert">确 定</el-button>
        <el-button @click="inUrlDialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 编辑地址 -->
    <el-dialog title="编辑地址" :visible.sync="upUrlDialogFormVisible">
      <el-form :model="upurlform">
        <el-form-item label="频道名称" :label-width="formLabelWidth">
          <el-input v-model="upurlform.name" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="地址url" :label-width="formLabelWidth">
          <el-input v-model="upurlform.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址类型" :label-width="formLabelWidth">
          <el-radio v-model="upurlform.isNet" label="0">互联网源</el-radio>
          <el-radio v-model="upurlform.isNet" label="1">运营商源</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="urlUpdate">确 定</el-button>
        <el-button @click="upUrlDialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    isEmpty
  } from "../../../static/js/util.js";
  import draggable from "vuedraggable";
  export default {
    data() {
      return {
        InitializeList: [],
        allInitializeList: [],
        growthShow: true,
        // 修改改后的排序数据
        NewlistsortChannelData: [],
        NewlistsortAllChannelData: [],
        dragOptions: {
          animation: 120,
          scroll: true,
          group: "sortlist",
          ghostClass: "ghost-style"
        },
        options: [],
        selectedOptions: [],
        testoptions: [],
        typeOptions: [],
        value: "",
        value3: true,
        value4: "",
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
        channelTimeDialogFormVisible: false,
        inChannelInDialogVisible: false,
        urlDialogFormVisible: false,
        txtDialogFormVisible: false,
        txtCheckVisible: false,
        listsortTypeData: [],
        urlData: [],
        typeform: {
          typeName: ""
        },
        typeId: "",
        typeName: "",
        channelform: {
          urlName: "",
          netUrl: ""
        },
        upchannelform: {
          channelId: "",
          urlName: "",
          netUrl: "",
          inChannelId: null,
          channelType: ""
        },
        listsortChannelData: [],
        listsortAllChannelData: [],
        tableInData: [],
        multipleSelection: [],
        channelNameId: null,
        channelName: null,
        txtMes: "",
        value2: [],
        pickerOptions: {
          shortcuts: [{
              text: "今天",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 0);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        timeChannelData: [],
        urlform: {
          url: "",
          isNet: "",
          channelId: "",
          name: ""
        },
        inUrlDialogFormVisible: false,
        upUrlDialogFormVisible: false,
        upurlform: {
          id: "",
          url: "",
          isNet: "",
          channelId: "",
          name: ""
        },
        placeTxt: "请按照如下格式导入<br/>#频道名称##  (注意：#号要有三个)<br/>@0@频道地址<br/>@1@频道地址<br/>#频道名称##<br/>@0@频道地址<br/>@1@频道地址(注意：@0代表是互联网源，@1代表是运营商源)"
      };
    },
    methods: {
      // handleChange(value, direction, movedKeys) {
      //   console.log(this.NewlistsortChannelData,'123456',value);

      //   console.log( direction, movedKeys, "666",this.listsortAllChannelData);
      // },
      resumeChannel() {
        this.$confirm("此操作将把所有的频道删除再重新引入, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            this.areaHotelId = this.selectedOptions[2];
            console.log(this.areaHotelId);
            let data = {
              operatorId: this.selectedOptions[0],
              areaId: this.selectedOptions[1],
              hotelId: this.hotelId + "",
              areaHotelId: this.areaHotelId + ""
            };
            this.$axios
              .post("/api/hoV2AppChannelType/resumeChannel", data)
              .then(res => {
                console.log(res.data);
                (this.currentTagName = ""), this.getChannelType();
              })
              .catch(err => {
                console.log(err + "错误");
              });
          })
          .catch(() => {});
      },
      chooseInChannel() {
        this.$axios
          .post("/api/hoV2AppChannelName/insertInChannel", this.multipleSelection)
          .then(res => {
            console.log(res.data);
            this.inChannelInDialogVisible = false;
            this.getChannel();
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      openInChannelInDialog() {
        this.inChannelInDialogVisible = true;
        this.tableInData = [];
        this.$axios
          .get("/api/hoV2AppChannelName/getInChannel/" + this.areaHotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tableInData.push({
                id: res.data.data[i].id,
                name: res.data.data[i].name,
                hotelId: this.hotelId + "",
                typeId: this.typeId + "",
                isAppShow: res.data.data[i].isAppShow
              });
            }
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection);
      },
      openAllChannelDialog() {
        this.sortAllChannelDialogFormVisible = true;
        this.NewlistsortAllChannelData = [];
        this.listsortAllChannelData = [];
        this.$axios
          .get("/api/hoV2AppChannelName/getAllChannel/" + this.hotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.listsortAllChannelData.push({
                id: res.data.data[i].id,
                name: res.data.data[i].name,
                channelType: res.data.data[i].channelId == null ? "自定义" : "内置",
                label: res.data.data[i].name +
                  "--" +
                  (res.data.data[i].channelId == null ? "自定义" : "内置")
              });
            }
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      // 修改
      sortAllChannel() {
        let copylistsortAllChannelData=this.listsortAllChannelData
        let copyNewlistsortAllChannelData=[];
        for(var i=0;i<this.NewlistsortAllChannelData.length;i++){
          copyNewlistsortAllChannelData.push({
            "id":this.NewlistsortAllChannelData[i]
          })
            copylistsortAllChannelData =copylistsortAllChannelData.filter(item => item.id !== this.NewlistsortAllChannelData[i])
        }
        // console.log(copyNewlistsortAllChannelData.concat(copylistsortAllChannelData))



        // // 筛选参数
        // let arr = this.listsortAllChannelData.map(function (value) {
        //   delete value.label;
        //   return value;
        // });
        // // 右边的数组
        // let arr2 = [];
        // // 右边的id
        // let arr3 = this.NewlistsortAllChannelData;
        // let arr4 = [...arr]
        // // 左边的id
        // let arr5Id = [];
        // // 左边的数组
        // let arr6 = []
        // // 获取数组的id
        // let arrId = arr4.map(
        //   function (value) {
        //     return value.id
        //   }
        // )
        // for (let i = 0; i < arrId.length; i++) {
        //   for (let j = 0; j < arr3.length; j++) {
        //     if (arrId[i] == arr3[j]) {
        //       arrId[i] = ''
        //       break
        //     }
        //   }
        // }
        // for (let i = 0; i < arrId.length; i++) {
        //   if (arrId[i] !== '') {
        //     arr5Id.push(arrId[i])
        //   }
        // }

        // arr3.forEach(e => {
        //   arr.forEach(i => {
        //     if (e == i.id) {
        //       arr2.push(i);
        //     }
        //   });
        // });
        // arr.forEach(i => {
        //   arr5Id.forEach(v => {
        //     if (v == i.id) {
        //       arr6.push(i)
        //     }
        //   })
        // })

        // // 所有请求的参数
        // let arr7 = [...arr2, ...arr6]

        this.$axios
          .post("/api/hoV2AppChannelName/sortAllChannel", copyNewlistsortAllChannelData.concat(copylistsortAllChannelData))
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
               this.sortAllChannelDialogFormVisible = false;
              this.$message.success("保存成功");
            } else {
              this.$message.success(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err + "错误");
          });
    
      },
    
      // openSortChannelDialog() {
      //   this.sortChannelDialogFormVisible = true;
      //   this.listsortChannelData = [];
      //   for (var i = 0; i < this.tableData.length; i++) {
      //     this.listsortChannelData.push({
      //       id: this.tableData[i].id,
      //       name: this.tableData[i].urlName,
      //       channelType: this.tableData[i].inChannelId == null ? "自定义" : "内置"
      //     })
      //   }
      //   console.log(this.listsortChannelData,'123');

      // },
      // 修改后的排序穿梭框
      openSortChannelDialog() {
        this.sortChannelDialogFormVisible = true;
        this.NewlistsortChannelData = [];
        this.listsortChannelData = [];
        for (var i = 0; i < this.tableData.length; i++) {
          this.listsortChannelData.push({
            label: this.tableData[i].urlName +
              "--" +
              (this.tableData[i].inChannelId == null ? "自定义" : "内置"),
            id: this.tableData[i].id,
            name: this.tableData[i].urlName,
            channelType: this.tableData[i].inChannelId == null ? "自定义" : "内置"
          });
        }
      },
      sortChannel() {
        let arr = this.listsortChannelData.map(function (value) {
          delete value.label;
          return value;
        });
        // 右边的数组
        let arr2 = [];
        // 右边的id
        let arr3 = this.NewlistsortChannelData;
        let arr4 = [...arr]
        // 左边的id
        let arr5Id = [];
        // 左边的数组
        let arr6 = []
        // 获取数组的id
        let arrId = arr4.map(
          function (value) {
            return value.id
          }
        )
        for (let i = 0; i < arrId.length; i++) {
          for (let j = 0; j < arr3.length; j++) {
            if (arrId[i] == arr3[j]) {
              arrId[i] = ''
              break
            }
          }
        }
        for (let i = 0; i < arrId.length; i++) {
          if (arrId[i] !== '') {
            arr5Id.push(arrId[i])
          }
        }

        arr3.forEach(e => {
          arr.forEach(i => {
            if (e == i.id) {
              arr2.push(i);
            }
          });
        });
        arr.forEach(i => {
          arr5Id.forEach(v => {
            if (v == i.id) {
              arr6.push(i)
            }
          })
        })
        // 所有请求的参数
        let arr7 = [...arr2, ...arr6]
        this.$axios
          .post("/api/hoV2AppChannelName/sortChannel", arr7)
          .then(res => {
            console.log(res.data);
            this.sortChannelDialogFormVisible = false;
            this.getChannel();
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      switchType(value, row) {
        let data = {
          typeId: row.id + "",
          isAppShow: value + ""
        };
        this.$axios
          .post("/api/hoV2AppChannelType/switchType", data)
          .then(res => {
            console.log(res.data);
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      switchOneTwo(value) {
        let data = {
          hotelId: this.hotelId + "",
          isOneTwo: value + ""
        };
        this.$axios
          .post("/api/hoV2AppChannelName/switchChannelOneTwo", data)
          .then(res => {
            console.log(res.data);
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      switchPlaySeek(value) {
        let data = {
          hotelId: this.hotelId + "",
          isPlaySeek: value + ""
        };
        this.$axios
          .post("/api/hoAppChannelMes/config/isPlaySeek", data)
          .then(res => {
            console.log(res.data);
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      switchChannel(value, row) {
        let data = {
          channelId: row.id + "",
          isAppShow: value + ""
        };
        this.$axios
          .post("/api/hoV2AppChannelName/switchChannel", data)
          .then(res => {
            console.log(res.data);
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      channelUpdate() {
        if (isEmpty(this.upchannelform.urlName)) {
          this.$message.error("请输入名称");
          return;
        }
        let data = {
          channelId: this.upchannelform.channelId + "",
          urlName: this.upchannelform.urlName,

          channelType: this.upchannelform.channelType + ""
        };
        this.$axios
          .post("/api/hoV2AppChannelName/updateChannel", data)
          .then(res => {
            console.log(res.data);
            this.upChannelDialogFormVisible = false;
            this.getChannel();
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      handleChanneldelete(index, row) {
        let data = {
          channelId: row.id + ""
        };
        this.$axios
          .post("/api/hoAppChannelUrl/deleteChannel", data)
          .then(res => {
            console.log(res.data);
            this.getChannel();
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      handleChannelEdit(index, row) {
        this.upchannelform.channelId = row.id;
        this.upchannelform.urlName = row.urlName;
        this.upchannelform.netUrl = row.netUrl;
        this.upchannelform.inChannelId = row.inChannelId;
        this.upchannelform.channelType = row.channelType + "";
        this.upChannelDialogFormVisible = true;
      },
      handleTagClick(tab, event) {
        let data = this.tags.find(item => {
          return item.name == tab.name;
        });
        this.typeId = data.id;
        this.typeName = data.name;
        this.getChannel();
        console.log(this.typeId, this.typeName);
      },

      channelInsert() {
        if (isEmpty(this.channelform.urlName)) {
          this.$message.error("请输入名称");
          return;
        }

        let data = {
          hotelId: this.hotelId + "",
          typeId: this.typeId + "",
          urlName: this.channelform.urlName
        };
        this.$axios
          .post("/api/hoV2AppChannelName/insertChannel", data)
          .then(res => {
            console.log(res.data);
            this.inChannelDialogFormVisible = false;
            this.getChannel();
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      typeInsert() {
        if (isEmpty(this.typeform.typeName)) {
          this.$message.error("请输入名称");
          return;
        }

        let data = {
          hotelId: this.hotelId + "",
          typeName: this.typeform.typeName
        };
        this.$axios
          .post("/api/hoV2AppChannelType/inserType", data)
          .then(res => {
            console.log(res.data);
            this.inTypeDialogFormVisible = false;
            this.getChannelType();
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      sortType() {
        this.$axios
          .post("/api/hoV2AppChannelType/sortType", this.listsortTypeData)
          .then(res => {
            console.log(res.data);
            this.sortTypeDialogFormVisible = false;
            this.getChannelType();
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      openInTypeDialog() {
        this.inTypeDialogFormVisible = true;
        this.typeform.typeName = "";
      },
      openSortTypeDialog() {
        this.listsortTypeData = [];
        this.sortTypeDialogFormVisible = true;
        for (var i = 0; i < this.listTypeData.length; i++) {
          this.listsortTypeData.push({
            id: this.listTypeData[i].id,
            name: this.listTypeData[i].name,
            typeType: this.listTypeData[i].inTypeId == null ? "自定义" : "内置"
          });
        }
      },
      handleTypeEdit(index, row) {
        this.$prompt("编辑类别姓名", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputValue: row.name,
            inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
          })
          .then(({
            value
          }) => {
            console.log(value);
            let data = {
              hotelId: this.hotelId + "",
              typeId: row.id + "",
              typeName: value
            };
            this.$axios
              .post("/api/hoV2AppChannelType/updateType", data)
              .then(res => {
                console.log(res.data);
                if (res.data.code == 0) {
                  this.getChannelType();
                } else {
                  this.$message.error(res.data.msg);
                }
              })
              .catch(err => {
                console.log(err + "错误");
              });
          })
          .catch(() => {});
      },
      handleTypedelete(index, row) {
        let data = {
          typeId: row.id + ""
        };
        this.$axios
          .post("/api/hoAppChannelType/deleteType", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.getChannelType();
            } else {}
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      openListType() {
        this.listTypeDialogFormVisible = true;
      },
      getChannelType() {
        this.typeOptions = [];
        this.tags = [];
        this.listTypeData = [];
        this.$axios
          .get("/api/hoV2AppChannelType/getType/" + this.hotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tags.push({
                id: res.data.data[i].id,
                name: res.data.data[i].name
              });
              this.listTypeData.push({
                id: res.data.data[i].id,
                name: res.data.data[i].name,
                typeType: res.data.data[i].inTypeId == null ? "自定义" : "内置",
                inTypeId: res.data.data[i].inTypeId,
                isAppShow: res.data.data[i].isAppShow + ""
              });
              this.typeOptions.push({
                value: res.data.data[i].id + "",
                label: res.data.data[i].name
              });
            }
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      getChannel() {
        this.tableData = [];
        this.$axios
          .get("/api/hoV2AppChannelName/getChannelByType/" + this.typeId)
          .then(res => {
            // console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tableData.push({
                id: res.data.data[i].id,
                urlName: res.data.data[i].name,
                isAppShow: res.data.data[i].isAppShow + "",
                isIn: res.data.data[i].channelId == null ? "自定义" : "内置",
                inChannelId: res.data.data[i].channelId,
                channelType: res.data.data[i].typeId + "",
                urlNum: res.data.data[i].urlNum
              });
            }
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      getAreaHotel() {
        this.tableData = [];
        this.$axios
          .get("/api/hoInChannelArea/getV2ChannelArea")
          .then(res => {
            console.log(res.data);
            this.testoptions = res.data.data;

            this.getChannelMes();
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      getChannelMes() {
        this.tableData = [];
        this.$axios
          .get("/api/hoAppChannelMes/getAppChannelMes/" + this.hotelId)
          .then(res => {
            console.log(res.data);
            this.options = this.testoptions;
            this.selectedOptions.push(res.data.data.operatorId + "");
            this.selectedOptions.push(res.data.data.areaId + "");
            this.selectedOptions.push(res.data.data.areaHotelId + "");
            this.value3 = res.data.data.isOneTwo + "";
            this.value4 = res.data.data.isPlayseek + "";
            this.areaHotelId = res.data.data.areaHotelId + "";
            this.getChannelType();
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      handleChannelUrlCheck(index, row) {
        this.channelNameId = row.id;
        this.channelName = row.urlName;
        this.urlDialogFormVisible = true;
        this.urlform.channelId = this.channelNameId;
        this.urlform.name = this.channelName;
        this.upurlform.channelId = this.channelNameId;
        this.upurlform.name = this.channelName;
        this.getUrl();
      },
      urlInsert() {
        if (isEmpty(this.urlform.url)) {
          this.$message.error("请输入地址");
          return;
        }
        if (isEmpty(this.urlform.isNet)) {
          this.urlform.isNet = "0";
        }

        let data = {
          hotelId: this.hotelId + "",
          channelId: this.urlform.channelId + "",
          url: this.urlform.url,
          isNet: this.urlform.isNet + ""
        };
        this.$axios
          .post("/api/hoV2AppChannelUrl/insertUrl", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.inUrlDialogFormVisible = false;
              this.$message.success("添加成功");
              this.getUrl();
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      insertDialogUrl() {
        this.inUrlDialogFormVisible = true;
        // this.$prompt("添加" + this.channelName + "地址", '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        // }).then(({
        //   value
        // }) => {
        //   console.log(value)
        //   let data = {
        //     hotelId: this.hotelId + "",
        //     channelId: this.channelNameId + "",
        //     url: value
        //   }
        //   this.$axios
        //     .post("/api/hoV2AppChannelUrl/insertUrl", data)
        //     .then(res => {
        //       console.log(res.data);
        //       if (res.data.code == 0) {
        //         this.$message.success("添加成功")
        //         this.getUrl()
        //       } else {
        //         this.$message.error(res.data.msg)
        //       }
        //     }).catch((err) => {
        //       console.log(err + "错误");
        //     });
        // }).catch(() => {

        // });
      },
      getUrl() {
        this.urlData = [];
        this.$axios
          .get("/api/hoV2AppChannelUrl/getUrl/" + this.channelNameId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.urlData.push({
                id: res.data.data[i].id,
                url: res.data.data[i].url,
                urlType: res.data.data[i].isNet == 0 ? "互联网源" : "运营商源",
                errNum: res.data.data[i].errNum,
                isNet: res.data.data[i].isNet + "",
                channelId: res.data.data[i].channelId,
                isAppShow: res.data.data[i].isAppShow == 0 ? "0" : "1"
              });
            }
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },

      urlUpdate() {
        if (isEmpty(this.upurlform.url)) {
          this.$message.error("请输入地址");
          return;
        }
        let data = {
          channelId: this.upurlform.channelId + "",
          url: this.upurlform.url,
          id: this.upurlform.id + "",
          isNet: this.upurlform.isNet + ""
        };
        this.$axios
          .post("/api/hoV2AppChannelUrl/updateUrl", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.$message.success("修改成功");
              this.upUrlDialogFormVisible = false;
              this.getUrl();
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },

      handleUrlEdit(index, row) {
        this.upurlform.id = row.id;
        this.upurlform.url = row.url;
        this.upurlform.isNet = row.isNet;
        this.upUrlDialogFormVisible = true;
        // this.$prompt("修改" + this.channelName + "地址", '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   inputValue: row.url,
        //   inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        // }).then(({
        //   value
        // }) => {
        //   console.log(value)
        //   let data = {

        //     channelId: this.channelNameId + "",
        //     url: value,
        //     id: row.id + ""
        //   }
        //   this.$axios
        //     .post("/api/hoV2AppChannelUrl/updateUrl", data)
        //     .then(res => {
        //       console.log(res.data);
        //       if (res.data.code == 0) {
        //         this.$message.success("修改成功")
        //         this.getUrl()
        //       } else {
        //         this.$message.error(res.data.msg)
        //       }
        //     }).catch((err) => {
        //       console.log(err + "错误");
        //     });
        // }).catch(() => {

        // });
      },

      switchUrl(value, row) {
        let data = {
          urlId: row.id + "",
          isAppShow: value + ""
        };
        this.$axios
          .post("/api/hoV2AppChannelUrl/switchUrl", data)
          .then(res => {
            console.log(res.data);
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      handleErrdelete(index, row) {
        let data = {
          channelId: row.id + ""
        };
        this.$axios
          .post("/api/hoV2AppChannelUrl/clearErr", data)
          .then(res => {
            console.log(res.data);
            row.errNum = 0;
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      handleUrlErrdelete(index, row) {
        let data = {
          urlId: row.id + ""
        };
        this.$axios
          .post("/api/hoV2AppChannelUrl/clearErr", data)
          .then(res => {
            console.log(res.data);
            row.errNum = 0;
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      handleUrldelete(index, row) {
        let data = {
          urlId: row.id + ""
        };
        this.$axios
          .post("/api/hoV2AppChannelUrl/deleteUrl", data)
          .then(res => {
            console.log(res.data);
            this.getUrl();
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      importExcel() {
        this.txtDialogFormVisible = true;
        this.txtCheckVisible = true;
        this.txtMes = "";
      },
      importMes() {
        let data = {
          importMes: this.txtMes + "",
          hotelId: this.hotelId + "",
          typeId: this.typeId + ""
        };
        this.$axios
          .post("/api/hoV2AppChannelName/importMes", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.txtDialogFormVisible = false;
              this.getChannel();
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err + "错误");
          });
        console.log(this.txtMes);
      },
      exportExcel() {
        this.txtMes = "";
        this.txtDialogFormVisible = true;
        (this.txtCheckVisible = false),
        this.$axios
          .get("/api/hoV2AppChannelName/exportMes/" + this.typeId)
          .then(res => {
            console.log(res.data);
            this.txtMes = res.data.data;
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      openPlaySort() {
        this.timeChannelData = [];
        this.value2 = [];
        this.channelTimeDialogFormVisible = true;
        this.value2.push(new Date());
        this.value2.push(new Date());
        let data = {
          times: this.value2,
          hotelId: this.hotelId + ""
        };
        this.$axios
          .post("/api/hoV2AppChannelTime/getTimeSort", data)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.timeChannelData.push({
                channelId: res.data.data[i].channelId,
                channelName: res.data.data[i].channelName,
                playTime: parseInt(res.data.data[i].playTime / 60) +
                  "分" +
                  ((res.data.data[i].playTime % 60) + "秒"),
                channelNum: i + 1
              });
            }
          })
          .catch(err => {
            console.log(err + "错误");
          });
      },
      chooseTime() {
        this.timeChannelData = [];
        console.log(this.value2);
        let data = {
          times: this.value2,
          hotelId: this.hotelId + ""
        };
        this.$axios
          .post("/api/hoV2AppChannelTime/getTimeSort", data)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.timeChannelData.push({
                channelId: res.data.data[i].channelId,
                channelName: res.data.data[i].channelName,
                playTime: parseInt(res.data.data[i].playTime / 60) +
                  "分" +
                  ((res.data.data[i].playTime % 60) + "秒"),
                channelNum: i + 1
              });
            }
          })
          .catch(err => {
            console.log(err + "错误");
          });
      }
    },
    created() {
      // this.getChannelType()
      this.getAreaHotel();
      // this.getChannelMes()
    },
    components: {
      draggable
    }
  };

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
    -webkit-transition: border 0.3s ease-in;
    transition: border 0.3s ease-in;
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
    border-style: dashed;
  }

</style>
