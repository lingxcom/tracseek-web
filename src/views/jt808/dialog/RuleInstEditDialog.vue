<template><el-scrollbar height="100%">
	<el-row>
	<el-col :span="20" style="padding-top:15px ">
	<el-form ref="form" label-width="160px">
		<el-form-item :label="t('el.rule.inst.name')" :rules="[{ required: true}]">
		<el-input v-model="data.name" @keyup.enter.native="dialogSubmit" spellcheck ="false" autocomplete="off"></el-input>
		</el-form-item>
		<el-form-item :label="t('el.rule.inst.template')" :rules="[{ required: true}]">
		<lingxgriddialog v-model="data.rule_id" ecode="tgps_rule" spellcheck ="false" autocomplete="off" :readonly="!!props.id"></lingxgriddialog>
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
		<el-form-item :label="t('el.rule.inst.device')" :rules="[{ required: true}]">
		<lingxgriddialog2 v-model="data.car_ids" ecode="tgps_car" spellcheck ="false" autocomplete="off"></lingxgriddialog2>
		</el-form-item>
		<el-form-item :label="t('el.rule.inst.action')" :rules="[{ required: true}]">
		<lingxgriddialog2 v-model="data.action_inst_ids" ecode="tgps_action_inst" spellcheck ="false" autocomplete="off"></lingxgriddialog2>
		</el-form-item>
		<el-form-item :label="t('el.stime')" :rules="[{ required: true}]">
		<el-time-select style="width: 100%;"
		  v-model="data.stime"
		   start="00:00"
		   step="00:15"
		   end="23:59"
			:include-end-time="true"
		   placeholder=""
		 />
		</el-form-item>
		<el-form-item :label="t('el.etime')" :rules="[{ required: true}]">
		<el-time-select style="width: 100%;"
		  v-model="data.etime"
		   start="00:00"
		   step="00:15"
		   end="23:59"
			:include-end-time="true"
		   placeholder=""
		 />
		</el-form-item>
		<el-form-item :label="t('el.rule.inst.min_duration')" :rules="[{ required: true}]">
		<el-input v-model="data.min_duration" @keyup.enter.native="dialogSubmit" spellcheck ="false" autocomplete="off"></el-input>
		</el-form-item>
		<el-form-item :label="t('el.status')">
		<el-radio-group  v-model="data.status" >
		      <el-radio label="1" ><span style="color: green;">{{t('el.enable')}}</span></el-radio>
		      <el-radio label="2" ><span style="color: red;">{{t('el.disable')}}</span></el-radio>
		</el-radio-group>
		</el-form-item>
		<el-form-item :label="t('el.remark')" >
		<el-input
		  type="textarea"
		  :rows="3"
		  placeholder=""
		  spellcheck ="false"
		  autocomplete="off"
		  v-model="data.remark">
		</el-input>
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
	const data=ref({name:"",rule_id:"",stime:"00:00",etime:"23:59",status:"1",min_duration:0});
	const listField=ref([]);
	const props = defineProps({
	  id: {type: String,default: ""},
	});
	function dialogSubmit(){
		let params=data.value;
		params.rule_config=JSON.stringify(listField.value);
		params.apicode=8002;
		params.ecode="tgps_rule_inst";
		params.mcode=params.id?"edit":"add";
		if(params.user_id)params.user_id=params.user_id.value;
		api.callApi(params,function(json){
			//console.log(json)
			if(json.code==1){
				emit("lingxedit")
				emit("close")
			}
			
		});
	}
	function ok(){
		dialogSubmit();
	}
	watch(()=>data.value.rule_id,function(newValue,oldValue){
		if(!props.id)
		api.callApi({apicode:1120,id:newValue},function(json){
			listField.value=json.data;
		});
	});
	onMounted(function(){
		if(props.id){
			emit("setitle",t("el.edit")+"-" +t("el.rule.inst"));
			api.callApi({apicode:8001,e:"tgps_rule_inst",m:"edit",eid:props.id},function(json){
				let dataList=json.data.fields;
				for(let i=0;i<dataList.length;i++){
					data.value[dataList[i].code]=dataList[i].value;
				}
				data.value.status=getValueString(data.value.status);
				api.callApi({apicode:1120,p1:data.value.rule_config,type:2,etype:"tgps_rule",id:data.value.rule_id[0].value},function(json){
					listField.value=json.data;
				});
			});
		}else{
			emit("setitle",t("el.add")+"-"+t("el.rule.inst"));
		}
		
	});
	defineExpose({ok});
</script>

<style>
</style>
