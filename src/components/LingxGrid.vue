<template>
	<div style="width: 100%;height: 100%;display: flex;flex-direction: column;" class="noselect">
		<div style="height: 35px;line-height: 32px !important;background-color: #dae5f3;" v-if="queryFields.length+toolbar2.length>0">
		<div style="margin-left: 10px;display: flex;">
			<div v-for="(item,index) in queryFields" >
			    <el-input  size="small" v-if="item.editor=='textfield'&&nosearchcodes.indexOf(','+item.field+',')==-1" v-model="item.value" 
    @keyup.enter="searchGrid"  @clear="searchGrid" :placeholder="item.name" clearable style="width: 110px;"></el-input>
			    <el-date-picker  size="small" value-format="YYYYMMDD" v-if="item.editor=='datefield'" v-model="item.value" @change="searchGrid"  :placeholder="item.name" :key="index" style="width: 130px;"
			       type="date">
			    </el-date-picker>
			
			<el-select  size="small" v-model="item.value"  v-if="item.editor=='combobox'" @change="searchGrid" :placeholder="item.name" clearable :key="index" style="width: 130px;">
			    <el-option
			      v-for="item4 in item.optionitem"
			      :key="item4.value"
			      :label="item4.text"
			      :value="item4.value"
			      v-html="item4.text">
			    </el-option>
			  </el-select>
			
			<LingxCarTreeDialog  size="small" v-model="item.value" v-if="item.editor=='carsdialog'" @change="searchGrid" :placeholder="item.name" clearable :key="index" style="width: 180px;">
			</LingxCarTreeDialog>
			
			  </div>
			  <div>
			  <el-button size="small" style="margin-left: 4px;" v-if="queryFields.length>0" circle  icon="Search"  @click="searchGrid"></el-button>
			  <!-- 工具栏操作按钮-->
			  <el-button size="small"  :type="item.buttonType" :disabled="item.disabled" @click="openDialog(item)" :key="index" plain v-for="(item,index) in toolbar2">{{item.text}}</el-button>
			 
			 <el-popover placement="right-start" trigger="click" :width="360">
				 <div style=" display: flex;flex-wrap: wrap;gap: 10px;">
				   <el-button size="small" style=" margin-left: 0 !important;" :type="item.buttonType" :disabled="item.disabled" @click="openDialog(item)" :key="index" plain v-for="(item,index) in toolbar5">{{item.text}}</el-button>
					</div>
					 <template #reference>
			           <el-button size="small"  v-if="GridConfig.advFun.length>0&&toolbar5.length>0" >{{t('el.advanced')}}</el-button>
			         </template>
			       </el-popover>
			 
			
			</div>
			  <div style="font-size: 12px;color: #999;float: right;margin-right: 8px;" :title="GridConfig.comment">
			  	{{GridConfig.comment}}
			  	</div>
				</div>	
		</div>
		<div v-else style="height: 2px;;"></div>
		<div style="height: 0px;flex-grow: 1;display: flex;flex-direction: column-reverse;">
			<div style="height: 30px;background-color: #FFFFFF;line-height: 30px;padding-left: 10px;">
				      <el-pagination size="small"
				            @size-change="handleSizeChange"
				            @current-change="handleCurrentPageChange"
				            :current-page="currentPage"
				            :page-sizes="[10, 20,  50, 100, 200, 500]"
				            :page-size="pageSize"
				            layout="total, sizes, prev, pager, next, jumper"
				            :total="total">
				          </el-pagination>
			</div>
			<div style="height: 0px;flex-grow: 1;border-top: 1px solid #99bce8;">
			      <el-table ref="table" style="width: 100%;height: 100%;" 
			          :data="tableData"
			         row-key="id"
					 class="ep-table-beauty"
			          v-loading = "isLoading"
			          @sort-change="sortChange"
			          stripe
					  border
			          highlight-current-row
			          @selection-change="handleSelectionChange"
			          @current-change="handleCurrentChange"
			          @row-contextmenu="contextmenuTable"
			          @row-dblclick="handleDblClick"
			          >
			      <el-table-column v-if="ischecked" type="selection" width="40"> </el-table-column>
				  <el-table-column type="index" width="40" :index="indexMethod"  :show-overflow-tooltip="true" style="text-align: center;" />
		          <el-table-column v-for="(item,index) in columns2" 
		            :prop="item.dataIndex"
		            :label="item.header"
		            :width="item.width+10"
		            :key="index"
		            sortable="custom"
		            :show-overflow-tooltip="true"
					:render-header="(props) => renderHeader(props, item.comment)"
		            >
					<template  #default="scope">
					 <div v-html="format1(scope.row[item.dataIndex])"></div>
					</template>
		            </el-table-column>
					<el-table-column v-if="GridConfig.operateWidth>0&&isoperaterow"
					      :label="t('el.operat')"
					      :width="GridConfig.operateWidth">
					      <template #default="scope">
					         <a @click="openDialog(item3,scope.row,true)" type="text" size="small" :disabled="item3.disabled" v-for="(item3,index) in toolbar4" style="margin-left:10px;color: #409eff; text-decoration:none;" href="javascript:;">{{item3.text}}</a>
					      </template>
					    </el-table-column>
			         </el-table>
					</div>
		</div>
		<!-- 右击菜单 -->
		<div :id="'menuTable'+ecode" class="menu-div" v-show="menuTableVisible"  v-if="toolbar.length>0" style="z-index: 2000;">
		            <el-menu
		            :id="'menuTable123'+ecode"
		                   text-color="#000"
		                 >
		                   <el-menu-item :index="item.code" :type="item.buttonType" :disabled="item.disabled" @click="openDialog(item)" :key="index1" class="menuItem" v-for="(item,index1) in toolbar3">
		                     <span>{{item.text}}</span>
		                   </el-menu-item>
		                 </el-menu>
		        </div>
	</div>
</template>
<script setup>
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose,onActivated, onDeactivated,h  } from 'vue';
	import api from '@/hooks/api'
	import {lgxInfo,getEntityString,getTextString,getValueString,format1} from '@/hooks/lingx'
	import { useI18n } from 'vue-i18n'
	import { ElTooltip, ElMessage } from 'element-plus'
import i18n from '@/lang'
	import LingxCarTreeDialog from "@/components/LingxCarTreeDialog.vue"
	const { t } = useI18n();
    const emit = defineEmits(['custom-event']);
	const props = defineProps({
	  ecode: {type: String,default: ""},
	  mcode: {type: String,default: "grid"},
	  nosearchcodes:{type:String,default:""},//查询栏，不参与查询的字段，用英文逗号隔开
	  nogridcodes:{type:String,default:""},//查询栏，不参与表格显示的字段，用英文逗号隔开
	  queryfilter:{
	      type:Object,
	      default:() => ({})//field,value
	  },
	  isoperaterow:{type:Boolean,default:false},//是否开启行操作
	  ischecked:{type:Boolean,default:false},//是否有多选控件
	  isautoload:{type:Boolean,default:true},
	  iscontextmenu:{type:Boolean,default:false},//是否支持右键菜单
	  isbutton:{type:Boolean,default:false}//是否工具栏按钮
	});
	const table=ref(null);
	const currentPage=ref(1),pageSize=ref(50),orderField=ref("id"),orderType=ref("asc"),textField=ref("id"),ename=ref(""),rightMenuNumber=ref(0),
	isLoading=ref(true),total=ref(0),menuTableVisible=ref(false);
	const GridConfig=ref({}),columns=ref([]),toolbar=ref([]),queryFields=ref([]),tableData=ref([]);
	let time1=null,isInit=false,currentRow={};
	let columns2=computed(()=>{
		let array=[];
		for(let i=0;i<columns.value.length;i++){
			if(columns.value[i].visible&&props.nogridcodes.indexOf(','+columns.value[i].dataIndex+',')===-1)array.push(columns.value[i])
		}
		return array;
	});
	
	
	let toolbar2=computed(()=>{
		let array=[];
		for(let i=0;i<toolbar.value.length;i++){//v-if="(','+GridConfig.advFun+',').indexOf(item.code)<0"
			if(toolbar.value[i].visible&&props.isbutton&&(','+GridConfig.value.advFun+',').indexOf(toolbar.value[i].code)<0)array.push(toolbar.value[i])
		}
		return array;
	});
	let toolbar3=computed(()=>{//右键菜单按钮
		let array=[];
		for(let i=0;i<toolbar.value.length;i++){
			if(toolbar.value[i].visible&&toolbar.value[i].rightmenu)array.push(toolbar.value[i])
		}
		return array;
	});
	let toolbar4=computed(()=>{//行内按钮operateRow
		let array=[];
		for(let i=0;i<toolbar.value.length;i++){
			if(toolbar.value[i].operateRow)array.push(toolbar.value[i])
		}
		return array;
	});
	let toolbar5=computed(()=>{
		let array=[];
		for(let i=0;i<toolbar.value.length;i++){//v-if="(','+GridConfig.advFun+',').indexOf(item.code)<0"
			if(toolbar.value[i].visible&&props.isbutton&&(','+GridConfig.value.advFun+',').indexOf(toolbar.value[i].code)>=0)array.push(toolbar.value[i])
		}
		return array;
	});
	const renderHeader = (props, tipText) => {
		if(!tipText)return  h('span', {}, props.column.label);
	  // h函数：创建 ElTooltip 组件包裹表头文字
	  return h(
	    ElTooltip, // 要渲染的组件：Element Plus 提示框
	    {
	        content: tipText, // 悬浮显示的文本
	        placement: 'top', // 提示框位置（top/left/right/bottom）
	        effect: 'dark', // 主题（dark/light）
	        enterable: true // 鼠标可进入提示框（可选）
	    },
	    // 子节点：表头原始文字（Vue3 要求子节点是函数返回）
	    () => h('span', {}, props.column.label)
	  )
	}
	function menuTableClose(){
	        menuTableVisible.value=false;
	document.removeEventListener("click", menuTableClose);
	      }
	function  contextmenuTable(row, column, event){
	            event.preventDefault();
		 if(!props.iscontextmenu||toolbar.value.length==0)return;
	         currentRow=row;
	        table.value.setCurrentRow(row);
	
	        emit("click",row);
			menuTableVisible.value=true;
	      var menu = document.querySelector("#menuTable"+props.ecode);
	            //获取我们自定义的右键菜单
	            // 根据事件对象中鼠标点击的位置，进行定位
	            menu.style.left = event.clientX + "px";
	            menu.style.top = event.clientY + "px";
	document.addEventListener("click", menuTableClose);
	      }
	function getGridConfig(){
	    return GridConfig.value;
	}
	function getViewConfig(){
	        let config=null;
	        for(let i=0;i<toolbar.value.length;i++){
	          if(toolbar.value[i].code=='view'){
	            config=toolbar.value[i];
	            break;
	          }
	        }
	        return config;
	}
	function searchGrid(){
		currentPage.value=1;
		reload(true);
	}
	function clearSelection(){
	    table.value.clearSelection();
	}
	function sortChange(param){
		orderField.value=param.prop;
		orderType.value="ascending"==param.order?"asc":"desc";
		reload(true);
	}
	function handleSelectionChange(selection,bbb){
		emit("lingx-selection-change",selection,bbb);
	}
	function openDialog(item,data,isRowClick){//isRowClick是行内按钮点击
        let id="",excelURL=window.apiUrl+"/excel";
        if(item.currentRow&&(!currentRow||!currentRow.id)){
          lgxInfo("请选择要操作的记录!");
          return ;
        }
        if(item.currentRow&&currentRow)id=currentRow.id;
        if(isRowClick)id=data.id;
        if(item.code=="lingx_ouput_excel"){
			console.log(excelURL.replace("/api/","/")+"?ecode="+props.ecode+"&userid="+sessionStorage.getItem("userid")+"&token="+sessionStorage.getItem("token")+"&language="+i18n.global.locale.value)
            window.location.href=excelURL.replace("/api/","/")+"?ecode="+props.ecode+"&userid="+sessionStorage.getItem("userid")+"&token="+sessionStorage.getItem("token")+"&language="+i18n.global.locale.value;
            return;
        }
        //emit("open-dialog",item,id,props.queryfilter,isRowClick?data:currentRow)
		emit("open-dialog",{method:item,id:id,queryfilter:props.queryfilter,data:(isRowClick?data:currentRow)})
      }
	function handleCurrentChange(row){
		currentRow=row;
		emit("changeRow",row);
	}
	function handleDblClick(row, column, event){
		//emit("dblclick",row, column, event);
		emit("dblclick",{data:row});
	}
	function handleSizeChange(p1){
		pageSize.value=p1
		reload(true);
	}
	function getTextField(){
	        return textField.value;
	}
	function getCurrentRow(){
		 return currentRow;
	}
	function setCurrentRow(row){
	    table.value.setCurrentRow(row);
	}
	function handleCurrentPageChange(p1){
		currentPage.value=p1;
		reload(true);
	}
	const indexMethod = (index) => {
	  return (currentPage.value-1)*pageSize.value+index+1
	}
	onMounted(function(){
		init();
	});
	function init(){
		if(time1){
			clearInterval(time1);
			time1=null;
		}
		let isCache=true;//是否缓存表配置，开发阶段不缓存
		let key=props.ecode+"_8001";
		let jsonCache=sessionStorage.getItem(key);
		if(jsonCache&&isCache){
			let json=JSON.parse(jsonCache);
			            if(json.code!=1)return;
			            currentPage.value=1;
			            GridConfig.value=json.data.GridConfig;
			            pageSize.value=json.data.GridConfig.pageSize;
			            orderField.value=json.data.GridConfig.sortName;
			            orderType.value=json.data.GridConfig.sortOrder;
			            columns.value=json.data.columns;
			            textField.value=json.data.textField;
			            toolbar.value=json.data.toolbar;
			            ename.value=json.data.name;
			            emit("syncename",ename.value);
			            queryFields.value=json.data.queryFields;
			            if(json.data.cascades)
			            emit("cascade",json.data.cascades);
			           rightMenuNumber.value=0;
			           for(let i=0;i<json.data.toolbar.length;i++){
			             if(json.data.toolbar[i].rightmenu==true){rightMenuNumber.value++;}
			           }
			           if(json.data.GridConfig.refreshAuto>0){
			             time1=setInterval(function(){
			               reload(false);
			             },json.data.GridConfig.refreshAuto*1000);
			           }
			
			           isInit=true;
			           if(props.isautoload)
			           reload(true);
		}else
			api.callApi({apicode:8001,e:props.ecode},function(json){
			            if(json.code!=1)return;
			            currentPage.value=1;
			            GridConfig.value=json.data.GridConfig;
			            pageSize.value=json.data.GridConfig.pageSize;
			            orderField.value=json.data.GridConfig.sortName;
			            orderType.value=json.data.GridConfig.sortOrder;
			            columns.value=json.data.columns;
			            textField.value=json.data.textField;
			            toolbar.value=json.data.toolbar;
			            ename.value=json.data.name;
			            emit("syncename",ename.value);
			            queryFields.value=json.data.queryFields;
			            if(json.data.cascades)
			            emit("cascade",json.data.cascades);
			           rightMenuNumber.value=0;
			           for(let i=0;i<json.data.toolbar.length;i++){
			             if(json.data.toolbar[i].rightmenu==true){rightMenuNumber.value++;}
			           }
			           if(json.data.GridConfig.refreshAuto>0){
			             time1=setInterval(function(){
			               reload(false);
			             },json.data.GridConfig.refreshAuto*1000);
			           }
			
			           isInit=true;
			           if(props.isautoload)
			           reload(true);
					   sessionStorage.setItem(key,JSON.stringify(json));
			           });
	}
	function reload(isloading){
      if(!isInit)return;
      if(isloading)isLoading.value=true;
      let param={apicode:8002,e:props.ecode,m:"grid",limit:pageSize.value,page:currentPage.value,orderField:orderField.value,orderType:orderType.value};
      for(let i=0;i<queryFields.value.length;i++){//查询条件
        let obj=queryFields.value[i];
        if(obj.value){
          param[obj.field]=obj.value;
        }
      }
      for(let field in props.queryfilter){//条件过滤，属性传入
        if(props.queryfilter[field]){
          if(props.queryfilter[field]=="lingxwait"){isLoading.value=false;return;}//未传入有效的上级ID，中断处理
          param[field]=props.queryfilter[field];
        }
      }
       api.callApi(param,function(json){
        if(isloading)isLoading.value=false;
        tableData.value=json.rows;
        total.value=json.total;
//_this.$refs.table.doLayout();//重新布局，使得横向滚动条放在正确的位置上
        emit("load-complete");
		if(json.rows.length>0){
			if(currentRow&&currentRow.id&&exists()){
				table.value.setCurrentRow(currentRow);
			}else{
				if(table&&table.value)
				table.value.setCurrentRow(tableData.value[0]);
			}
		}else{
			currentRow=null;
		}
		
       });
	}
	function exists(){
		let array=tableData.value;
		for(let i=0;i<array.length;i++){
			if(array[i].id==currentRow.id)return true;
		}
		return false;
	}
watch(() => props.ecode,(newVal)=>{
	isInit=false;
	init();
	currentRow={};
});
watch(() => props.queryfilter,(newVal)=>{
	reload(true);
},{deep: true});
onActivated(function(){
	reload(true);
});
onDeactivated(function(){
	
});
onUnmounted(function(){
	if(time1){
		clearInterval(time1);
		time1=null;
	}
	document.removeEventListener("click", menuTableClose);
});
defineExpose({clearSelection,getGridConfig,getViewConfig,getCurrentRow,getTextField,reload,init});
</script>

<style scoped>
	 :deep(.el-table__header) .cell {
	  white-space: nowrap; /* 强制不换行 */
	  overflow: hidden;    /* 溢出隐藏 */
	  text-overflow: unset; /* 超出显示省略号（可选） */
	}
	
	.el-button+.el-button{
		margin-left: 8px;
	}
	.el-form-item{
	  margin-bottom: 5px;
	}
	  .el-menu-item, .el-submenu__title{
	    height: 32px;
	    line-height: 32px;
	  }
	  .menu-div{
	position: fixed;
	  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
	  background: #ffffff;
	  cursor: pointer;
	  color: #606266;
	  width: 200px;
	  border: 1px solid #e4e7ed;
	  }
</style>
