<template>
	<lingxdialog ref="dialog" @confirm="dialogSubmit" :scrollbar="false">
		<alarmhandle ref="view1" :id="alarmId" @reload="reload"></alarmhandle>
	</lingxdialog>
</template>

<script setup>
	import {ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose,defineAsyncComponent,shallowRef} from 'vue';
	import {lgxInfo,lgxInfo2,distance,timenum,formatDatetime,timeString,getRotation,JSONToExcelConvertor} from '@/hooks/lingx'
	import {useI18n} from 'vue-i18n'
	import api from '@/hooks/api'
	const emit = defineEmits(['custom-event']);
	const {t} = useI18n()
	import lingxdialog from "@/components/LingxDialog.vue"
	import alarmhandle from "@/views/jt808/dialog/AlarmHandle.vue"
	
	
	const alarmId=ref(0);
	const view1=ref();
	const dialog=ref();
	function dialogSubmit(){
		view1.value.ok();
		dialog.value.closeDialog();
	}
	function openDialog(options) {
		alarmId.value=options.id;
		dialog.value.openDialog({
			title: t('el.car.alarm.handle.dialog.title')
		});
		view1.value.reload(options.id);
	}
	function reload(){
		emit("reload");
	}
	defineExpose({
		openDialog
	});
</script>

<style>
</style>
