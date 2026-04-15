<template>
	<div style="width: 100%;height: 100%;">
		<lingxtree ref="tree" :ecode="ecode" @syncename="syncename" :mcode="mcode" isbutton isoperaterow iscontextmenu 
		 @open-dialog="openDialog2" @dblclick="openViewDialog2"
		 ></lingxtree>
		<lingxeditdialog ref="editdialog" @lingxedit="reloadTree"></lingxeditdialog>
		<lingxviewdialog ref="viewdialog" ></lingxviewdialog>
	</div>
</template>

<script setup>
	import lingxtree from "@/components/LingxTree.vue"
	import lingxeditdialog from "@/views/lingx/dialog/LingxEditDialog.vue"
	import lingxviewdialog from "@/views/lingx/dialog/LingxViewDialog.vue"
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose  } from 'vue';
	const props = defineProps({
	  ecode: {
	    type: String,
	    default: ""
	  },
	  mcode: {
	    type: String,
	    default: "tree"
	  }
	});
	const tree=ref(null);
	const editdialog=ref(null);
	const viewdialog=ref(null);
	let ename="";
	function syncename(p1){
		ename=p1;
	}
	function openDialog2(options){
		let p1=options.method;
		let p2=options.id;
		editdialog.value.openDialog({ecode:props.ecode,mcode:p1.code,id:p2,title:p1.text+"-"+ename});
	}
	function reloadTree(){
		tree.value.reload();
	}
	const openViewDialog2=(options,ecode2,ename2)=>{
		let data=options.data;
		if(data)
		viewdialog.value.openDialog({ecode:ecode2||props.ecode,mcode:"view",id:data.id,title:ename2||ename});
	}
</script>

<style>
</style>
