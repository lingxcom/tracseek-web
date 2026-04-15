<template>
	<div style="width: 100%;height: 100%;"><lingxmap mapid="map565156" zoom="16" ref="lingxMap"></lingxmap></div>
</template>

<script setup>
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose } from 'vue';
	import { useI18n } from 'vue-i18n'
	import * as maptalks from 'maptalks';
	import api from '@/hooks/api'
	import {lgxInfo} from '@/hooks/lingx'
	import {wgs84ToGcj02} from '@/hooks/maptools'
	import lingxmap from "@/components/LingxMap.vue"
	const { t } = useI18n();
	const emit = defineEmits(['custom-event']);
	const props = defineProps({
	  id: {type: String,default: ""},
	});
	const lingxMap=ref(null);
	let map,layer;
	function ok(){
		emit("close")
	}
	function reload(id){
		layer.clear();
		api.callApi({apicode:8002,ecode:"tgps_car_alarm",mcode:"get",id:id},function(json){
			
			new maptalks.Marker(
			                             wgs84ToGcj02(json.data.lng,json.data.lat)
			                             
			                           ).addTo(layer);
									   map.setCenter(wgs84ToGcj02(json.data.lng,json.data.lat));
		});
	}
	onMounted(function(){
		emit("setype",2);
		emit("setitle",t('el.car.history.alarm'));
		api.callApi({apicode:8002,ecode:"tgps_car_alarm",mcode:"get",id:props.id},function(json){
			map=lingxMap.value.getMap();
			layer = new maptalks.VectorLayer('vector').addTo(map);
			new maptalks.Marker(
			                             wgs84ToGcj02(json.data.lng,json.data.lat)
			                             
			                           ).addTo(layer);
									   map.setCenter(wgs84ToGcj02(json.data.lng,json.data.lat));
		});
	});
	defineExpose({ok,reload});
</script>

<style>
</style>
