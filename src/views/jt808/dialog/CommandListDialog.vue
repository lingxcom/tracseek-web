<template>
	<lingxdialog ref="dialog" @confirm="dialogSubmit" :type="2">
			<div style="display: flex;flex-wrap: wrap; gap: 10px;padding: 10px;">
			<div v-for="(item,index) in list"  :key="index" style="text-align: center;height: 40px;line-height: 40px;">
			  <el-button type="primary" plain @click="sendCmd(item)" style="width:130px">{{index+1}}.{{item.name}}</el-button>
			</div>
			<commandsenddialog ref="commandsend"></commandsenddialog>
		</div>
	</lingxdialog>
</template>

<script setup>
	import {ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose,defineAsyncComponent,shallowRef} from 'vue';
	import {useI18n} from 'vue-i18n'
	import api from '@/hooks/api'
	import lingxdialog from "@/components/LingxDialog.vue"
	import commandsenddialog from "@/views/jt808/dialog/CommandSendDialog.vue"
	const {t} = useI18n()
	const emit = defineEmits(['custom-event']);
	const list=ref([]);
	const dialog = ref(null);
	const commandsend=ref(null);
	let id,carno;
	function sendCmd(item){
		commandsend.value.openDialog({id:id,carno:carno,params:item});
	}
	function openDialog(options) {
		id=options.id;
		carno=options.carno;
		dialog.value.openDialog({
			title: t('el.car.command.dialog.title')+"["+options.carno+"]"
		});
		api.callApi({apicode:1108},function(json){
		  list.value=json.data;
		});
	}
	defineExpose({
		openDialog
	});
</script>

<style scoped="scoped">
</style>
