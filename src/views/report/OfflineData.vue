<template>
 <el-container style="height: 100%;">
   <el-header height="42" style="padding:0px;">
   <div style="margin:5px 0px;">
     <span>
      <el-date-picker size="small"
            v-model="date8"
            @change="searchGrid"
            type="date"
		    value-format="YYYYMMDD"
            :placeholder="t('el.select.date')"
            :shortcuts="shortcuts">
          </el-date-picker>
     </span>
     <el-button @click="searchGrid" type="primary" plain icon="Search" style="margin-left: 5px;" size="small">{{t('el.search')}}</el-button>
     <el-button @click="excel" type="success" plain icon="Download" :disabled="tableData.length==0" size="small">{{t('el.excel')}}</el-button>
   </div>
   </el-header>
   <el-main style="margin:0px;padding:0px;">
<el-table
    :data="tableData"
    stripe
					 class="ep-table-beauty"
    highlight-current-row
    size="mini"
    height="100%"
    style="width: 100%">
    <el-table-column
               label=""
               width="42px">
           <template #default="scope">
               {{scope.$index+1}}
           </template>
       </el-table-column>
    <el-table-column  prop="carno" :label="t('el.car.info.carno')" width="150"></el-table-column>
    <el-table-column  prop="group" :label="t('el.car.info.group')" width="150"></el-table-column>
    <el-table-column  prop="tid" :label="t('el.car.info.tid')" width="180"></el-table-column>
    <el-table-column  prop="gpstime" :label="t('el.report.offline.time1')"  width="180" :formatter="formatDatetime1"></el-table-column>
    <el-table-column  prop="time1" :label="t('el.report.offline.time2')"  width="180" :formatter="timeString1"></el-table-column>
  </el-table>
   </el-main>
 </el-container>
</template>

<script setup>
	import { ref, computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose,watch   } from 'vue';
	import {lgxInfo,lgxInfo2,distance,timenum,formatDatetime,timeString,getRotation,JSONToExcelConvertor} from '@/hooks/lingx'
	import api from '@/hooks/api';
	import { useI18n } from 'vue-i18n'
	import { useRoute } from 'vue-router'
	const route = useRoute()
	const { t } = useI18n()
	const date8=ref(0);
	const tableData=ref([]);
	const shortcuts=ref([{
            text:t('el.report.shortcuts.time1'),
            value: () => {
              const date = new Date()
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 3)
                    return date
            }
          },{
            text:t('el.report.shortcuts.time2'),
            value: () =>  {
              const date = new Date()
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
             return date
            }
          }, {
            text: t('el.report.shortcuts.time3'),
            value: () => {
              const date = new Date()
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
                    return date
            }
          }]);
	const disabledDate = (time) => {
		return time.getTime()+(24*60*60*1000) > Date.now()
	}
	function searchGrid(){
		api.callApi({apicode:1124,date8:date8.value},function(json){
		  tableData.value=json.data;
		})
	}
	function formatDatetime1(p1,p2,p3){
		return formatDatetime(p3);
	}
	function timeString1(p1,p2,p3){
		return timeString(p3/1000);
	}
	function excel(){
		let columns=[
			{title:t('el.car.info.carno'),field:"carno"},
			{title:t('el.car.info.group'),field:"group"},
			{title:t('el.car.info.tid'),field:"tid"},
			{title:t('el.report.offline.time1'),field:"gpstime",formatter:formatDatetime1},
			{title:t('el.report.offline.time2'),field:"time1",formatter:timeString1},
		];
		JSONToExcelConvertor(columns,tableData.value,new Date().getTime());
	}
</script>

<style>
</style>
