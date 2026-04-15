<template>
	<el-dialog
	 append-to-body
	    v-model="visible"
	    title="Tips" 
	    draggable
	    overflow
		:fullscreen="fullscreen"
		:width="fullscreen ? '100%' : '800px'"
		:show-close="false"
		:close-on-click-modal="false"
		class="lingxdialog"
	  >
		<template #header="{ close, titleId, titleClass }">
	        <div class="lingxheader noselect" @dblclick="fullscreen=!fullscreen">
	         {{title2}}
			 
			 <div class="lingxclose"   @click="closeDialog">
				 <el-icon><Close /></el-icon>
			 </div>
			 <div class="lingxfullscreen" @click="fullscreen=!fullscreen" >
			 				 <el-icon v-if="!fullscreen"><FullScreen /></el-icon>
							 <el-icon v-if="fullscreen"><CopyDocument /></el-icon>
			 </div>
	        </div>
	    </template>
	  <template #default>
		  <div style="width: 100%;height: 100%;display: flex;flex-direction: column-reverse;">
			  <div class="lingxfooter">
				 <el-button type="primary" @click="confirm" v-if="type==1" size="large">
				   {{confirmName||t("el.submit")}}
				 </el-button>
				 <el-button @click="closeDialog"  v-if="type==1" size="large"> {{t("el.canel")}}</el-button>
				 <el-button @click="closeDialog"  v-if="type==2" size="large"> {{t("el.close")}}</el-button>
				 
			   </div>
			   <div style="height: 0;flex-grow: 1;">
				   	<el-scrollbar v-if="scrollbar" style="height: 100%;">
				   		  <slot></slot>
				   		</el-scrollbar>
				   		<div v-else style="height: 100%;">
				   		  <slot></slot>
				   		</div>
			   </div>
		  </div>
	  </template>
	  </el-dialog>
</template>

<script setup>
	import { ref,watch, computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose   } from 'vue';
	import { useI18n } from 'vue-i18n'
	const { t } = useI18n();
    const emit = defineEmits(['custom-event']);
	const props = defineProps({
	  scrollbar: {
	    type: Boolean,
	    default: true
	  },
	  title:{
		  type:String,
		  default:""
	  },
	  confirmName:{
	  		  type:String,
	  		  default:""
	  },
	  type:{
		  type:Number,
		  default:1//1是确定和取消，2是关闭
	  }
	});
	const visible=ref(false);
	const fullscreen=ref(false);
	const title2=ref("");
	function openDialog(options){
		visible.value=true;
		if(options.title)title2.value=options.title;
	}
	function closeDialog(){
		visible.value=false;
		emit("close");
	}
	function confirm(){
		emit("confirm");
	}
	watch(() => props.title,(newVal)=>{
		title2.value=newVal
	});
	defineExpose({openDialog,closeDialog});
</script>

<style>
	.el-dialog__body{
		flex-grow: 1;height:0;
	}
	.lingxdialog{
		padding: 0px;
		background-color: #dfe9f6;
		height: 480px;
		display: flex;
		flex-direction: column;
	}
	.el-dialog__header{
		height: 56px !important;
	}
	.lingxheader{
		padding-left: 20px;
		height: 56px;
		line-height: 54px;
		background-color: #ced9e7;
		border-top-right-radius: 5px;
		border-top-left-radius:5px;
		border-bottom: #99bbe8 solid 1px ;
	}
	.lingxbody{
		width: 100%;height: 420px;padding: 0px 0px;overflow: hidden;
	}
	
	.lingxfooter{
		padding-right:20px;
		height: 66px;
		line-height: 60px;
		background-color: #ced9e7;
		border-bottom-right-radius: 5px;
		border-bottom-left-radius: 5px;
		text-align: right;
	}
	.lingxfullscreen{
		float: right;cursor: pointer;margin-right: 10px;
	}
	.lingxfullscreen:hover{
		color: #f1f1f1;
	}
	.lingxclose{
		float: right;cursor: pointer;margin-right: 10px;
	}
	.lingxclose:hover{
		color: orangered;
	}
</style>
