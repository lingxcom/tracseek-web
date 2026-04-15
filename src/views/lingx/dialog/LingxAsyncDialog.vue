<template>
	<lingxdialog ref="dialog" @confirm="dialogSubmit" :title="title" :scrollbar="false" :type="type">
		 <component ref="myref" :id="id" :is="myComponent" @setitle="setitle" @close="closeDialog" @lingxedit="lingxeditFun" @setype="setType"></component>
	</lingxdialog>
</template>

<script setup>
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose,defineAsyncComponent,shallowRef  } from 'vue';
	import lingxdialog from "@/components/LingxDialog.vue"
	//import test from '@/views/test/Test.vue'
	const viewComponents = import.meta.glob('@/views/**/*.vue');
	//console.log(viewComponents)
	const dialog=ref(null);
	const myref=ref(null);
	const myComponent = shallowRef(null);
	const title=ref("");
	const id=ref("");
	const type=ref(1);
    const emit = defineEmits(['custom-event']);
	function lingxeditFun(){
		emit("lingxedit");
	}
	function openDialog(options){
		let p1=options.method;
		let p2=options.id;
		//let path='../../../views/'+p1.viewUri;
		//let asyncComp = defineAsyncComponent(() => import(path))
		let componentPath = '/src/views/'+p1.viewUri;
		//componentPath='/src/views/lingx/role/MenuAuthDialog.vue';
		//console.log(componentPath)
		const componentLoader = viewComponents[componentPath];
		    
		    if (!componentLoader) {
		        console.error('组件未找到:', componentPath);
		        return;
		    }
		
		    // 定义异步组件
		    const asyncComp = defineAsyncComponent(componentLoader);
		    myComponent.value = asyncComp;
		id.value=p2;
		dialog.value.openDialog({title:""});
		//if(myref)
	}
	
	function closeDialog(){
		dialog.value.closeDialog();
	}
	function setType(p1){
		type.value=p1;
	}
	function dialogSubmit(){
		console.log(myComponent.value)
        //emit("lingxedit",{ecode:ecode,mcode:mcode,id:id})
		myref.value.ok();
	}
	function setitle(temp){
		title.value=temp;
	}
	
	defineExpose({openDialog,closeDialog});
</script>

<style>
</style>
