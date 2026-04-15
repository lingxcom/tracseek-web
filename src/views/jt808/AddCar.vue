<template>
  <div style="width: 100%;height: 100%;background-color:#dfe9f6;">
  <div style="padding: 10px;width: 800px;margin:0px auto;">
	  <el-tabs type="border-card">
	      <el-tab-pane :label="t('el.other.add.single')">
			  <el-form ref="form" :model="form" label-width="100px" style="margin-top: 20px;margin-right: 10px;">
			      <el-form-item :label="t('el.car.info.carno')" required>
			        <el-input v-model="carno" ></el-input>
			      </el-form-item>
			  
			  <el-form-item :label="t('el.car.info.tid')" required>
			      <el-col :span="10">
			        <el-input type="tid" v-model="tid"  ></el-input>
			      </el-col>
			      <el-col class="line" :span="4" style="text-align: right;padding-right:10px ;">{{t('el.car.info.sim')}}</el-col>
			      <el-col :span="10">
			        <el-input v-model="sim" ></el-input>
			      </el-col>
			    </el-form-item>
			  
			  <el-form-item :label="t('el.car.info.czxm')">
			      <el-col :span="10">
			        <el-input v-model="czxm" ></el-input>
			      </el-col>
			      <el-col class="line" :span="4" style="text-align: right;padding-right:10px ;">{{t('el.car.info.tel')}}</el-col>
			      <el-col :span="10">
			        <el-input v-model="tel" ></el-input>
			      </el-col>
			    </el-form-item>
			  
			      <el-form-item :label="t('el.car.info.group')" required>
			        <lingxtreedialog v-model="groupId" ecode="tgps_group"></lingxtreedialog>
			      </el-form-item>
			    
			      <el-form-item :label="t('el.car.info.channel')">
			        <el-checkbox-group v-model="channels">
			          <el-checkbox label="CH-1" name="type"></el-checkbox>
			          <el-checkbox label="CH-2" name="type"></el-checkbox>
			          <el-checkbox label="CH-3" name="type"></el-checkbox>
			          <el-checkbox label="CH-4" name="type"></el-checkbox>
			          <el-checkbox label="CH-5" name="type"></el-checkbox>
			          <el-checkbox label="CH-6" name="type"></el-checkbox>
			          <el-checkbox label="CH-7" name="type"></el-checkbox>
			          <el-checkbox label="CH-8" name="type"></el-checkbox>
			        </el-checkbox-group>
			      </el-form-item>
				  <!--
			      <el-form-item :label="t('el.car.info.version')" required>
			        <el-radio-group v-model="version">
			          <el-radio label="JT808-2011"></el-radio>
			          <el-radio label="JT808-2013"></el-radio>
			          <el-radio label="JT808-2019"></el-radio>
			          <el-radio label="LHCX"></el-radio>
			          <el-radio :label="t('el.other')"></el-radio>
			        </el-radio-group>
			      </el-form-item>-->
			      <el-form-item :label="t('el.car.info.remark')">
			        <el-input type="textarea" v-model="remark"></el-input>
			      </el-form-item>
			      <el-form-item label-width="0" >
					  <div style="margin: 0 auto;">
			        <el-button type="primary" @click="onSubmit">{{t('el.submit')}}</el-button>
					<!-- 
			        <el-button @click="clear">{{t('el.clear')}}</el-button>-->
					</div>
			      </el-form-item>
			    </el-form>
		  </el-tab-pane>
	      <el-tab-pane :label="t('el.other.add.batch')">
			  <el-form ref="form2" label-width="100px" style="margin-top: 20px;margin-right: 10px;">
			  
			  <el-form-item :label="t('el.car.info.tid')" required>
			        <el-input  v-model="tids" type="textarea"  :placeholder="t('el.other.add.info')" rows="10"></el-input>
			    </el-form-item>
			  
			  
			      <el-form-item :label="t('el.car.info.group')" required>
			        <lingxtreedialog v-model="groupId" ecode="tgps_group"></lingxtreedialog>
			      </el-form-item>
			    <!---->
			      <el-form-item :label="t('el.car.info.channel')">
			        <el-checkbox-group v-model="channels">
			          <el-checkbox label="CH-1" name="type"></el-checkbox>
			          <el-checkbox label="CH-2" name="type"></el-checkbox>
			          <el-checkbox label="CH-3" name="type"></el-checkbox>
			          <el-checkbox label="CH-4" name="type"></el-checkbox>
			          <el-checkbox label="CH-5" name="type"></el-checkbox>
			          <el-checkbox label="CH-6" name="type"></el-checkbox>
			          <el-checkbox label="CH-7" name="type"></el-checkbox>
			          <el-checkbox label="CH-8" name="type"></el-checkbox>
			        </el-checkbox-group>
			      </el-form-item>
					
<!--
 <el-form-item :label="t('el.car.info.version')" required>
   <el-radio-group v-model="version" >
     <el-radio label="JT808-2011"></el-radio>
     <el-radio label="JT808-2013"></el-radio>
     <el-radio label="JT808-2019"></el-radio>
     <el-radio label="LHCX"></el-radio>
     <el-radio :label="t('el.other')"></el-radio>
   </el-radio-group>
 </el-form-item>
 -->
			      <el-form-item :label="t('el.car.info.remark')">
			        <el-input type="textarea" v-model="remark"></el-input>
			      </el-form-item>
			      <el-form-item label-width="0">
					<div style="margin: 0 auto;">
			        <el-button type="primary" @click="onSubmit2">{{t('el.submit')}}</el-button>
					<!-- 
			        <el-button @click="clear2">{{t('el.clear')}}</el-button>-->
					</div>
			      </el-form-item>
			    </el-form>
		  </el-tab-pane>
	    </el-tabs>
  </div></div>
</template>
<script setup>
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose  } from 'vue';
	import lingxtreedialog from "@/views/lingx/dialog/LingxTreeDialog.vue"
	import api from '@/hooks/api'
	import {lgxInfo,lgxInfo3,getEntityString,getTextString,getValueString,format1} from '@/hooks/lingx'
	import { ElLoading } from 'element-plus'
	const emit = defineEmits(['custom-event']);
	import { useI18n } from 'vue-i18n'
	const { t } = useI18n()
	const tid=ref("");
	const sim=ref("");
	const czxm=ref("");
	const tel=ref("");
	const tids=ref("");
	const carno=ref("");
	const groupId=ref("");
	const channels=ref([]);
	const version=ref("");
	const remark=ref("");
	const form=ref({});
	
	function onSubmit(){
		 if(!carno.value){
            lgxInfo3(t('el.car.info.carno')+t('el.info.notnull'));
            return;
          }
		  if(!tid.value){
            lgxInfo3(t('el.car.info.tid')+t('el.info.notnull'));
            return;
          }
          if(!groupId.value){
             lgxInfo3(t('el.car.info.group')+t('el.info.notnull'));
            return;
          }
          
		  api.callApi({"apicode":1163,"e":"tgps_car","m":"add",type:"single",
            "tid":tid.value,
            "carno":carno.value,
            "groupId":groupId.value,
            "sim":sim.value,
            "czxm":czxm.value,
            "tel":tel.value,
            "remark":remark.value,
            "version":version.value,
            "channels":channels.value
            },function(json){
                if(json.code==1){
                    lgxInfo(t('el.success'));
                }else{
					lgxInfo(t('el.fail'));
                }
            });
        
	}
	function onSubmit2(){
	        if(!tids.value){
	          lgxInfo3(t('el.car.info.tid')+t('el.info.notnull'));
	          return;
	        }
	        if(!groupId.value){
	           lgxInfo3(t('el.car.info.group')+t('el.info.notnull'));
	          return;
	        }
			
	        api.callApi({apicode:1163,tids:tids.value,groupId:groupId.value,type:"batch",
	            remark:remark.value,
	            version:version.value,
	            channels:channels.value},function(json){
	              if(json.code==1){
	                  lgxInfo(t('el.success'));
	              }else{
	                  lgxInfo(t('el.fail'));
	              }
	            });
	      }
	function clear(){
		
	}
</script>

<style>
</style>
