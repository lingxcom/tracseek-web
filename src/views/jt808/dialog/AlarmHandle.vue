<template>
	<div style="width: 100%;height: 100%;">
		<el-form label-width="auto" style="margin: 10px;" >
		    <el-form-item :label="t('el.car.alarm.name')">
		      	{{data.name}}
		    </el-form-item>
		    <el-form-item :label="t('el.car.alarm.handletype')">
		      <el-radio-group v-model="type">
		        <el-radio value="1">{{t('el.car.alarm.type1')}}</el-radio>
		        <el-radio value="2">{{t('el.car.alarm.type2')}}</el-radio>
		        <el-radio value="3">{{t('el.car.alarm.type3')}}</el-radio>
		      </el-radio-group>
		    </el-form-item>
		    <el-form-item :label="t('el.car.alarm.comment')">
		      <el-input v-model="comment" type="textarea" maxlength="60" />
		    </el-form-item>
		  
		  </el-form>
	</div>
</template>

<script setup>
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose } from 'vue';
	import { useI18n } from 'vue-i18n'
	import api from '@/hooks/api'
	import {lgxInfo} from '@/hooks/lingx'
	import {wgs84ToGcj02} from '@/hooks/maptools'
	const { t } = useI18n();
	const emit = defineEmits(['custom-event']);
	const props = defineProps({
	  id: {type: String,default: ""},
	});
	const lingxMap=ref(null);	
	const data=ref({});
	const type=ref("1"),comment=ref("");
	function ok(){
		api.callApi({apicode:1198,car_id:data.value.car_id,id:data.value.id,name:data.value.name,type:type.value,comment:comment.value},function(json){
			emit("reload");
			emit("close")
		});
	}
	function reload(id){
		api.callApi({apicode:8002,ecode:"tgps_car_alarm",mcode:"get",id:id},function(json){
			data.value=json.data;
		});
	}
	onMounted(function(){
		emit("setitle",t('el.car.alarm.handle.dialog.title'));
		api.callApi({apicode:8002,ecode:"tgps_car_alarm",mcode:"get",id:props.id},function(json){
			data.value=json.data;
		});
	});
	defineExpose({ok,reload});
</script>

<style>
</style>
