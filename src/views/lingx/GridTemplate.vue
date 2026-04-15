<template>
	<div style="width: 100%;height: 100%;">
		<lingxgrid ref="grid" :ecode="ecode" @syncename="syncename" :mcode="mcode" isbutton isoperaterow iscontextmenu 
		 @open-dialog="openDialog2" @dblclick="openViewDialog2"
		 ></lingxgrid>
		<lingxeditdialog ref="editdialog" @lingxedit="reloadGrid"></lingxeditdialog>
		<lingxviewdialog ref="viewdialog" ></lingxviewdialog>
		<lingxasyncdialog ref="asyncdialog" @lingxedit="reloadGrid"></lingxasyncdialog>
	</div>
</template>

<script setup>
	import lingxgrid from "@/components/LingxGrid.vue"
	import lingxeditdialog from "@/views/lingx/dialog/LingxEditDialog.vue"
	import lingxviewdialog from "@/views/lingx/dialog/LingxViewDialog.vue"
	import lingxasyncdialog from "@/views/lingx/dialog/LingxAsyncDialog.vue"
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose  } from 'vue';
	const props = defineProps({
	  ecode: {
	    type: String,
	    default: ""
	  },
	  mcode: {
	    type: String,
	    default: "grid"
	  }
	});
	const grid=ref(null);
	const editdialog=ref(null);
	const viewdialog=ref(null);
	const asyncdialog=ref(null);//异步加载Vue
	let ename="";
	function syncename(p1){
		ename=p1;
	}
	function openDialog2(options){
		let p1=options.method;
		let p2=options.id;
		if(p1.viewUri)
		asyncdialog.value.openDialog(options);
		else
		editdialog.value.openDialog({ecode:props.ecode,mcode:p1.code,id:p2,title:p1.text+"-"+ename});
	}
	function openViewDialog(p1,p2,p3){
		viewdialog.value.openDialog({ecode:p2,mcode:"view",id:p3,title:p1});
	}
	function openViewDialog2(options){
		let data=options.data;
		if(data&&data.id)
		viewdialog.value.openDialog({ecode:props.ecode,mcode:"view",id:data.id,title:ename});
	}
	function reloadGrid(){
		grid.value.reload();
	}
	window.openViewDialog=openViewDialog;
</script>

<style>
</style>
