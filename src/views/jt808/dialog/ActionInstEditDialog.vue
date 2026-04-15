<template>
	<el-scrollbar height="100%">
		<el-row>
		<el-col :span="20" style="padding-top:15px ">
		<el-form ref="form" label-width="160px">
			<el-form-item :label="t('el.rule.action.name')" :rules="[{ required: true}]">
			<el-input v-model="data.name" @keyup.enter.native="dialogSubmit" spellcheck ="false" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item :label="t('el.rule.action.template')" :rules="[{ required: true}]">
			<lingxgriddialog v-model="data.action_id" ecode="tgps_action" spellcheck ="false" autocomplete="off" :readonly="!!props.id"></lingxgriddialog>
			</el-form-item>
			<el-form-item :label="item.name" :key="index" v-for="(item,index) in listField"
			 :rules="[{ required: true}]">
			 <el-input v-model="item.value"  v-if="item.inputType=='textfield'||!item.inputType" @keyup.enter.native="dialogSubmit" spellcheck ="false" autocomplete="off"></el-input>
			 <el-select v-model="item.value"  v-if="item.inputType=='combobox'" placeholder="">
			     <el-option
			       v-for="item4 in item.optionitem"
			       :key="item4.value"
			       :label="item4.text"
			       :value="item4.value">
			     </el-option>
			   </el-select>
			   <lingxgriddialog v-model="item.value" :ecode="item.refEntity" v-if="item.inputType=='dialoggrid'" :options="item.inputOptions"></lingxgriddialog>
			   <lingxgriddialog2 v-model="item.value" :ecode="item.refEntity" v-if="item.inputType=='dialoggrid2'" :options="item.inputOptions"></lingxgriddialog2>
			</el-form-item>
			<el-form-item :label="t('el.rule.action.orderindex')" :rules="[{ required: true}]">
				<el-input v-model="data.orderindex" @keyup.enter.native="dialogSubmit" spellcheck ="false" autocomplete="off"></el-input>
			</el-form-item>
		</el-form></el-col>
		</el-row>
	  </el-scrollbar>
</template>

<script setup>
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose  } from 'vue';
	import lingxgriddialog from "@/views/lingx/dialog/LingxGridDialog.vue";
	import lingxgriddialog2 from "@/views/lingx/dialog/LingxGridDialog2.vue";
	import { useI18n } from 'vue-i18n'
	import api from '@/hooks/api'
	import {lgxInfo,getValueString} from '@/hooks/lingx'
	const { t } = useI18n();
	const emit = defineEmits(['custom-event']);
	const props = defineProps({
	  id: {type: String,default: ""},
	});
	const data=ref({name:"",action_id:"",orderindex:100});
	const listField=ref([]);
	function dialogSubmit(){
		let params=data.value;
		params.action_config=JSON.stringify(listField.value)||"[]";
		params.apicode=8002;
		params.ecode="tgps_action_inst";
		params.mcode=params.id?"edit":"add";
		if(params.user_id)params.user_id=params.user_id.value;
		api.callApi(params,function(json){
			if(json.code==1){
				emit("lingxedit")
				emit("close")
			}
			
		});
	}
	function ok(){
		dialogSubmit();
	}
	watch(()=>data.value.action_id,function(newValue,oldValue){
		if(!props.id)
		api.callApi({apicode:1120,id:newValue,type:3},function(json){
			listField.value=json.data;
		});
	});
	onMounted(function(){
		if(props.id){
			emit("setitle",t('el.edit')+"-"+t('el.rule.action'));
			api.callApi({apicode:8001,e:"tgps_action_inst",m:"edit",eid:props.id},function(json){
				let dataList=json.data.fields;
				for(let i=0;i<dataList.length;i++){
					data.value[dataList[i].code]=dataList[i].value;
				}
				api.callApi({apicode:1120,p1:data.value.action_config,type:4,etype:"tgps_action",id:data.value.action_id[0].value},function(json){
					listField.value=json.data;
				});
			});
		}else{
			emit("setitle",t('el.add')+"-"+t('el.rule.action'));
		}
		
	});
	defineExpose({ok});
</script>

<style>
</style>
