<template>
	<div  style="width: 100%;height: 100%;">
		<lingxgrid ref="grid" :ecode="ecode" :queryfilter="queryfilter" @syncename="syncename" :mcode="mcode" isbutton isoperaterow iscontextmenu
		 @open-dialog="openDialog2" @dblclick="openViewDialog2"
		 ></lingxgrid>
		<lingxeditdialog ref="editdialog" @lingxedit="reloadGrid"></lingxeditdialog>
		<lingxviewdialog ref="viewdialog" ></lingxviewdialog>
		<lingxasyncdialog ref="asyncdialog" @lingxedit="reloadGrid"></lingxasyncdialog>
	</div>
</template>

<script setup>
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose } from 'vue';
	import { useI18n } from 'vue-i18n'
	import api from '@/hooks/api'
	import {lgxInfo} from '@/hooks/lingx'
	
	import lingxdialog from "@/components/LingxDialog.vue"
	import lingxgrid from "@/components/LingxGrid.vue"
	import lingxeditdialog from "@/views/lingx/dialog/LingxEditDialog.vue"
	import lingxviewdialog from "@/views/lingx/dialog/LingxViewDialog.vue"
	import lingxasyncdialog from "@/views/lingx/dialog/LingxAsyncDialog.vue"
	const { t } = useI18n();
	const emit = defineEmits(['custom-event']);
	const props = defineProps({
	  id: {type: String,default: ""},
	});
	const dialog=ref(null);
	
	const ecode=ref("tgps_car_tdh");
	const mcode=ref("grid");
	const grid=ref(null);
	const editdialog=ref(null);
	const viewdialog=ref(null);
	const asyncdialog=ref(null);//异步加载Vue
	let ename="";
	const queryfilter=ref({car_id:props.id});
	function syncename(p1){
		ename=p1;
	}
	function openDialog2(options){
		console.log("过濾设置",queryfilter.value)
		let p1=options.method;
		let p2=options.id;
		if(p1.viewUri)
		asyncdialog.value.openDialog(options);
		else
		editdialog.value.openDialog({ecode:ecode.value,mcode:p1.code,id:p2,title:p1.text+"-"+ename,extparam:options.queryfilter});
	}
	function openViewDialog(p1,p2,p3){
		viewdialog.value.openDialog({ecode:p2,mcode:"view",id:p3,title:p1});
	}
	function openViewDialog2(options){
		let data=options.data;
		if(data&&data.id)
		viewdialog.value.openDialog({ecode:ecode.value,mcode:"view",id:data.id,title:ename});
	}
	function reloadGrid(){
		grid.value.reload();
	}
	watch(() => props.id,(newVal)=>{
		queryfilter.value.car_id=newVal;
	});
	onMounted(function(){
		emit("setype",2);
		emit("setitle","设置视频");
		
	});
	//window.openViewDialog=openViewDialog;
</script>

<style>
</style>
