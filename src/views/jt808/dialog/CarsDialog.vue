<template>
	<lingxdialog ref="dialog" @confirm="dialogSubmit" :scrollbar="false">
		<div style="background-color: #FFF;width: 100%;height: 100%;display: flex;flex-direction: column;">
			<lingxcartree ref="cartree" :istype="istype" :ischecked="ischecked" @change-type="setType" @lingxnodeclick="lingxnodeclick" @lingxnodedblclick="lingxnodedblclick" @lingxcheckchange="lingxcheckchange"></lingxcartree>
		</div>
	</lingxdialog>
</template>

<script setup>
	import {ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose,defineAsyncComponent,shallowRef} from 'vue';
	import {useI18n} from 'vue-i18n'
	import api from '@/hooks/api'
	const emit = defineEmits(['custom-event']);
	const {t} = useI18n()
	import lingxdialog from "@/components/LingxDialog.vue"
	import lingxcartree from "@/components/LingxCarTree.vue"
	let tids = [],type="all";
	const cartree=ref(null);
	const dialog = ref(null);
	const props = defineProps({
	  ischecked: {
	    type: Boolean,
	    default: true
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
	function setType(temp){
		type=temp;
	}
	function dialogSubmit() {
		//console.log(tids)
		emit("lingxchange", tids);
		dialog.value.closeDialog();
	}

	function openDialog(options) {
		dialog.value.openDialog({
			title: t('el.car.select.dialog.title')
		});
		cartree.value.clearChecked();
		tids = [];
	}
	function lingxnodeclick(data,node,el){
		if(!props.ischecked){
			tids=[data];
		}
	}
	function lingxnodedblclick(data,node,el){
		//if(!props.ischecked){
			tids=[data];
			dialogSubmit();
		//}
	}
	function lingxcheckchange(data, aaa, bbb) {
		if(aaa){
		//添加
		         //是分组的话，取出车辆信息
		           if(data.type=="group"){
		              api.callApi({apicode:1136,groupId:data.value,type:type},function(json){
		                  for(var i=0;i<json.data.length;i++){
		                    addTid({text:getText(json.data[i].text),value:json.data[i].value});
		                  }
		              })
		           }else{
		addTid({text:getText(data.text),value:data.value});
		           }
		           //是分组，特殊处理
		        }else{
		//删除
		            //是分组的话，取出车辆信息
		            if(bbb){
						//removeTid({text:getText(data.text),value:data.value});
						return;
					}
		           if(data.type=="group"){
		              api.callApi({apicode:1136,groupId:data.value,type:type},function(json){
		                  for(var i=0;i<json.data.length;i++){
		                    removeTid({text:getText(json.data[i].text),value:json.data[i].value});
		                  }
		              })
		           }else{
		             removeTid({text:getText(data.text),value:data.value});
		           }
		           //是分组，特殊处理
		        }
	}
function getText(str){
  var ind=str.indexOf(" ");
  if(ind>0)str=str.substring(0,ind)
  return str;
}
	function addTid(obj) {
		var tid = obj.value;
		var index = -1;
		for (var i = 0; i < tids.length; i++) {
			if (tid == tids[i].value) {
				index = i;
				break;
			}
		}
		if (index == -1)
			tids.push(obj);
	}
	function removeTid(obj) {
		console.log(tids)
		console.log(obj)
		var tid = obj.value;
		var index = -1;
		for (var i = 0; i < tids.length; i++) {
			if (tid == tids[i].value) {
				index = i;
				break;
			}
		}
		if(index>=0)
		tids.splice(index, 1);
	}
	defineExpose({
		openDialog
	});
</script>

<style>
</style>
