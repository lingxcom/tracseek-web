<template>
		<lingxdialog ref="dialog" @confirm="dialogSubmit">
			 <el-row>
			 <el-col :span="20" style="padding-top:15px ">
			 <el-form ref="form" label-width="160px">
			 <el-form-item v-if="method.prompt"  label=""  style="height:30px;line-height: 30px;margin-bottom: 12px !important;">
			            <div style="width:100%;height:100%;font-size: 12px;color: #999;" v-html="method.prompt"></div>
			            </el-form-item>
			
			<el-form-item :label="item.name" :key="index" v-for="(item,index) in fields2"
			 :rules="[{ required: item.isNotNull}]"
			>
			<el-input v-model="item.value" v-if="item.inputType=='textfield'&&!method.readonly" @keyup.enter.native="dialogSubmit" spellcheck ="false" autocomplete="off"></el-input>
		<el-input v-model="item.value" v-if="item.inputType=='readonly'&&!method.readonly" readonly  spellcheck ="false" autocomplete="off"></el-input>
		    <el-input v-model="item.value" v-if="item.inputType=='password'&&!method.readonly" show-password @keyup.13.native="dialogSubmit"  spellcheck ="false" autocomplete="off"></el-input>
		    <el-input
		      type="textarea"
		      :rows="3"
		      placeholder=""
		      spellcheck ="false"
		      autocomplete="off"
		      v-if="item.inputType=='textarea'&&!method.readonly"
		      v-model="item.value">
		    </el-input>
		
		    <el-radio-group  v-model="item.value"  v-if="item.inputType=='radio'&&!method.readonly">
		          <el-radio :name="item.code"  :label="item2.value" :key="index2" v-for="(item2,index2) in item.optionitem"><span v-html="item2.text"></span></el-radio>
		    </el-radio-group>
		
		    <el-checkbox-group v-model="item.value"  v-if="item.inputType=='checkbox'&&!method.readonly">
		          <el-checkbox name="itemcode"  :key="index3" :label="item3.value" :data-value="item.value" v-for="(item3,index3) in item.optionitem"><span v-html="item3.text"></span></el-checkbox>
		    </el-checkbox-group>
		
		<el-select v-model="item.value"  v-if="item.inputType=='combobox'&&!method.readonly" placeholder="">
		    <el-option
		      v-for="item4 in item.optionitem"
		      :key="item4.value"
		      :label="item4.text"
		      :value="item4.value">
		    </el-option>
		  </el-select>
		
		    <el-date-picker  style="width: 100%;"
		      v-model="item.value"  v-if="item.inputType=='datefield'&&!method.readonly" 
		      type="date"
		      value-format="YYYYMMDD"
		      placeholder="">
		    </el-date-picker>
		
		    <el-date-picker  style="width: 100%;"
		      v-model="item.value"  v-if="item.inputType=='datetimefield'&&!method.readonly" 
		      type="datetime"
		      value-format="YYYYMMDDHHmmss"
		      placeholder="">
		    </el-date-picker>
			 <el-time-select style="width: 100%;"
			   v-model="item.value"  v-if="item.inputType=='timefield'&&!method.readonly" 
			    start="00:00"
			    step="00:15"
			    end="23:59"
				:include-end-time="true"
			    placeholder=""
			  />
		
		<div v-if="item.inputType=='displayfield'&&!method.readonly" v-html="format1(item.value)"></div>
		
		<div v-if="item.inputType=='imagefield'&&!method.readonly" >
		  <img :src="item.value" style="width:200px" />
		</div>

<el-input-number v-model="item.value" v-if="item.inputType=='numberfield'&&!method.readonly"> </el-input-number>
<lingxgriddialog v-model="item.value" :ecode="item.refEntity" v-if="item.inputType=='dialoggrid'&&!method.readonly" :options="item.inputOptions"></lingxgriddialog>
<lingxgriddialog2 v-model="item.value" :ecode="item.refEntity" v-if="item.inputType=='dialoggrid2'&&!method.readonly" :options="item.inputOptions"></lingxgriddialog2>
<lingxtreedialog v-model="item.value" :ecode="item.refEntity" v-if="item.inputType=='dialogtree'&&!method.readonly" :options="item.inputOptions"></lingxtreedialog>
<lingxtreedialog2 v-model="item.value" :ecode="item.refEntity" v-if="item.inputType=='dialogtree2'&&!method.readonly" :options="item.inputOptions"></lingxtreedialog2>
<lingxfiledialog v-model="item.value" v-if="item.inputType=='file'&&!method.readonly"></lingxfiledialog>

<div v-if="method.readonly" v-html="item.valueView"></div>

		  </el-form-item>
		  </el-form></el-col>
		          </el-row>
		</lingxdialog>
</template>

<script setup>
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose  } from 'vue';
	import lingxdialog from "@/components/LingxDialog.vue"
	import lingxgriddialog from "@/views/lingx/dialog/LingxGridDialog.vue"
	import lingxgriddialog2 from "@/views/lingx/dialog/LingxGridDialog2.vue"
	import lingxtreedialog from "@/views/lingx/dialog/LingxTreeDialog.vue"
	import lingxtreedialog2 from "@/views/lingx/dialog/LingxTreeDialog2.vue"
	import lingxfiledialog from "@/views/lingx/dialog/LingxFileDialog.vue"
	import api from '@/hooks/api'
	import {lgxInfo,lgxInfo2,getEntityString,getTextString,getValueString,format1} from '@/hooks/lingx'
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
	function dialogSubmit(){
      if(method.value.confirm){
        if(!confirm(method.value.confirm)){
          return;
        }
      }
      let param={apicode:8002,e:ecode,m:mcode}
      for(let i=0;i<fields.value.length;i++){
        var obj=fields.value[i];
        if(obj.inputType=="checkbox"){
        var temp1="";
        for(let j=0;j<obj.value.length;j++){
          if(obj.value[j])temp1+=obj.value[j]+",";
        }
        if(temp1.length>0)temp1=temp1.substring(0,temp1.length-1);
        param[obj.code]=temp1;
        }else if(typeof obj.value =="object"){
          param[obj.code]=getValueString(obj.value);
        }else{
          param[obj.code]=obj.value;
        }
      }
	  
	  let loadingInstance = ElLoading.service({fullscreen:false,background:"#ced9e7",customClass:"lingx-loading"});
      api.callApi(param,function(json){
        loadingInstance.close();
        if(json.code==1){
          lgxInfo(json.message);
          dialog.value.closeDialog();
          //_this.reload();
          emit("lingxedit",{ecode:ecode,mcode:mcode,id:id})

          if(json.downloadFile){//下载文件
            window.location.href=json.downloadFile;
          }
        }else{
          lgxInfo2(json.message);
        }

       });
      }
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
            if(obj.inputOptions){
               obj.inputOptionsSource=obj.inputOptions;
            }
            if(json.data.method.readonly){//只读处理
              if(typeof obj.value=="object"){
                  obj.valueView=getEntityString(obj.value);
              }else{
                  obj.valueView=obj.value;
              }
              //只读处理结束
            }else{//正常处理
              if(obj.inputType=="checkbox"){
                if(obj.value){
                  if(typeof obj.value =="object"){
                    obj.value=getValueString(obj.value).split(",");
                  }else{
                    obj.value=obj.value.split(",");
                  }

                }else{
                  obj.value=[];
                }
              }else  if(obj.inputType=="radio"){
                  if(typeof obj.value =="object"){
                    obj.value=getValueString(obj.value);
                  }
              }else  if(obj.inputType=="combobox"){
                  if(typeof obj.value =="object"){
                    obj.value=getValueString(obj.value);
                  }
              }
              //正常处理结束
            }

          }
          method.value=json.data.method;
          fields.value=json.data.fields;
         });
	}
	
	defineExpose({openDialog});
	
</script>

<style>
</style>
