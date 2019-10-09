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
          <el-button type="primary" @click="inChannelDialogFormVisible=true">添加频道</el-button>
          <el-button type="primary" @click="openSortChannelDialog">排序频道</el-button>
          <el-button type="primary" @click="exportExcel">导出excel</el-button>
          <el-button type="primary" @click="importExcel">导入excel</el-button>
          <input type="file" class="upload" ref="refexcel" @change="uploadExcel" id="excelId" style="display: none;" />

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
            <el-table-column label="频道网络源" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.netUrl }}</span>
              </template>
            </el-table-column>
            <el-table-column label="频道组播源" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.groupUrl }}</span>
              </template>
            </el-table-column>
            <el-table-column label="电信Id" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.telecomId}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" @click="handleChannelEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" @click="handleChanneldelete(scope.$index, scope.row)">删除</el-button>
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

      <!-- 添加频道对话框 -->
      <el-dialog title="添加频道" :visible.sync="inChannelDialogFormVisible">
        <el-form :model="channelform">
          <el-form-item label="频道名称" :label-width="formLabelWidth">
            <el-input v-model="channelform.urlName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="网络源地址" :label-width="formLabelWidth">
            <el-input v-model="channelform.netUrl" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="组播源地址" :label-width="formLabelWidth">
            <el-input v-model="channelform.groupUrl" autocomplete="off"></el-input>
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
      <!-- 类别管理 -->
      <el-dialog title="类别列表" :visible.sync="listTypeDialogFormVisible">
        <el-button type="primary" @click="openSortTypeDialog">排序</el-button>
        <el-table :data="listTypeData" style="width: 100%">
          <el-table-column label="类别名称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
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
            <el-input v-model="upchannelform.urlName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="网络源地址" :label-width="formLabelWidth">
            <el-input v-model="upchannelform.netUrl" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="组播源地址" :label-width="formLabelWidth">
            <el-input v-model="upchannelform.groupUrl" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电信id" :label-width="formLabelWidth">
            <el-input v-model="upchannelform.telecomId" autocomplete="off"></el-input>
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

      <!-- 额外源管理 -->
      <el-dialog title="额外源列表" :visible.sync="listExtraDialogFormVisible">
        <el-button type="primary" @click="openInExtraDialog">添加额外源</el-button>
        <el-table :data="listExtraData" style="width: 100%">
          <el-table-column label="开/关" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isAppShow" active-value="0" inactive-value="1" @change="switchExtraChannel($event, scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="频道名称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="频道地址" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.url }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleExtraEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" @click="handleExtradelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <!-- 添加额外频道对话框 -->
      <el-dialog title="添加额外频道" :visible.sync="inExChannelDialogFormVisible">
        <el-form :model="exinchannelform">
          <el-form-item label="频道名称" :label-width="formLabelWidth">
            <el-input v-model="exinchannelform.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="网络源地址" :label-width="formLabelWidth">
            <el-input v-model="exinchannelform.url" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属酒店区域" :label-width="formLabelWidth">
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
          <el-button type="primary" @click="insertExtraChannel">确 定</el-button>
          <el-button @click="inExChannelDialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 编辑额外频道对话框 -->
      <el-dialog title="编辑额外频道" :visible.sync="upExChannelDialogFormVisible">
        <el-form :model="exupchannelform">
          <el-form-item label="频道名称" :label-width="formLabelWidth">
            <el-input v-model="exupchannelform.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="网络源地址" :label-width="formLabelWidth">
            <el-input v-model="exupchannelform.url" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateExtraChannel">确 定</el-button>
          <el-button @click="upExChannelDialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 添加区域 -->
      <el-dialog title="添加区域" :visible.sync="inAreaVisible">
        <el-form :model="exupchannelform">
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
    name: "admhotelchannel",
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
          groupUrl: "",
          netUrl: "",
          telecomId: "",
        },
        upchannelform: {
          channelId: "",
          urlName: "",
          groupUrl: "",
          netUrl: "",
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
        value3: true,
        value4: true
      }
    },
    methods: {
      openAreaDialog() {
        this.inAreaVisible = true;
        this.operatoroptions.push({
          "label": "电信",
          "value": "1",
        })
        this.operatoroptions.push({
          "label": "联通",
          "value": "2",
        })
        this.areaoptions = city
      },
      insertArea() {
        let data = {
          operatorId: this.inOperatorName,
          areaCode: this.inAreaName
        }
        this.$axios
          .post("/api/hoInChannelArea/insertArea", data)
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
      openInTypeDialog() {
        if (isEmpty(this.areaHotelId)) {
          this.$message.error("请先选择一个区域酒店")
          return
        }
        this.inTypeDialogFormVisible = true;
      },
      openInAreaHotelDialog() {
        if (isEmpty(this.areaId)) {
          this.$message.error("请先选择一个区域")
          return
        }
        this.inAreaHotelDialogFormVisible = true
      },
      importExcel() {
        document.getElementById("excelId").click();
      },
      uploadExcel(e) {
        const files = e.target.files
        const rawFile = files[0] // only use files[0]
        if (!this.isExcel(rawFile)) {
          this.$message.error('仅仅支持 导入 .xlsx, .xls, .csv suffix files')
          return;
        }
        this.readerData(rawFile)
      },
      isExcel(file) {
        return /\.(xlsx|xls|csv)$/.test(file.name)
      },
      generateData({
        header,
        results
      }) {
        let data = [];
        for (var i = 0; i < results.length; i++) {
          data.push({
            name: results[i].urlName,
            netUrl: results[i].netUrl,
            groupUrl: results[i].groupUrl,
            telecomId: results[i].telecomId,
            areaHotelId: this.areaHotelId,
            typeId: this.typeId,
          })
        }
        this.$axios
          .post("/api/hoInChannelUrl/insertExcelChannel", data)
          .then(res => {
            console.log(res.data);
            this.getChannel();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      readerData(rawFile) {
        this.loading = true
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = e => {
            const data = e.target.result
            const fixedData = this.fixData(data)
            const workbook = XLSX.read(btoa(fixedData), {
              type: 'base64'
            })
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]
            const header = this.getHeaderRow(worksheet)
            const results = XLSX.utils.sheet_to_json(worksheet)
            this.generateData({
              header,
              results
            })
            this.loading = false
            resolve()
          }
          reader.readAsArrayBuffer(rawFile)
        })
      },
      fixData(data) {
        let o = ''
        let l = 0
        const w = 10240
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l *
          w + w)))
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
        return o
      },
      getHeaderRow(sheet) {
        const headers = []
        const range = XLSX.utils.decode_range(sheet['!ref'])
        let C
        const R = range.s.r
        /* start in the first row */
        for (C = range.s.c; C <= range.e.c; ++C) {
          /* walk every column in the range */
          const cell = sheet[XLSX.utils.encode_cell({
            c: C,
            r: R
          })]
          /* find the cell in the first row */
          let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
          if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
          headers.push(hdr)
        }
        return headers
      },
      exportExcel() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['urlName', 'netUrl', 'groupUrl', 'telecomId']
          const filterVal = ['urlName', 'netUrl', 'groupUrl', 'telecomId']
          const data = this.formatJson(filterVal, this.tableData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.typeName,
            autoWidth: true,
            bookType: 'xlsx'
          })
        })
      },
      handleExtraEdit(index, row) {
        this.exupchannelform.id = row.id;
        this.exupchannelform.name = row.name;
        this.exupchannelform.url = row.url;
        this.upExChannelDialogFormVisible = true;

      },
      updateExtraChannel() {
        if (isEmpty(this.exupchannelform.name)) {
          this.$message.error("请输入名称")
          return
        }
        if (isEmpty(this.exupchannelform.url)) {
          this.$message.error("请输入地址")
          return
        }
        let data = {
          id: this.exupchannelform.id + "",
          name: this.exupchannelform.name,
          url: this.exupchannelform.url
        }
        this.$axios
          .post("/api/hoInChannelUrl/updateExtraChannel", data)
          .then(res => {
            console.log(res.data);
            this.upExChannelDialogFormVisible = false;
            this.getExtraChannel();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      handleExtradelete(index, row) {
        let data = {
          id: row.id + ""
        }
        this.$axios
          .post("/api/hoInChannelUrl/deleteExtraChannel", data)
          .then(res => {
            console.log(res.data);
            this.getExtraChannel();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      insertExtraChannel() {
        if (isEmpty(this.exinchannelform.name)) {
          this.$message.error("请输入名称")
          return
        }
        if (isEmpty(this.exinchannelform.url)) {
          this.$message.error("请输入地址")
          return
        }
        let data = {
          areaHotelId: this.areaHotelId + "",
          name: this.exinchannelform.name,
          url: this.exinchannelform.url
        }
        this.$axios
          .post("/api/hoInChannelUrl/insertExtraChannel", data)
          .then(res => {
            console.log(res.data);
            this.inExChannelDialogFormVisible = false;
            this.getExtraChannel();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      openExtraDialog() {
        if (isEmpty(this.areaHotelId)) {
          this.$message.error("请先选择一个区域酒店")
          return
        }
        this.listExtraDialogFormVisible = true;
        this.getExtraChannel()


      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j]
        }))
      },
      getExtraChannel() {
        this.listExtraData = [];
        this.$axios
          .get("/api/hoInChannelUrl/getExtraChannel/" + this.areaHotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.listExtraData.push({
                "id": res.data.data[i].id,
                "name": res.data.data[i].name,
                "url": res.data.data[i].netUrl,
                "isAppShow": res.data.data[i].isAppShow + ""
              })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      },

      openInExtraDialog() {
        this.inExChannelDialogFormVisible = true;
      },
      switchChannel(value, row) {
        let data = {
          channelId: row.id + "",
          isAppShow: value + ""
        }
        this.$axios
          .post("/api/hoInChannelUrl/switchChannel", data)
          .then(res => {
            console.log(res.data);

          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      switchExtraChannel(value, row) {
        let data = {
          id: row.id + "",
          isAppShow: value + ""
        }
        this.$axios
          .post("/api/hoInChannelUrl/switchExtraChannel", data)
          .then(res => {
            console.log(res.data);
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
          .post("/api/hoInChannelUrl/sortChannel", this.listsortChannelData)
          .then(res => {
            console.log(res.data);
            this.sortChannelDialogFormVisible = false;
            this.getChannel();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      channelUpdate() {
        if (isEmpty(this.upchannelform.urlName)) {
          this.$message.error("请输入名称")
          return
        }
        if (isEmpty(this.upchannelform.netUrl)) {
          this.$message.error("请输入地址")
          return
        }
        let data = {
          typeId: this.typeId + "",
          channelId: this.upchannelform.channelId + "",
          urlName: this.upchannelform.urlName,
          telecomId: this.upchannelform.telecomId + "",
          groupUrl: this.upchannelform.groupUrl,
          netUrl: this.upchannelform.netUrl,
        }
        this.$axios
          .post("/api/hoInChannelUrl/updateChannel", data)
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
          .post("/api/hoInChannelUrl/deleteChannel", data)
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
        this.upchannelform.groupUrl = row.groupUrl
        this.upchannelform.netUrl = row.netUrl
        this.upchannelform.telecomId = row.telecomId
        this.upChannelDialogFormVisible = true;
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
          .post("/api/hoInChannelUrl/sortType", this.listsortTypeData)
          .then(res => {
            console.log(res.data);
            this.sortTypeDialogFormVisible = false;
            this.getChannelType();
          }).catch((err) => {
            console.log(err + "错误");
          });
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
            .post("/api/hoInChannelUrl/updateType", data)
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
          .post("/api/hoInChannelUrl/deleteType", data)
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
        if (isEmpty(this.areaHotelId)) {
          this.$message.error("请先选择一个区域酒店")
          return
        }
        this.listTypeDialogFormVisible = true;

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
      handleTagClick(tab, event) {
        console.log(tab.name);
        let data = this.tags.find(item => {
          return item.name == tab.name;
        })
        this.typeId = data.id;
        this.typeName = data.name;
        this.getChannel();
        console.log(this.typeId, this.typeName);
      },
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
      getChannelType() {
        this.tags = [];
        this.listTypeData = [];
        this.currentTagName = ""
        this.$axios
          .get("/api/hoInChannelUrl/getType/" + this.areaHotelId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tags.push({
                "id": res.data.data[i].id,
                "name": res.data.data[i].name
              })
              this.listTypeData.push({
                "id": res.data.data[i].id,
                "name": res.data.data[i].name
              })
            }
          }).catch((err) => {
            console.log(err + "错误");
          });
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
          .post("/api/hoInChannelUrl/inserType", data)
          .then(res => {
            console.log(res.data);
            this.inTypeDialogFormVisible = false;
            this.getChannelType();

          }).catch((err) => {
            console.log(err + "错误");
          });
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
          areaHotelId: this.areaHotelId + "",
          typeId: this.typeId + "",
          urlName: this.channelform.urlName,
          telecomId: this.channelform.telecomId + "",
          groupUrl: this.channelform.groupUrl,
          netUrl: this.channelform.netUrl,
        }
        this.$axios
          .post("/api/hoInChannelUrl/insertChannel", data)
          .then(res => {
            console.log(res.data);
            this.inChannelDialogFormVisible = false;
            this.getChannel();
          }).catch((err) => {
            console.log(err + "错误");
          });
      },
      getChannel() {
        this.tableData = [];
        this.$axios
          .get("/api/hoInChannelUrl/getChannel/" + this.typeId)
          .then(res => {
            console.log(res.data);
            for (var i = 0; i < res.data.data.length; i++) {
              this.tableData.push({
                "id": res.data.data[i].id,
                "groupUrl": res.data.data[i].groupUrl,
                "netUrl": res.data.data[i].netUrl,
                "telecomId": res.data.data[i].telecomId,
                "urlName": res.data.data[i].name,
                "isAppShow": res.data.data[i].isAppShow + ""
              })

            }
          }).catch((err) => {
            console.log(err + "错误");
          });
      }
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
