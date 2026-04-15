<template>
	
  <div style="padding: 20px;background: #dfe9f6;">
<el-row :gutter="40">
  <el-col :span="6">
    <div class="item1">
      <div style="width:49%">
		  <el-icon style="color: rgb(77, 200, 198);"><Histogram /></el-icon>
      </div>
      <div style="width:49%">
        <div class="top-lable">{{t('el.home.total')}}</div>
        <div class="top-number">{{ all }}</div>
      </div>
    </div>
  </el-col>
  <el-col :span="6">
    <div class="item1">
      <div style="width:49%">
		   <el-icon style="color: rgb(67, 161, 243);"><Histogram /></el-icon>
      </div>
      <div style="width:49%">
        <div class="top-lable">{{t('el.home.online')}}</div>
        <div class="top-number">{{ online }}</div>
      </div>
    </div>
  </el-col>
  <el-col :span="6">
    <div class="item1">
       <div style="width:49%">
		   <el-icon style="color: rgb(240, 83, 109);"><Histogram /></el-icon>
      </div>
      <div style="width:49%">
        <div class="top-lable">{{t('el.home.alarm')}}</div>
        <div class="top-number">{{ bj }}</div>
      </div>
    </div>
  </el-col>
  <el-col :span="6">
    <div class="item1">
       <div style="width:49%">
		   <el-icon style="color: rgb(65, 191, 164);"><Histogram /></el-icon>
      </div>
      <div style=" width:49%">
        <div class="top-lable">{{t('el.home.lc')}}</div>
        <div class="top-number">{{ lc }}</div>
      </div>
    </div>
	
  </el-col>
</el-row>

    <!-- 柱状图 -->
    <div class="echart" ref="chart"></div>
    <!-- 曲线图 -->
    <div class="echart" ref="chartLine"></div>
	
  </div>
</template>

<script setup>
	import {ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose,defineAsyncComponent,shallowRef} from 'vue';
	import {useI18n} from 'vue-i18n'
	import api from '@/hooks/api'
	import * as echarts from 'echarts';
	const emit = defineEmits(['custom-event']);
	const {t} = useI18n()
	import {lgxInfo,lgxInfo2,getEntityString,getTextString,getValueString,format1} from '@/hooks/lingx'
	const all=ref(0);
	const online=ref(0);
	const bj=ref(0);
	const lc=ref(0);
	const onlines=ref([]);
	const alarms=ref([]);
	const chart=ref(null);
	const chartLine=ref(null);
	function initCharts(){
		
		  let myChart = echarts.init(chart.value);
		
		  // 车辆在线时间刻度列表
		  let onlineTimeList = onlines.value.map(item=> {return item.date})
		  // 车辆在线数量刻度列表
		  let onlineCountList = onlines.value.map(item=> {return item.count})
		  // 绘制图表
		  myChart.setOption({
		    title: {
				show: false,
		      text: '车辆在线数量统计图',
		      textStyle: {
		        fontSize: 28
		      }
		    },
		    grid: {
		      top: '40px',
		      left: '100px',
		      right: '100px',
			  bottom:'20px',
		      containLabel: true
		    },
		    tooltip: {
		      trigger: 'axis',
		      axisPointer: {
		        type: 'shadow'
		      }
		    },
		    xAxis: [{
		      name: '',
		      type: 'category',
		      // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
		      data: onlineTimeList, //车辆在线时间刻度列表 数据
		      axisTick: {
		        alignWithLabel: true,
		      },
		      nameTextStyle: {
		        color: '#3388ee',
		        fontSize: 16,
		      },
		      axisLabel: {
		        color: '#3388ee',
		        fontSize: 14,
		        margin: 14,
		      }
		    }],
		    yAxis: {
		    name: t('el.home.online1'),
		      nameTextStyle: {
		        color: '#3388ee',
		        fontSize: 16,
		      },
		      axisLabel: {
		        color: '#3388ee',
		        fontSize: 14,
		        borderColor: '#000'
		      },
		
		    },
		    series: [{
		      name: t('el.home.online1'),
		      type: 'bar',
		      // data: [10, 52, 200, 334, 390, 330, 220, 52, 200, 334, 390, 3030],
		      data: onlineCountList,  //车辆在线数量刻度列表数据
		      label: {
		        normal: {
		          show: true, //开启显示
		          position: 'top', //柱形上方
		          textStyle: { //数值样式
		            color: '#000',
		            fontSize: 14,
		          }
		        }
		      }
		    }]
		  });
	}
	function initChartLine(){
		
		let myChart = echarts.init(chartLine.value);
				
		// 车辆在线时间刻度列表
		let onlineTimeList = alarms.value.map(item=> {return item.date})
		// 车辆在线数量刻度列表
		let onlineCountList = alarms.value.map(item=> {return item.count})
		// 绘制图表
		myChart.setOption({
		  title: {
						show: false,
		    text: '车辆报警数量统计图',
		    textStyle: {
		      fontSize: 28
		    }
		  },
		  grid: {
		    top: '40px',
		    left: '100px',
		    right: '100px',
			  bottom:'20px',
		      containLabel: true
		  },
		  tooltip: {
		    trigger: 'axis',
		    axisPointer: {
		      type: 'shadow'
		    }
		  },
		  xAxis: [{
		    name: '',
		    type: 'category',
		    // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
		    data: onlineTimeList, //车辆在线时间刻度列表 数据
		    axisTick: {
		      alignWithLabel: true,
		    },
		    nameTextStyle: {
		      color: '#3388ee',
		      fontSize: 16,
		    },
		    axisLabel: {
		      color: '#3388ee',
		      fontSize: 14,
		      margin: 14,
		    }
		  }],
		  yAxis: {
		  name: t('el.home.alarm1'),
		    nameTextStyle: {
		      color: '#3388ee',
		      fontSize: 16,
		    },
		    axisLabel: {
		      color: '#3388ee',
		      fontSize: 14,
		      borderColor: '#000'
		    },
				
		  },
		  series: [{
		    name: t('el.home.alarm1'),
		    type: 'line',
			smooth: true, 
		    // data: [10, 52, 200, 334, 390, 330, 220, 52, 200, 334, 390, 3030],
		    data: onlineCountList,  //车辆在线数量刻度列表数据
			
		    label: {
		      normal: {
		        show: true, //开启显示
		        position: 'top', //柱形上方
		        textStyle: { //数值样式
		          color: '#000',
		          fontSize: 14,
		        }
		      }
		    }
		  }]
		});
	}
	onMounted(()=>{
		api.callApi({
        apicode: 1100
      }, json => {
        all.value = json.data.all; //总用户数
        online.value = json.data.online; //当天注册数
        lc.value = json.data.lc; //当天登录数
        bj.value = json.data.bj; //总群组
        onlines.value = json.data.onlines; //月每天在线数
        alarms.value=json.data.alarms;
        initCharts();
        initChartLine()
      });
	});
</script>

<style scoped="scoped">
	.item1 {
	   display:flex; align-items:center;
	   margin: 0px;
	   background-color: #fff;
	   height: 110px;
	
	 }
	 .item1 div i{
	   text-align: center;
	  font-size: 70px;
	 }
	.item1 div {
	   text-align: center;
	 }
	  .top-lable {
	         color: #aaa;
	         font-weight: bold;
	         font-size: 18px;
	         line-height: 24px;
	       }
	
	       .top-number {
	         color: #333;
	         font-weight: bold;
	         font-size: 24px;
	         line-height: 36px;
	         text-align: center;
	       }
	
	
	 .echart {
	   height: 320px;
	   background: #fff;
	   padding: 20px 20px 0;
	   margin-top: 20px;
	 }
</style>
