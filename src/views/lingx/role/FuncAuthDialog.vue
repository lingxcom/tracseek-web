<template>
	<el-scrollbar style="height: 100%;background-color: #fff;">
	<el-tree ref="tree1"  :props="defaultProps"  style="background-color: #fff;"
	node-key="id" :default-checked-keys="checkedKeys" :data="dataTree" :default-expanded-keys="expandedKeys" :show-checkbox="true" @check-change="checkChange"
	 :expand-on-click-node="false" :auto-expand-parent="false" >
	 <template #default="{ node, data }">
	 <div style="font-size: 14px;width:100%">
	           <div class="node" style="font-size: 14px;width:100%">{{node.label}}</div>
	         </div>
	 		</template>
	</el-tree>
	</el-scrollbar>
</template>

<script setup>
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose } from 'vue';
	import { useI18n } from 'vue-i18n'
	import api from '@/hooks/api'
	import {lgxInfo} from '@/hooks/lingx'
	const { t } = useI18n();
	const emit = defineEmits(['custom-event']);
	const props = defineProps({
	  id: {type: String,default: ""},
	});
	const dataTree=ref([]);
	const checkedKeys=ref([]);
	const expandedKeys=ref([]);
	const defaultProps=ref({
	  children: 'children',
	  label: 'text',
	  isLeaf: 'leaf'
	});
	const rootKey=ref("");
	let isInit=false;
	function checkChange(data,aaa,bbb){
		var param={apicode:9020,checked:aaa,checkedSub:bbb,func_id:data.id,role_id:props.id};
		if(isInit)
		api.callApi(param,function(json){
		  //_this.lgxInfo(json.message)
		});
	}
	
	function ok(){
		emit("close")
	}
	onMounted(function(){
		emit("setype",2);
		emit("setitle",t('el.role.funcauth'));
		var param={apicode:9019,fid:0,role_id:props.id};
        api.callApi(param,function(json){
          dataTree.value=json.data;
           checkedKeys.value=json.checkedKeys;
          for(let i=0;i<json.data.length;i++){
            let obj=json.data[i];
            if(obj.state=="open"){
              expandedKeys.value.push(obj.id);
            }
          }
          isInit=true
        });
	});
	defineExpose({ok});
</script>

<style>
</style>
