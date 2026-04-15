<template>
<div ref="div0" style="padding: 0px;width: 100%;height: 100%;position: relative;overflow: hidden;">
<div v-for="(item,index) in list" class="div1" :style="{width:width+'px',height:height+'px',top:(parseInt(index/lineNum)*(height+2)+2)+'px',left:((index%lineNum)*(width+2)+2)+'px'}">
<LingxCarMapGroup :mapid="'map'+index" v-if="item.tids.length>0" :tids="item.tids" @closewin="remove(index)"></LingxCarMapGroup>
<div v-if="item.tids.length==0" style="display: flex;position: relative;justify-content: center;align-items:center; height: 100%;cursor: pointer;" @click="add(index)">
<el-icon style="font-size: 86px;color: #0077AA;"><Plus /></el-icon>
</div>
</div>
<CarsDialog ref="carsDialog" @lingxchange="setTids"></CarsDialog>
</div>
</template>

<script setup>
  import { ref, computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose,watch   } from 'vue';
  import {lgxInfo,lgxInfo2,distance,timenum,formatDatetime,timeString,getRotation,JSONToExcelConvertor} from '@/hooks/lingx'
  import CarsDialog from "@/views/jt808/dialog/CarsDialog.vue"
  import LingxCarMapGroup from "@/components/LingxCarMapGroup.vue"
  import { useRouter } from "vue-router";
  const router = useRouter();
  const lineNum=ref(3);
  const div0=ref();
  const list=ref([{tids:[]},{tids:[]},{tids:[]},{tids:[]},{tids:[]},{tids:[]},{tids:[]},{tids:[]},{tids:[]}]);
  const cindex=ref(0);
  const carsDialog=ref();
  const width=ref(0),height=ref(0);
  function remove(index){
  list.value[index].tids=[];
  localStorage.setItem("LingxCarMapGroup",JSON.stringify(list.value));
  }
  function add(index){
    cindex.value=index;
    carsDialog.value.openDialog();
  }
  
  function setTids(tids){
  let arr=[];
  for(let i=0;i<tids.length;i++){
    arr.push(tids[i].value);
  }
   list.value[cindex.value].tids=arr;

  localStorage.setItem("LingxCarMapGroup",JSON.stringify(list.value));
  }
  onMounted(function(){
	  let temp=localStorage.getItem("LingxCarMapGroup")
	  if(temp){
	    list.value=JSON.parse(temp);
	  }
	  let num=lineNum.value;
	  let maxwidth=div0.value.clientWidth;
	  let maxheight=div0.value.clientHeight;
	  width.value=maxwidth/num-3;
	  height.value=maxheight/num-3;
	  
	  
  });
  
  const handleResize = () => {
    let num=lineNum.value;
    let maxwidth=div0.value.clientWidth;
    let maxheight=div0.value.clientHeight;
    width.value=maxwidth/num-3;
    height.value=maxheight/num-3;
    };
   
    // 添加resize事件监听器
    window.addEventListener('resize', handleResize);
   
    // 清理函数，用于移除事件监听器
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });
</script>

<style scoped="scoped">
	.div1{
		position: absolute;margin: 0px;
		border: #99bbe8 1px solid;
	}
</style>
