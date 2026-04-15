<template>
	<div ref="panel" style="width: 100%;height: 100%;position: relative;">
		<div :id="mapid" style="width: 100%;height: 100%;"></div>
		<div class="noselect tool-bar" v-if="iscl">
			<div @click="fullscreen" class="tool-icon">
				<el-icon><FullScreen /></el-icon>
			</div>
		  <el-link @click="cj" type="primary" style="font-size: 12px;padding: 0px 5px;"> {{$t('el.map.tool1')}} </el-link>
		  <el-link @click="cm" type="primary" style="font-size: 12px;padding: 0px 5px;"> {{$t('el.map.tool2')}} </el-link>
		  <el-link @click="wl" type="primary" style="font-size: 12px;padding: 0px 5px;"> {{$t('el.map.tool3')}} </el-link>
		</div>
		<div @click="showMap=true" class="noselect" style="cursor: pointer;position: absolute;top:10px;right:10px;padding: 0 5px;height: 24px;line-height: 24px;font-size: 12px;background-color: #fff;text-align: center;border: #aaa 1px solid;">
			{{$t('el.map.switchmap')}}
		</div>
		<div v-show="showMap" @mouseleave="showMap=false" style="position: absolute;top:10px;right:10px;width:150px;line-height: 24px;font-size: 12px;background-color: #fff;border: #aaa 1px solid;">
			<table  border="0" cellSpacing="0" cellPadding="0" style="width: 100%;"><tbody>
				<tr>
					<td colspan="2">
						<div style="width: 100%;display: flex;flex-wrap: wrap;margin-top: 10px;">
							<div v-for="(item,index) in listMaptype" :key="item.id||item.url||index" style="flex: 1 1 70px;min-width: 70px; text-align: center;">
								<el-link @click="setBaseLayer(item)" type="primary" style="background-color: #fff;font-size: 12px;padding: 0px 5px;"> 
								 {{ language=="zh-CN"?item.cn_name:item.en_name}}
								 </el-link>
							</div>
						</div>
					</td>
				</tr>
				<tr>
					<td align="center" colspan="2">
						<el-checkbox v-model="checked1" :label="$t('el.map.traffic')" size="small" />
						<el-checkbox v-model="checked2" :label="$t('el.map.flag')" size="small" />
					</td>
					<td align="center"></td>
				</tr>
			</tbody></table>
			  
		</div>
		<div v-show="showPls" class="noselect" style="position: absolute;top:2px;left:2px;width:240px;height: 270px;line-height: 24px;font-size: 12px;background-color: #fff;border: #aaa 1px solid;display: flex;flex-direction: column;">
		<div style="height: 24px;padding-left: 5px;padding-right: 5px;">
			<el-input
			      v-model="searchText"
			      style="width: 150px"
			      size="small"
				  :clearable="true"
			      :placeholder="t('el.map.fance.search')"
				  @keyup.enter="editPls=false;wlGrid()"
				  @clear="editPls=false;wlGrid()"
			    >
				<template #append>
					   <el-button icon="Search"   size="small" @click="editPls=false;wlGrid()"></el-button>
				</template>
			 </el-input>
			 <el-link type="primary" plain size="small" style="margin-left: 5px;font-size: 12px;" @click="editPls=true;wlAdd()">{{t('el.map.fance.add')}}</el-link>  
			 <el-link type="info" plain size="small" style="margin-left: 15px;font-size: 12px;" @click="editPls=false;showPls=false;drawTool.disable();layerPls.clear()">{{t('el.map.fance.close')}}</el-link>
		</div>
		<div v-show="!editPls" style="height: 0;flex-grow: 1;">
			<el-scrollbar height="100%">
			<table style="width: 100%;" border="0" cellSpacing="0" cellPadding="0">
				<thead><tr>
					<th></th>
					<th>{{t('el.map.fance.name')}}</th>
					<th>{{t('el.map.fance.type')}}</th>
					<!--<th>点数</th> -->
					<th>{{t('el.map.fance.operat')}}</th>
				</tr></thead>
				<tbody>
					<tr v-for="(item,index) in listPls" style="cursor: pointer;" @click="trclick(item,index)" :class="{clsf9f9f91:(index%2)==1,active1:selectIndex==index}">
						<td align="center">{{index+1}}</td>
						<td align="center">{{item.name}}</td>
						<td align="center">{{wlType(item.type)}}</td> 
						<!--<td align="center">{{item.num}}</td>-->
						<td align="center">
			 <el-link type="success" plain size="small" style="font-size: 12px;" @click.stop="wlEdit(item,index)">{{t('el.map.fance.edit')}}</el-link> 
			 <el-link type="danger" plain size="small"  style="margin-left: 5px;font-size: 12px" @click.stop="wlDel(item.id)">{{t('el.map.fance.del')}}</el-link>
			  </td>
					</tr>
				</tbody>
			</table>
  </el-scrollbar>
		</div>
		<div v-show="editPls">
			<el-form label-width="50px" size="small" style="padding-top:20px; padding-right: 5px;;">
				<el-form-item :label="t('el.map.fance.name')">
				<el-input v-model="data.name"  spellcheck ="false" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item :label="t('el.map.fance.type')">
				<el-radio-group  v-model="data.type" :disabled="data.id!=null">
				      <el-radio label="3" >{{t("el.map.fance.p")}}</el-radio>
				      <el-radio label="2" >{{t("el.map.fance.l")}}</el-radio>
				      <el-radio label="1" >{{t("el.map.fance.s")}}</el-radio>
				</el-radio-group>
				</el-form-item>
				<el-form-item :label="t('el.map.fance.radius')" v-show="data.type!=1">
					<el-input-number v-model="data.radius" :step="10" :min="10" />
				</el-form-item>
				<el-form-item :label="t('el.map.fance.map')">
				<el-radio-group  v-model="data.is_map">
				      <el-radio label="1" >{{t('el.map.fance.display')}}</el-radio>
				      <el-radio label="0" >{{t('el.map.fance.nodisplay')}}</el-radio>
				</el-radio-group>
				</el-form-item>
				<el-form-item :label="t('el.map.fance.color')" v-show="data.is_map=='1'">
				<el-color-picker v-model="data.color" show-alpha :predefine="predefineColors" />
				</el-form-item>
				<el-form-item label-width="0px">
					<div style="width: 100%;text-align: center;">
					    <el-button type="primary" @click="wlSave">{{t("el.submit")}}</el-button>
					    <el-button type="info" @click="editPls=false;pls.endEdit()">{{t("el.canel")}}</el-button>
						</div>
				</el-form-item>
			</el-form>
			<div style="font-size: 12px;color: #AAA;padding: 5px;">
				{{t("el.map.fance.info")}}
			</div>
		</div>	
		</div>
	</div>
</template>

<script setup>
  import 'maptalks/dist/maptalks.css';
	import * as maptalks from 'maptalks';
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose  } from 'vue';
    import {lgxInfo,lgxInfo2} from '@/hooks/lingx'
	import { useI18n } from 'vue-i18n'
	import api from '@/hooks/api'
	import {wgs84ToGcj02,gcj02ToWgs84} from '@/hooks/maptools'
	import i18n from '@/lang'
	let language=i18n.global.locale.value;
	const { t } = useI18n()
	let lingxMap=null;let layer1;
	let distanceTool,areaTool,drawTool,pls,layerPls;
	const props = defineProps({
	  mapid: {
	    type: String,
	    default: "lingxmap"
	  },
	  renderer: {
	    type: String,
	    default: "canvas"
	  },
	  istoolbar:{
		  type:Boolean,
		  default:false
	  },
    iscl:{type:Boolean,default:false},//是否测量
    zoom:{type:Number,default:0},
    center:{type:Object,default:()=>({lng: 116.396621, lat: 39.916385})},
	});
	const showMap=ref(false),showPls=ref(false),editPls=ref(false),listPls=ref([]);
	const searchText=ref(""),selectIndex=ref(-1);
	const checked1=ref(false),checked2=ref(true);
	const listMaptype=ref([]);
	const data=ref({id:null,name:"",type:"1",is_map:"0",radius:50,color:"#ff4500"});
	const predefineColors = ref([
	  '#ff4500',
	  '#ff8c00',
	  '#ffd700',
	  '#90ee90',
	  '#00ced1',
	  '#1e90ff',
	  '#c71585',
	  'rgba(255, 69, 0, 0.68)',
	  'rgb(255, 120, 0)',
	  'hsv(51, 100, 98)',
	  'hsva(120, 40, 94, 0.5)',
	  'hsl(181, 100%, 37%)',
	  'hsla(209, 100%, 56%, 0.73)',
	  '#c7158577',
	])
	let symbolRed={
              'polygonFill' : '#f56c6c',
              'polygonOpacity' : 0.5,
              'lineColor' : '#f56c6c',
              'lineWidth' : 3
            };
	let symbol={
            markerType: "x",
                                        markerWidth: 20,
                                        markerHeight: 20,
                                        markerLineWidth: 3,
                                        markerLineColor: "#F00",
              'polygonFill' : '#dfe8f6',
              'polygonOpacity' : 0.5,
              'lineColor' : '#3c537e',
              'lineWidth' : 3,
            };
	const qqmap3=new maptalks.TileLayer('rtt2c', {
		          crossOrigin: undefined,
		          renderer : props.renderer,//默认是webgl
		          urlTemplate: 'https://tm.amap.com/trafficengine/mapabc/traffictile?v=1.0&x={x}&y={y}&z={z}',
		          subdomains: ['0','1','2','3'],
		        })		
	const panel=ref();
	function parseLatlngs(text){
		try{
			return JSON.parse(text);
		}catch(e){
			lgxInfo2(t('el.fail'));
			return [];
		}
	}
	function fullscreen(){
		panel.value.requestFullscreen()
	}
	function cj(){
	      lgxInfo(t("el.map.msg1"));
	    distanceTool.enable();
	    }
	function cm(){
	      lgxInfo(t("el.map.msg2"));
	    areaTool.enable();
	    }
	function trclick(data,index){
		selectIndex.value=index;
		let geometry=null;
		let latlngs=parseLatlngs(data.latlngs);
		if(!latlngs.length)return;
		
		let dataList=latlngs;
		latlngs=[];
		for(let i=0;i<dataList.length;i++){
		  latlngs.push(wgs84ToGcj02(dataList[i][0],dataList[i][1]));
		}
		
		   layerPls.clear();
		    switch(data.type-0){
		      case 3:
			  latlngs=latlngs[0];
		geometry=new maptalks.Marker(latlngs,{symbol:symbol});
		lingxMap.setCenter(latlngs);
		      break;
		      case 2:
		geometry=new maptalks.LineString(latlngs,{symbol:symbol});
		//map.setCenter(latlngs[0]);
		lingxMap.fitExtent(geometry.getExtent(), 0);
		      break;
		      case 1:
		geometry=new maptalks.Polygon([latlngs],{symbol:symbol});
		//map.setCenter(latlngs[0]);
		lingxMap.fitExtent(geometry.getExtent(), 0);
		      break;
		    }
		layerPls.addGeometry(geometry);
		pls=geometry;
	}
	function wl(){
		selectIndex.value=-1;
		showPls.value=true;
		wlGrid();
		//drawTool.setMode("Polygon").enable();
	}
	function wlType(type){
		if(type==1)return t("el.map.fance.s");
		if(type==2)return t("el.map.fance.l");
		if(type==3)return t("el.map.fance.p");
	}
	function wlAdd(){
		layerPls.clear()
		drawTool.setMode("Polygon").enable();
		data.value={id:null,name:"",type:"1",is_map:"0",radius:50,color:"#ff4500"};
	}
	function wlEdit(item,index){
		selectIndex.value=index;
		data.value=item;
		editPls.value=true;
		let geometry=null;
		let latlngs=parseLatlngs(item.latlngs);
		if(!latlngs.length)return;
		
		let dataList=latlngs;
		latlngs=[];
		for(let i=0;i<dataList.length;i++){
		  latlngs.push(wgs84ToGcj02(dataList[i][0],dataList[i][1]));
		}
		
		   layerPls.clear();
		    switch(item.type-0){
		      case 3:
			  latlngs=latlngs[0];
		geometry=new maptalks.Marker(latlngs,{symbol:symbol});
		lingxMap.setCenter(latlngs);
		      break;
		      case 2:
		geometry=new maptalks.LineString(latlngs,{symbol:symbol});
		//map.setCenter(latlngs[0]);
		lingxMap.fitExtent(geometry.getExtent(), 0);
		      break;
		      case 1:
		geometry=new maptalks.Polygon([latlngs],{symbol:symbol});
		//map.setCenter(latlngs[0]);
		lingxMap.fitExtent(geometry.getExtent(), 0);
		      break;
		    }
		layerPls.addGeometry(geometry);
		pls=geometry;
		pls.startEdit();
	}
	function wlDel(id){
		if(!confirm(t("el.confirm.del")))return;
		layerPls.clear()
		let params={apicode:8002,ecode:"tgps_pls",mcode:"del",id:id};
		api.callApi(params,function(json){
		wlGrid();
		selectIndex.value=-1;
		});
	}
	function wlSave(){
		selectIndex.value=-1;
		let params=data.value;
		if(!params.name){
			lgxInfo2(t('el.map.fance.name')+t('el.info.notnull'));
			return;
		}
		if(!pls){
			lgxInfo2(t('el.map.fance')+t('el.info.notnull'));
			return;
		}
		params.apicode=8002;
		params.ecode="tgps_pls";
		params.mcode=params.id?"edit":"add";
		if(params.user_id)params.user_id=params.user_id.value;
		pls.endEdit();
		let array=maptalks.Coordinate.toNumberArrays(pls.getCoordinates());
		if(params.type==1)array=array[0];
		if(params.type==3)array=[array];
		
		let dataList=array;
		let latlngs=[];
		for(let i=0;i<dataList.length;i++){
		  latlngs.push(gcj02ToWgs84(dataList[i][0],dataList[i][1]));
		}
		array=latlngs;
		
		
		params.latlngs=JSON.stringify(array);
		params.num=(params.type==3)?1:array.length;
		api.callApi(params,function(json){
			//console.log(json)
			wlGrid();
			editPls.value=false;
			layerPls.clear()
		});
	}
	function wlGrid(){
		let params={apicode:8002,ecode:"tgps_pls",mcode:"grid",limit:100,cx_name:searchText.value};
		api.callApi(params,function(json){
			let dataList=json.rows;
			for(let i=0;i<dataList.length;i++){
				dataList[i].type=dataList[i].type[0].value;
			}
			listPls.value=dataList;
		});
	}
	function addMapToolbar(){
		//lingxMap.setBaseLayer(google1); 
	}
	function setBaseLayer(item){
		let layer1=new maptalks.TileLayer('base', {
			          crossOrigin: undefined,
			          renderer : props.renderer,//默认是webgl
			          urlTemplate:item.url,
			          subdomains: ['1','2','3'],
			        })
		lingxMap.setBaseLayer(layer1);
	}
	onMounted(function(){
			init();
		api.callApi({apicode:1102},function(json){
			listMaptype.value=json.data.listMaptype;
			let layer1=new maptalks.TileLayer('base', {
				          crossOrigin: undefined,
				          renderer : props.renderer,//默认是webgl
				          urlTemplate:listMaptype.value[0].url,
				          subdomains: ['1','2','3'],
				        })
			lingxMap.setBaseLayer(layer1);
			
			let centerLatlng=json.data.centerLatlng;
	          let arr=centerLatlng.split(",");
			let center1={lat:arr[0]-0,lng:arr[1]-0};
			lingxMap.setCenter(wgs84ToGcj02(center1.lng,center1.lat));
			if(arr.length>2){
			  let zoom1=arr[2]-0;
			  if(props.zoom>0)zoom1=props.zoom;
			  lingxMap.setZoom(zoom1);
			}
			//console.log(json)
		});
		layer1 = new maptalks.VectorLayer('vector_def_1').addTo(lingxMap);
		api.callApi({apicode:1119},function(json){
		
		for(let i=0;i<json.rows.length;i++){
		let data=json.rows[i];
		let geometry;
		let sss={...symbolRed,polygonFill:data.color,lineColor:data.color};
		
		let latlngs=parseLatlngs(data.latlngs);
		if(!latlngs.length)continue;
		let dataList=latlngs;
		let array=[];
		for(let j=0;j<dataList.length;j++){
		  array.push(wgs84ToGcj02(dataList[j][0],dataList[j][1]));
		}
		latlngs=array;
		
		    switch(data.type-0){
		      case 3:
		geometry=new maptalks.Circle(latlngs, data.radius,{symbol:sss});
		layer1.addGeometry(geometry);
		      break;
		      case 2:
		geometry=new maptalks.LineString(latlngs,{symbol:sss});
		layer1.addGeometry(geometry);
		      break;
		      case 1:
		geometry=new maptalks.Polygon([latlngs],{symbol:sss});
		layer1.addGeometry(geometry);
		      break;
		    }
		    geometry.on("click",function(p1){
		      lgxInfo(data.name);
		    });
		}
		
		//、点线面处理 END
		
		      });
	});
	onUnmounted(()=>{
		if(drawTool)drawTool.disable();
		if(distanceTool)distanceTool.disable();
		if(areaTool)areaTool.disable();
		if(lingxMap){
			lingxMap.remove();
			lingxMap=null;
		}
	});
	function init(){
		  let scaleControl=false;
		  let zoomControl=false;
		  if(props.istoolbar){
		    scaleControl= {
		                                'position'  : 'bottom-right',
		                                'maxWidth': 100,
		                                'metric': true,
		                                'imperial': false
		                              }
			zoomControl= {
			          'position'  : 'top-left',
			          'zoomLevel' : false
			        }
		  }
		  
		lingxMap = new maptalks.Map(props.mapid,{
		                        center: [props.center.lng,props.center.lat],
		                        zoom: props.zoom,
		                       scaleControl:scaleControl,
							    zoomControl: zoomControl,
								minZoom: 3,
								maxZoom: 17,
								dragRotate: !1,
								dragPitch: !1,
								zoomAnimation: !1,
								panAnimation: !1,
								enableInfoWindow: !0,
		                     spatialReference:{
		                          
		                           },
		                         // baseLayer: google1//baidu1//google1
		                  });
						  
		layerPls = new maptalks.VectorLayer('vector_pls').addTo(lingxMap);
		 distanceTool = new maptalks.DistanceTool({
		         'once' : true,
		              'symbol': {
		                'lineColor' : '#fc8046',
		                'lineWidth' : 2
		              },
		              'vertexSymbol' : {
		                'markerType'        : 'ellipse',
		                'markerFill'        : '#fff',
		                'markerLineColor'   : '#ff0101',
		                'markerLineWidth'   : 2,
		                'markerWidth'       : 10,
		                'markerHeight'      : 10
		              },
		
		              'labelOptions' : {
		                'textSymbol': {
		                  'textFaceName': 'monospace',
		                  'textFill' : '#888',
		                  'textLineSpacing': 1,
		                  'textHorizontalAlignment': 'right',
		                  'textDx': 15,
		                  'markerLineColor': '#b4b3b3',
		                  'markerFill' : '#fff'
		                },
		                'boxStyle' : {
		                  'padding' : [6, 2],
		                  'symbol' : {
		                    'markerType' : 'square',
		                    'markerFill' : '#fff',
		                    'markerFillOpacity' : 0.9,
		                    'markerLineColor' : '#b4b3b3'
		                  }
		                }
		              },
		              'clearButtonSymbol' :[{
		                'markerType': 'square',
		                'markerFill': '#fff',
		                'markerLineColor': '#b4b3b3',
		                'markerLineWidth': 1,
		                'markerWidth': 15,
		                'markerHeight': 15,
		                'markerDx': 20
		              }, {
		                'markerType': 'x',
		                'markerWidth': 10,
		                'markerHeight': 10,
		                'markerLineColor' : '#999',
		                'markerDx': 20
		              }],
		              'language' : 'zh-CN'
		            }).addTo(lingxMap).disable();
		             areaTool = new maptalks.AreaTool({
		               'once' : true,
		                   'symbol': {
		                     'lineColor' : '#fc8046',
		                     'lineWidth' : 2,
		          'polygonFill' : '#fff',
		          'polygonOpacity' : 0.5
		                   },
		                   'vertexSymbol' : {
		                     'markerType'        : 'ellipse',
		                     'markerFill'        : '#fff',
		                     'markerLineColor'   : '#ff0101',
		                     'markerLineWidth'   : 2,
		                     'markerWidth'       : 10,
		                     'markerHeight'      : 10
		                   },
		
		                   'labelOptions' : {
		                     'textSymbol': {
		                       'textFaceName': 'monospace',
		                       'textFill' : '#888',
		                       'textLineSpacing': 1,
		                       'textHorizontalAlignment': 'right',
		                       'textDx': 15,
		                       'markerLineColor': '#b4b3b3',
		                       'markerFill' : '#fff'
		                     },
		                     'boxStyle' : {
		                       'padding' : [6, 2],
		                       'symbol' : {
		                         'markerType' : 'square',
		                         'markerFill' : '#fff',
		                         'markerFillOpacity' : 0.9,
		                         'markerLineColor' : '#b4b3b3'
		                       }
		                     }
		                   },
		                   'clearButtonSymbol' :[{
		                     'markerType': 'square',
		                     'markerFill': '#fff',
		                     'markerLineColor': '#b4b3b3',
		                     'markerLineWidth': 1,
		                     'markerWidth': 15,
		                     'markerHeight': 15,
		                     'markerDx': 20
		                   }, {
		                     'markerType': 'x',
		                     'markerWidth': 10,
		                     'markerHeight': 10,
		                     'markerLineColor' : '#999',
		                     'markerDx': 20
		                   }],
		                   'language' : 'zh-CN'
		                  }).addTo(lingxMap).disable();
		drawTool=new maptalks.DrawTool({
            mode: 'Polygon',
            symbol:symbol
          }).addTo(lingxMap).disable();

          drawTool.on('drawend', function (param) {
            layerPls.addGeometry(param.geometry);
            if("Point"!=param.geometry.type)
            param.geometry.startEdit();
            pls=param.geometry;
            //console.log(pls)
           // pls.startEdit();
            drawTool.disable();
          });

		lingxMap.addLayer(qqmap3);
		qqmap3.hide();
		addMapToolbar();
	}
	function getMap(){
		return lingxMap;
	}
	watch(checked1,(newVal)=>{
		if(newVal){
			qqmap3.show();
		}else{
			qqmap3.hide();
		}
	});
	watch(checked2,(newVal)=>{
		if(newVal){
			layer1.show();
		}else{
			layer1.hide();
		}
	});
	watch(()=>data.value.type,(newValue)=>{
		switch(newValue){
			case "1":
			drawTool.setMode("Polygon").enable();
			break;
			case "2":
			drawTool.setMode("LineString").enable();
			break;
			case "3":
			drawTool.setMode("Point").enable();
			break;
		}
	});
	defineExpose({getMap});
</script>

<style scoped="scoped">
	:deep(.el-form-item--small) {
	  margin-bottom: 5px !important;
	}
	td{
		border-top: #f1f1f1 solid 1px;
	}
	
	tr.clsf9f9f91{
	     background-color: #f9f9f9;
	   }
	 tr.active1{
	     background-color: #dfe8f6;
	   }
	
	.tool-bar {
	  position: absolute;
	  top: 0;
	  left: 5px;
	  height: 20px;
	  padding: 0 2px;
	  background-color: #dfe9f6;
	
	  display: flex;
	  align-items: center;
	}
	
	.tool-icon {
	  display: flex;
	  align-items: center;
	  cursor: pointer;
	}
	
	.tool-link {
	  font-size: 12px;
	  padding: 0 5px;
	}

</style>
