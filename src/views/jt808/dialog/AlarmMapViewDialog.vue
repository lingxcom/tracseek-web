<template>
	<lingxdialog ref="dialog" @confirm="dialogSubmit" type="2" :scrollbar="false">
		<alarmmapview ref="view1" :id="alarmId"></alarmmapview>
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
	import alarmmapview from "@/views/jt808/dialog/AlarmMapView.vue"
	
	
	const alarmId=ref(0);
	const view1=ref();
	const dialog=ref();
	function openDialog(options) {
		alarmId.value=options.id;
		dialog.value.openDialog({
			title: t('el.car.alarm.map.dialog.title')
		});
		view1.value.reload(options.id);
	}
	defineExpose({
		openDialog
	});
</script>

<style>
</style>
