<template>
	<layout2>
		<template #left>
			<cartree ref="lingxCarTree" @lingxnodeclick="lingxnodeclick" ></cartree>
		</template>
		<div style="margin-top: 20px;">
			<el-form  label-width="140px" style="width:80%;">
			  <el-form-item :label="t('el.jt808.prop.terminal_type')">
			    <el-input v-model="form.p0"></el-input>
			  </el-form-item>
			  <el-form-item :label="t('el.jt808.prop.maker_id')">
			    <el-input v-model="form.p2"></el-input>
			  </el-form-item>
			  <el-form-item :label="t('el.jt808.prop.terminal_model')">
			    <el-input v-model="form.p7"></el-input>
			  </el-form-item>
			  <el-form-item :label="t('el.jt808.prop.terminal_id')">
			    <el-input v-model="form.p27"></el-input>
			  </el-form-item>
			  <el-form-item :label="t('el.jt808.prop.sim_iccid')">
			    <el-input v-model="form.p42"></el-input>
			  </el-form-item>
			  <el-form-item :label="t('el.jt808.prop.hw_version')">
			    <el-input v-model="form.p53"></el-input>
			  </el-form-item>
			  <el-form-item :label="t('el.jt808.prop.fw_version')">
			    <el-input v-model="form.p54"></el-input>
			  </el-form-item>
			  <el-form-item :label="t('el.jt808.prop.gnss_attr')">
			    <el-input v-model="form.p55"></el-input>
			  </el-form-item>
			  <el-form-item :label="t('el.jt808.prop.comm_attr')">
			    <el-input v-model="form.p56"></el-input>
			  </el-form-item>
			   <el-form-item>
			      <el-button type="success" @click="search">{{t('el.jt808.prop.query_terminal_attr')}}</el-button>
			    </el-form-item>
			</el-form>
		</div>
	</layout2>
</template>

<script setup>
	import { ref, computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose,watch   } from 'vue';
	import {lgxInfo,lgxInfo2,distance,timenum,formatDatetime,timeString,getRotation,JSONToExcelConvertor} from '@/hooks/lingx'
	import layout2 from "@/components/LingxLayout2.vue";
	import cartree from "@/components/LingxCarTree.vue"
	import api from '@/hooks/api';
	import { useI18n } from 'vue-i18n'
	import { useRoute } from 'vue-router'
	const route = useRoute()
	const { t } = useI18n()
	const form=ref({});
	let carid;
	function lingxnodeclick(data,node,el){
		if(data.type=="device")carid=data.value;
	}
	function search(){
	  if(!carid){
	    lgxInfo2(t("el.jt808.prop.select_device_first"));
	    return;
	  }
	  lgxInfo(t("el.jt808.prop.querying"));
	  api.callApi({apicode:1134,deviceId:carid},function(json){
	  if(json.data){
	    form.value=json.data;
	  }
	
	  })
	}
</script>

<style>
</style>
