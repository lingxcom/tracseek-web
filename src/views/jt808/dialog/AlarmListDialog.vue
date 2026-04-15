<template>
	<lingxdialog ref="dialog" @confirm="dialogSubmit" type="2" :scrollbar="false">
		<div style="background-color: #FFF;width: 100%;height: 100%;display: flex;flex-direction: column;">
			<div style="width: 100%;height: 42px;">
				<div style="margin: 5px;">
				          <span>
				             <el-date-picker
				             style="width: 120px;"
				                   v-model="sdate"
				                   value-format="YYYYMMDD"
				                   type="date"
				                   :placeholder="t('el.stime')"
								   :clearable="false"
								   size="small"
				                 >
				                 </el-date-picker>
						
				                 <el-date-picker
				                   style="width: 120px;margin-left: 5px;"
				                       v-model="edate"
				                       value-format="YYYYMMDD"
				                       type="date"
				                      :placeholder="t('el.etime')"
								   :clearable="false"
								   size="small"
				                       >
				                     </el-date-picker>
				          </span>
				          <el-button @click="searchGrid" type="primary" plain icon="Search" style="margin-left: 5px;" size="small">{{t('el.search')}}</el-button>
						
				    <el-button @click="excel" :disabled="tableData.length==0" icon="Download" type="success" plain size="small">{{t('el.excel')}}</el-button>
				<el-button-group  style="margin-left: 5px;" size="small">
				<el-button @click="day1"  plain  >{{t('el.report.shortcuts.time01')}}</el-button>	
				<el-button @click="day2"  plain  >{{t('el.report.shortcuts.time02')}}</el-button>
				<el-button @click="day7"  plain  >{{t('el.report.shortcuts.time101')}}</el-button>
						</el-button-group>
				                </div>
			</div>
			<div style="height: 0px;flex-grow: 1;">
				<el-table
				    :data="tableData"
				    stripe
				    highlight-current-row
				    height="100%"
				    style="width: 100%">
				    <el-table-column
				               label=""
				               width="42px">
				           <template #default="scope">
				               {{scope.$index+1}}
				           </template>
				       </el-table-column>
				    <el-table-column v-for="(item,index) in fields" :key="index"
				      :prop="item.code"
				      :label="item.name"
					  :width="item.width"
               show-overflow-tooltip
				      >
					  <template #default="scope">
					     <div v-if="item.code=='time'" v-html="timeString(scope.row['time'])"></div>
					     <div v-else-if="item.code=='gpstime'"  v-html="formatDatetime(scope.row['gpstime'])"></div>
					     <div v-else-if="item.code=='status'"  v-html="formatStatus(scope.row['status'])"></div>
					     <div v-else >
					       {{scope.row[item.code]}}
					     </div>
					  </template>
				    </el-table-column>
					 <el-table-column fixed="right" label="" width="100">
					      <template #default="scope">
					        <el-button link type="primary" :disabled="scope.row['status']!='1'" size="small" @click="handleClick(scope.row['id'])">
					        {{t("el.handle")}}
					        </el-button>
					        <el-button link type="success" size="small" @click="showMap(scope.row['id'])"> {{t("el.map")}}</el-button>
					      </template>
					    </el-table-column>
				  </el-table>
				  <alarmmapviewdialog ref="dialog1"></alarmmapviewdialog>
				  <alarmhandledialog ref="dialog2" @reload="searchGrid"></alarmhandledialog>
			</div>
		</div>
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
	import alarmmapviewdialog from "@/views/jt808/dialog/AlarmMapViewDialog.vue"
	import alarmhandledialog from "@/views/jt808/dialog/AlarmHandleDialog.vue"
	let car_id=null;
	let date1=new Date();
	let date2=new Date();
	date1.setDate(date1.getDate()-7);
	const sdate=ref(date1.format("yyyyMMdd")),edate=ref(date2.format("yyyyMMdd"));
	const tableData=ref([]),fields=ref([{name:t('el.car.alarm.name'),code:"name",width:100},
	{name:t('el.car.alarm.gpstime'),code:"gpstime",width:160},
	{name:t('el.car.alarm.time'),code:"time",width:100},
	{name:t('el.car.alarm.speed'),code:"speed",width:120},
	{name:t('el.car.alarm.status'),code:"status",width:100},
	{name:t('el.car.alarm.comment'),code:"comment",width:100}]);
	
	const dialog1=ref();//地图位置
	const dialog2=ref();//报警处理
	const dialog = ref(null);
	function searchGrid(){
		api.callApi({apicode:1199,car_id:car_id,stime:sdate.value+"000000",etime:edate.value+"235959"},function(json){
			tableData.value=json.data;
		});
	}
	function handleClick(id){
		dialog2.value.openDialog({id:id});
	}
	function showMap(id){
		dialog1.value.openDialog({id:id});
	}
	function formatStatus(status){
		return status=="1"?t("el.handle1"):t("el.handle2");
	}
	function openDialog(options) {
		car_id=options.carid;
		dialog.value.openDialog({
			title: t('el.car.alarm.dialog.title')+"["+options.carno+"]"
		});
		day7();
		//searchGrid();
	}
	function day1(){
		let date1=new Date();
		sdate.value=date1.format("yyyyMMdd");
		edate.value=date1.format("yyyyMMdd");
		searchGrid()
	}
	function day2(){
		let date1=new Date();
		date1.setDate(date1.getDate()-1);
		sdate.value=date1.format("yyyyMMdd");
		edate.value=date1.format("yyyyMMdd");
		searchGrid()
	}
	function day7(){
		let date1=new Date();
		let date2=new Date();
		date1.setDate(date1.getDate()-7);
		sdate.value=date1.format("yyyyMMdd");
		edate.value=date2.format("yyyyMMdd");
		searchGrid()
	}
	defineExpose({
		openDialog
	});
</script>

<style>
</style>
