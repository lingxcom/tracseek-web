<template>
	<el-table :data="cars" highlight-current-row @row-click="tableclickHandler" stripe border style="width: 100%;height: 100%;">
			<el-table-column type="index" :index="indexMethod" />
             <el-table-column v-for="(item,index) in columns"
               :prop="item.code"
               :width="item.width"
               show-overflow-tooltip
               :label="item.name" :key="index">
               <template #default="scope">
                  <div v-if="item.code=='alarm_str'" v-html="formatAlarm(scope.row['alarm_str'])"></div>
                  <div v-else-if="item.code=='online'"  v-html="formatOnline(scope.row['online'])"></div>
                  <div v-else-if="item.code=='gpstime'"  v-html="formatDatetime(1,1,scope.row['gpstime'])"></div>
                  <div v-else-if="item.code=='systime'"  v-html="formatDatetime(1,1,scope.row['systime'])"></div>
                  <div v-else-if="item.code=='first_time'"  v-html="formatDatetime(1,1,scope.row['first_time'])"></div>
                  <div v-else-if="item.code=='A30'"  v-html="formatTxxh(1,1,scope.row['A30'])"></div>
                  <div v-else-if="item.code=='A31'"  v-html="formatDwxh(1,1,scope.row['A31'])"></div>
                  <div v-else >
                    {{scope.row[item.code]}}
                  </div>
               </template>
             </el-table-column>
	  </el-table>
</template>

<script setup>
	import { ref, computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose   } from 'vue';
	import api from '@/hooks/api'
	import { useI18n } from 'vue-i18n'
	const { t } = useI18n()
    const emit = defineEmits(['custom-event']);
	const props = defineProps({
	  cars: {
	    type: Array,
	    require: true
	  }
	});
	const indexMethod = (index) => {
	  return index+1
	}
	
	const columns=[
	  {code:"carno",name:t("el.car.ssjk.carno"),checked:true,width:120},
	  //{code:"group_name",name:t("el.car.ssjk.group_name"),checked:false,width:100},
	  {code:"online",name:t("el.car.ssjk.online"),checked:true,width:70},
	  {code:"status_str",name:t("el.car.ssjk.status_str"),checked:true,width:160},
	  {code:"alarm_str",name:t("el.car.ssjk.alarm_str"),checked:true,width:100},
	  {code:"speed",name:t("el.car.ssjk.speed"),checked:true,width:100},
	  {code:"gpstime",name:t("el.car.ssjk.gpstime"),checked:true,width:160},
	  {code:"systime",name:t("el.car.ssjk.systime"),checked:false,width:160},
	  {code:"dtlc",name:t("el.car.ssjk.dtlc"),checked:true,width:90},
	  {code:"A01",name:t("el.car.ssjk.A01"),checked:true,width:100},
	  {code:"height",name:t("el.car.ssjk.height"),checked:false,width:80},
	  {code:"A30",name:t("el.car.ssjk.A30"),checked:false,width:80},
	  {code:"A31",name:t("el.car.ssjk.A31"),checked:false,width:80},
	  {code:"tid",name:t("el.car.ssjk.tid"),checked:true,width:120},
	  {code:"address",name:t("el.car.ssjk.address"),checked:true,width:120},
	  //{code:"address",name:t("el.car.ssjk.address"),checked:true,width:150},
	  {code:"lng",name:t("el.car.ssjk.lng"),checked:false,width:100},
	  {code:"lat",name:t("el.car.ssjk.lat"),checked:false,width:100},
	  {code:"comment",name:t("el.car.ssjk.comment"),checked:false,width:120},
	  //{code:"first_time",name:"最初定位",checked:false,width:140}
	];
	function tableclickHandler(row, column, event){
		emit("ssjkclick",row.car_id);
	}
	function formatOnline(value){
	  return value==1?"<span style='color:green'>"+t("el.car.ssjk.online")+"</span>":"<span style='color:red'>"+t("el.car.ssjk.offline")+"</span>";
	}
	function formatAcc(value){
	  return value&1>0?"<span style='color:green'>点火</span>":"<span style='color:red'>熄火</span>";
	}
	function formatAlarm(value){
	  return value=="-"?"-":"<span style='color:red'>"+value+"</span>";
	}
	function formatDatetime(row,column,value,index){
	  if(!value)return "";
	  return (value.substring(0,4)+"-"+value.substring(4,6)+"-"+value.substring(6,8)+" "+value.substring(8,10)+":"+value.substring(10,12)+":"+value.substring(12,14));
	}
	
	function formatTxxh(row,column,value,index){
	  if(value){
	    var temp=value;
		  var str="";
		  if(temp<10){
			  str=temp+"-"+t("el.car.ssjk.l");
		  }else if(temp<20){
			  str=temp+"-"+t("el.car.ssjk.m");
		  }else {
			  str=temp+"-"+t("el.car.ssjk.h");
		  }
		  return str;
	    }else{return 0;}
	}
	function formatDwxh(row,column,value,index){
	    if(value){
	    var temp=value;
		  var str="";
		  if(temp<4){
			  str=temp+"-"+t("el.car.ssjk.l");
		  }else if(temp<7){
			  str=temp+"-"+t("el.car.ssjk.m");
		  }else {
			  str=temp+"-"+t("el.car.ssjk.h");
		  }
		  return str;
	    }else{return 0;}
	}
</script>

<style scoped="scoped">
	:deep(.el-table__header) .cell {
	  white-space: nowrap; /* 强制不换行 */
	  overflow: hidden;    /* 溢出隐藏 */
	  text-overflow: unset; /* 超出显示省略号（可选） */
	}
</style>
