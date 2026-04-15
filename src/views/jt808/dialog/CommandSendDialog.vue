<template>
	<lingxdialog ref="dialog" @confirm="dialogSubmit" >
			<el-form label-position="right" label-width="120px"  style="margin-top: 10px;padding: 10px;">
			  <el-form-item :label="t('el.car.command')" :rules="[{ required: true}]">
			    <div><b>{{cmd.name}}</b></div>
			    <div style="font-size: 12px;color: #999;">{{cmd.remark}}</div>
			  </el-form-item>
			  <el-form-item v-for="(item,index) in fields"  :key="index" :label="item.name" :rules="[{ required: true}]">
			    <el-input  v-if="item.inputType=='text'||!item.inputType" v-model="item.value"></el-input>
			    <el-checkbox-group v-model="item.value"  v-if="item.inputType=='checkbox'">
			          <el-checkbox name="itemcode"  :key="index3" :label="item3.value" :data-value="item.value" v-for="(item3,index3) in item.optionitem"><span v-html="item3.text"></span></el-checkbox>
			    </el-checkbox-group>
			<el-select v-model="item.value"  v-if="item.inputType=='combobox'" placeholder="">
			    <el-option
			      v-for="item4 in item.optionitem"
			      :key="item4.value"
			      :label="item4.text"
			      :value="item4.value">
			    </el-option>
			  </el-select>
			  </el-form-item>
			
			</el-form>
	</lingxdialog>
</template>

<script setup>
	import {ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose,defineAsyncComponent,shallowRef} from 'vue';
	import {useI18n} from 'vue-i18n'
	import api from '@/hooks/api'
	import lingxdialog from "@/components/LingxDialog.vue"
	import { ElLoading } from 'element-plus'
	const {t} = useI18n()
	const emit = defineEmits(['custom-event']);
	const fields=ref([]);
	const dialog = ref(null);
	const cmd=ref({});
	let id,carno;
	function openDialog(options) {
		id=options.id;
		carno=options.carno;
		cmd.value=options.params;
		fields.value=[];
		if(options.params.params)
		fields.value=eval("("+options.params.params+")");
		dialog.value.openDialog({
			title: t('el.car.command.dialog.title')+"["+options.carno+"]"
		});
		console.log(options)
	}
	function dialogSubmit(){
		let loadingInstance = ElLoading.service({fullscreen:false,background:"#ced9e7",customClass:"lingx-loading"});
		var param={apicode:1109,car_id: id,cmdId:cmd.value.id,cmdParams:JSON.stringify(fields.value)};
		api.callApi(param,function(json){
		  loadingInstance.close();
		  alert(json.message);
		  //_this.list=json.data;
		});
	}
	defineExpose({
		openDialog
	});
</script>

<style scoped="scoped">
</style>
