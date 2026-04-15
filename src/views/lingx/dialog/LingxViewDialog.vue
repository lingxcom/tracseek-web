<template>
		<lingxdialog ref="dialog" :type="2">
			 <el-row>
			 <el-col :span="20" style="padding-top:15px ">
			 <el-form ref="form" label-width="160px">
			 <el-form-item v-if="method.prompt"  label="" style="height:30px;line-height: 30px;margin-bottom: 2px !important;">
			            <div style="width:100%;height:100%;font-size: 12px;color: #999;">{{method.prompt}}</div>
			            </el-form-item>
			
			<el-form-item :label="item.name" :key="index" v-for="(item,index) in fields2"
			 :rules="[{ required: item.isNotNull}]"
			>
			
<div  v-html="item.valueView"></div>

		  </el-form-item>
		  </el-form></el-col>
		          </el-row>
		</lingxdialog>
</template>

<script setup>
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose  } from 'vue';
	import lingxdialog from "@/components/LingxDialog.vue"
	import api from '@/hooks/api'
	import {lgxInfo,getEntityString,getTextString,getValueString,format1} from '@/hooks/lingx'
	import { ElLoading } from 'element-plus'
    const emit = defineEmits(['custom-event']);
	const dialog=ref(null),method=ref({}),fields=ref([]);
	let ecode,mcode,title,id;
	let fields2=computed(()=>{
		let array=[];
		for(let i=0;i<fields.value.length;i++){
			if(fields.value[i].enabled&&fields.value[i].inputType!='hidden')array.push(fields.value[i])
		}
		return array;
	});
	
	function openDialog(options){
		ecode=options.ecode,mcode=options.mcode,title=options.title,id=options.id;
		dialog.value.openDialog({title:title});
		let extparam=options.extparam;
        let param={apicode:8001,e:ecode,m:mcode,eid:options.id};
        for(var field in extparam){//条件过滤，属性传入
          if(extparam[field]){
            param[field]=extparam[field];
          }
        }

        api.callApi(param,function(json){
          for(let i=0;i<json.data.fields.length;i++){
            let obj=json.data.fields[i];
            if(typeof obj.value=="object"){
                obj.valueView=getEntityString(obj.value);
            }else{
                obj.valueView=obj.value;
            }
              //正常处理结束
            

          }
          method.value=json.data.method;
          fields.value=json.data.fields;
         });
	}
	
	defineExpose({openDialog});
	
</script>

<style>
</style>
