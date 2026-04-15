<template>
  <div style="padding: 0px;display: flex;flex-direction: column;height: 100%;" class="noselect">
	  <div style="width: 100%;height: 2px;background-color: #dfe9f6;"></div>
	  <div v-if="istype" style="width: 100%;height: 30px;display: flex;background-color: #dfe9f6;color: #435d8d;font-size: 14px;line-height: 30px;">
		  <div style="padding: 0 4px;text-align: center;cursor: pointer;flex: 1;" @click="setType('all')" :class="{'div2bbbaaa':type=='all'}">{{t('el.car.tree.type.all')}}({{data2.total}})</div>
		  <div style="padding: 0 4px;text-align: center;cursor: pointer;flex: 1;" @click="setType('online')" :class="{'div2bbbaaa':type=='online'}">{{t('el.car.tree.type.online')}}({{data2.online}})</div>
		  <div style="padding: 0 4px;text-align: center;cursor: pointer;flex: 1;" @click="setType('offline')" :class="{'div2bbbaaa':type=='offline'}">{{t('el.car.tree.type.offline')}}({{data2.offline}})</div>
		  <div style="padding: 0 4px;text-align: center;cursor: pointer;flex: 1;" @click="setType('follow')" :class="{'div2bbbaaa':type=='follow'}">{{t('el.car.tree.type.follow')}}({{data2.follow}})</div>
	  </div>
	  
    <div style="background-color: #dfe9f6;line-height: 24px;">
    <el-input
    size="small"
    :placeholder='$t("el.cartree.info1")'
    clearable
    @clear="searchTree"
    v-model="searchText"
    @keyup.enter="searchTree"
   >
   <template #append>
	   <el-button-group size="small">
	   <el-button icon="Search"  @click="searchTree" title="Search" size="small" style=""></el-button>
	   <el-button icon="Refresh"  @click="refreshTree" title="Refresh" size="small" style="border-left: 1px solid #dcdfe6;"></el-button>
	   </el-button-group>
   </template>
  
  </el-input>
    </div>
    <div style="flex: 1; flex-grow:1;overflow: auto;">
		<el-scrollbar style="height: 100%;">
    <el-tree ref="tree1"  :props="defaultProps" :load="loadNode" 
                    :render-content="renderContent"
    node-key="id" :default-expanded-keys="expandedKeys" :show-checkbox="ischecked" @check-change="checkChange" @node-click="nodeClick"
      @node-contextmenu="contextmenuTree" :expand-on-click-node="isexpand" :auto-expand-parent="false" lazy>
      <div class="custom-tree-node" slot-scope="{ node , data }" style="font-size: 14px;width:100%">
                <div @dblclick="handleNodeDblClick(node,data)" class="node" style="font-size: 14px;width:100%">{{node.label}}</div>
              </div>
    </el-tree>
	</el-scrollbar>
    </div>
  </div>
</template>

<script setup>
	import { ref, computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose   } from 'vue';
	import api from '@/hooks/api'
	import {lgxInfo} from '@/hooks/lingx'
	import { useI18n } from 'vue-i18n'
	const { t } = useI18n()
	const rootKey=ref("");
	const searchText=ref("");
	const expandedKeys=ref([149]);
	const defaultProps=ref({
	  children: 'children',
	  label: 'text',
	  isLeaf: 'leaf'
	});
    const emit = defineEmits(['custom-event']);
	const props = defineProps({
		isexpand: {
		  type: Boolean,
		  default: false
		},
	  isreload: {
	    type: Boolean,
	    default: false
	  },
	  ischecked: {
	    type: Boolean,
	    default: false
	  },
	  isvideo: {
	    type: Boolean,
	    default: false
	  },
	  isstatus: {
	    type: Boolean,
	    default: false
	  },
	  istype: {
	    type: Boolean,
	    default: false
	  }
	});
	const tree1=ref(null);
	const type=ref("all");
	const data2=ref({});
	function setType(temp){
		type.value=temp;
		emit("change-type",temp);
		refreshNodeBy(rootKey.value);
	}
	function refreshTree(){
		searchText.value="";
		searchTree();
	}
	function searchTree(){
		    // this.expandedKeys=[];
		     refreshNodeBy(rootKey.value);
	}
	function refreshNodeBy(id){
		//console.log(tree1)
            if(!tree1.value||!id)return;
            let node = tree1.value.getNode(id); // 通过节点id找到对应树节点对象
            if(!node||!node.parent)return;
            node=node.parent;
            node.loaded = false;
            node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
        }
	function loadNode(node, resolve){
        var fid=0;
        if (node.level === 0) {
          fid=0;
        }else{
          fid=node.data.id;
        }
        api.callApi({
          apicode: 1101,
          fid: fid,
		  type:type.value,
          isVideo:props.isvideo,//是否返回通道号
          isStatus:props.isstatus,//是否返回状态
          searchText:searchText.value
        }, function(json) {
			data2.value=json.data2;
          if(json.data.length==0){
             resolve(json.data);
            return;
          }
        if(fid==0)rootKey.value=json.data[0].id;
        if(json.expandedKeys.length>0){
			for(var i=0;i<json.expandedKeys.length;i++){
				if(expandedKeys.value.indexOf(json.expandedKeys[i])===-1){
					expandedKeys.value.push(json.expandedKeys[i]);
				}
			}
        }
          resolve(json.data);
        });
      }
	function checkChange(data,aaa,bbb){
		emit("lingxcheckchange",data,aaa,bbb);
	}
	function setCheckedKeys(arr){
	    tree1.value.setCheckedKeys(arr);
	}
	function clearChecked(){
	    tree1.value.setCheckedKeys([]);
	}
	let treeClickId=null,treeClickCnt=0,treeClickTimeout;
	function nodeClick(data,node,el){
		// 如果点击的id不相同，则重置点击次数
		              if (data.id != treeClickId) {
		                treeClickCnt = 0;
		              }
		              treeClickId = data.id;
		              treeClickCnt++;
		
		              // 注册清空点击次数计时器任务
		              window.clearTimeout(treeClickTimeout);
		              treeClickTimeout = window.setTimeout(() => {
		                treeClickCnt = 0;
		              }, 300);
		
		              // 连续点击多次则不做任何事情
		              if (treeClickCnt > 2) return;
		              // 点击一次时单击事件
		              if (treeClickCnt == 1) {
		                // 单击事件
						tree1.value.setChecked(node,true);
		                emit("lingxnodeclick",data,node,el);
		              }
		              // 点击两次时双击事件
		              if (treeClickCnt == 2) {
		                // 双击事件
		                 emit("lingxnodedblclick",data,node,el);
		              }
	}
	function contextmenuTree(){
		
	}
	function handleNodeDblClick(){
		
	}
	function renderContent(h, { node, data, store }) {
	if(data.type=="device"){
		return h("span",{style:{"line-height":"26px"}},
		h("i",{class:"el-icon "+data.iconCls,style:{"margin-right":"5px","vertical-align":"middle","margin-top":"-3px"}},
		h("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1024 1024"},h("path",{fill:"currentColor",d:"M512 928c23.936 0 117.504-68.352 192.064-153.152C803.456 661.888 864 535.808 864 416c0-189.632-155.84-320-352-320S160 226.368 160 416c0 120.32 60.544 246.4 159.936 359.232C394.432 859.84 488 928 512 928m0-435.2a64 64 0 1 0 0-128 64 64 0 0 0 0 128m0 140.8a204.8 204.8 0 1 1 0-409.6 204.8 204.8 0 0 1 0 409.6"}))),
		h("span",{"vertical-align":"middle"},node.label));
	}else if(data.type=="group"){
		return h("span",{style:{"line-height":"26px"}},
		h("i",{class:"el-icon ",style:{"margin-right":"5px","vertical-align":"middle","color":"#435d8d","margin-top":"-3px"}},
		h("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1024 1024"},h("path",{fill:"currentColor",d:"M512 128 128 447.936V896h255.936V640H640v256h255.936V447.936z"}))),
		h("span",{"vertical-align":"middle"},node.label));
	}else if(data.type=="tdh"){
		return h("span",{style:{"line-height":"26px"}},
		h("i",{class:"el-icon ",style:{"margin-right":"5px","vertical-align":"middle","color":"#333","margin-top":"-3px"}},
		h("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1024 1024"},h("path",{fill:"currentColor",d:"M704 768V256H128v512zm64-416 192-96v512l-192-96v128a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V224a32 32 0 0 1 32-32h640a32 32 0 0 1 32 32zm0 71.552v176.896l128 64V359.552zM192 320h192v64H192z"}))),
		h("span",{"vertical-align":"middle"},node.label));
	}
	  
      }
	  function updateTreeNode(json,node){
		  updateTreeNode2(json,node);
	  }
	 function updateTreeNode2(json,node){
	          if(!node&&tree1.value)
	           node=tree1.value.getNode(rootKey.value);
	           if(node==null)return;
	          if(json.type==node.data.type&&json.value==node.data.value){
	          if(json.iconCls)node.data.iconCls=json.iconCls;
	          node.data.text=json.text;
	            return ;
	          }else{
	            for(var i=0;i<node.childNodes.length;i++){
	              updateTreeNode2(json,node.childNodes[i]);
	            }
	          }
	        }
	 function reload(fid){
	          api.callApi({
	            apicode: 1101,
	            fid: fid,
				type:type.value,
	            isVideo:props.isvideo,//是否返回通道号
	            isStatus:props.isstatus,//是否返回状态
	            searchText:searchText.value
	          }, function(json) {
				  data2.value=json.data2;
	            if(json.data.length==0){
	              return;
	            }
	            for(var i=0;i<json.data.length;i++){
	              updateTreeNode2(json.data[i]);
	              if(!json.data[i].leaf)reload(json.data[i].id);
	            }
	          });
	        }
	let time1=null;
	onMounted(function(){
		if(props.isreload){
			time1=setInterval(function(){
			        reload(0);
			      },30*1000);
		}
	});
	onUnmounted(function(){
		if(props.isreload){
			clearInterval(time1)
		}
	});
	defineExpose({updateTreeNode,reload,clearChecked,setCheckedKeys});
</script>

<style>
	
	.carStatus_1{
	  color: red;
	}
	.carStatus_2{
	  color: #0462fd;
	}
	.carStatus_3{
	  color: green;
	}
	.carStatus_4{
	  color: #999;
	}
	.carStatus_5{
	  color: #5503bb;
	}
	.carStatus_6{
	  color: red;
	}
	
	.div2bbbaaa{
		font-weight: bold;
	}
</style>
