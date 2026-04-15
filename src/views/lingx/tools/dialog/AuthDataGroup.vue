<template>
<div style="border-top: #AAAAAA 1px solid;border-left: #AAAAAA 1px solid;">
    <el-button size="small" plain type="success" style="margin-left:0px ;" @click="addGroup">添加分组</el-button>
    <el-button size="small" plain type="primary" style="margin-left:0px ;" @click="addCondi">添加条件</el-button>
    <el-button size="small" plain type="danger"  style="margin-left:0px ;" @click="delGroup">删除分组</el-button>
    <ul v-for="(item,index) in list" style="margin: 0px;padding-left: 10px;" >
      <li v-if="item.type=='op'" style="list-style-type:none;">
        <el-radio v-model="item.op" label="and">and</el-radio>
        <el-radio v-model="item.op" label="or">or</el-radio>
      </li>
      <li v-if="item.type=='group'" style="list-style-type:none;">
        <AuthDataGroup :list="item.group" :parentIndex="index" @delgroup="delGroupSub" :left="left" :op="op" :right="right"></AuthDataGroup>
      </li>
      <li v-if="item.type=='condi'" style="list-style-type:none;">
        <select v-model="item.left">
          <option value="">请选择</option>
          <option v-for="(item,index) in left" :value="item.value">{{item.text}}</option>
        </select>
        <select v-model="item.op">
          <option v-for="(item,index) in op" :value="item.value">{{item.text}}</option>
        </select>
        <select v-model="item.right">
          <option value="">请选择</option>
          <option v-for="(item,index) in right" :value="item.value">{{item.text}}</option>
        </select>
         <el-button size="small" plain type="danger" style="margin-left:0px ;" @click="delCondi(index)">删</el-button>
      </li>
    </ul>
  </div>
</template>

<script setup>
	import {ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose,defineAsyncComponent,shallowRef} from 'vue';
	import {useI18n} from 'vue-i18n'
	import api from '@/hooks/api'
	const emit = defineEmits(['custom-event']);
	const {t} = useI18n();
	const props = defineProps({
	  parentIndex:{type:Number,default:0},
	  list:{type:Array,default:()=>[]},
	  left:{type:Array,default:()=>[]},
	  op:{type:Array,default:()=>[]},
	  right:{type:Array,default:()=>[]}
	});
	//const list=ref(props.list);

    function addGroup(){
      props.list.push({type:"group",group:[{type:"op",op:"and"}]})
    }
    function addCondi(){
      props.list.push({type:"condi",left:"",op:"=",right:""})
    }
    function delGroup(){
      emit("delgroup",props.parentIndex)
    }
    function delCondi(idx){
      props.list.splice(idx,1);
    }
    function delGroupSub(idx){
       props.list.splice(idx,1);
    }
</script>

<style>
</style>
