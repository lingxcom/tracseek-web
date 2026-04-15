<template>
	<div style="width: 100%;">
			<div  @click="openDialog" style="width: 100%;" class="noselect">
	<el-input placeholder="" readonly v-model="text" >
	    <template #append >{{t("el.choose")}}</template>
	</el-input></div>
	<lingxdialog ref="dialog" :title="ename+'-'+t('el.single')" :scrollbar="false" @confirm="ok">
		<lingxtree ref="tree" :ecode="ecode" @syncename="syncename" @dblclick="ok"></lingxtree>
	</lingxdialog>
	</div>
</template>

<script setup>
	import lingxtree from "@/components/LingxTree.vue"
	import lingxdialog from "@/components/LingxDialog.vue"
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose  } from 'vue';
	import {lgxInfo,getEntityString,getTextString,getValueString,format1} from '@/hooks/lingx'
	import { useI18n } from 'vue-i18n'
	const { t } = useI18n();
	const emit = defineEmits(['update:modelValue'])
	const props = defineProps({
	  ecode: {
	    type: String,
	    default: ""
	  },
	  mcode: {
	    type: String,
	    default: "tree"
	  },
	  modelValue:{
		  type:Array,
		  default:[]
	  },
	  options:{
		  type:Object,
		  default:{}
	  },
	  readonly:{
		  type:Boolean,
		  defalut:false
	  }
	});
	const dialog=ref(null);
	const tree=ref(null);
	const text=ref("");
	const ename=ref("");
	let tempValue="";
	function openDialog(){
		if(props.readonly)return;
		dialog.value.openDialog({title:ename.value+"-"+t('el.single'),ecode:props.ecode});
	}
	function syncename(p1){
		ename.value=p1;
	}
	function ok(){
		var row=tree.value.getCurrentNode();
	    var textField=tree.value.getTextField();
	    tempValue=row.id;
		emit("update:modelValue", tempValue)
	    text.value=row[textField];
	    dialog.value.closeDialog();
	}
	onMounted(function(){
		if(props.modelValue){
			let obj=props.modelValue;
			text.value=getTextString(obj);
			tempValue=getValueString(obj);
			emit("update:modelValue", tempValue)
		}
	});
	watch(() => props.modelValue,function(newVal,oldVal){
		let obj=newVal;
		 if(!obj){
		    text.value="";
		 }
		if(typeof obj=="object"){
		    text.value=getTextString(obj);
		    tempValue=getValueString(obj);
		    emit("update:modelValue", tempValue)
		}
	},{deep: true});
</script>

<style>
</style>
