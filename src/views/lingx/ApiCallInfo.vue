<template>
	<div>
	
	<el-button style="margin: 5px;" type="primary" size="small" plain @click="reset">{{t('el.api_call.reset')}}</el-button>
	<el-button style="margin: 5px;" type="success" size="small" plain @click="setSortType(1)">{{t('el.api_call.sort_total')}}</el-button>
	<el-button style="margin: 5px;" type="success" size="small" plain @click="setSortType(2)">{{t('el.api_call.sort_max_time')}}</el-button>
	<el-button style="margin: 5px;" type="success" size="small" plain @click="setSortType(3)">{{t('el.api_call.sort_error_num')}}</el-button>
	
	<br>
	<table width="100%" border="0" cellSpacing="0" cellPadding="0">
	  <th></th><th  width="80">{{t('el.api_call.code')}}</th><th width="220">{{t('el.api_call.name')}}</th>
	  <th  width="120">{{t('el.api_call.module')}}</th>
	  <th width="120">{{t('el.api_call.calls_per_sec')}}</th><th width="120">{{t('el.api_call.total_calls')}}</th><th width="150">{{t('el.api_call.last_time_ms')}}</th><th width="150">{{t('el.api_call.max_time_ms')}}</th><th width="120">{{t('el.api_call.error_num')}}</th><th width="120">{{t('el.api_call.is_log')}}</th><th></th>
	  <tr v-for="(item,index) in list" :key="index"  :class="{clsf9f9f91:(index%2)==1}" >
	   <td style="text-align: center;width: 40px;">{{index+1}}</td><td>{{item.apicode}}</td><td>{{item.name}}</td>
	   <td>{{item.groupName}}</td><td>{{count1(item.apicode,item.total)}}</td><td>{{item.total}}</td>
	   <td>{{item.lastTime}}</td><td>{{item.maxTime}}</td><td>{{item.errorNum}}</td><td>{{item.isLog}}</td><td></td>
	  </tr>
	</table>
	  </div>
</template>

<script setup>
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose  } from 'vue';
	import api from '@/hooks/api'
	import {lgxInfo,lgxInfo2,getEntityString,getTextString,getValueString,format1} from '@/hooks/lingx'
	import { ElLoading } from 'element-plus'
	const emit = defineEmits(['custom-event']);
	import { useI18n } from 'vue-i18n'
	const { t } = useI18n()
	const list=ref([]),listOld=ref([]),sortType=ref(1);
	let interval=null;
	function setSortType(type){
	  sortType.value=type;
	}
	function reset(){
	  if(!confirm(t("el.api_call.confirm_reset")))return;
	  api.callApi({apicode:8015},function(json){
	    list.value=[];
	  })
	}
	function loadData() {
	  api.callApi({apicode:8014},function(json){
	    listOld.value=list.value;
	    var arr=json.data;
	    if(sortType.value==1){
	      arr=arr.sort(function(a1,a2){
	        return a2.total-a1.total;
	      });
	    }else if(sortType.value==2){
	      arr=arr.sort(function(a1,a2){
	        return a2.maxTime-a1.maxTime;
	      });
	    }else if(sortType.value==3){
	      arr=arr.sort(function(a1,a2){
	        return a2.errorNum-a1.errorNum;
	      });
	    }
	
	    list.value=arr;
	  })
	}
	function count1(apicode,total){
	  for(var i=0;i<listOld.value.length;i++){
	    if(apicode==listOld.value[i].apicode){
	      return total-listOld.value[i].total;
	    }
	  }
	  return 0;
	}
	onMounted(function(){
		loadData();
		interval=setInterval(loadData,1*1000);
	});
	onUnmounted(function(){
		clearInterval(interval);
	});
</script>

<style scoped="scoped">
  tr.clsf9f9f91{
      background-color: #f9f9f9;
    }
  tr.active1{
      background-color: #dfe8f6;
    }

    th{
      text-align: left;
      height: 36px;
          line-height:36px;
          border-top: 1px solid #ddd;
          font-size: 14px;
    }
    td{
      height: 36px;
          line-height:36px;
          border-top: 1px solid #ddd;
          font-size: 14px;
    }
.hexstring{
  width: 500px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>

