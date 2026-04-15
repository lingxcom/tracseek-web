<template>
	<div style="width: 100%;overflow: hidden;">
			<div  @click="openDialog" style="width: 100%;vertical-align:middle"  class="noselect">
	<el-input :placeholder="placeholder" readonly v-model="text"  size="small">
	    <template #append >{{t("el.choose")}}</template>
	</el-input></div>
<CarsDialog ref="carsDialog" @lingxchange="setTids" :istype="true"></CarsDialog>
	</div>
</template>

<script setup>
  import CarsDialog from "@/views/jt808/dialog/CarsDialog.vue"
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
	  },
	  placeholder: {
	    type: String,
	    default: ""
	  }
	});
	const carsDialog=ref(null);
	const text=ref("");
	const ename=ref("");
	let tempValue="";
	function openDialog(){
		if(props.readonly)return;
		carsDialog.value.openDialog({title:ename.value+"-"+t('el.single'),ecode:props.ecode});
	}
	function setTids(obj){
		text.value=getTextString(obj);
		tempValue=getValueString(obj);
		emit("update:modelValue", tempValue)
		emit("change")
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
