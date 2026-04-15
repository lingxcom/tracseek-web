<template>
	<div>
	<div style="padding: 5px 0px;margin-left: 10px;">
	    <el-input v-model="text" :placeholder="t('el.car.info.tid')" style="width: 200px;" size="small"></el-input>
	     <el-button type="success" @click="connect"  size="small" style="margin-left: 10px;">{{t('el.start')}}</el-button>
	     <el-button type="warning" @click="close"  size="small">{{t('el.stop')}}</el-button>
	     <el-button  type="primary" plain @click="settext"  size="small">{{t('el.filter')}}</el-button>
	     <el-button  type="info" plain @click="clear"  size="small">{{t('el.clear')}}</el-button>
	</div>
		
	<table width="100%" border="0" cellSpacing="0" cellPadding="0">
	  <tr v-for="(item,index) in list" :key="index"  :class="{clsf9f9f91:(index%2)==1}" >
	    <td width="10px"><div style="width: 10px;"> </div></td>
	    <td width="160px" style="width: 160px;">
	      <div style="width: 160px;">
	      {{item.time}}
	      </div>
	    </td>
	    <td style="text-align: left;">
	       {{item.hexstring}}
	    </td>
	  </tr>
	</table>
	</div>
</template>

<script setup>
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose  } from 'vue';
	import lingxtreedialog from "@/views/lingx/dialog/LingxTreeDialog.vue"
	import api from '@/hooks/api'
	import {lgxInfo,lgxInfo2,getEntityString,getTextString,getValueString,format1} from '@/hooks/lingx'
	import { ElLoading } from 'element-plus'
	const emit = defineEmits(['custom-event']);
	import { useI18n } from 'vue-i18n'
	const { t } = useI18n()
	const text=ref("");
	const list=ref([]);
	let websocket=null;
	const MAX_ROWS=1000;
	function isWsOpen(){
		return websocket && websocket.readyState===WebSocket.OPEN;
	}
	function safeSend(payload){
		if(!isWsOpen())return false;
		websocket.send(JSON.stringify(payload));
		return true;
	}
	function settext(){
		safeSend({apicode:1007,text:text.value,lingxtoken:sessionStorage.getItem("token")});
	}
	function clear(){
		list.value=[]
	}
	function connect(){
		if(websocket==null||websocket.readyState===WebSocket.CLOSED){
			initWebsocket();
		}
	}
	function close(sendStop=true){
		if(websocket!=null){
			if(sendStop){
				safeSend({apicode:1008,text:text.value,lingxtoken:sessionStorage.getItem("token")});
			}
			websocket.close();
		}
	}
	function onMessage(e){
		list.value.unshift({hexstring:e.data,time:getNowTime()})
		if(list.value.length>MAX_ROWS){
			list.value.length=MAX_ROWS;
		}
	}
	function getNowTime() {
	    const d = new Date();
	    return d.getFullYear() + '-' +
	        String(d.getMonth() + 1).padStart(2, '0') + '-' +
	        String(d.getDate()).padStart(2, '0') + ' ' +
	        String(d.getHours()).padStart(2, '0') + ':' +
	        String(d.getMinutes()).padStart(2, '0') + ':' +
	        String(d.getSeconds()).padStart(2, '0');
	}
	function initWebsocket(){
		console.log(window.wsUrl)
		websocket= new WebSocket(window.wsUrl);
		websocket.onmessage = onMessage;
		websocket.onopen=function(){
			safeSend({apicode:1007,text:text.value,lingxtoken:sessionStorage.getItem("token")});
		}
		websocket.onerror=function(){
			// keep the view stable after network errors
			websocket=null;
		}
		websocket.onclose=function(){
			websocket=null;
		}
	}
	onMounted(function(){
		
	});
	onUnmounted(function(){
		if(websocket){
			close(false);
		}
		
	});
</script>

<style scoped="scoped">
  tr.clsf9f9f91{
      background-color: #f9f9f9;
    }
  tr.active1{
      background-color: #dfe8f6;
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
