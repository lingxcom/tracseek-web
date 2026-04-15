<template>
	<layout3>
		<template #left>
			<div style="width: 100%;height: 100%;display: flex;flex-direction: column;">
			<div style="height:42px; overflow: hidden;background-color: #ced9e7;padding: 5px;" class="noselect ">
				<carsdialog ref="carsdialog1" :ischecked="false" @lingxchange="setCar"></carsdialog>
			<el-form ref="form" label-width="0px">
			       <el-form-item >
			         <div @click="openCarsDialog" style="width: 100%;">
			          <el-input :placeholder="t('el.car.select.device')"  readonly v-model="car.text" >
			              <template #append >{{t("el.choose")}}</template>
			          </el-input>
			          </div>
			         </el-form-item>
			         </el-form>
			      </div>
			     <div style="height:380px; overflow: hidden;" class="noselect">
			       <el-calendar class="custom-calendar" v-model="cdate">
			         <template #date-cell="{ data }" style="height: 30px;">
			             <div :class="data.isSelected ? 'is-selected' : ''" style="width: 100%;height: 100%; text-align: center;">
			               <div style="padding-top: 6px;line-height: 1.2;color: #999;">{{ data.date.getDate() }}</div>
			               <div style="font-size: 12px;line-height: 10px;">{{getDtlc(data)}}</div>
			             </div>
			           </template>
			       </el-calendar>
			
			     </div>
			     <div style="width:100%;height: 31px;background-color: #ced9e7;">
 <el-time-picker style="width: 100%;"
			    is-range
			    v-model="timerange"
			    @change="loadData"
			    :range-separator="t('el.to')"
			    :start-placeholder="t('el.stime')"
			    :end-placeholder="t('el.etime')"
			    :placeholder="getLocalText('选择时间范围','Select time range')">
			  </el-time-picker>
			     </div>
				 <div style="flex-grow: 1;height: 0;">
					 <el-tabs ref="lingxtab" type="border-card" v-model="activeName" style="height: 100%;">
					     <el-tab-pane :label="t('el.car.history.info')" name="first">
							 <table class="info" width="100%" border="0" cellSpacing="0" cellPadding="0">
								 <tbody>
							  <tr  class="clsf9f9f91">
								   <td class="td_title" width="150">{{t('el.car.history.carno')}}:</td><td>{{car.text}} </td>
							 </tr>
							 <tr >
							   <td class="td_title">{{t('el.car.history.driving')}}:</td><td>{{gy.sum1}} km</td>
							 </tr>
							 <tr class="clsf9f9f91">
								 <td class="td_title">{{t('el.car.history.maxspeed')}}:</td><td>{{gy.max}} km/h</td>
							 </tr>
							 <tr>
							   <td class="td_title">{{t('el.car.history.avgspeed')}}:</td><td>{{gy.ave}} km/h</td>
							 </tr>
							 <tr class="clsf9f9f91">
							   <td class="td_title">{{t('el.car.history.drivingduration')}}:</td><td>{{gy.sum2}} </td>
							 </tr>
							 <tr >
							   <td class="td_title">{{t('el.car.history.parkingduration')}}:</td><td>{{gy.time1}} </td>
							 </tr>
							 <tr  class="clsf9f9f91">
							   <td class="td_title">{{t('el.car.history.points')}}:</td><td>{{data.length}} </td>
							 </tr>
							 <tr>
								 <td colspan="2" align="center">
									 <el-button @click="exportExcel" type="success" plain="">Excel</el-button>
								 </td>
							 </tr>
							 </tbody>
							 </table>
							 
						 </el-tab-pane>
					     <el-tab-pane :label="t('el.car.history.parking')+'('+listStop.length+')'" name="third">
							 <el-scrollbar :height="(tabHeight-42)+'px'">
							  <div style="font-size: 14px;">
							 <table width="100%" border="0" cellSpacing="0" cellPadding="0">
							   <tr v-for="(item,index) in listStop" :key="index"  :class="{clsf9f9f91:(index%2)==1}" >
							     <td style="text-align: left;padding: 5px;cursor:pointer;" @click="gotoTime(item.stime)">
							       {{index+1}}.{{t('el.car.history.parkingduration')}}：{{timeString(item.stopTime)}}<br />
							       {{formatDatetime(item.stime)}} {{t('el.to')}} {{formatDatetime(item.etime)}}
							       <span v-if="item.address"><br />
							       <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width:360px;" :title="item.address">{{item.address}} </div>
							       </span>
							     </td>
							   </tr>
							 </table>
							 </div>
							</el-scrollbar>
						 </el-tab-pane>
					     <el-tab-pane :label="t('el.car.history.alarm')+'('+listAlarm.length+')'" name="fourth">
							 <el-scrollbar :height="(tabHeight-42)+'px'">
							  <div style="font-size: 14px;">
							 <table width="100%" border="0" cellSpacing="0" cellPadding="0">
							   <tr v-for="(item,index) in listAlarm" :key="index"  :class="{clsf9f9f91:(index%2)==1}" >
							     <td style="text-align: left;padding: 5px;cursor:pointer;"  @click="gotoTime(item.gpstime)">
							       {{index+1}}.{{item.name}} {{item.speed}} km/h <span v-if="item.time>0" style="color: #aaa;"> [{{timeString(item.time)}}]</span> <br />
							       {{formatDatetime(item.gpstime)}}
							     
							     </td>
							   </tr>
							 </table>
							 </div>
							</el-scrollbar>
						 </el-tab-pane>
					   </el-tabs>
				 </div></div>
		</template>
		<template #bottom>
			<div style="height: 100%;display: flex;flex-direction: column;">
			      <div class="block noselect" style="display: flex;background-color: #ced9e7;">
			        <div style="width: 32px;padding: 6px 0px 0px 0px;">
						<el-icon v-if="isPlay" @click="isPlay=!isPlay;stopPlay()" style="font-size:20px;cursor:pointer;color:#435d8d;"><VideoPause /></el-icon>
						<el-icon v-if="!isPlay" @click="isPlay=!isPlay;startPlay()" style="font-size:20px;cursor:pointer;color:#435d8d;"><VideoPlay /></el-icon>
			        </div>
			        <div style="flex: 1;flex-grow: 1;">
			         <el-slider :disabled="data.length==0" v-model="value1" @change="changeSlider" input-size="mini" :show-tooltip="false"></el-slider>
			         </div>
					 <div style="width: 20px;padding: 2px 0px 0px 6px;">
					    <el-button v-if="isFast" @click="operat2" link size="small">{{t('el.car.history.s')}}</el-button>
					    <el-button v-if="!isFast" @click="operat2" link size="small">{{t('el.car.history.f')}}</el-button>
					 </div>
			         <div style="width: 60px;text-align: center;padding-top:2px">
						  <el-popover placement="top" :width="600" :offset="30" trigger="click">
						       <template #reference>
						          <el-button size="small" link>{{t('el.car.history.track')}}</el-button>
						       </template>
						       <div class="slider-demo-block">
						           <el-slider v-model="speeds" range :marks="marks" :max="150" :format-tooltip="formatTooltip"/>
						        </div>
						     </el-popover>
						
						 
			         </div>
			       </div>
			<div style="flex:1;flex-grow: 1;overflow: hidden;" class="noselect">
				<el-auto-resizer>
				      <template #default="{ height, width }">
				        <el-table-v2 ref="lingxtable"
						:header-height="32"
						:row-height="32"
						:row-class="getRowClassName"
				          :columns="columns"
				          :data="data"
				          :width="width"
				          :height="height"
				          fixed
						  :row-event-handlers="{onClick: tableClick}"
				        />
				      </template>
				    </el-auto-resizer>
			</div>
			</div>
		</template>
		<lingxmap ref="lingxMap" istoolbar iscl></lingxmap>
	</layout3>
</template>

<script setup>
	import * as maptalks from 'maptalks';
	import lingxmap from "@/components/LingxMap.vue"
	import { ref, computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose,watch   } from 'vue';
	import {lgxInfo,lgxInfo2,distance,timenum,formatDatetime,timeString,getRotation,JSONToExcelConvertor} from '@/hooks/lingx'
	import layout3 from "@/components/LingxLayout3.vue";
	import lingxdialog from "@/components/LingxDialog.vue";
	import carsdialog from "@/views/jt808/dialog/CarsDialog.vue";
	import {wgs84ToGcj02} from '@/hooks/maptools'
	import api from '@/hooks/api';
	import { useI18n } from 'vue-i18n'
	import { useRoute } from 'vue-router'
	const route = useRoute()
	const { t, locale } = useI18n()
	const carsdialog1=ref(null);
	const timerange=ref([]);
	const car=ref({text:"",value:""}),tabHeight=ref(0);
	const cdate=ref(new Date()),value1=ref(0);
	const data=ref([]),listDtlc=ref([]),listStop=ref([]),listAlarm=ref([]),speeds=ref([30,100]);
	const isFast=ref(false),isPlay=ref(false),activeName=ref("first");
	const gy=ref({sum1:0,sum2:0,max:0,ave:0,time1:0,time2:0,address1:"",address2:""});
	const columns=ref([
	{title:t('el.car.history.no'),width: 50,cellRenderer: ({ rowIndex }) => `${rowIndex + 1}`,align: 'center'},
	{title:t('el.car.history.carno'),dataKey:"carno",width:100,cellRenderer:()=>{ return car.value.text}},
	{title:t('el.car.history.gpstime'),dataKey:"gpstime",width:180,cellRenderer:({ cellData: gpstime })=>{return formatDatetime(gpstime)}},
	{title:t('el.car.history.speed'),dataKey:"speed",width:90},
	{title:t('el.car.history.parking'),dataKey:"stopTime",width:100,cellRenderer:({ cellData: stopTime })=>{return timeString(stopTime)}},
	{title:t('el.car.history.status_str'),dataKey:"status_str",width:100},
	{title:t('el.car.history.alarm_str'),dataKey:"alarm_str",width:100},
	{title:t('el.car.history.A01'),dataKey:"mileage",width:100},
	{title:t('el.car.history.oil'),dataKey:"oil",width:80},
	{title:t('el.car.history.height'),dataKey:"height",width:80},
	{title:t('el.car.history.A30'),dataKey:"txxh",width:100},
	{title:t('el.car.history.A31'),dataKey:"wxxh",width:100},
	{title:t('el.car.history.address'),dataKey:"address",width:100},
	{title:t('el.car.history.lng'),dataKey:"lng",width:100},
	{title:t('el.car.history.lat'),dataKey:"lat",width:100}]);
	const lingxMap=ref(null);
	const lingxtab=ref(null);
	const lingxtable=ref(null);
	let map,layer,isSlide=false,intervalProcess=null,carMarket;//是否正在拖动
	const index=ref(0);
	function getLocalText(zhText,enText){
		return (locale.value || '').startsWith('zh') ? zhText : enText;
	}
	
	function getAddress(obj){
		if(!obj || obj.address || obj._addressLoading)return;
		obj._addressLoading=true;
		api.callApi({apicode:1157,lat:obj.lat,lng:obj.lng,ext:obj.id},function(json){
			let list=data.value;
			for(let i=0;i<list.length;i++){
				if(list[i].id==json.ext){
					list[i].address=json.data;
				}
				
			}
			obj._addressLoading=false;
		});
	}
	function tableClick(options){
		index.value=options.rowIndex;
		lingxtable.value.scrollTo((index.value-4)*30);
		render();
	}
	function render(){
		if(!data.value.length)return;
		if(index.value<0)index.value=0;
		if(index.value>=data.value.length)index.value=data.value.length-1;
		value1.value=parseInt((index.value+1)/data.value.length*100);
		lingxtable.value.scrollToRow(index.value);
		 carMarket.setCoordinates(wgs84ToGcj02(data.value[index.value].lng,data.value[index.value].lat));
		 carMarket.setSymbol([{
		                             'markerFile'   :"/static/images/car_icon_0/car2.png",
		                             'markerWidth'  : 40,
		                             'markerHeight' : 40,
		                             'markerDx'     : 0,
		                             'markerDy'     : 20,
		                             'markerOpacity': 1,
		                             'markerRotation':getRotation(data.value[index.value].direction)
		                           }]);
		getAddress(data.value[index.value]);
		if(!isPlay.value)
		map.setCenter(wgs84ToGcj02(data.value[index.value].lng,data.value[index.value].lat));
		//this.car=this.data[this.index];
		 //this.$refs.table.pagingScrollTopLeft((this.index-2)*28,0);//
		 //this.$refs.table.setCurrentRow(this.data[this.index]);
	}
	function next(){
		if(!data.value.length)return;
		if(index.value>=data.value.length-1){
			isPlay.value=false;
			stopPlay();
			return;
		}
		index.value++;
		render();
	}
	function startPlay(){
	  if(intervalProcess){
	  	clearInterval(intervalProcess);
	  	intervalProcess=null;
	  }
	  if(isPlay.value){
	    intervalProcess=setInterval(next,300)
	  }
	}
	function stopPlay(){
	  if(intervalProcess){
	    clearInterval(intervalProcess)
		intervalProcess=null;
	  }
	}
	const getRowClassName = ({ rowData, rowIndex }) => {
	  // 根据行数据或索引返回类名
	  if (rowIndex === index.value) {
	    return 'active2';
	  }
	  if (rowIndex % 2 === 0) {
	    return 'clsf9f9f92';
	  }
	  return '';
	};
	function gotoTime(time){
		if(time.length>14)time=time.substring(0,14);
	  let temp=-1;
	  for(let i=0;i<data.value.length;i++){
	    if(time==data.value[i].gpstime){
	         temp=i;
	         break;
	    }
	  }
	  if(temp>=0){
	    index.value=temp;
	  }else{
	    for(let i=0;i<data.value.length;i++){
	      if(time<=data.value[i].gpstime){
	          temp=i-1;
	           break;
	      }
	    }
	    if(temp>=0)
	    index.value=temp;
	  }
	  if(temp==-1){
	    temp=data.value.length-1;
	    index.value=temp;
	  }
	  render()
	}
	function changeSlider(newValue){
		if(!data.value.length)return;
		index.value=Math.round(newValue/100*(data.value.length-1));
		if(index.value<0)index.value=0;
		if(index.value>=data.value.length)index.value=data.value.length-1;
		render();
	}
	function operat2(){
	  if(!isPlay.value)return;
	isFast.value=!isFast.value;
	if(isFast.value){
	 clearInterval( intervalProcess);
	                   intervalProcess=null;
	      intervalProcess=setInterval(()=>{ next(); }, 100);
	}else{
	 clearInterval( intervalProcess);
	                   intervalProcess=null;
	      intervalProcess=setInterval(()=>{ next(); }, 300);
	}
	       }
	function formatTooltip(val){
		return val+" km/h"
	}
	function openCarsDialog(){
		carsdialog1.value.openDialog();
	}
	function setCar(array){
		if(array.length!=1){
			lgxInfo2(getLocalText("只能选择一个设备","Only one device can be selected"));
			return;
		}
		//console.log(array)
		car.value=array[0];
		loadData1154();
		loadData();
	}
	function loadData(){
		if(!car.value.value)return;
		if(!timerange.value || timerange.value.length!==2)return;
		index.value=0;
		var date=cdate.value;
var stime=date.format("yyyyMMdd")+timerange.value[0].format("HHmmss");//"000000";
var etime=date.format("yyyyMMdd")+timerange.value[1].format("HHmmss");//"235959";
isSlide=false;
		 api.callApi({apicode:1105,car_id:car.value.value,timeStop:3,static:true,stime:stime,etime:etime,alarm:true,isaddress:false},function(json){
		//console.log(json)
		if(json.data.length==0){
			isPlay.value=false;
			stopPlay();
			data.value=[];
			listStop.value=[];
			listAlarm.value=[];
			gy.value={sum1:0,sum2:0,max:0,ave:0,time1:0,time2:0,address1:"",address2:""};
			if(layer)layer.clear();
			lgxInfo2(getLocalText("无数据","No data"));
			return;
		}
				gyFun(json.data);
			 data.value=json.data;
			 listStop.value=json.stops;
			 listAlarm.value=json.alarms;
				drawLines();
		 });
	}
	function loadData1154(){
		var date= new Date();
		var etime=date.format("yyyyMMddHHmmss");
		date.setMonth(date.getMonth()-12);
		var stime=date.format("yyyyMMddHHmmss");
		timerange.value=[new Date(2023,11,11,0,0,0),new Date(2023,11,11,23,59,59)];
		api.callApi({apicode:1154,tid:car.value.value,stime:stime,etime:etime},function(json){
		  listDtlc.value=json.data;
		})
	}
	function getDtlc(data){
		let m=0;
		let datestr=data.date.format("yyyyMMdd");
		for(let i=0;i<listDtlc.value.length;i++){
		  if(datestr==listDtlc.value[i].date){
		    m=listDtlc.value[i].mileage;
		    break;
		  }
		}
		return m==0?"-":m;
	}
	
	function gyFun(list){//概要信息计算
	if(!list)return;
	var lc=0,max=0,ave1=0,ave2=0;
	var runtime=0;//行驶时长
	var stoptime=0;//停车时长
	var acctime=0;//点火时长
	    for(var i=0;i<list.length;i++){
	       if(i+1<list.length){
	         lc=lc+distance(list[i].lat,list[i].lng,list[i+1].lat,list[i+1].lng)/1000;
			 if(list[i].speed>0||list[i+1].speed>0){
				 runtime=runtime+ timenum(list[i].gpstime,list[i+1].gpstime);
			 }
	       }
	       if(list[i].speed>max){
	         max=list[i].speed;
	       }
	       if(list[i].speed>0){
	         ave1+=list[i].speed
	         ave2++;
	       }
	
	       if(list[i].stopTime){
	          stoptime=stoptime+ list[i].stopTime;
	       }
	       //
	       if(list[i].acc==1){
	          if(i<(list.length-1)&&list[i+1].acc==1)acctime=acctime+timenum(list[i].gpstime,list[i+1].gpstime);
	       }
	    }
	
	      let date=cdate.value;
	      let dtlc=getDtlc({date:date});
	
	    if(timerange.value[0].format("HHmmss")=="000000"&&timerange.value[1].format("HHmmss")=="235959"){
	      gy.value.sum1=dtlc;
	    }else{
	      gy.value.sum1=parseFloat(lc*0.92).toFixed(2);
	    }
	     gy.value.sum2=timeString(runtime/1000);
	    gy.value.max=max;
	    if(ave2>0)
	    gy.value.ave=parseFloat(ave1/ave2).toFixed(2);
	    gy.value.time1=timeString(stoptime);
	    gy.value.time2=timeString(acctime/1000);

	}
	function drawLines(){
		layer.clear();
		if(data.value.length==0)return;
		drawLines1(0,speeds.value[0],"#fdbf04");
		drawLines1(speeds.value[0],speeds.value[1],"#2d9f28");
		drawLines1(speeds.value[1],500,"#fd3904");
		let dataList=data.value;
		let latlngs=[];
		for(let i=0;i<dataList.length;i++){
		  if(!dataList[i].lng)continue;
		  latlngs.push(wgs84ToGcj02(dataList[i].lng,dataList[i].lat));
		}
		//console.log(latlngs)
		let geometry=new maptalks.LineString(latlngs,{symbol:{
               'lineColor' : '#2d9f28',
               'lineWidth' : 8,
             }});//{symbol:symbol}
		//layer.addGeometry(geometry);
		//map.setCenter(latlngs[0]);
		createAllMarket();
		createParkMarket();
		createAlarmMarket();
		createStartAndEndMarket(dataList);
		createCarMarket();
		if(!isSlide&&dataList.length>1)map.fitExtent(geometry.getExtent(), 0);//拖动时不处理
		if(!isSlide&&dataList.length==1)map.setCenter(latlngs[0]);
		geometry.remove();
	}
	function drawLines1(min,max,color){
		let dataList=data.value;
		let latlngs=[];
		for(let i=0;i<dataList.length;i++){
		  if(!dataList[i].lng)continue;
		  if(dataList[i].speed>=min&&dataList[i].speed<=max){
			  latlngs.push(wgs84ToGcj02(dataList[i].lng,dataList[i].lat));
		  }else{
			  if(latlngs.length>0){
				  latlngs.push(wgs84ToGcj02(dataList[i].lng,dataList[i].lat));
				  layer.addGeometry(new maptalks.LineString(latlngs,{symbol:{
				    'lineColor' : color,
				    'lineWidth' : 8,
				  }}));
				  latlngs=[];
			  }
			  
		  }
		}
		if(latlngs.length>0){
			layer.addGeometry(new maptalks.LineString(latlngs,{symbol:{
			  'lineColor' : color,
			  'lineWidth' : 8,
			}}));
		}
	}
	function createAllMarket(){
			let dataList=data.value;
			for(let i=0;i<dataList.length;i++){
				if(i==0)continue;
				if(i==dataList.length-1)continue;
				if(dataList[i].speed==0)continue;
				let market1=new maptalks.Marker(
				                             wgs84ToGcj02(dataList[i].lng,dataList[i].lat),
				                             {'id':i,
				                               'symbol' : [{
				                                 'markerFile'   : "/static/images/point.svg",
				                                 'markerWidth'  : 10,
				                                 'markerHeight' : 10,
				                                 'markerDx'     : 0,
				                                 'markerDy'     : 5,
				                                 'markerOpacity': 0.3,
												 'markerRotation':getRotation(dataList[i].direction)
				                               }]
				                             }
				                           ).addTo(layer);
				market1.on('click', function(p1){
				  index.value=p1.target._id;
				  render();
				});
			}
	}
	function createCarMarket(){
		var slatlng=data.value[0];
		carMarket = new maptalks.Marker(
		                        wgs84ToGcj02(slatlng.lng,slatlng.lat),
		                        {'properties' : {
		                            //'name' : _this.carno //轨迹不显示车牌
		                            },
		                          'symbol' : [{
		                            'markerFile'   : "/static/images/car_icon_0/car2.png",
		                            'markerWidth'  : 40,
		                            'markerHeight' : 40,
		                            'markerDx'     : 0,
		                            'markerDy'     : 20,
		                            'markerOpacity': 1,
		                            'markerRotation':getRotation(slatlng.direction)
		                          },{
		              'textName' : '{name}',
		              'textSize' : 14,
		              'textDy'   : -24,
		              'textFill':"#004e98",
		'textWeight':"bold"
		
		            }]
		                        }
		                      ).addTo(layer);
	}
	function createParkMarket(){
		let dataList=listStop.value;
		for(let i=0;i<dataList.length;i++){
			let market1=new maptalks.Marker(
			                             wgs84ToGcj02(dataList[i].lng,dataList[i].lat),
			                             {id:dataList[i].gpstime+"_park",
			                               'symbol' : [{
			                                 'markerFile'   : "/static/images/map-park-en.png",
			                                 'markerWidth'  : 65,
			                                 'markerHeight' : 65,
			                                 'markerDx'     : 0,
			                                 'markerDy'     : 32,
			                                 'markerOpacity': 1,
			                               }]
			                             }
			                           ).addTo(layer);
									   market1.on('click', function(p1){
									     gotoTime(p1.target._id);
									   });
		}
	}
	function createAlarmMarket(){
		let dataList=listAlarm.value;
		for(let i=0;i<dataList.length;i++){
			let market1=new maptalks.Marker(
			                             wgs84ToGcj02(dataList[i].lng,dataList[i].lat),
			                             {id:dataList[i].gpstime+"_"+dataList[i].name+"_alarm",
			                               'symbol' : [{
			                                 'markerFile'   : "/static/images/map-alarm-en.png",
			                                 'markerWidth'  : 65,
			                                 'markerHeight' : 65,
			                                 'markerDx'     : 0,
			                                 'markerDy'     : 32,
			                                 'markerOpacity': 1,
			                               }]
			                             }
			                           ).addTo(layer);
									   market1.on('click', function(p1){
									     gotoTime(p1.target._id);
									   });
		}
	}
	function createStartAndEndMarket(list){
	  if(list&&list.length>=2){
	  var slatlng=list[0];
	  var elatlng=list[list.length-1];
	var spoint= new maptalks.Marker(
	                             wgs84ToGcj02(slatlng.lng,slatlng.lat),
	                             {id:0,
	                               'symbol' : [{
	                                 'markerFile'   : "/static/images/map-start-en.png",
	                                 'markerWidth'  : 65,
	                                 'markerHeight' : 65,
	                                 'markerDx'     : 0,
	                                 'markerDy'     : 32,
	                                 'markerOpacity': 1,
	                                 //'markerRotation':_this.getRotation(_this.car.direction)
	                               }]
	                             }
	                           ).addTo(layer);
	var epoint= new maptalks.Marker(
	                             wgs84ToGcj02(elatlng.lng,elatlng.lat),
	                             {id:list.length-1,
	                               'symbol' : [{
	                                 'markerFile'   : "/static/images/map-end-en.png",
	                                 'markerWidth'  : 65,
	                                 'markerHeight' : 65,
	                                 'markerDx'     : 0,
	                                 'markerDy'     : 32,
	                                 'markerOpacity': 1,
	                                 //'markerRotation':_this.getRotation(_this.car.direction)
	                               }]
	                             }
	                           ).addTo(layer);
							   spoint.on('click', function(p1){
							     index.value=p1.target._id;
							     render();
							   });
							   epoint.on('click', function(p1){
							     index.value=p1.target._id;
							     render();
							   });
	   }
	
	}
	function exportExcel() {
		if(data.value.length==0)return;
	  let columns222 = [];
	  let dataList=columns.value;
	  for(let i=0;i<dataList.length;i++){
		  if(!dataList[i].dataKey)continue;
		  if(dataList[i].dataKey=='carno'){
			  columns222.push({title:dataList[i].title,field:dataList[i].dataKey,formater:function(){return car.value.text;}})
		  }else{
			  columns222.push({title:dataList[i].title,field:dataList[i].dataKey})
		  }
		  
	  }
	  // 添加数据
	  dataList=data.value;
	  let filename=car.value.text+"["+cdate.value.format("yyyy-MM-dd")+"]";
	  JSONToExcelConvertor(columns222,dataList,filename);
	}
	onMounted(()=>{
		tabHeight.value=lingxtab.value.$el.offsetHeight;
		map=lingxMap.value.getMap();
		layer = new maptalks.VectorLayer('vector').addTo(map);
		if(route.query.carid)setCar([{text:route.query.carno,value:route.query.carid}]);
	});
	onUnmounted(()=>{
		stopPlay();
	});
	watch(cdate,(newVal)=>{
		loadData();
	});
	watch(speeds,(newVal)=>{
		isSlide=true;
		drawLines();
	});
	watch(() => route.query.carid,function(newVal,oldVal){
		if(route.query.carid)setCar([{text:route.query.carno,value:route.query.carid}]);
	});
</script>

<style scoped>
/* 修改 Header 的 padding */
:deep(.el-calendar__header) {
  padding: 2px !important; /* 强制覆盖 */
}

/* 修改 Body 的 padding */
:deep(.el-calendar__body) {
  padding: 0 !important;
}
:deep(.el-calendar-table thead th ) {
  padding: 0 !important;
}
:deep(.el-tabs__content) {
  padding: 0 !important;
}

.custom-calendar {
  --el-calendar-cell-width: 48px;
}
.slider-demo-block .el-slider{
	--el-slider-main-bg-color:#2d9f28;
}


 tr.clsf9f9f91{
      background-color: #f9f9f9;
    }
  tr.active1{
      background-color: #dfe8f6;
    }
.info tr{
	height: 36px;line-height: 36px;font-size: 14px;
}
:deep(.clsf9f9f92){
      background-color: #f9f9f9;
    }    
:deep(.active2){
      background-color: #dfe8f6 !important;
    }
    .td_title{
      text-align: right;
	  padding-right: 10px;
    }

</style>