<template>
	<lingxdialog ref="dialog" @confirm="dialogSubmit" :scrollbar="false">
		<AuthDataGroup :list="list" :parentIndex="0" @delgroup="delGroup" :left="left" :op="op" :right="right"/>
	</lingxdialog>
</template>

<script setup>
	import {ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose,defineAsyncComponent,shallowRef} from 'vue';
	import {useI18n} from 'vue-i18n'
	import api from '@/hooks/api'
	const emit = defineEmits(['custom-event']);
	const {t} = useI18n();
	import lingxdialog from "@/components/LingxDialog.vue"
	import AuthDataGroup from "@/views/lingx/tools/dialog/AuthDataGroup.vue"
	import {lgxInfo,lgxInfo2,getEntityString,getTextString,getValueString,format1} from '@/hooks/lingx'
	const list=ref([{type:"op",op:"and"}]);
	const left=ref([]);
	const op=ref([]);
	const right=ref([]);
	const id=ref("");
	const prop=ref("");
	const ecode=ref("");
	const dialog=ref(null);
	function openDialog(options) {
		dialog.value.openDialog({
			title: "数据权限"
		});

        list.value=[{type:"op",op:"and"}];
        ecode.value=options.ecode;
        id.value=options.id;
        prop.value=options.prop;
        if(options.value&&options.value.charAt(0)=='['){
          list.value=JSON.parse(options.value);
        }
        api.callApi({
          apicode: 9024,
          ecode: ecode.value,
        }, function(json) {
          left.value=json.left;
          right.value=json.right;
        });
        api.callApi({
          apicode: 8002,
          ecode: "tlingx_option",
          mcode:"items",
          code:"LJYSF"
        }, function(json) {
          op.value=json.data;
        });
	}
	function dialogSubmit(){
		let value=JSON.stringify(list.value);
		api.callApi({apicode:9008,code:ecode.value,id:id.value,prop:prop.value,value:value},function(json){
		 lgxInfo(json.message)
		 if(json.code==1)dialog.value.closeDialog();
		});
	}
	defineExpose({
		openDialog
	});
</script>

<style>
</style>
