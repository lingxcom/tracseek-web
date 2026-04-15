<template>
	<layout2>
		<template #left>
			<cartree ref="lingxCarTree" @lingxcheckchange="lingxcheckchange" ischecked></cartree>
		</template>
		<el-container style="width: 100%;height: 100%;margin: 0px;padding: 0px;">
		         <el-header height="42" style="padding:0px;background-color: #dfe9f6;">
		         <div style="margin: 5px 0px;">
		           <span>
		              <el-date-picker size="small"
		              style="width: 150px;"
		                    v-model="sdate"
		                    value-format="YYYYMMDD"
		                    type="date"
		                    :placeholder="t('el.stime')"
		                  >
		                  </el-date-picker>
		
		                  <el-date-picker size="small"
		                    style="width: 150px;margin-left: 5px;"
		                        v-model="edate"
		                        value-format="YYYYMMDD"
		                        type="date"
		                       :placeholder="t('el.etime')"
		                        >
		                      </el-date-picker>
		           </span>
		           <el-button @click="searchGrid" type="primary" plain icon="Search" style="margin-left: 5px;"  size="small">{{t('el.search')}}</el-button>
		
		     <el-button @click="excel" :disabled="tableData.length==0" icon="Download" type="success" plain size="small">{{t('el.excel')}}</el-button>
		<el-button-group  style="margin-left: 5px;" size="small">
		<el-button @click="day7"  plain >{{t('el.report.shortcuts.time101')}}</el-button>
		<el-button @click="day15"  plain >{{t('el.report.shortcuts.time102')}}</el-button>
		<el-button @click="day30"  plain >{{t('el.report.shortcuts.time103')}}</el-button>
				</el-button-group>
		                 </div>
		             </el-header>
		         <el-main style="margin: 0px;padding: 0px;">
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
		    <el-table-column v-for="(item,index) in fields" :key="index"
		      :prop="item.code"
		      :label="item.name"
		      >
		    </el-table-column>
		  </el-table>
		         </el-main>
		      </el-container>
	</layout2>
</template>

<script setup>
	import { ref, computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose,watch   } from 'vue';
	import {lgxInfo,lgxInfo2,distance,timenum,formatDatetime,timeString,getRotation,JSONToExcelConvertor} from '@/hooks/lingx'
	import layout2 from "@/components/LingxLayout2.vue";
	import cartree from "@/components/LingxCarTree.vue"
	import api from '@/hooks/api';
	import { useI18n } from 'vue-i18n'
	import { useRoute } from 'vue-router'
	const route = useRoute()
	const { t } = useI18n()
	const sdate=ref(""),edate=ref("");
	const tids=ref([]),gids=ref([]);
	const tableData=ref([]),fields=ref([{name:t('el.car.info.tid'),code:"tid"},{name:t('el.car.info.carno'),code:"carno"},{name:t('el.car.info.group'),code:"group"}]);
	function lingxcheckchange(p1,p2,p3){
  if(p2){
    if((p1.id+"").indexOf('_')>0)
      tids.value.push(p1.value-0);
      else
      gids.value.push(p1.value);
  }else{
      var index=-1;
      for(var i=0;i<tids.value.length;i++){
        if(p1.value==tids.value[i]){
          index=i;
          break;
        }
       }
      if(index>=0)tids.value.splice(index,1);

      index=-1;
      for(var i=0;i<gids.value.length;i++){
        if(p1.value==gids.value[i]){
          index=i;
          break;
        }
       }
      if(index>=0)gids.value.splice(index,1);
  }

		
	}
	function searchGrid(){
		if(tids.value.length==0&&gids.value.length==0){
		  lgxInfo2(t('el.info.notnull2'));return;
		}
		if(!sdate.value||!edate.value){
		  lgxInfo2(t('el.info.notnull3'));return;
		}
		fields.value=[{name:t('el.car.info.tid'),code:"tid"},{name:t('el.car.info.carno'),code:"carno"},{name:t('el.car.info.group'),code:"group"}];
		let temp=sdate.value;
		let sdate2=new Date(temp.substring(0,4)-0,temp.substring(4,6)-1,temp.substring(6,8)-0);
		 temp=edate.value;
		let edate2=new Date(temp.substring(0,4)-0,temp.substring(4,6)-1,temp.substring(6,8)-0);
		while(sdate2.getTime()<=edate2.getTime()){
		    let str=sdate2.format("MM-dd");
		    fields.value.push({name:str,code:str});
		    sdate2.setDate(sdate2.getDate()+1);
		}
		
		fields.value.push({name:t('el.report.mileage.day3'),code:"sum"});
		fields.value.push({name:t('el.report.mileage.day1'),code:"ccl"});
		fields.value.push({name:t('el.report.mileage.day2'),code:"ccts"});
		api.callApi({apicode:1121,tids:tids.value,gids:gids.value,stime:sdate.value,etime:edate.value},function(json){
		
		  tableData.value=json.data;
		})
	}
	function day7(){
	        const end = new Date();
	        const start = new Date();
	        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
	      sdate.value=start.format("yyyyMMdd");
	      edate.value=end.format("yyyyMMdd");
	}
	function day15(){
	        const end = new Date();
	        const start = new Date();
	        start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
	      sdate.value=start.format("yyyyMMdd");
	      edate.value=end.format("yyyyMMdd");
	}
	function day30(){
	        const end = new Date();
	        const start = new Date();
	         start.setMonth(start.getMonth()-1);
	     sdate.value=start.format("yyyyMMdd");
	     edate.value=end.format("yyyyMMdd");
	}
	function excel(){
	  let titles=[{title:t('el.car.info.tid'),field:"tid"},{title:t('el.car.info.carno'),field:"carno"},{title:t('el.car.info.group'),field:"group"}];
	  
	  let temp=sdate.value;
	  let sdate2=new Date(temp.substring(0,4)-0,temp.substring(4,6)-1,temp.substring(6,8)-0);
	   temp=edate.value;
	  let edate2=new Date(temp.substring(0,4)-0,temp.substring(4,6)-1,temp.substring(6,8)-0);
	  while(sdate2.getTime()<=edate2.getTime()){
	      var str=sdate2.format("MM-dd");
	      titles.push({title:str,field:str});
	      sdate2.setDate(sdate2.getDate()+1);
	  }
	
	  titles.push({title:t('el.report.mileage.day3'),field:"sum"});
	  titles.push({title:t('el.report.mileage.day1'),field:"ccl"});
	  titles.push({title:t('el.report.mileage.day2'),field:"ccts"});
	  JSONToExcelConvertor(titles,tableData.value,new Date().getTime());
	}
</script>

<style>
</style>
