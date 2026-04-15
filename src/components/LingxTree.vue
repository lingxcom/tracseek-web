<template>
	<div style="width: 100%;height: 100%;display: flex;flex-direction: column;" class="noselect">
		<div style="height: 35px;padding: 4px;background-color: #dfe9f6;" v-if="queryFields.length+toolbar2.length>0">
		<span v-for="(item,index) in queryFields" style="margin-left: 4px;">
		    <el-input  size="small" v-if="item.editor=='textfield'&&nosearchcodes.indexOf(','+item.field+',')==-1" v-model="item.value"  @keyup.enter.native="searchTree"  @clear="searchTree" :placeholder="item.name" clearable style="width: 130px;"></el-input>
		    <el-date-picker  size="small" value-format="YYYYMMDD" v-if="item.editor=='datefield'" v-model="item.value" @change111="searchTree"  :placeholder="item.name" style="width: 130px;"
		       type="date">
		    </el-date-picker>
		
		<el-select  size="small" v-model="item.value"  v-if="item.editor=='combobox'" @change111="searchTree" :placeholder="item.name" clearable style="width: 130px;">
		    <el-option
		      v-for="item4 in item.optionitem"
		      :key="item4.value"
		      :label="item4.text"
		      :value="item4.value"
		      v-html="item4.text">
		    </el-option>
		  </el-select>
		
		  </span>
		  <el-button  size="small" style="margin-left: 4px;" v-if="queryFields.length>0" circle icon="Search"  @click="searchTree"></el-button>
		  <!-- 工具栏操作按钮-->
		  <el-button  size="small" :type="item.buttonType" :disabled="item.disabled" @click="openDialog(item)" :key="index" plain v-for="(item,index) in toolbar2">{{item.text}}</el-button>
		  
		</div>
		<div style="flex-grow: 1;height: 0px;border-top: 1px solid #99bce8;">
		<el-scrollbar style="height: 100%;background-color: #FFFFFF;">
	      <el-tree ref="tree" :props="defaultProps" :load="loadNode"  @current-change="handleNodeClick"  highlight-current :check-strictly="true" 
	      node-key="id" :default-expanded-keys="expandedKeys" :show-checkbox="ischecked" @check-change="checkChange"  @node-contextmenu="contextmenuTree" 
	         :expand-on-click-node="false" :auto-expand-parent="false" lazy>
			 <template #default="{ node, data }">
	        <div style="font-size: 14px;width:100%">
	                  <div  @dblclick="handleNodeDblClick(node,data)" class="node" style="font-size: 14px;width:100%">{{node.label}}</div>
	                </div>
					</template>
	      </el-tree>
	</el-scrollbar>
		</div>
		    <!-- 右击菜单 -->
		    <div :id="'menuTable'+ecode" class="menu-div" v-show="menuTableVisible"  v-if="toolbar.length>0" style="z-index: 2000;">
		                <el-menu
		                :id="'menuTable123'+ecode"
		                       text-color="#000"
		                     >
		                       <el-menu-item :index="item.code" :type="item.buttonType" :disabled="item.disabled" @click="openDialog(item)" :key="index1" class="menuItem" v-for="(item,index1) in toolbar3">
		                         <span slot="title">{{item.text}}</span>
		                       </el-menu-item>
		                     </el-menu>
		            </div>
	</div>
</template>
<script setup>
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose  } from 'vue';
	import api from '@/hooks/api'
	import {lgxInfo,getEntityString,getTextString,getValueString,format1} from '@/hooks/lingx'
	import { useI18n } from 'vue-i18n'
	const { t } = useI18n();
	const emit = defineEmits(['custom-event']);
	const props = defineProps({
	  ecode: {type: String,default: ""},
	  mcode: {type: String,default: "grid"},
	  nosearchcodes:{type:String,default:""},//查询栏，不参与查询的字段，用英文逗号隔开
	  nogridcodes:{type:String,default:""},//查询栏，不参与表格显示的字段，用英文逗号隔开
	  queryfilter:{
	      type:Object,
	      default:() => {}//field,value
	  },
	  isoperaterow:{type:Boolean,default:false},//是否开启行操作
	  ischecked:{type:Boolean,default:false},//是否有多选控件
	  isautoload:{type:Boolean,default:true},
	  iscontextmenu:{type:Boolean,default:false},//是否支持右键菜单
	  isbutton:{type:Boolean,default:false}//是否工具栏按钮
	});
	const tree=ref(null);
	const GridConfig=ref({}),toolbar=ref([]),queryFields=ref([]),expandedKeys=ref([]),menuTableVisible=ref(false),
	ename=ref(""),orderField=ref("id"),orderType=ref("asc"),textField=ref("id");
	const defaultProps=ref({
	  children: 'children',
	  label: 'text',
	  isLeaf: 'leaf'
	});
	let currentKey="",isInit=false,isSearch=false,rootKey="",currentNode;
	let toolbar2=computed(()=>{//工具栏按扭
		let array=[];
		for(let i=0;i<toolbar.value.length;i++){
			if(toolbar.value[i].visible&&props.isbutton)array.push(toolbar.value[i])
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
	function renderContent(h, { node, data, store }) {
		return h("span",{"vertical-align":"middle"},node.label);
	  }
	function menuTableClose(){
	        menuTableVisible.value=false;
	document.removeEventListener("click", menuTableClose);
	      }
	function  contextmenuTree( event,data,node){
		 if(!props.iscontextmenu||toolbar.value.length==0)return;
	         currentNode=data;
	        let currentKey=data.id;
	         tree.value.setCurrentKey(currentKey)
	
	        emit("click",data);
	        if(!props.iscontextmenu)return;
			menuTableVisible.value=true;
	      var menu = document.querySelector("#menuTable"+props.ecode);
	            event.preventDefault();
	            //获取我们自定义的右键菜单
	            // 根据事件对象中鼠标点击的位置，进行定位
	            menu.style.left = event.clientX + "px";
	            menu.style.top = event.clientY + "px";
	document.addEventListener("click", menuTableClose);
	      }
	function checkChange(data,p2,p3){
        emit("lingx-selection-change",data,p2,p3);
      }
    function openDialog(item){
        let id="";
        if(currentNode)id=currentNode.id;
        emit("open-dialog",{method:item,id:id,queryfilter:props.queryfilter,data:currentNode})
      //this.$refs.lingxEditDialog.openDialog(item,id);
      }
    function  loadNode(node, resolve) {
        let fid=0;
        if (node.level === 0) {
          fid=0;
        }else{
          fid=node.data.id;
        }
        let param={apicode:8002,e:props.ecode,m:"tree",fid:fid,orderField:orderField.value,orderType:orderType.value};

      isSearch=false;
      for(let i=0;i<queryFields.value.length;i++){//查询条件
        let obj=queryFields.value[i];
        if(obj.value){
          param[obj.field]=obj.value;
          param.lingxSearch=true;
          isSearch=true;
        }
      }

      for(let field in props.queryfilter){//条件过滤，属性传入
        if(props.queryfilter[field]){
          param[field]=props.queryfilter[field];
        }
      }

        api.callApi(param,function(json){
          for(let i=0;i<json.data.length;i++){
            let obj=json.data[i];
            if(!currentKey&&fid==0&&i==0){
              currentKey=obj.id;
              rootKey=obj.id;
              currentNode=obj;

              emit("click",obj);

            }
            if(obj.state=="open"&&!isSearch){
              expandedKeys.value.push(obj.id);
            }else if(node.level==0&&json.data.length==1&&json.leaf==false){
              expandedKeys.value.push(obj.id);
            }
          }
          resolve(json.data);
			if(tree&&tree.value)
          tree.value.setCurrentKey(currentKey)
        });
      }
    function getTextField(){
        return textField.value;
      }
    function  getCurrentNode(){
        return currentNode;
      }
     function handleNodeClick(data) {
        currentKey=data.id;
        currentNode=data;
		emit("click",data);
      }
    function  handleNodeDblClick(node,data,event) {
		//emit("dblclick",data, node, event);
		emit("dblclick",{node:node,data:data});
    }

	function initTree() {
		let isCache=false;//是否缓存表配置，开发阶段不缓存
		let key=props.ecode+"_8001";
		let jsonCache=sessionStorage.getItem(key);
		if(jsonCache&&isCache){
			let json=JSON.parse(jsonCache);
			GridConfig.value = json.data.GridConfig;
			orderField.value = json.data.GridConfig.sortName;
			orderType.value = json.data.GridConfig.sortOrder;
			textField.value = json.data.textField;
			toolbar.value = json.data.toolbar;
			ename.value = json.data.name;
			emit("syncename",ename.value);
			queryFields.value = json.data.queryFields;
			if (json.data.cascades)emit("cascade", json.data.cascades);
			if( currentKey){
			  refreshNodeBy(currentKey);
			  currentKey="";
			}
			isInit = true;
		}else{
			api.callApi({
			  apicode: 8001,
			  e: props.ecode
			}, function(json) {
			  GridConfig.value = json.data.GridConfig;
			  orderField.value = json.data.GridConfig.sortName;
			  orderType.value = json.data.GridConfig.sortOrder;
			  textField.value = json.data.textField;
			  toolbar.value = json.data.toolbar;
			  ename.value = json.data.name;
			  emit("syncename",ename.value);
			  queryFields.value = json.data.queryFields;
			  if (json.data.cascades)emit("cascade", json.data.cascades);
			  if( currentKey){
			    refreshNodeBy(currentKey);
			    currentKey="";
			  }
			  isInit = true;
			  sessionStorage.setItem(key,JSON.stringify(json));
			});
		}
        
      }
	function refreshNodeBy(id){
		if(tree&&tree.value){
            let node = tree.value.getNode(id); // 通过节点id找到对应树节点对象
            if(node.parent)node=node.parent;
            node.loaded = false;
            node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
			}
        }

    function searchTree(){
          isSearch=true;
          expandedKeys.value=[];
          refreshNodeBy(rootKey);
        }
	onMounted(function(){
		initTree();
	});
	watch(() => props.ecode,(newVal)=>{
		isInit=false;
		initTree();
		currentNode={};
	});
	function reload(){
		searchTree();
	}
defineExpose({getCurrentNode,getTextField,reload});
</script>

<style scoped>
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
