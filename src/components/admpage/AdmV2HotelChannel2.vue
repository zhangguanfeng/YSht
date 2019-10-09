<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>默认列表配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-row>
        <el-cascader placeholder="请选择直播源" :options="options" filterable @change="selectArea"></el-cascader>
        <el-button type="primary" @click="openAreaDialog">添加区域</el-button>
        <el-button type="primary" @click="openInAreaHotelDialog">添加区域酒店</el-button>
        <el-button type="primary" @click="openInTypeDialog">添加类别</el-button>
        <el-button type="primary" @click="openListType">类别管理</el-button>
        <el-button type="primary" @click=" openExtraDialog">额外源管理</el-button>
        <el-switch v-model="value3" active-text="开启节目预告" inactive-text="不开启节目预告">
        </el-switch>
        <el-switch v-model="value4" active-text="开启节目采集" inactive-text="不开启节目采集">
        </el-switch>
      </el-row>
      <div style="height:20px"></div>
      <el-row>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>{{ operatorName }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ areaName }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ areaHotelName }}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-row>
      <div style="height:20px"></div>
      <el-tabs type="border-card" @tab-click="handleTagClick" v-model="currentTagName">
        <el-tab-pane v-for="item in tags" :key="item.id" :label="item.name" :name="item.name">
          <el-button type="primary" @click="openInChannelNameDialog">添加频道</el-button>
          <el-button type="primary" @click="openSortChannelDialog">排序频道</el-button>
          <el-button type="primary" @click="exportExcel">导出数据</el-button>
          <el-button type="primary" @click="importExcel">导入数据</el-button>
          <!-- <input type="file" class="upload" ref="refexcel" @change="uploadExcel" id="excelId" style="display: none;" /> -->

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
            <el-table-column label="epg" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.egpCode}}</span>
              </template>
            </el-table-column>
            <el-table-column label="电信Id" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.telecomId}}</span>
              </template>
            </el-table-column>
            <el-table-column label="报错次数" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.errNum}}</span>
              </template>
            </el-table-column>
            <el-table-column label="地址总数" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.urlNum}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="500px">
              <template slot-scope="scope">
                <el-button type="primary" @click="handleChannelUrlInsert(scope.$index, scope.row)">添加地址</el-button>
                <el-button type="primary" @click="handleChannelUrlCheck(scope.$index, scope.row)">查看地址</el-button>
                <el-button type="primary" @click="handleChannelEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" @click="handleErrdelete(scope.$index, scope.row)">清除报错</el-button>
                <!-- <el-button type="danger" @click="handleChanneldelete(scope.$index, scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加区域酒店对话框 -->
      <el-dialog title="添加区域酒店" :visible.sync="inAreaHotelDialogFormVisible">
        <el-form :model="hotelareaform">
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="hotelareaform.areaHotelName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="区域名称" :label-width="formLabelWidth">
            <el-input v-model="areaName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="运营商名称" :label-width="formLabelWidth">
            <el-input v-model="operatorName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="areaHotelInsert">确 定</el-button>
          <el-button @click="inAreaHotelDialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 添加类别对话框 -->
      <el-dialog title="添加类别" :visible.sync="inTypeDialogFormVisible">
        <el-form :model="typeform">
          <el-form-item label="类别名称" :label-width="formLabelWidth">
            <el-input v-model="typeform.typeName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="区域酒店名称" :label-width="formLabelWidth">
            <el-input v-model="areaHotelName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="区域名称" :label-width="formLabelWidth">
            <el-input v-model="areaName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="运营商名称" :label-width="formLabelWidth">
            <el-input v-model="operatorName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="typeInsert">确 定</el-button>
          <el-button @click="inTypeDialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 查看地址 -->
      <el-dialog :title="channelName+'地址列表'" :visible.sync="urlDialogFormVisible" width="800px">
        <!-- <el-button type="primary" @click="insertDialogUrl">添加地址</el-button> -->
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
          <el-table-column label="操作" align="center">
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
                {{item.name}}
              </div>
            </draggable>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="sortType" type="primary">确定</el-button>
          <el-button @click="sortTypeDialogFormVisible = false">关闭</el-button>
        </div>
      </el-dialog>

      <!-- 频道编辑对话框 -->
      <el-dialog title="频道编辑" :visible.sync="upChannelDialogFormVisible">
        <el-form :model="upchannelform">
          <el-form-item label="频道名称" :label-width="formLabelWidth">
            <el-input v-model="upchannelform.urlName"></el-input>
          </el-form-item>
          <el-form-item label="egp" :label-width="formLabelWidth">
            <el-input v-model="upchannelform.egpCode"></el-input>
          </el-form-item>
          <el-form-item label="电信id" :label-width="formLabelWidth">
            <el-input v-model="upchannelform.telecomId"></el-input>
          </el-form-item>
          <el-form-item label="所属类别" :label-width="formLabelWidth">
            <el-input v-model="typeName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="所属区域" :label-width="formLabelWidth">
            <el-input v-model="areaHotelName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="所属区域" :label-width="formLabelWidth">
            <el-input v-model="areaName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="所属运营商" :label-width="formLabelWidth">
            <el-input v-model="operatorName" autocomplete="off" :disabled="true"></el-input>
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
                {{item.name}}
              </div>
            </draggable>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="sortChannel" type="primary">确定</el-button>
          <el-button @click="sortChannelDialogFormVisible = false">关闭</el-button>
        </div>
      </el-dialog>

      <!-- 添加区域 -->
      <el-dialog title="添加区域" :visible.sync="inAreaVisible">
        <el-form>
          <el-form-item label="区域名称" :label-width="formLabelWidth">
            <el-select v-model="inAreaName" filterable placeholder="请选择">
              <el-option v-for="item in areaoptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运营商名称" :label-width="formLabelWidth">
            <el-select v-model="inOperatorName" filterable placeholder="请选择">
              <el-option v-for="item in operatoroptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="insertArea">确 定</el-button>
          <el-button @click="inAreaVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 添加频道 -->
      <el-dialog title="添加频道" :visible.sync="inChannelDialogFormVisible">
        <el-form :model="channelform">
          <el-form-item label="频道名称" :label-width="formLabelWidth">
            <el-input v-model="channelform.urlName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="egp" :label-width="formLabelWidth">
            <el-input v-model="channelform.egpCode" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电信id" :label-width="formLabelWidth">
            <el-input v-model="channelform.telecomId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属类别" :label-width="formLabelWidth">
            <el-input v-model="typeName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="所属区域" :label-width="formLabelWidth">
            <el-input v-model="areaHotelName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="所属区域" :label-width="formLabelWidth">
            <el-input v-model="areaName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="所属运营商" :label-width="formLabelWidth">
            <el-input v-model="operatorName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="channelInsert">确 定</el-button>
          <el-button @click="inChannelDialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>


      <!-- 额外源管理 -->
      <el-dialog title="额外源频道管理" :visible.sync="exChannelDialogFormVisible">
        <el-button type="primary" @click="openInExChannelNameDialog">添加频道</el-button>
        <el-table :data="extableData" stripe style="width: 100%"
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
          <el-table-column label="epg" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.egpCode}}</span>
            </template>
          </el-table-column>
          <el-table-column label="电信Id" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.telecomId}}</span>
            </template>
          </el-table-column>
          <el-table-column label="地址总数" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.urlNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="错误次数" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.errNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="500px">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleChannelUrlInsert(scope.$index, scope.row)">添加地址</el-button>
              <el-button type="primary" @click="handleChannelUrlCheck(scope.$index, scope.row)">查看地址</el-button>
              <el-button type="primary" @click="handleChannelEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" @click="handleErrdelete(scope.$index, scope.row)">清除错误</el-button>
              <!-- <el-button type="danger" @click="handleChanneldelete(scope.$index, scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>


      <!-- 添加额外源频道 -->
      <el-dialog title="添加额外频道" :visible.sync="inExChannelDialogFormVisible">
        <el-form :model="channelform">
          <el-form-item label="频道名称" :label-width="formLabelWidth">
            <el-input v-model="channelform.urlName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="egp" :label-width="formLabelWidth">
            <el-input v-model="channelform.egpCode" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电信id" :label-width="formLabelWidth">
            <el-input v-model="channelform.telecomId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属类别" :label-width="formLabelWidth">
            <el-input v-model="typeName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="所属区域" :label-width="formLabelWidth">
            <el-input v-model="areaHotelName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="所属区域" :label-width="formLabelWidth">
            <el-input v-model="areaName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="所属运营商" :label-width="formLabelWidth">
            <el-input v-model="operatorName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="channelExInsert">确 定</el-button>
          <el-button @click="inExChannelDialogFormVisible = false">取 消</el-button>
        </div>
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
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import XLSX from 'xlsx'
  import {
    isEmpty
  } from '../../../static/js/util.js'
  import {
    city
  } from '../../../static/js/city.js'
  export default {
    //写上name参数会被缓存
    name: "admv2hotelchannel",
    data() {
      return {
        operatoroptions: [],
        inOperatorName: "",
        inAreaName: "",
        areaoptions: [],
        inAreaVisible: false,
        dragOptions: {
          animation: 120,
          scroll: true,
          group: 'sortlist',
          ghostClass: 'ghost-style'
        },
        value: true,
        formLabelWidth: "120px",
        inTypeDialogFormVisible: false,
        inChannelDialogFormVisible: false,
        inAreaHotelDialogFormVisible: false,
        listTypeDialogFormVisible: false,
        sortTypeDialogFormVisible: false,
        upChannelDialogFormVisible: false,
        sortChannelDialogFormVisible: false,
        listExtraDialogFormVisible: false,
        inExChannelDialogFormVisible: false,
        upExChannelDialogFormVisible: false,
        exChannelDialogFormVisible: false,
        urlDialogFormVisible: false,
        txtDialogFormVisible: false,
        txtCheckVisible: false,
        currentTagName: "",
        typeName: "",
        typeId: "",
        operatorId: "",
        operatorName: "",
        areaId: "",
        areaName: "",
        areaHotelName: "",
        areaHotelId: "",
        options: [],
        tags: [],

        typeform: {
          typeName: ""
        },
        channelform: {
          channelId: "",
          urlName: "",
          egpCode: "",
          telecomId: "",
        },
        upchannelform: {
          channelId: "",
          urlName: "",
          egpCode: "",
          telecomId: "",
        },
        hotelareaform: {
          areaHotelName: ""
        },
        exinchannelform: {
          name: "",
          url: ""
        },
        exupchannelform: {
          id: "",
          name: "",
          url: "",
        },
        tableData: [],
        listTypeData: [],
        listsortTypeData: [],
        listsortChannelData: [],
        listExtraData: [],
        urlData: [],
        extableData: [],
        channelNameId: null,
        channelName: null,
        value3: true,
        value4: true,
        txtMes: "",
        placeTxt: '请按照如下格式导入<br/>#频道名称##  (注意：#号要有三个)<br/>@0@频道地址<br/>@1@频道地址<br/>#频道名称##<br/>@0@频道地址<br/>@1@频道地址(注意：@0代表是互联网源，@1代表是运营商源)',
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
      }
    },
    methods: {
      getChannelArea() {
        this.options = [];
        this.$axios
          .get("/api/hoInChannelArea/getChannelArea")
          .then(res => {
            console.log(res.data);
            this.options = res.data.data;

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      selectArea(value) {
        if (value.length == 3) {
          var arr1 = value[0].split("-");
          var arr2 = value[1].split("-");
          var arr3 = value[2].split("-")
          this.operatorName = arr1[1];
          this.areaName = arr2[1];
          this.operatorId = arr1[0];
          this.areaId = arr2[0];
          this.areaHotelId = arr3[0];
          this.areaHotelName = arr3[1];
          this.getChannelType();
        }
      },
      openAreaDialog() {
        this.operatoroptions = []
        this.inAreaVisible = true;
        this.operatoroptions.push({
          "label": "电信",
          "value": "1",
        })
        this.operatoroptions.push({
          "label": "联通",
          "value": "2",
        })
        this.operatoroptions.push({
          "label": "移动",
          "value": "3",
        })
        this.areaoptions = city
      },
      insertArea() {
        let data = {
          operatorId: this.inOperatorName,
          areaCode: this.inAreaName
        }
        this.$axios
          .post("/api/hoInChannelArea/v2/insertArea", data)
          .then(res => {
            if (res.data.code == 0) {
              this.getChannelArea()
              this.inAreaVisible = false;
              this.$message.success("添加成功")
            } else {
              this.$message.error("已存在")
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },

      openInAreaHotelDialog() {
        if (isEmpty(this.areaId)) {
          this.$message.error("请先选择一个区域")
          return
        }
        this.inAreaHotelDialogFormVisible = true
      },

      areaHotelInsert() {
        if (isEmpty(this.hotelareaform.areaHotelName)) {
          this.$message.error("请输入名称")
          return
        }
        let data = {
          areaId: this.areaId,
          areaHotelName: this.hotelareaform.areaHotelName
        }
        this.$axios
          .post("/api/hoInChannelUrl/inserAreaHotel", data)
          .then(res => {
            console.log(res.data);
            this.inAreaHotelDialogFormVisible = false;
            this.getChannelArea();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      openInTypeDialog() {
        if (isEmpty(this.areaHotelId)) {
          this.$message.error("请先选择一个区域酒店")
          return
        }
        this.inTypeDialogFormVisible = true;
      },

      typeInsert() {
        if (isEmpty(this.typeform.typeName)) {
          this.$message.error("请输入名称")
          return
        }
        console.log(this.areaHotelId)
        let data = {
          "areaHotelId": this.areaHotelId + "",
          "typeName": this.typeform.typeName
        }
        this.$axios
          .post("/api/hoV2InChannelType/inserType", data)
          .then(res => {
            console.log(res.data);
            this.inTypeDialogFormVisible = false;
            this.getChannelType();

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getChannelType() {
        this.tags = [];
        this.listTypeData = [];
        this.currentTagName = ""
        this.$axios
          .get("/api/hoV2InChannelType/getType/" + this.areaHotelId)
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
                "isAppShow": res.data.data[i].isAppShow == 0 ? "0" : "1"
              })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },

      openListType() {
        if (isEmpty(this.areaHotelId)) {
          this.$message.error("请先选择一个区域酒店")
          return
        }
        this.listTypeDialogFormVisible = true;

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
            areaHotelId: this.areaHotelId + "",
            typeId: row.id + "",
            typeName: value
          }
          this.$axios
            .post("/api/hoV2InChannelType/updateType", data)
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
          .post("/api/hoV2InChannelType/deleteType", data)
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
      openSortTypeDialog() {
        this.listsortTypeData = []
        this.sortTypeDialogFormVisible = true;
        for (var i = 0; i < this.listTypeData.length; i++) {
          this.listsortTypeData.push({
            "id": this.listTypeData[i].id,
            "name": this.listTypeData[i].name
          })
        }
      },
      sortType() {
        this.$axios
          .post("/api/hoV2InChannelType/sortType", this.listsortTypeData)
          .then(res => {
            console.log(res.data);
            this.sortTypeDialogFormVisible = false;
            this.getChannelType();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleTagClick(tab, event) {
        console.log(tab.name);
        let data = this.tags.find(item => {
          return item.name == tab.name;
        })
        this.typeId = data.id;
        this.typeName = data.name;
        this.getChannel();
        // console.log(this.typeId, this.typeName);
      },
      openInChannelNameDialog() {
        this.inChannelDialogFormVisible = true
        this.channelform.urlName = ""
        this.channelform.egpCode = ""
        this.channelform.telecomId = ""
      },
      openInExChannelNameDialog() {
        this.inExChannelDialogFormVisible = true
        this.channelform.urlName = ""
        this.channelform.egpCode = ""
        this.channelform.telecomId = ""
      },
      getChannel() {

        this.tableData = [];
        this.$axios
          .get("/api/hoV2InChannelName/getChannel/" + this.typeId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tableData.push({
                "id": res.data.data[i].id,
                "egpCode": res.data.data[i].egpCode,
                "errNum": res.data.data[i].errNum,
                "telecomId": res.data.data[i].telecomId,
                "urlName": res.data.data[i].name,
                "isAppShow": res.data.data[i].isAppShow + "",
                "urlNum": res.data.data[i].urlNum
              })

            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      urlInsert() {
        if (isEmpty(this.urlform.url)) {
          this.$message.error("请输入地址")
          return
        }
        if (isEmpty(this.urlform.isNet)) {
          this.urlform.isNet = "0"
        }

        let data = {
          areaHotelId: this.areaHotelId + "",
          channelId: this.urlform.channelId + "",
          url: this.urlform.url,
          isNet: this.urlform.isNet + ""
        }
        this.$axios
          .post("/api/hoV2InChannelUrl/insertUrl", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.inUrlDialogFormVisible = false
              this.$message.success("添加成功")
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleChannelUrlInsert(index, row) {
        this.urlform.name = row.urlName
        this.inUrlDialogFormVisible = true
        this.urlform.channelId = row.id
        this.urlform.url = ""
        this.urlform.isNet = ""
        // let data = {
        //     areaHotelId: this.areaHotelId + "",
        //     channelId: row.id + "",
        //     url: value
        //   }
        //   this.$axios
        //     .post("/api/hoV2InChannelUrl/insertUrl", data)
        //     .then(res => {
        //       console.log(res.data);
        //       if (res.data.code == 0) {
        //         this.$message.success("添加成功")
        //       } else {
        //         this.$message.error(res.data.msg)
        //       }
        //     }).catch((err) => {
        //       console.log(err + "错误");
        //     });
        // this.$prompt("添加" + row.urlName + "地址", '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',

        //   inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        // }).then(({
        //   value
        // }) => {
        //   console.log(value)
        //   let data = {
        //     areaHotelId: this.areaHotelId + "",
        //     channelId: row.id + "",
        //     url: value
        //   }
        //   this.$axios
        //     .post("/api/hoV2InChannelUrl/insertUrl", data)
        //     .then(res => {
        //       console.log(res.data);
        //       if (res.data.code == 0) {
        //         this.$message.success("添加成功")
        //       } else {
        //         this.$message.error(res.data.msg)
        //       }
        //     }).catch((err) => {
        //       console.log(err + "错误");
        //     });
        // }).catch(() => {

        // });
      },
      handleChannelEdit(index, row) {
        this.upchannelform.channelId = row.id
        this.upchannelform.urlName = row.urlName
        this.upchannelform.egpCode = row.egpCode
        this.upchannelform.telecomId = row.telecomId
        this.upChannelDialogFormVisible = true;
      },
      handleChannelUrlCheck(index, row) {
        this.channelNameId = row.id
        this.channelName = row.urlName
        this.urlDialogFormVisible = true
        this.getUrl()
      },
      channelUpdate() {
        if (isEmpty(this.upchannelform.urlName)) {
          this.$message.error("请输入名称")
          return
        }

        let data = {
          channelId: this.upchannelform.channelId + "",
          urlName: this.upchannelform.urlName,
          telecomId: this.upchannelform.telecomId + "",
          egpCode: this.upchannelform.egpCode + ""
        }
        this.$axios
          .post("/api/hoV2InChannelName/updateChannel", data)
          .then(res => {
            console.log(res.data);
            this.upChannelDialogFormVisible = false;
            this.getChannel();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },

      channelInsert() {
        if (isEmpty(this.channelform.urlName)) {
          this.$message.error("请输入名称")
          return
        }

        let data = {
          areaHotelId: this.areaHotelId + "",
          typeId: this.typeId + "",
          urlName: this.channelform.urlName,
          telecomId: this.channelform.telecomId + "",
          egpCode: this.channelform.egpCode,
        }
        this.$axios
          .post("/api/hoV2InChannelName/insertChannel", data)
          .then(res => {
            console.log(res.data);
            this.inChannelDialogFormVisible = false;
            this.getChannel();
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
            name: this.tableData[i].urlName
          })
        }
      },
      sortChannel() {
        this.$axios
          .post("/api/hoV2InChannelName/sortChannel", this.listsortChannelData)
          .then(res => {
            console.log(res.data);
            this.sortChannelDialogFormVisible = false;
            this.getChannel();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      insertDialogUrl() {
        this.$prompt("添加" + this.channelName + "地址", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/
        }).then(({
          value
        }) => {
          console.log(value)
          let data = {
            areaHotelId: this.areaHotelId + "",
            channelId: this.channelNameId + "",
            url: value
          }
          this.$axios
            .post("/api/hoV2InChannelUrl/insertUrl", data)
            .then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.$message.success("添加成功")
                this.getUrl()
              } else {
                this.$message.error(res.data.msg)
              }
            }).catch((err) => {
              console.log(err + "错误");
            });
        }).catch(() => {

        });
      },
      getUrl() {
        this.urlData = []
        this.$axios
          .get("/api/hoV2InChannelUrl/getUrl/" + this.channelNameId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.urlData.push({
                id: res.data.data[i].id,
                url: res.data.data[i].url,
                urlType: res.data.data[i].isNet == 0 ? "互联网源" : "运营商源",
                isNet: res.data.data[i].isNet + "",
                errNum: res.data.data[i].errNum,
                channelId: res.data.data[i].channelId,
                isAppShow: res.data.data[i].isAppShow == 0 ? "0" : "1",
              })
            }

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      urlUpdate() {
        if (isEmpty(this.upurlform.url)) {
          this.$message.error("请输入地址")
          return
        }
        let data = {

          channelId: this.channelNameId + "",
          url: this.upurlform.url,
          id: this.upurlform.id + "",
          isNet: this.upurlform.isNet + ""
        }
        this.$axios
          .post("/api/hoV2InChannelUrl/updateUrl", data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.$message.success("修改成功")
              this.upUrlDialogFormVisible=false
              this.getUrl()
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleUrlEdit(index, row) {
        this.upurlform.name = this.channelName
        this.upUrlDialogFormVisible = true
        // this.upurlform.channelId = this.channelNameId
        this.upurlform.url = row.url
        this.upurlform.isNet = row.isNet
        this.upurlform.id = row.id
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
        //     .post("/api/hoV2InChannelUrl/updateUrl", data)
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
      getExChannel() {

        this.extableData = [];
        this.$axios
          .get("/api/hoV2InChannelName/getExtraChannel/" + this.areaHotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.extableData.push({
                "id": res.data.data[i].id,
                "egpCode": res.data.data[i].egpCode,
                "errNum": res.data.data[i].errNum,
                "telecomId": res.data.data[i].telecomId,
                "urlName": res.data.data[i].name,
                "isAppShow": res.data.data[i].isAppShow + "",
                "urlNum": res.data.data[i].urlNum
              })

            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      openExtraDialog() {
        if (isEmpty(this.areaHotelId)) {
          this.$message.error("请先选择一个区域酒店")
          return
        }
        this.exChannelDialogFormVisible = true
        this.getExChannel()
      },
      channelExInsert() {
        if (isEmpty(this.channelform.urlName)) {
          this.$message.error("请输入名称")
          return
        }

        let data = {
          areaHotelId: this.areaHotelId + "",
          urlName: this.channelform.urlName,
          telecomId: this.channelform.telecomId + "",
          egpCode: this.channelform.egpCode,
        }
        this.$axios
          .post("/api/hoV2InChannelName/insertExtraChannel", data)
          .then(res => {
            console.log(res.data);
            this.inExChannelDialogFormVisible = false;
            this.getExChannel();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      switchChannel(value, row) {
        let data = {
          channelId: row.id + "",
          isAppShow: value + "",
          areaHotelId: this.areaHotelId + ""
        }
        this.$axios
          .post("/api/hoV2InChannelName/switchChannel", data)
          .then(res => {
            console.log(res.data);

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      switchUrl(value, row) {
        let data = {
          urlId: row.id + "",
          isAppShow: value + ""
        }
        this.$axios
          .post("/api/hoV2InChannelUrl/switchUrl", data)
          .then(res => {
            console.log(res.data);

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleErrdelete(index, row) {
        let data = {
          channelId: row.id + "",
        }
        this.$axios
          .post("/api/hoV2InChannelName/clearErr", data)
          .then(res => {
            console.log(res.data);
            row.errNum = 0;
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleUrlErrdelete(index, row) {
        let data = {
          urlId: row.id + "",
        }
        this.$axios
          .post("/api/hoV2InChannelUrl/clearErr", data)
          .then(res => {
            console.log(res.data);
            row.errNum = 0;
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleUrldelete(index, row) {
        let data = {
          urlId: row.id + "",
        }
        this.$axios
          .post("/api/hoV2InChannelUrl/deleteUrl", data)
          .then(res => {
            console.log(res.data);
            this.getUrl()
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      switchType(value, row) {
        let data = {
          typeId: row.id + "",
          isAppShow: value + "",
          areaHotelId: this.areaHotelId + "",
        }
        this.$axios
          .post("/api/hoV2InChannelType/switchType", data)
          .then(res => {
            console.log(res.data);

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      importExcel() {
        this.txtDialogFormVisible = true
        this.txtCheckVisible = true
        this.txtMes = ""
      },
      importMes() {
        let data = {
          importMes: this.txtMes + "",
          areaHotelId: this.areaHotelId + "",
          typeId: this.typeId + "",
        }
        this.$axios
          .post("/api/hoV2InChannelName/importMes", data)
          .then(res => {
            console.log(res.data);
            if(res.data.code==0){
              this.txtDialogFormVisible = false
              this.getChannel()
            
            }else{
              this.$message.error(res.data.msg)
            }
          
          }).catch((err) => {
            console.log(err + "错误");
          });
        console.log(this.txtMes)
      },
      exportExcel() {
        this.txtMes = ""
        this.txtDialogFormVisible = true;
        this.txtCheckVisible = false,
          this.$axios
          .get("/api/hoV2InChannelName/exportMes/" + this.typeId)
          .then(res => {
            console.log(res.data);
            this.txtMes = res.data.data
          }).catch((err) => {
            console.log(err + "错误");
          });
      }
      //   handleExtraEdit(index, row) {
      //     this.exupchannelform.id = row.id;
      //     this.exupchannelform.name = row.name;
      //     this.exupchannelform.url = row.url;
      //     this.upExChannelDialogFormVisible = true;

      //   },
      //   updateExtraChannel() {
      //     if (isEmpty(this.exupchannelform.name)) {
      //       this.$message.error("请输入名称")
      //       return
      //     }
      //     if (isEmpty(this.exupchannelform.url)) {
      //       this.$message.error("请输入地址")
      //       return
      //     }
      //     let data = {
      //       id: this.exupchannelform.id + "",
      //       name: this.exupchannelform.name,
      //       url: this.exupchannelform.url
      //     }
      //     this.$axios
      //       .post("/api/hoInChannelUrl/updateExtraChannel", data)
      //       .then(res => {
      //         console.log(res.data);
      //         this.upExChannelDialogFormVisible = false;
      //         this.getExtraChannel();
      //       }).catch((err) => {
      //         console.log(err + "错误");
      //       });
      //   },
      //   handleExtradelete(index, row) {
      //     let data = {
      //       id: row.id + ""
      //     }
      //     this.$axios
      //       .post("/api/hoInChannelUrl/deleteExtraChannel", data)
      //       .then(res => {
      //         console.log(res.data);
      //         this.getExtraChannel();
      //       }).catch((err) => {
      //         console.log(err + "错误");
      //       });
      //   },
      //   insertExtraChannel() {
      //     if (isEmpty(this.exinchannelform.name)) {
      //       this.$message.error("请输入名称")
      //       return
      //     }
      //     if (isEmpty(this.exinchannelform.url)) {
      //       this.$message.error("请输入地址")
      //       return
      //     }
      //     let data = {
      //       areaHotelId: this.areaHotelId + "",
      //       name: this.exinchannelform.name,
      //       url: this.exinchannelform.url
      //     }
      //     this.$axios
      //       .post("/api/hoInChannelUrl/insertExtraChannel", data)
      //       .then(res => {
      //         console.log(res.data);
      //         this.inExChannelDialogFormVisible = false;
      //         this.getExtraChannel();
      //       }).catch((err) => {
      //         console.log(err + "错误");
      //       });
      //   },


      //   getExtraChannel() {
      //     this.listExtraData = [];
      //     this.$axios
      //       .get("/api/hoInChannelUrl/getExtraChannel/" + this.areaHotelId)
      //       .then(res => {
      //         console.log(res.data);
      //         for (var i = 0; i < res.data.data.length; i++) {
      //           this.listExtraData.push({
      //             "id": res.data.data[i].id,
      //             "name": res.data.data[i].name,
      //             "url": res.data.data[i].netUrl,
      //             "isAppShow": res.data.data[i].isAppShow + ""
      //           })
      //         }
      //       }).catch((err) => {
      //         console.log(err + "错误");
      //       });
      //   },

      //   openInExtraDialog() {
      //     this.inExChannelDialogFormVisible = true;
      //   },

      //   switchExtraChannel(value, row) {
      //     let data = {
      //       id: row.id + "",
      //       isAppShow: value + ""
      //     }
      //     this.$axios
      //       .post("/api/hoInChannelUrl/switchExtraChannel", data)
      //       .then(res => {
      //         console.log(res.data);
      //       }).catch((err) => {
      //         console.log(err + "错误");
      //       });
      //   },



      //   handleChanneldelete(index, row) {
      //     let data = {
      //       channelId: row.id + "",
      //     }
      //     this.$axios
      //       .post("/api/hoInChannelUrl/deleteChannel", data)
      //       .then(res => {
      //         console.log(res.data);
      //         this.getChannel();
      //       }).catch((err) => {
      //         console.log(err + "错误");
      //       });
      //   },

      //   openSortTypeDialog() {
      //     this.listsortTypeData = []
      //     this.sortTypeDialogFormVisible = true;
      //     for (var i = 0; i < this.listTypeData.length; i++) {
      //       this.listsortTypeData.push({
      //         "id": this.listTypeData[i].id,
      //         "name": this.listTypeData[i].name
      //       })
      //     }
      //   },

    },

    created() {
      this.getChannelArea();
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
