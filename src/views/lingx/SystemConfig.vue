<template>
<div style="background-color: #fff;width: 100%;height: 100%;padding: 10px;overflow: auto;">
  <table width="100%" style="border-spacing: 0;border-collapse: collapse;">
    <tr class="clsf9f9f91">
      <td width="200"><b>{{t('el.name')}}</b></td> <td width="600"><b>{{t('el.value')}}</b></td> <td><b>{{t('el.remark')}}</b></td>
    </tr>
    <tr v-for="(item,index) in tableData" :class="'clsf9f9f9'+(index%2)">
      <td>{{index+1}}. {{item.name}}</td>
      <td>
        <div style="display: inline-block;" v-if="item.type=='text'">
          <el-input  v-model="data[item.key1]"  style="width: 500px;"  ></el-input>
        </div>
        <div style="display: inline-block; margin-left: 5px;" v-if="item.type=='text'">
          <el-button @click="save(item.key1)"  type="primary" plain>{{t('el.save')}}</el-button>
        </div>
        <div style="display: inline-block;" v-if="item.type=='textarea'">
          <el-input type="textarea"   v-model="data[item.key1]" style="width: 500px;" ></el-input>
        </div>
        <div style="display: inline-block; height: 100%;vertical-align: top; margin-left: 5px;" v-if="item.type=='textarea'">
          <el-button @click="save(item.key1)"  type="primary" plain>{{t('el.save')}}</el-button>
        </div>
        <div v-if="item.type=='switch'">
          <el-switch  
          @change="save(item.key1)"
            v-model="data[item.key1]"
            active-color="#13ce66"
            inactive-color="#ff4949"></el-switch>
        </div>

      </td>
      <td>{{item.remark}}</td>
    </tr>
  </table>
</div>
</template>

<script setup>
	import { ref, computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose,watch   } from 'vue';
	import {lgxInfo,lgxInfo2,distance,timenum,formatDatetime,timeString,getRotation,JSONToExcelConvertor} from '@/hooks/lingx'
	import layout2 from "@/components/LingxLayout2.vue";
	import cartree from "@/components/LingxCarTree.vue"
	import api from '@/hooks/api';
	import { useI18n } from 'vue-i18n'
	const { t } = useI18n()
	const data=ref({});
	const tableData=ref([]);
	
	function save(key){
        api.callApi({apicode:9033,method:"save",key:key,value:data.value[key]},function(json){
          lgxInfo(json.message );
        })
      }
	  
	onMounted(function(){
		api.callApi({apicode:9033},function(json){
		  tableData.value=json.list;
		  data.value=json.data;
		})
	});
</script>

<style scoped="scoped">
  tr.clsf9f9f91{
    background-color: #f9f9f9;
  }
  td{
        padding: 8px;
        line-height: 1.42857143;
        vertical-align: top;
        border-top: 1px solid #ddd;
        font-size: 14px;
            font-family: "Helvetica Neue", "Luxi Sans", "DejaVu Sans", Tahoma, "Hiragino Sans GB", STHeiti, "Microsoft YaHei";
  }
</style>
