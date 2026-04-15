<template>
	<lingxdialog ref="dialog"type="2" :scrollbar="false">
	<lingxgrid ref="grid" ecode="tgps_data_20260408" mcode="grid" :queryfilter="queryfilter"></lingxgrid>
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
	import lingxgrid from "@/components/LingxGrid.vue"
	const dialog = ref(null);
	const grid=ref(null);
	const queryfilter=ref({});
	let car_id;
	function openDialog(options) {
		car_id=options.carid;
		dialog.value.openDialog({
			title: t('el.car.info.history.data')+"["+options.carno+"]"
		});
		queryfilter.value={cx_carid:car_id}
	}
	defineExpose({
		openDialog
	});
</script>

<style>
</style>
