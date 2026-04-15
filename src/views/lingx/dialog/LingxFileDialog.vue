<template>
	<div style="width: 100%;">
	    <div  @click="openDialog">
	<el-input placeholder="" readonly v-model="text">
	    <template #append>上传</template>
	</el-input>
	</div>
	
	<lingxdialog ref="dialog" :title="t('el.upload.file')" :scrollbar="false" @confirm="ok">
		<div style="width: 100%;height: 100%;display: flex;flex-direction: column;">
			<div style="height: 35px;margin-left: 10px;display: flex;align-items: center;">
				<el-upload :headers="getHeaders"
				  :on-success="upSuccess"
				  :on-error="upError"
				  :action="action"
				  :data="getData"
				  :before-upload="startUp"
				  :show-file-list="false"
				  style="display: flex;align-items: center; "
				  >
				  <el-button size="small" plain type="success">上传文件</el-button>
				</el-upload>
				  <el-button size="small" plain type="danger" style="margin-left: 10px;" @click="delFile">删除文件</el-button>
			</div>
			<div style="flex-grow: 1;height: 0;">
				<lingxgrid ref="grid" ecode="tlingx_file" mcode="grid" @dblclick="ok"></lingxgrid>
			</div>
		</div>
	</lingxdialog>
	</div>
</template>

<script setup>
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose  } from 'vue';
	import api from '@/hooks/api'
	import {lgxInfo,lgxInfo2,getEntityString,getTextString,getValueString,format1} from '@/hooks/lingx'
	import lingxdialog from "@/components/LingxDialog.vue"
	import lingxgrid from "@/components/LingxGrid.vue"
	import { ElLoading } from 'element-plus'
	import { useI18n } from 'vue-i18n'
	const emit = defineEmits(['update:modelValue'])
	const props = defineProps({
	  modelValue:{
		  type:String,
		  default:{}
	  },
	  readonly:{
		  type:Boolean,
		  defalut:false
	  }
	});
	const { t } = useI18n();
	const dialog=ref(null);
	const grid=ref(null);
	const getHeaders=ref( {
	  'Accept': 'application/json'
	});
	const getData=ref( {
	  'lingxtoken': sessionStorage.getItem("token")
	});
	const action=ref(window.uploadUrl);
	const text=ref("");
	let loadingInstance1;
	let tempValue="";
	function openDialog(){
		if(props.readonly)return;
		dialog.value.openDialog({title:t('el.upload.file')});
	}
	function startUp(){
		 loadingInstance1 = ElLoading.service({ fullscreen: true })
	}
	function reloadGrid(){
	  grid.value.reload();
	}
	function upSuccess(e){
		var msg=e||"文件上传成功！"
		lgxInfo(msg)
		loadingInstance1.close();
		reloadGrid();
	
	}
	function upError(){
		loadingInstance1.close();
		lgxInfo2("文件上传失败！")
	}
	function ok(){
		let row=grid.value.getCurrentRow();
	    let textField=grid.value.getTextField();
	    let tempValue=row.id;
		emit("update:modelValue", tempValue)
	    text.value=tempValue;
	    dialog.value.closeDialog();
	}
	function delFile(){
		if(!confirm("确认删除吗？"))return;
		let row=grid.value.getCurrentRow();
		api.callApi({apicode:8009,filename:row.id},function(json){
			lgxInfo("文件删除成功！");
			 reloadGrid();
		});
	}
	onMounted(function(){
		if(props.modelValue){
			let obj=props.modelValue;
			text.value=obj;
			tempValue=obj;
		}else{
			text.value="";
			tempValue="";
		}
	});
	watch(() => props.modelValue,function(newVal,oldVal){
		if(props.modelValue){
			let obj=newVal;
			text.value=obj;
			tempValue=obj;
		}else{
			text.value="";
			tempValue="";
		}
	});
</script>

<style>
</style>
