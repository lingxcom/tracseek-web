<template>
	<div v-if="style==1" style="width: 100%;height: 100%;display: flex;flex-direction: column;">
		<div style="width: 100%;height: 50px;display: flex;background-color:#435d8d ;" class="noselect">
			<div @click="reloadPage" style="width: 280px;height: 50px;line-height: 50px;margin: 0px 20px;color:#fff;font-size: 16px;cursor: pointer;">{{sysName?sysName:$t("el.system.name")}}
			</div>
			<div v-if="mainComment" style="width: 150px;color: #e1e1e1;font-size: 12px;line-height: 20px;margin-top: 4px;"  v-html="mainComment"></div>
			<div style="flex-grow: 1;width: 0;">
					<el-menu style="border: 0px none;width: 100%;" v-if="menus.length>0"
					    :default-active="activeIndex"
					    mode="horizontal"
						  background-color="#435d8d"
						  class="menu-right-all"
						  text-color="#fff"
						  active-text-color="#fff"
					    @select="handleSelect">
					         <el-sub-menu v-for="(item,index) in menus" :key="index" :index="index">
					                   <template #title>
										   <el-icon v-if="item.icon">
										       <component :is="Icons[item.icon]" />
										     </el-icon>
					                     <span>{{item.title}}</span>
					                   </template>
					                     <el-menu-item class="noselect" v-for="child in item.children" :key="child.id" :index='child.index' >{{child.title}}</el-menu-item>
					                 </el-sub-menu>
							<el-sub-menu index="100000">
							          <template #title>
										  <span class="user-title-inline">
										    <el-icon><Avatar /></el-icon>
										    <span>{{userName}}</span>
										    <span v-if="unread>0" class="user-badge-inline">{{unread}}</span>
										  </span>
							          </template>
									    <el-menu-item class="noselect" @click="handleSelect('/main/home')" >{{$t("el.main.home")}}</el-menu-item>
									     <el-menu-item class="noselect" @click="handleSelect('/main/grid?ecode=tlingx_message&mcode=grid')" >{{ $t("el.main.system_messages") }} <span v-if="unread>0" class="user-badge-inline" style="margin-left: 6px;">{{unread}}</span></el-menu-item>
										<el-menu-item class="noselect" @click="changeStyle" >{{$t("el.main.style")}}</el-menu-item>
							            <el-menu-item class="noselect" @click="editUser" >{{$t("el.main.userinfo")}}</el-menu-item>
							            <el-menu-item class="noselect" @click="editPassword" >{{$t("el.main.password")}}</el-menu-item>
							            <el-menu-item class="noselect" @click="logout" >{{$t("el.main.logout")}}</el-menu-item>
							        </el-sub-menu>
					  </el-menu>
			</div>
		</div>
		<div style="flex-grow: 1;background-color: #dfe9f6;height: 0;overflow: auto;">
			
			       <router-view v-slot="{ Component }">
			         <keep-alive>
			           <component :is="Component" />
			         </keep-alive>
			       </router-view>
			<!--
			<router-view/>-->
		</div>
		<lingxeditdialog ref="editdialog"></lingxeditdialog>
	</div>
	<div v-if="style==2" style="width: 100%;height: 100%;display: flex;flex-direction: column;">
		<div style="width: 100%;height: 50px;display: flex;background-color:#435d8d ;" class="noselect">
			<div @click="reloadPage" style="width: 280px;height: 50px;line-height: 50px;margin: 0px 20px;color:#fff;font-size: 16px;cursor: pointer;">{{sysName?sysName:$t("el.system.name")}}
			</div>
			<div v-if="mainComment" style="width: 150px;color: #e1e1e1;font-size: 12px;line-height: 20px;margin-top: 4px;"  v-html="mainComment"></div>
			<div style="flex: 1;flex-grow: 1;width: 0;">
					<el-menu style="border: 0px none;width: 100%;"
					    :default-active="activeIndex"
					    mode="horizontal"
						  background-color="#435d8d"
						  class="menu-right-all"
						  text-color="#fff"
						  active-text-color="#fff"
					    @select="handleSelect"
					  >
							<el-sub-menu index="100000">
							          <template #title>
										 <span class="user-title-inline">
										   <el-icon><Avatar /></el-icon>
										   <span>{{userName}}</span>
										   <span v-if="unread>0" class="user-badge-inline">{{unread}}</span>
										 </span>
							          </template>
									    <el-menu-item class="noselect" @click="handleSelect('/main/home')" >{{$t("el.main.home")}}</el-menu-item>
									     <el-menu-item class="noselect" @click="handleSelect('/main/grid?ecode=tlingx_message&mcode=grid')" >{{ $t("el.main.system_messages") }} <span v-if="unread>0" class="user-badge-inline" style="margin-left: 6px;">{{unread}}</span></el-menu-item>
									    <el-menu-item class="noselect" @click="changeStyle" >{{$t("el.main.style")}}</el-menu-item>
							            <el-menu-item class="noselect" @click="editUser" >{{$t("el.main.userinfo")}}</el-menu-item>
							            <el-menu-item class="noselect" @click="editPassword" >{{$t("el.main.password")}}</el-menu-item>
							            <el-menu-item class="noselect" @click="logout" >{{$t("el.main.logout")}}</el-menu-item>
							        </el-sub-menu>
					  </el-menu>
			</div>
		</div>
		<div style="flex-grow: 1;background-color: #dfe9f6;height: 0;display: flex;">
			<layout2 layoutid="Main_Layout2" leftwidth="200">
				<template #left>
					<div style="width: 100%;height: 100%;background-color: #435d8d;" class="noselect">
						<el-scrollbar style="height: 100%;">
					<el-menu class="custom-menu"
					@select="handleSelect"
					  background-color="#435d8d"
					   text-color="#fff"
					   active-text-color="#fedd92"
					   style="border: 0px none;"
					   :collapse="isCollapse"
					   :collapse-transition="false"
					   :unique-opened="true"
                        :default-openeds="[0]" 
					 >
					<el-sub-menu v-for="(item,index) in menus" :key="index" :index="index">
					          <template #title>
								  <el-icon v-if="item.icon">
								      <component :is="Icons[item.icon]" />
								    </el-icon>
					            <span>{{item.title}}</span>
					          </template>
					            <el-menu-item class="noselect" v-for="child in item.children" :key="child.id" :index='child.index' >{{child.title}}</el-menu-item>
					        </el-sub-menu>
					    </el-menu>
						</el-scrollbar>
						</div>
				</template>
				<div style="width: 100%;height: 100%;background-color: #dfe9f6;overflow: auto;">
			       <router-view v-slot="{ Component }">
			         <keep-alive>
			           <component :is="Component" />
			         </keep-alive>
			       </router-view>
				</div>
			</layout2>
			
		</div>
		<lingxeditdialog ref="editdialog"></lingxeditdialog>
	</div>
</template>

<script setup>
import { ref, computed,onMounted,onUnmounted  } from 'vue';
 import api from '@/hooks/api'
 import {lgxInfo} from '@/hooks/lingx'
 import { useRoute, useRouter } from "vue-router";
 import { useI18n } from 'vue-i18n'
import lingxeditdialog from "@/views/lingx/dialog/LingxEditDialog.vue"
import layout2 from "@/components/LingxLayout2.vue";
import { ElNotification } from 'element-plus'
import * as Icons from '@element-plus/icons-vue'
 const { t } = useI18n()
const sysName=ref(""),mainComment=ref("");
const router = useRouter();
const activeIndex=ref("idx_0");
const menus=ref([]);
const key=ref("/main/home");
const userName=ref("");
const editdialog=ref(null);
const style=ref(1),unread=ref(0);
const isCollapse=ref(false),isAuth=ref(false);
let interaval1;
if(localStorage.getItem("MainStyle"))style.value=localStorage.getItem("MainStyle")-0;
function changeStyle(){
	if(style.value==1)
	style.value=2;
	else style.value=1;
	
	localStorage.setItem("MainStyle",style.value+"");
}
function reloadPage(){
	window.location.reload()
}
function editUser(){
	editdialog.value.openDialog({ecode:"tlingx_user",mcode:"editself",id:sessionStorage.getItem("userid"),title:t('el.user.editself')});
}
function editPassword(){
	editdialog.value.openDialog({ecode:"tlingx_user",mcode:"editpassword",id:sessionStorage.getItem("userid"),title:t('el.user.editpassword')});
}
function handleSelect(key){
	router.push(key);
}
function callback(){
	
}
function toAuthPage(){
		router.push("/main/authinfo?ecode=tlingx_tools&mcode=authinfo")
}
function logout(){
	router.push("/login")
}
function showNotify(msg){
        var content = msg.content;
             ElNotification({
                 message: content,
                 type: 'warning',
               })
}

	sysName.value=sessionStorage.getItem("sysName");
	userName.value=sessionStorage.getItem("userName");
	isAuth.value="true"==sessionStorage.getItem("auth");
	api.callApi({apicode:8004},function(json){
		menus.value=json.data;
	});
onMounted(function(){
	
	if(sysName.value){
		document.title=sysName.value;
	}else{
		document.title=t('el.system.name');
	}
	mainComment.value=sessionStorage.getItem("mainComment");
	
	interaval1=setInterval(function(){
	   api.callApi({apicode:8008},function(json){
		   unread.value=json.unread;
	     if(json.data&&json.data.length>0){
	       showNotify(json.data[0]);
	     }
	   });
	 }, 10*1000);
});
onUnmounted(()=>{
	if(interaval1)clearInterval(interaval1)
});
</script>

<style scoped="scoped">
	.el-menu--horizontal {
	  --el-menu-horizontal-height: 50px;
	}
:deep(.el-sub-menu.is-active) {
  .el-sub-menu__title.el-tooltip__trigger.el-tooltip__trigger {
    border-bottom: 0px none !important;
  }
}
:deep(.el-sub-menu__title.el-tooltip__trigger.el-tooltip__trigger) {
  border-bottom: 0px none !important;
}

:deep(.el-menu--vertical .el-menu--inline) {
  background-color: #334a6d;
}
.custom-menu {
  --el-menu-hover-bg-color: #435d8d  !important;
}
.el-menu-item{
	font-family: Microsoft YaHei, 微软雅黑, Microsoft JhengHei, 华文细黑, STHeiti, MingLiu !important;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.menu-right-all {
  display: flex;
  justify-content: flex-end;
}
.user-title-inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.user-badge-inline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 5px;
  border-radius: 10px;
  background: #f56c6c;
  color: #fff;
  font-size: 12px;
  line-height: 1;
  box-sizing: border-box;
}
</style>
