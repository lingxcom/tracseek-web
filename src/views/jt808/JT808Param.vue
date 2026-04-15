<template>
	<layout2>
		<template #left>
			<cartree ref="lingxCarTree" @lingxnodeclick="lingxnodeclick" ></cartree>
		</template>
		<div style="width: 100%;height: 100%;display: flex;flex-direction: column;">
		<div style="margin-top: 20px;margin-left: 10px;">
			<el-form :inline="true" class="demo-form-inline" >
			              <el-form-item>
			               <el-select v-model="param" :placeholder="t('el.jt808.param.select_param')" @change="change" style="width:494px;">
			                 <el-option v-for="(item,index) in list" :key="index" :value="item.paramid" :label="item.paramid +'-'+ item.remark"></el-option>
			               </el-select>
			              </el-form-item>
			              <el-form-item>
			                <el-button type="success" @click="search">{{t('el.jt808.param.query_terminal_param')}}</el-button>
							 <el-button type="success" @click="searchAll">{{t('el.jt808.param.query_all_params')}}</el-button>
			              </el-form-item>
			            </el-form>
			
			         <el-form ref="form" label-width="80px" label-position="top" >
			          <el-form-item :label="t('el.jt808.param.param_value')">
			              <el-input type="textarea" v-model="text" rows="5" style="width:500px;"></el-input>
			            </el-form-item>
			            <el-form-item>
			               <el-button type="primary" @click="setConfig" :disabled="!issend">{{t('el.jt808.param.send_to_terminal')}}</el-button>
			             </el-form-item>
			         </el-form>
					
		</div><div style="padding: 20px;margin-left: 20px;overflow: auto;flex-grow: 1;height: 0;">
						<li v-for="(item,index) in listAll">
												 {{index+1}}.{{item.remark}} 【<span style="color: red;">{{item.value}}</span>】
						</li>
					</div>
					</div>
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
	const text=ref("");
	const param=ref("0x0001");
	const issend=ref(false);
	let carid;
	let id="1",type="DWORD",region="";
	const list=ref([]);
	const listAll=ref([]);
	function lingxnodeclick(data,node,el){
		if(data.type=="device")carid=data.value;
	}
	function change(){
          text.value="";
          id=parseInt(param.value);
          for(var i=0;i<list.value.length;i++){
            if(id==parseInt(list.value[i].paramid)){
                type=list.value[i].type;
            }
          }
        }
	function searchAll(){
		if(!carid){
		  lgxInfo2(t("el.jt808.param.select_device_first"));
		  return;
		}
		listAll.value=[]
		lgxInfo(t("el.jt808.param.querying"));
		api.callApi({apicode:1172,deviceId:carid},function(json){
		 console.log(json.data)
		 listAll.value=json.data;
		})
	}
    function search(){
        //  console.log(this.form);
          if(!carid){
            lgxInfo2(t("el.jt808.param.select_device_first"));
            return;
          }
          lgxInfo(t("el.jt808.param.querying"));
          api.callApi({apicode:1128,tid:carid,id:id,type:type},function(json){
          if(json.data.code==9){
            lgxInfo2(json.data.message);
            return;
          }
          if(json.value){
             text.value=json.value;
             issend.value=true;
          }

          })
        }
    function setConfig(){
          if(!confirm(t("el.jt808.param.confirm_send")))return;
          lgxInfo(t("el.jt808.param.sending"));
          api.callApi({apicode:1129,tid:carid,id:id,type:type,param:text.value},function(json){
              lgxInfo(json.message);
              //console.log(json)
          })
        }
	function init(){
		api.callApi({apicode:1130},function(json){
		    list.value=json.data;
		})
	}
	onMounted(init);
</script>

<style>
</style>
