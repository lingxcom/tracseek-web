<template>
	<div style="width: 100%;">
			<div  @click="openDialog" style="width: 100%;" class="noselect">
	<el-input placeholder="" readonly v-model="text" >
	    <template #append >{{t("el.choose")}}</template>
	</el-input></div>
	<lingxdialog ref="dialog" :title="ename+'-'+t('el.single')" :scrollbar="false" @confirm="ok">
		<div style="width: 100%;height: 100%;display: flex;">
			<div style="width: 180px;">
				<el-scrollbar height="100%">
				<ul style="height: 100%;padding: 0px;margin: 0px;background-color: #fff;">
				  <li v-for="(item,index) in checkedArray" @click="deleteChecked(index)" 
				  class="checked-item">{{item.text}}</li>
				</ul></el-scrollbar>
			</div>
			<div style="flex-grow: 1;width: 0;">
		<lingxtree ref="tree" :ecode="ecode" @syncename="syncename" :ischecked="true" @lingx-selection-change="oncheck"></lingxtree>
			</div>
			</div>
	</lingxdialog>
	</div>
</template>

<script setup>
	import lingxtree from "@/components/LingxTree.vue"
	import lingxdialog from "@/components/LingxDialog.vue"
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose  } from 'vue';
	import {lgxInfo,getEntityString,getTextString,getValueString,format1} from '@/hooks/lingx'
	import { useI18n } from 'vue-i18n'
	const { t } = useI18n();
	const emit = defineEmits(['update:modelValue'])
	const props = defineProps({
	  ecode: {
	    type: String,
	    default: ""
	  },
	  mcode: {
	    type: String,
	    default: "tree"
	  },
	  modelValue:{
		  type:Array,
		  default:[]
	  },
	  options:{
		  type:Object,
		  default:{}
	  },
	  readonly:{
		  type:Boolean,
		  defalut:false
	  }
	});
	const dialog=ref(null);
	const tree=ref(null);
	const text=ref("");
	const ename=ref("");
	const checkedArray=ref([]);
	let tempValue="";
	function oncheck(item,p2,p3){
        //this.lgxInfo(p2)
            if(p2){
              var textfield=tree.value.getTextField();
                if(!exists(item.id)){
                  checkedArray.value.push({text:item[textfield],value:item.id})
                }else{
                 // lgxInfo("该项已选择，可双击左侧删除选项")
                }
            }else{
              var index=-1;
              for(var i=0;i<checkedArray.value.length;i++){
                if(item.id==checkedArray.value[i].value){
                  index=i;
                  break;
                }
              }

              if(index>=0)deleteChecked(index)
            }
        }
	
	function exists(value){
	  let b=false;
	  if(checkedArray.value)
	  for(let i=0;i<checkedArray.value.length;i++){
	    if(checkedArray.value[i].value==value){
	      b=true;break;
	    }
	  }
	  return b;
	}
	function deleteChecked(index){
	checkedArray.value.splice(index,1);
	      }
	function openDialog(){
		if(props.readonly)return;
		dialog.value.openDialog({title:ename.value+"-"+t('el.multiple'),ecode:props.ecode});
	}
	function syncename(p1){
		ename.value=p1;
	}
	function ok(){
        var textField=tree.value.getTextField();
        tempValue=getValueString(checkedArray.value);
		emit("update:modelValue", tempValue)
        text.value=getTextString(checkedArray.value);//row[textField];
        dialog.value.closeDialog();
	}
	onMounted(function(){
		if(props.modelValue){
			let obj=props.modelValue;
			text.value=getTextString(obj);
			tempValue=getValueString(obj);
			if(tempValue)
			checkedArray.value=props.modelValue;
			else
			checkedArray.value=[];
			emit("update:modelValue", tempValue)
		}
	});
	watch(() => props.modelValue,function(newVal,oldVal){
		let obj=newVal;
		 if(!obj){
		    text.value="";
		 }
		if(typeof obj=="object"){
		    text.value=getTextString(obj);
		    tempValue=getValueString(obj);
			
			if(tempValue)
			checkedArray.value=obj;
			else
			checkedArray.value=[];
		    emit("update:modelValue", tempValue)
		}
	},{deep: true});
</script>

<style scoped="scoped">
	.checked-item{
	  border:0px none;list-style-type:none;height:32px;line-height: 32px;font-size: 14px;width: 100%;text-align: center;background-color: #E6F1FE;color: #3c537e;
	  -webkit-user-select:none;
	     -moz-user-select:none;
	     -ms-user-select:none;
	     user-select:none;
	     overflow: hidden;white-space: nowrap;
	     text-overflow: ellipsis;
	     border-bottom:1px solid #FFFDEF ;
		 cursor: pointer;
	}
</style>
