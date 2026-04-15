<template>
	<div @mousemove="mousemove" @mouseup="mouseup"  style="width: 100%;height: 100%;background-color:#F2F2F2;display: flex;">
		<div ref="left" style="background-color: #FFFFFF;overflow: hidden;" :style="{width:leftWidth+'px'}">
			<slot name="left"></slot>
		</div>
		<div  @mousedown="mousedown(1,$event)"  @mouseup="mouseup"  style="width:8px;background-color: #dfe9f6;cursor: col-resize;;">
			<div @click="toggleLeft"  @mousedown.stop="emptyFun" :class='{"left":leftWidth>0,"right":leftWidth==0}' style="width: 8px;height: 48px;background-color: #435d8d;cursor: pointer;position:relative;top:50%;margin-top: -24px;"></div>
		</div>
		<div style="flex: 1;flex-grow: 1;display: flex;flex-direction:column-reverse;width:0">
			<div style="background-color: #FFFFFF;overflow: hidden;" :style="{height:bottomHeight+'px'}" >
				<slot name="bottom"></slot>
			</div>
		    <div @mousedown="mousedown(2,$event)"  @mouseup="mouseup" style="height:8px;background-color: #dfe9f6;cursor: row-resize;">
				<div style="height: 8px;width: 96px;background-color: #435d8d;position:relative;left:50%;margin-left: -48px;display: flex;">
					<div @click="toTop" @mousedown.stop="emptyFun" style="flex:1;background-image: url(../static/images/splitter/mini-top.png);cursor: pointer;"></div>
					<div @click="toBottom" @mousedown.stop="emptyFun" style="flex:1;background-image: url(../static/images/splitter/mini-bottom.png);cursor: pointer;"></div>
				</div>
			</div>
			<div v-show="isShowCenter" style="flex-grow: 1;background-color: #FFFFFF;overflow: hidden;">
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed,onMounted  } from 'vue';
const leftWidth=ref(300);
const bottomHeight=ref(200);
const left=ref(null);
const isShowCenter=ref(true);
let type=0,temp=0,temp2=0,leftMargin=0;

//onMounted 优先级小于setup 所以移出来了
leftWidth.value=localStorage.getItem("layoutWidth")||300;
bottomHeight.value=localStorage.getItem("bottomHeight")||200;
localStorage.setItem("layoutWidth",leftWidth.value)
localStorage.setItem("bottomHeight",bottomHeight.value)
		
function emptyFun(){}
function mousedown(value,e){
	leftMargin=left.value.getBoundingClientRect().left;
	type=value;
	if(type==1)
	temp=e.x;
	else if(type==2){
		temp=e.y;
	temp2=bottomHeight.value-0;
	}
}
function mouseup(){
	type=0;
}
function mousemove(e){
	if(type==1){
		leftWidth.value=e.x-4-leftMargin;
		localStorage.setItem("layoutWidth",leftWidth.value)
	}else if(type==2){
		bottomHeight.value=temp2+(temp-e.y);
		localStorage.setItem("bottomHeight",bottomHeight.value)
		isShowCenter.value=true;
	}
	
}
function toggleLeft(){
	if(leftWidth.value==0){
		leftWidth.value=localStorage.getItem("layoutWidth")||300;
	}else{
		leftWidth.value=0;
	}
}
function toBottom(){
	if((bottomHeight.value-0)>(localStorage.getItem("bottomHeight")-0)){
		bottomHeight.value=localStorage.getItem("bottomHeight")||200;
	}else {
		bottomHeight.value=0;
	}
	isShowCenter.value=true;
}

function toTop(){
	if((bottomHeight.value-0)==0){
		 bottomHeight.value=localStorage.getItem("bottomHeight")||200;
	}else if((bottomHeight.value-0)==(localStorage.getItem("bottomHeight")-0)){
		isShowCenter.value=false;
		bottomHeight.value=left.value.offsetHeight-8;
	}
}
 onMounted(function(){
	
 });
</script>

<style scoped="scoped">
	.left{
		background-image: url(../static/images/splitter/mini-left.png);
	}
	.right{
		background-image: url(../static/images/splitter/mini-right.png);
	}
</style>
