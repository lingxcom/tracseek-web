<template>
	<layout3>
		<template #left>
			<cartree ref="lingxCarTree" @lingxcheckchange="lingxcheckchange" @lingxnodeclick="lingxnodeclick" @change-type="setType" isstatus isreload ischecked istype></cartree>
		</template>
		<template #bottom>
			<ssjk :cars="cars" @ssjkclick="ssjkclick" class="noselect"></ssjk>
		</template>
		<div style="display: flex;flex-direction: row-reverse;height: 100%;">
			<lingxmap ref="lingxMap" istoolbar iscl></lingxmap>
			<!-- 
			<div v-show="isVideo" style="width: 50%;">
				<lingxvideopanel ref="videopanel" @close="isVideo=false"></lingxvideopanel>
			</div>
			<div style="width: 0;flex-grow: 1;">
				<lingxmap ref="lingxMap" istoolbar iscl></lingxmap>
			</div>
			-->
			<div v-show="false">
				<div ref="infowindow" style="margin:0px;padding:0px;">
					<div style="width:100%;font-size:14px;line-height: 28px;margin:0px;padding:0px;">
						<div style="width: 100%;height: 30px;line-height: 30px;font-size: 14px;background-color: #f9f9f9;color: #333;padding-right: 2px;margin-top: 5px;display: flex;">
							<div style="width:300px;display: flex;">
								<div  style="color: #999999;width:90px;text-align: right;">
							{{t("el.car.info.tid")}}：</div>
							{{lastCar.tid}} <el-icon class="lingxiconclose" title="Copy" @click="copyFun2(lastCar.tid)"><DocumentCopy /></el-icon></div>
						<div style="margin-right: 5px;text-align: right;flex-grow: 1;">
							<el-icon size="16" @click="follow(lastCar.car_id,lastCar.follow)" class="lingxiconclose" :style="{color:lastCar.follow==1?'#e6a23c':''}"><Star v-if="lastCar.follow!=1" /><StarFilled v-if="lastCar.follow==1" /></el-icon>&nbsp;
							<el-icon size="16" @click="m6(lastCar.car_id,lastCar.carno)" class="lingxiconclose"><Close /></el-icon>
						</div>
						</div>
						<table  width="100%" border="0" cellSpacing="0" cellPadding="0" ><tbody>
					<tr style="background-color: #ffffff;">
						<td style="color: #999999;width:90px;text-align:right;"><div style="width:90px">{{t("el.car.info.carno")}}：</div></td><td ><div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width:120px;" :title="lastCar.carno">{{lastCar.carno}}</div></td><td style="color: #999999;width:74px;text-align:right;">{{t("el.car.info.systime")}}：</td><td  width="160">{{formatDatetime(1,1,lastCar.systime,1)}}</td></tr>
						<tr style="background-color: #f9f9f9;"><td style="color: #999999;text-align:right;">{{t("el.car.info.speed")}}：</td><td>{{lastCar.speed}} km/h</td><td style="color: #999999;text-align:right;">{{t("el.car.info.gpstime")}}：</td><td>{{formatDatetime(1,1,lastCar.gpstime,1)}}</td></tr>
						<tr style="background-color: #ffffff;"><td style="color: #999999;text-align:right;">{{t("el.car.info.status")}}：</td><td colspan="3"><span v-if="lastCar.alarm_str=='-'||lastCar.alarm_str==''"></span><span v-else style="color:red" >{{lastCar.alarm_str}},</span>{{lastCar.status_str}}</td></tr>
						<tr style="background-color: #f9f9f9;"><td style="color: #999999;text-align:right;">{{t("el.car.info.address")}}：</td><td colspan="3"><div style="white-space: wrap;width:390px;" :title="lastCar.address">{{lastCar.address||"-"}}</div></td></tr>
						<tr style="background-color: #ffffff;"><td colspan="4" class="noselect" style="padding-left: 20px;">
						<a style="line-height:1.6" class="el-link el-link--primary is-underline" @click="m2(lastCar.car_id,lastCar.carno)"><!----><span class="el-link--inner">{{t("el.car.info.history")}}</span><!----></a> | 
						
						<a style="line-height:1.6" class="el-link el-link--success is-underline" @click="openHistoryDialog(lastCar.car_id,lastCar.carno)"><!----><span class="el-link--inner">{{t("el.car.info.history.data")}}</span><!----></a> |
						
						<a style="line-height:1.6" class="el-link el-link--danger is-underline" @click="openAlarmDialog(lastCar.car_id,lastCar.carno)"><!----><span class="el-link--inner">{{t("el.car.info.alarm2")}}</span><!----></a> |
						 <a style="line-height:1.6" class="el-link el-link--warning is-underline" @click="m3(lastCar.car_id,lastCar.carno)"><!----><span class="el-link--inner">{{t("el.car.info.command")}}</span><!----></a>  
						<!--
						<a style="line-height:1.6" class="el-link el-link--warning is-underline" @click="copyFun(lastCar.car_id,lastCar.carno)"><span class="el-link--inner">{{t("el.car.info.copy")}}</span></a> | 
						 <a style="line-height:1.6" class="el-link el-link--info is-underline" @click="m6(lastCar.car_id,lastCar.carno)"><span class="el-link--inner">{{t("el.car.info.close")}}</span></a> -->
						</td></tr>
					</tbody></table>
						<div style="width: 100%;height: 10px;background-color: #fff;"></div>
					</div>
				</div>
			</div>
		</div>
		
		<commandlistdialog ref="commandlist"></commandlistdialog>
		<alarmlistdialog ref="alarmlist"></alarmlistdialog>
		<historydatadialog ref="historydata"></historydatadialog>
	</layout3>
</template>

<script setup>
    import jsmap from "@/assets/js/jsmap.js"
	import * as maptalks from 'maptalks';
	import lingxmap from "@/components/LingxMap.vue"
	import layout3 from "@/components/LingxLayout3.vue"
	import cartree from "@/components/LingxCarTree.vue"
	import ssjk from "@/views/jt808/support/Ssjk.vue"
	import commandlistdialog from "@/views/jt808/dialog/CommandListDialog.vue"
	import alarmlistdialog from "@/views/jt808/dialog/AlarmListDialog.vue"
	import historydatadialog from "@/views/jt808/dialog/HistoryDataDialog.vue"
	import { ref,watch, computed,onMounted,onUnmounted,defineProps,defineEmits,onActivated,onDeactivated   } from 'vue';
	import api from '@/hooks/api'
	import {lgxInfo,lgxInfo2} from '@/hooks/lingx'
	import {wgs84ToGcj02} from '@/hooks/maptools'
	import { useI18n } from 'vue-i18n'
	import {ClusterLayer} from 'maptalks.markercluster';
	import { useRouter } from "vue-router";
	import i18n from '@/lang'
	let language=i18n.global.locale.value;
	const router = useRouter();
	const { t } = useI18n()
	const lingxCarTree=ref(null);
	const lingxMap=ref(null),type=ref("all");
	const commandlist=ref(null),alarmlist=ref(null),historydata=ref(null);
	const cars=ref([]),lastCar=ref({});
	const isVideo=ref(false),videopanel=ref(null);
	let websocket=null,token=null,lastTid,map,layer;
	let hashMap=new jsmap.HashMap();
	let isShowInfoWindow=true,infowindow=ref();
	let isReConnect=true;
	let reconnectTimer=null;
	function scheduleReconnect(){
		if(!isReConnect)return;
		if(reconnectTimer)return;
		reconnectTimer=setTimeout(function () {
			reconnectTimer=null;
			initWebsocket();
		}, 3 * 1000);
	}
	function follow(carid,flag){
		let type="add";
		if(flag==1){
			type="del";
		}
		api.callApi({apicode:1115,deviceId:carid,type:type},function(json){
			lingxCarTree.value.reload(0);
		});
	}
	function setType(type1){
		type.value=type1;
	}
	function getAddress(obj){
		api.callApi({apicode:1157,lat:obj.lat,lng:obj.lng,ext:obj.car_id},function(json){
			let list=cars.value;
			for(let i=0;i<list.length;i++){
				if(list[i].car_id==json.ext){
					list[i].address=json.data;
				}
				
			}
		});
	}
	function openHistoryDialog(carid,carno){
		historydata.value.openDialog({carid:carid,carno:carno});
	}
	function openAlarmDialog(carid,carno){
		alarmlist.value.openDialog({carid:carid,carno:carno});
	}
	function playVideo(carid,carno){
		isVideo.value=true;
		let dataList=cars.value;
		let carJson=null;
		for(let i=0;i<dataList.length;i++){
				  if(dataList[i].car_id==carid)carJson=dataList[i];
		}
		let channels=carJson.channels;
		//console.log(channels)
		videopanel.value.playVideo(carid,carno,channels);
	}
	function copyFun(){
	  let copyIpt= document.createElement("textarea");
	  let lastCar=null;
	  let dataList=cars.value;
	  for(let i=0;i<dataList.length;i++){
		  if(dataList[i].car_id==lastTid)lastCar=dataList[i];
	  }
	  if(!lastCar){
		lgxInfo2(t('el.fail'));
		return;
	  }
	copyIpt.style.position = "absolute";
	copyIpt.style.left = "-100%";
	copyIpt.value = t("el.car.info.carno")+"："+lastCar.carno+
	"\n"+t("el.car.info.speed")+"："+lastCar.speed+" KM/H"+
	"\n"+t("el.car.info.systime")+"："+formatDatetime(1,1,lastCar.systime,1)+
	"\n"+t("el.car.info.gpstime")+"："+formatDatetime(1,1,lastCar.gpstime,1)+
	"\n"+t("el.car.ssjk.status_str")+"："+lastCar.status_str+
	"\n"+t("el.car.ssjk.alarm_str")+"："+lastCar.alarm_str+"\n";
	
	 document.body.appendChild(copyIpt);
	  copyIpt.select();
	      if (document.execCommand('copy')) {
	          lgxInfo(t('el.success'));
	      }else{
	    lgxInfo2(t('el.fail'))
	  }
	  document.body.removeChild(copyIpt)
	}
	
	function copyFun2(copyTid){
	  let copyIpt= document.createElement("textarea");
	  let lastCar=null;
	  /*
	  let dataList=cars.value;
	  for(let i=0;i<dataList.length;i++){
		  if(dataList[i].car_id==lastTid)lastCar=dataList[i];
	  }*/
	copyIpt.style.position = "absolute";
	copyIpt.style.left = "-100%";
	copyIpt.value = copyTid;
	
	 document.body.appendChild(copyIpt);
	  copyIpt.select();
	      if (document.execCommand('copy')) {
	          lgxInfo(t('el.success'));
	      }else{
	    lgxInfo2(t('el.fail'))
	  }
	  document.body.removeChild(copyIpt)
	}
	
	function ssjkclick(tid){
		setCarCenter(tid,true)
	}
	function setCarCenter(car_id,isCenter){
		 for(var i=0;i<cars.value.length;i++){
		        if(car_id==cars.value[i].car_id){
					lastTid=car_id;
					if(isCenter)
					map.setCenter(wgs84ToGcj02(cars.value[i].lng,cars.value[i].lat));
					lastCar.value=cars.value[i];
					if(isShowInfoWindow&&hashMap.get(lastTid))hashMap.get(lastTid).openInfoWindow();
		        }
		      }
	}
	function lingxnodeclick(data,node,el){
		//isShowInfoWindow=true;
		setCarCenter(data.value,true);
	}
	
	function lingxcheckchange(data,aaa,bbb){
	        if(data.expire){
	          lgxInfo(language=="zh-cn"?"该设备服务已到期，请联系管理人员。":"The device service has expired. Please contact the administrator.")
	          return;
	        }
	        if(aaa){
	         //是分组的话，取出车辆信息
	           if(data.type=="group"){
	              api.callApi({apicode:1136,groupId:data.value,type:type.value},function(json){
					websocketsend({cmd:1005,car_id:json.deviceIdString,language:language});
	              })
	           //是分组，特殊处理
	           }else{
				   //isShowInfoWindow=true;
	                lastTid=data.value;
				   var data1={cmd:1005,car_id:data.value,language:language}
				   if(!isSend1005(data.value))websocketsend(data1);
			   }
	        }else{
	//删除
	            //是分组的话，取出车辆信息
	            if(bbb)return;
				if(data.type=="group"){
	              api.callApi({apicode:1136,groupId:data.value,type:type.value},function(json){
					websocketsend({cmd:1006,car_id:json.deviceIdString});
	                  for(var i=0;i<json.data.length;i++){
	                    delCar(json.data[i].value);
	                  }
	              })
	           //是分组，特殊处理
	           }else{
				var data1={cmd:1006,car_id:data.value}
				if(!isSend1006(data.value))websocketsend(data1);
				delCar(data.value);
			   }
	        }
	      }
	let array1005=[];
	function isSend1005(tid){
		let b=array1005.indexOf(tid);
		if(b==-1){
			array1005.push(tid)
			return false;
		}else{
			return true;
		}
	}
	function isSend1006(tid){
		let b=array1005.indexOf(tid);
		if(b>-1){
			array1005.splice(b,1)
			return false;
		}else{
			return true;
		}
	}
	function addCar(json){
    // console.log(json);
        if(!json)return;
        if(json.type!="0x0200")return;
       // json.carno=carnoMap[json.tid];
        if(!json.carno)json.carno=json.tid;
        if(json.carno.indexOf(" ")>0)json.carno=json.carno.substring(0,json.carno.indexOf(" "));
        let index=-1;
        for(var i=0;i<cars.value.length;i++){
          if(json.tid==cars.value[i].tid){
            index=i;
          }
        }
        if(index==-1){
          cars.value.push(json);
        }else{
         cars.value[index]=json;
        }
      }
	function delCar(tid){
		let index=-1;
		        for(var i=0;i<cars.value.length;i++){
		          if(tid==cars.value[i].car_id){
		            index=i;
		          }
		        }
		        if(index>-1){
		          cars.value.splice(index,1);
				  if(hashMap.get(tid)){
					  hashMap.get(tid).remove();
					  hashMap.remove(tid);
				  }
				  
		        }
	}
	function initWebsocket(){
		let wsuri = window.wsUrl;
		if(websocket&&(websocket.readyState===WebSocket.OPEN||websocket.readyState===WebSocket.CONNECTING)){
			return;
		}
		
			websocket = new WebSocket(wsuri);
			websocket.onmessage = websocketonmessage;
			websocket.onopen = websocketonopen;
			websocket.onerror = websocketonerror;
			websocket.onclose = websocketclose;
		
	}
	function websocketonopen(){ //连接建立之后执行send方法发送数据
		 if(reconnectTimer){
		 	clearTimeout(reconnectTimer);
		 	reconnectTimer=null;
		 }
	       // let actions = {"test":"12345"};
	        //this.websocketsend(actions);
	      }
	function websocketonerror(){//连接建立失败重连
		  if(isReConnect){
			  console.log("websocket错误")
			  scheduleReconnect();
		  }
	 }
	function websocketonmessage(e){ //数据接收
		let redata = JSON.parse(e.data);
		if("list"==redata.websocketDataType){
			redata=redata.data;
			for( let i=0;i<redata.length;i++){
			if(i==0)lastTid=redata[i].car_id;
			//getAddress(redata[i]);
			addCar(redata[i]);
	    	refresh(redata[i]);
			}
		}else{
			//getAddress(redata);
			addCar(redata);
	    	refresh(redata);
		}
		
	    //lingxCarTree.value.updateTreeNode(redata);
	}
	function websocketsend(obj){//数据发送
			if(!websocket||websocket.readyState!==WebSocket.OPEN)return;
	        obj.lingxtoken=token;
			websocket.send(JSON.stringify(obj));
	      }
	function websocketclose(e){  //关闭
	if(isReConnect){
		console.log("websocket重连")
		scheduleReconnect();
	}
	      }
	onMounted(()=>{
		isReConnect=true;
			token=sessionStorage.getItem("token")
	        initWebsocket();
			
			map=lingxMap.value.getMap();
			//layer = new maptalks.VectorLayer('vector').addTo(map);
			layer = new ClusterLayer('cluster', {
				  interactive: true,
			      'noClusterWithOneMarker' : true,
			      'maxClusterZoom' : 8,
			      //"count" is an internal variable: marker count in the cluster.
			      'symbol': {
			        'markerType' : 'ellipse',
			        'markerFill' : { property:'count', type:'interval', stops: [[0, 'rgb(135, 196, 240)'], [100, '#1bbc9b'],[500, '#cca300'],
			            [999, '#fc3707']]},
			        'markerFillOpacity' : 0.9,
			        'markerLineOpacity' : 1,
			        'markerLineWidth' : 3,
			        'markerLineColor' : '#fff',
			        'markerWidth' : { property:'count', type:'interval', stops: [[0, 40], [9, 60], [50, 70],[99, 80]] },
			        'markerHeight' : { property:'count', type:'interval', stops: [[0, 40], [9, 60], [50, 70],[99, 80]] }
			      },
			      'drawClusterText': true,
			      'geometryEvents' : true,
			      'single': true
			    });
				
				layer.addTo(map);
				map.on('click', function (e) { 
					let g= layer.identify(e.coordinate); 
				if(g&&g.center)
				map.animateTo({
				                    center: g.center,
				                    zoom: map.getZoom() + 2 // 放大2级
				                }, {
				                    duration: 0 // 动画时长500ms
				                });
				});
	});
	onUnmounted(()=>{
		isReConnect=false;
		if(reconnectTimer){
			clearTimeout(reconnectTimer);
			reconnectTimer=null;
		}
		if(websocket){
			websocket.close();
			websocket=null;
		}
		delete window.m2;
		delete window.m3;
		delete window.m5;
		delete window.m6;
		delete window.m7;
	});
	onActivated(()=>{
		isReConnect=true;
	});
	onDeactivated(()=>{
		//isReConnect=false;
	});
	let carImgArr=["/car6.png","/car1.png","/car2.png","/car3.png","/car4.png","/car5.png","/car6.png"];
	function getCarIcon(map){
        return "/static/images/"+(map.icon_type?map.icon_type:"car_icon_0")+carImgArr[map.status_jt808];
      }
	function getRotation(temp){
	          return (360-temp+360)%360;
	}
	function formatDatetime(row,column,value,index){
        if(!value)return "";
        return (value.substring(0,4)+"-"+value.substring(4,6)+"-"+value.substring(6,8)+" "+value.substring(8,10)+":"+value.substring(10,12)+":"+value.substring(12,14));
      }
	function m2(tid,carno){
		router.push({
			path:"/main/postsitionhistory?ecode=tlingx_tools&mcode=history1",
			query:{
				carid:tid,
				carno:carno
			}
		})
	}
		window.m2=m2;
	function m3(tid,carno){
		commandlist.value.openDialog({id:tid,carno:carno});
	}
	window.m3=m3;
	function m6(tid,carno){
			isShowInfoWindow=false;
			hashMap.get(tid).closeInfoWindow();
		}
		window.m6=m6;
		window.m7=playVideo;
		window.m5=copyFun;
	function refresh(json){
		if(!json)return;
         if(!json.lng)return;
		 if(json.type!="0x0200")return;
		 if(!json.carno)json.carno=json.tid;
		 if(json.carno.indexOf(" ")>0)json.carno=json.carno.substring(0,json.carno.indexOf(" "));
		 let item=json;
		 if(hashMap.containsKey(item.car_id)){
		             let marker1=hashMap.get(item.car_id);
		             marker1.setCoordinates(wgs84ToGcj02(item.lng,item.lat));
		             marker1.setSymbol([{
		                             'markerFile'   : getCarIcon(item),//car2Img,
		                             'markerWidth'  : 40,
		                             'markerHeight' : 40,
		                             'markerDx'     : 0,
		                             'markerDy'     : 20,
		                             'markerOpacity': 1,
		                             'markerRotation':getRotation(item.direction)
		                           },{
		               'textName' : '{name}',
		               'textSize' : 14,
		               'textDy'   : -30,
		               'textFill':"#004e98",
						'textWeight':"bold",
						'textHaloFill': '#FFF', 
		                 'textHaloRadius': 6 
		             }]);
		             marker1.setProperties({
		                             'name' : item.carno //+ (item.speed==0?"":" - "+item.speed+" KM/H")
		                             });
					if(item.car_id==lastCar.value.car_id)lastCar.value=item;
		           //  marker1.getInfoWindow().setContent(getWinInfo(item));
		           }else{
		             var marker1 = new maptalks.Marker(
		                         wgs84ToGcj02(item.lng,item.lat),
		                         { 'id':item.car_id,
		                           'properties' : {
		                             'name' : item.carno
		                             },
		                           'symbol' : [{
		                             'markerFile'   : getCarIcon(item),//car2Img,
		                             'markerWidth'  : 40,
		                             'markerHeight' : 40,
		                             'markerDx'     : 0,
		                             'markerDy'     : 20,
		                             'markerOpacity': 1,
		                             'markerRotation':getRotation(item.direction)
		                           },{
		               'textName' : '{name}',
		               'textSize' : 14,
		               'textDy'   : -30,
		               'textFill':"#004e98",
						'textWeight':"bold",
						'textHaloFill': '#FFF', 
		                     'textHaloRadius': 6 
		 
		             }]
		                         }
		                       ).addTo(layer);
								marker1.on('click', function(p1){
								  isShowInfoWindow=true;
								  setCarCenter(p1.target._id,false)
		                          p1.target.openInfoWindow();
		                         
		                        });
								lastCar.value=item;
		                        marker1.setInfoWindow({
		                              // 'title'     : 'Marker\'s InfoWindow',
									  animation: false,
									  style: {
									      padding: '0px' // 内边距设为0
									    },
		                               'content'   : infowindow.value,//getWinInfo(item),
		                                'autoPan': false,
		                                'width': 500,
		                                'minHeight': 120,
		                               // 'custom': false,
		                               'autoOpenOn' : 'none',  //set to null if not to open when clicking on marker
		                               'autoCloseOn' : 'none'
		                             });
								//marker1.getInfoWindow().on("hide",()=>{isShowInfoWindow=false});
		              hashMap.put(item.car_id,marker1);
		 			 
		 			 if(lastTid==item.car_id){
						 map.setCenter(wgs84ToGcj02(item.lng,item.lat));
		 			 }
		             if(isShowInfoWindow)
		             marker1.openInfoWindow();
		           }
	}
	
</script>

<style scoped="scoped">
	.lingxiconclose{
		cursor: pointer;
	}
	.lingxiconclose:hover{
		color: orangered;
	}
	.maptalks-msgBox-header {
	    display: none !important;
	}
	::v-deep(.maptalks-msgBox) {
	    background-color: #f9f9f9 !important;
	}
</style>
