<template>
	<lingxdialog ref="dialog" @confirm="dialogSubmit" type="2" :scrollbar="true">
<el-tree ref="tree1" :data="data" :props="defaultProps"
default-expand-all show-checkbox
                  node-key="id"
                  style="background-color: #dfe9f6;"
                  check-on-click-node
                  :default-checked-keys="checkedKeys"
                  @check-change="checkChange"
 ></el-tree>
	</lingxdialog>
</template>

<script setup>
	import {ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose,defineAsyncComponent,shallowRef} from 'vue';
	import {useI18n} from 'vue-i18n'
	import api from '@/hooks/api'
	const emit = defineEmits(['custom-event']);
	const {t} = useI18n()
	import lingxdialog from "@/components/LingxDialog.vue"
	import {lgxInfo,lgxInfo2,getEntityString,getTextString,getValueString,format1} from '@/hooks/lingx'
	const dialog=ref(null);
	const ecode=ref("");
	const data=ref([]);
	const checkedKeys=ref([]);
	const defaultProps=ref( {
	  children: 'children',
	  label: 'text',
	  isLeaf: 'leaf'
	});
	function openDialog(options) {
		dialog.value.openDialog({
			title: "功能权限"
		});
		ecode.value=options.ecode;
		api.callApi({
		  apicode: 9015,
		  code: options.ecode
		}, function(json) {
		  data.value = json.data;
		  checkedKeys.value=json.checkedKeys;
		});
	}
	function checkChange(data,checked){
	  api.callApi({
	    apicode: 9016,
	    ecode: ecode.value,
	    mcode:data.id,
	    checked:checked
	  }, function(json) {
	    lgxInfo(json.message)
	  });
	}
	function dialogSubmit(){
		dialog.value.closeDialog();
	}
	defineExpose({
		openDialog
	});
</script>

<style>
</style>
