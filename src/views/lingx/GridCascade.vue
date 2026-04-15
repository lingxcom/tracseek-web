<template>
	<div style="width: 100%;height: 100%;display: flex;flex-direction: column;">
		<div style="width: 100%;height: 50%;">
			<lingxgrid ref="grid" @open-dialog="openDialog" @dblclick="openViewDialog2" @syncename="syncename" :ecode="ecode" @cascade="initCascade" @changeRow="changeRow" iscontextmenu isbutton></lingxgrid>
		    <lingxeditdialog ref="editdialog" @lingxedit="reloadGrid"></lingxeditdialog>
			<lingxviewdialog ref="viewdialog" ></lingxviewdialog>
		    <lingxasyncdialog ref="asyncdialog" @lingxedit="reloadGrid"></lingxasyncdialog>
		</div>
		<div style="flex-grow: 1;height: 0px;">
			       <el-tabs  v-model="activeName"  type="border-card" style="height:100%;border-left: 0px none;border-right: 0px none">
			           <el-tab-pane v-for="(item,index) in cascades" :key="index" :label="item.name" :name="item.entity" style="height:100%;padding:0px;">
			             <lingxgrid :ref="(el:refItem) => handleSetMap(el, item)"
			             :ecode="item.entity"
			             :queryfilter="item.queryFilter"
			             @open-dialog="openDialog2($event,item.entity,item.name)" @dblclick="openViewDialog2($event,item.entity,item.name)" :isoperaterow="true" :iscontextmenu="true"  :isbutton="true"  ></lingxgrid>
			           </el-tab-pane>
			
			         </el-tabs>
		</div>
	</div>
</template>

<script setup>
	import lingxgrid from "@/components/LingxGrid.vue"
	import lingxeditdialog from "@/views/lingx/dialog/LingxEditDialog.vue"
	import lingxviewdialog from "@/views/lingx/dialog/LingxViewDialog.vue"
	import lingxasyncdialog from "@/views/lingx/dialog/LingxAsyncDialog.vue"
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose  } from 'vue';
	const props = defineProps({
	  ecode: {
	    type: String,
	    default: ""
	  },
	  mcode: {
	    type: String,
	    default: "grid"
	  }
	});
	const grid=ref(null);
	const refMap = ref({});
	const handleSetMap = (el, item) => {
	  if (el) {
	    refMap.value[`${item.entity}_grid`] = el;
	  }
	};
	const activeName=ref("first"),editdialog=ref(null);
	const cascades=ref([]);
	const viewdialog=ref(null);
	const asyncdialog=ref(null);//异步加载Vue
	let currentRow=null;
	const initCascade=(p1)=>{
		cascades.value=(p1)
		activeName.value=p1[0].entity;
	}
	let ename="";
	function syncename(p1){
		ename=p1;
	}
	function reloadGrid(options){
		console.log(options)
		if(options.ecode==props.ecode){
			grid.value.reload();
		}else{
			refMap.value[options.ecode+"_grid"].reload();
		}
	}
	const changeRow=(row)=>{
		if(!row)return;
        currentRow=row;
        for(let i=0;i<cascades.value.length;i++){
          let obj=cascades.value[i];
          //this.$set(obj.queryFilter,obj.refField,row.id)
          obj.queryFilter[obj.refField]=row.id;
          //this.$refs[obj.entity+'_grid'][0].reload();
        }
	}
	const openDialog=(options)=>{
		let p1=options.method;
		let p2=options.id;
		if(p1.viewUri)
		asyncdialog.value.openDialog(options);
		else
		editdialog.value.openDialog({ecode:props.ecode,mcode:p1.code,id:p2,title:p1.text+"-"+ename});
	}
	const openDialog2=(options,entity,name)=>{
		//console.log(options)
		let p1=options.method;
		let p2=options.id;
		let queryfilter=options.queryfilter;
		let data=options.data;
		editdialog.value.openDialog({ecode:entity,mcode:p1.code,id:p2,title:p1.text+"-"+name,extparam:queryfilter});
	}
	const openViewDialog2=(options,ecode2,ename2)=>{
		let data=options.data;
		if(data)
		viewdialog.value.openDialog({ecode:ecode2||props.ecode,mcode:"view",id:data.id,title:ename2||ename});
	}
</script>

<style scoped="scoped">
	:deep(.el-tabs__item.is-active) {
	  background-color: #dae5f3  !important;
	  color: #15498b !important;
	}
	
	:deep(.el-tabs .el-tabs__content){
		padding: 0px;
	}
</style>
