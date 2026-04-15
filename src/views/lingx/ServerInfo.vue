<template>
	<div style="background-color: #dfe9f6;width: 100%;height: 100%;padding: 20px;">
		<div style="margin: 0px auto;">
	    <el-row :gutter="20">
	    <el-col :span="20">
	<el-card class="box-card">
	<div class="panel-heading">{{t('el.server.info.title')}}</div>
	    <table class="panel-body table ">
	    <tr><td width="25%">{{t('el.server.info.server_name')}}</td><td width="25%" id="sys1">{{data.sys.computerName}}</td><td width="25%">{{t('el.server.info.os_name')}}</td><td id="sys2">{{data.sys.osName}}</td></tr>
	    <tr><td>{{t('el.server.info.server_ip')}}</td><td id="sys3">{{data.sys.computerIp}}</td><td>{{t('el.server.info.os_arch')}}</td><td id="sys4">{{data.sys.osArch}}</td></tr>
	  </table>
	</el-card>
	</el-col>
	</el-row>
	
	<el-row :gutter="30" style="margin-top:20px;">
	<el-col :span="10">
	<el-card class="box-card">
	<div class="panel-heading">{{t('el.server.cpu.title')}}</div>
	  <table class="panel-body table ">
	  <tr><th width="50%">{{t('el.server.common.prop')}}</th><th>{{t('el.server.common.value')}}</th></tr>
	  <tr><td>{{t('el.server.cpu.core_num')}}</td><td id="cpu1">{{data.cpu.cpuNum}}</td></tr>
	  <tr><td>{{t('el.server.cpu.user_usage')}}</td><td id="cpu2">{{data.cpu.used}} %</td></tr>
	  <tr><td>{{t('el.server.cpu.sys_usage')}}</td><td id="cpu3">{{data.cpu.sys}} %</td></tr>
	  <tr><td>{{t('el.server.cpu.free_usage')}}</td><td id="cpu4">{{data.cpu.free}} %</td></tr>
	</table>
	</el-card>
	</el-col>
	
	<el-col :span="10">
	<el-card class="box-card">
	  <div class="panel-heading">{{t('el.server.mem.title')}}</div>
	  <table class="panel-body table ">
	  <tr><th width="33%">{{t('el.server.common.prop')}}</th><th width="33%">{{t('el.server.mem.title')}}</th><th>JVM</th></tr>
	  <tr><td>{{t('el.server.mem.total')}}</td><td id="mem1">{{data.mem.total}} GB</td><td id="jvm1">{{data.jvm.total}} MB</td></tr>
	  <tr><td>{{t('el.server.mem.used')}}</td><td id="mem2">{{data.mem.used}} GB</td><td id="jvm2">{{data.jvm.used}} MB</td></tr>
	  <tr><td>{{t('el.server.mem.free')}}</td><td id="mem3">{{data.mem.free}} GB</td><td id="jvm3">{{data.jvm.free}} MB</td></tr>
	  <tr><td>{{t('el.server.mem.usage')}}</td><td id="mem4">{{data.mem.usage}} %</td><td id="jvm4">{{data.jvm.usage}} %</td></tr>
	</table>
	</el-card>
	</el-col>
	
	</el-row>
	
	<el-row :gutter="30" style="margin-top:20px;">
	<el-col :span="20">
	<el-card class="box-card">
	  <div class="panel-heading">{{t('el.server.jvm.title')}}</div>
	  <table class="panel-body table ">
	  <tr><td width="25%">{{t('el.server.jvm.jdk_name')}}</td><td id="jdk1">{{data.jvm.name}}</td width="25%"><td width="25%">{{t('el.server.jvm.jdk_version')}}</td><td id="jdk2">{{data.jvm.version}}</td></tr>
	  <tr><td>{{t('el.server.jvm.start_time')}}</td><td id="jdk3">{{data.jvm.startTime}}</td><td>{{t('el.server.jvm.run_time')}}</td><td id="jdk4">{{data.jvm.runTime}}</td></tr>
	
	  <tr><td>{{t('el.server.jvm.home')}}</td><td colspan="3" id="jdk5">{{data.jvm.home}}</td></tr>
	
	  <tr><td>{{t('el.server.jvm.project_path')}}</td><td colspan="3" id="jdk6">{{data.sys.userDir}}</td></tr>
	</table>
	</el-card>
	</el-col>
	</el-row>
	
	
	<el-row :gutter="30" style="margin-top:20px;">
	<el-col :span="20">
	<el-card class="box-card">
	<div class="panel-heading">{{t('el.server.disk.title')}}</div>
	  <table id="disk" class="panel-body table ">
	  <tr><th>{{t('el.server.disk.dir')}}</th><th>{{t('el.server.disk.sys_type')}}</th><th>{{t('el.server.disk.type')}}</th><th>{{t('el.server.disk.total')}}</th><th>{{t('el.server.disk.free')}}</th><th>{{t('el.server.disk.used')}}</th><th>{{t('el.server.disk.usage')}}</th></tr>
	  <tr v-for="(item,index) in data.sysFiles">
	    <td>{{item.dirName}}</td><td>{{item.sysTypeName}}</td><td>{{item.typeName}}</td><td>{{item.total}}</td><td>{{item.free}}</td><td>{{item.used}}</td><td>{{item.usage}}%</td>
	    </tr>
	</table>
	</el-card>
	</el-col>
	</el-row>
	<!--	$("#disk").append("<tr class='delTr'><td>"+disk.dirName+"</td><td>"+disk.sysTypeName+"</td><td>"+disk.typeName+"</td><td>"+disk.total+"</td><td>"+disk.free+"</td><td>"+disk.used+"</td><td>"+disk.usage+"%</td></tr>");
	
	
			$("#jdk1").text(json.jvm.name);
			$("#jdk2").text(json.jvm.version);
			$("#jdk3").text(json.jvm.startTime);
			$("#jdk4").text(json.jvm.runTime);
			$("#jdk5").text(json.jvm.home);
			$("#jdk6").text(json.sys.userDir);
	
	-->
	  </div></div>
</template>

<script setup>
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose  } from 'vue';
	import api from '@/hooks/api'
	import {lgxInfo,lgxInfo2,getEntityString,getTextString,getValueString,format1} from '@/hooks/lingx'
	import { ElLoading } from 'element-plus'
	const emit = defineEmits(['custom-event']);
	import { useI18n } from 'vue-i18n'
	const { t } = useI18n()
	const data=ref({sys:{},cpu:{},mem:{},jvm:{},sysFiles:[]});
	let time1;
	function reloadData(){
          api.callApi({apicode:9032},function(json){
            data.value=json.data;
          })
        }
	onMounted(function(){
		reloadData();
		time1=setInterval(reloadData,5000)
	});
	onUnmounted(function(){
		clearInterval(time1);
	});
</script>

<style scoped="scoped">
  .table{
    width:100%
  }
  .panel-heading{
    color: #0481c4;
    height: 30px;
    line-height: 20px;
  }
  td{
    font-size: 14px;
    line-height: 24px;
  }
  th{
    font-size: 14px;
    text-align: left;
  }
</style>
