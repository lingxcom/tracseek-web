<template>
  <div style="width: 100%;height: 100%;display: flex;flex-direction:column;">
    <div v-if="isheader" style="text-align: right;height: 24px;background-color: #ced9e7;color: #0466b0;">
     <div style="float: left;font-size: 12px;color: #0466b0;margin-left: 10px;line-height: 24px;">{{t('el.device')}}:{{tids.length}}</div>
      <a href="javascript:;" style="font-size: 12px;color: #0466b0;margin-right: 10px;line-height: 24px;" @click="closeWin"><el-icon class="lingxclose1"><Close /></el-icon></a>
    </div>
    <div style="flex: 1;flex-grow:1;overflow: hidden;border-top: 1px solid #99bce8;">
<lingxmap :mapid="mapid" ref="lingxMap" ></lingxmap>
</div>
  </div>
</template>

<script setup>
	import { ref, computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose,watch,onDeactivated,onActivated   } from 'vue';
	import {lgxInfo,lgxInfo2,distance,timenum,timeString,getRotation,JSONToExcelConvertor} from '@/hooks/lingx'
  import jsmap from "@/assets/js/jsmap.js"
	import * as maptalks from 'maptalks';
	import lingxmap from "@/components/LingxMap.vue"
	import api from '@/hooks/api'
	import {wgs84ToGcj02} from '@/hooks/maptools'
	import { useI18n } from 'vue-i18n'
	import i18n from '@/lang'
	const { t } = useI18n()
	let language=i18n.global.locale.value;
  const props = defineProps({
     tids: {type: Array,default:  () => {return [];}},
     mapid:{type:String,default:"map"},
	 isheader:{type:Boolean,default:true}
  });
	const emit = defineEmits(['custom-event']);
  const lingxMap=ref();
	const cars=ref([]);
  let map,layer={},isReConnect=true,websocket,token,lastTid;
	let hashMap=new jsmap.HashMap();
	let isShowInfoWindow=false;
  onMounted(function(){
	token=sessionStorage.getItem("token")
    map=lingxMap.value.getMap();
   layer = new maptalks.VectorLayer('vector').addTo(map);
   initWebsocket();
  });

	function closeWin(){
		emit("closewin");
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
		console.log(window.wsUrl)
		let wsuri = window.wsUrl;

			websocket = new WebSocket(wsuri);
			websocket.onmessage = websocketonmessage;
			websocket.onopen = websocketonopen;
			websocket.onerror = websocketonerror;
			websocket.onclose = websocketclose;

	}
	function websocketonopen(){ //连接建立之后执行send方法发送数据
	       // let actions = {"test":"12345"};
	        //this.websocketsend(actions);
			
			sendTids(props.tids);
	      }
	function websocketonerror(){//连接建立失败重连
		  if(isReConnect)
	       setTimeout(function () {
									  console.log("websocket错误")
	              initWebsocket();
	         }, 3 * 1000);
	 }
	function websocketonmessage(e){ //数据接收
		let redata = JSON.parse(e.data);
		if("list"==redata.websocketDataType){
			redata=redata.data;
			for( let i=0;i<redata.length;i++){
			if(i==0)lastTid=redata[i].car_id;
			addCar(redata[i]);
	    	refresh(redata[i]);
			}
		}else{
			addCar(redata);
	    	refresh(redata);
		}

	}
	function websocketsend(obj){//数据发送
	        obj.lingxtoken=token;
	        websocket.send(JSON.stringify(obj));
	      }
	function websocketclose(e){  //关闭
	if(isReConnect)setTimeout(function () {
									  console.log("websocket重连")
	                                     initWebsocket();
	                                }, 3 * 1000);
	      }

	onUnmounted(()=>{
		isReConnect=false;
		if(websocket)websocket.close()
	});
	onActivated(()=>{
		isReConnect=true;
	});
	onDeactivated(()=>{
		isReConnect=false;
	});
	let carImgArr=["/car6.png","/car1.png","/car2.png","/car3.png","/car4.png","/car5.png","/car6.png"];
	function getCarIcon(map){
        return "/static/images/"+(map.icon_type?map.icon_type:"car_icon_0")+carImgArr[map.status_jt808];
      }
	function formatDatetime(row,column,value,index){
        if(!value)return "";
        return (value.substring(0,4)+"-"+value.substring(4,6)+"-"+value.substring(6,8)+" "+value.substring(8,10)+":"+value.substring(10,12)+":"+value.substring(12,14));
      }
	function  getWinInfo(car){
        //console.log(car)
        var div='<div style="width:460px;font-size:14px;line-height: 28px;margin:0px;padding:0px;"><table  width="100%" border="0" cellSpacing="0" cellPadding="0">'+
        '<tr style="background-color: #f9f9f9;"><td style="color: #999999;width:90px;text-align:right;"><div style="width:90px">'+t("el.car.info.carno")+'：</div></td><td ><div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width:120px;" title="'+car.carno+'">'+car.carno+'</div></td><td style="color: #999999;width:74px;text-align:right;">'+t("el.car.info.systime")+'：</td><td  width="140">'+formatDatetime(1,1,car.systime,1)+'</td></tr>'+
        '<tr><td style="color: #999999;text-align:right;">'+t("el.car.info.speed")+'：</td><td>'+car.speed+' km/h</td><td style="color: #999999;text-align:right;">'+t("el.car.info.gpstime")+'：</td><td>'+formatDatetime(1,1,car.gpstime,1)+'</td></tr>'+
        '<tr style="background-color: #f9f9f9;"><td style="color: #999999;text-align:right;">'+t("el.car.info.status")+'：</td><td colspan="3"><div style="white-space: wrap;width:350px;" title="'+car.status_str+'">'+car.status_str+'</div></td></tr>'+ //<td style="color: #999999;width:64px;">在线状态:</td><td><div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width:120px;" title="'+car.comment+'">'+car.comment+'</div></td>
        '<tr><td style="color: #999999;text-align:right;">'+t("el.car.info.alarm")+'：</td><td colspan="3">'+(car.alarm_str=='-'?'-':'<span style="color:red">'+car.alarm_str+'</span>')+'</td></tr>';
       //if(car.is_address)
       // div+='<tr style="background-color: #f9f9f9;"><td style="color: #999999;text-align:right;" valign="top">'+t("el.car.info.address")+'：</td><td colspan="3"><div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width:360px;" title="'+car.address+'">'+(car.address||'无')+'</div></td></tr>';

        '</table></div>';

        return div;
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
		             marker1.getInfoWindow().setContent(getWinInfo(item));
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
		                          lastTid=(p1.target._id)
								 // isShowInfoWindow=true;
		                          //p1.target.openInfoWindow();

		                        });
		                        marker1.setInfoWindow({
		                              // 'title'     : 'Marker\'s InfoWindow',
		                               'content'   : getWinInfo(item),
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

function sendTids(arr){
	let deviceIdString="";
	for(let i=0;i<arr.length;i++){
			deviceIdString=deviceIdString+arr[i]+",";
		}
		if(deviceIdString.length>0)deviceIdString=deviceIdString.substring(0,deviceIdString.length-1);
	websocketsend({cmd:1005,car_id:deviceIdString,language:language});
}

watch(()=>props.tids,function(newValue,oldValue){
	//let arr=newValue;
	sendTids(newValue);
});
</script>

<style scoped="scoped">
	.lingxclose1{}
	.lingxclose1:hover{
		color: orangered;
	}
</style>
