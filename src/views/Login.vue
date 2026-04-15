<template>
  <div style="width: 100%;height: 100%;display: flex;flex-direction: column;">
	  <div style="height:80px;"><div style="width: 1000px; margin: 0 auto;display: flex;">
	  <div style="font-size: 24px;font-weight: 700;line-height: 80px;flex: 1;">{{ data.name?data.name:$t('el.system.name') }}</div>
	  
	  <div style="flex: 1;height: 80px;text-align: right;line-height: 80px;"> 
	 
	  <el-select v-if="isLanguage" v-model="vmodelCurrentLocale" placeholder="请选择语言" style="width: 200px;margin-top: 24px;" @change="fnChangeLang">
      <el-option v-for="item in localeOptions" :key="item.label" :label="item.label" :value="item.value" />
    </el-select></div>
	  </div></div>
	  <div style="height:650px;background-image: url(static/images/8qLJPA.png);">
		  	<div style="width: 1000px; height:650px;margin: 0 auto;display: flex;">
				<div style="width: 640px;margin-top: 70px;color: #fff;line-height: 16px;line-height: 32px;" >
					
					<div v-html="loginComment" style="padding: 20px;"></div>
					<div v-if="isApp" style="background-color: #FFF; width: 110px;color: #333;text-align: center;line-height: 16px;padding:5px;border-radius: 10px;">
						<img src="/static/images/appqrcode.png" style="width: 100px;" />
						<br>
						APP
					</div>
					
				</div>
				<div style="width: 360px;height: 400px; border-radius: 0.3125rem;background-color: #fff;margin-top: 70px;">
					<div style="height: 60px;line-height: 60px;width: 100%;text-align: center;">
						<span style="font-weight: 700;">{{ $t('el.login.title') }}</span>
					</div>
					<div>
				<el-form  size="large" label-position="top" style="margin: 0px 20px 10px 20px;" >
				    <el-form-item :label="$t('el.login.account')" >
				      <el-input v-model="account" prefix-icon="User" @keyup.enter.native="submitForm"/>
				    </el-form-item>
				    <el-form-item :label="$t('el.login.password')" >
				      <el-input v-model="password" type="password" prefix-icon="Lock" @keyup.enter.native="submitForm"/>
				    </el-form-item>
				    <el-form-item label-width="0">
				      <el-button type="primary" @click="submitForm()" style="width: 100%;">{{ $t('el.login.btn') }}</el-button>
				    </el-form-item>
					<div style="width: 100%;display: flex;">
						<div style="">
    <el-checkbox v-model="checked1" :label="$t('el.login.remember')" value="" /></div>
						<div style="flex-grow: 1;text-align: right;">
    <el-link type="info" @click="toDemo" style="margin-top: 9px;">{{ $t('el.login.demo') }}</el-link>
	<span style="vertical-align: middle; margin: 0 8px;" v-if="isRegister"> | </span>
	<el-link type="info" @click="toReg" style="margin-top: 9px;" v-if="isRegister">{{ $t('el.login.register') }}</el-link>
	</div>
						
					</div>
				  </el-form>
				  </div>
				</div>
			</div>
	  </div>
	  <div>
		  <div style="width: 1000px; margin: 0 auto;margin-top: 80px;text-align: center;">
			  <a href="https://beian.miit.gov.cn" target="_blank" v-if="data.beian" style="color: #999;text-decoration: none;">{{data.beian}}</a>
		  </div>
	  </div>
  </div>
</template>

<script setup>
import { ref, computed,onMounted,getCurrentInstance  } from 'vue'
// 1、语言切换 options
import { LOCALE_OPTIONS } from '@/lang'
const localeOptions = ref(LOCALE_OPTIONS)
// 2、定义当前 locale、改变 locale 方法
import useLocale from '@/hooks/locale'
const account=ref(""),password=ref(""),yzm=ref(""),loginComment=ref("");
const checked1=ref(false),isLanguage=ref(false),isRegister=ref(false),isApp=ref(false);
const { changeLocale, currentLocale } = useLocale()
const vmodelCurrentLocale = computed({
  get() {
    return currentLocale.value
  },
  set(value) {
    changeLocale(value)
  }
})
const fnChangeLang = (lang) => {
  changeLocale(lang);
  document.title=t('el.system.name');
 // api.info();
}
const data=ref({});
// 3、在 template 模版中通过 $t(）使用变量，在 script 中通过 const { t } = useI18n() 使用变量
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const resMsg = computed(() => t('modelname.demo.name'))

 import { useRoute, useRouter } from "vue-router";
 import api from '@/hooks/api'
 import {lgxInfo,lgxInfo2} from '@/hooks/lingx'
 import md5 from 'js-md5';
 const route = useRoute();
 const router = useRouter();
 const { proxy } = getCurrentInstance()
 function submitForm(){
	 if(!account.value){
		lgxInfo(t('el.login.errmsg1'))
		 return;
	 }
	 if(!password.value){
	 		lgxInfo(t('el.login.errmsg1'))
	 		 return;
	 }
	 checkboxHandler();
	 let password1=password.value;
	 if(password1.length!=32)password1=javascriptPasswordEncode(password.value,account.value);
	api.callApi({apicode:8003,account:account.value,password:password1},function(json){
		if(json.code==1){
			sessionStorage.setItem("userid",json.id);
			sessionStorage.setItem("userName",json.name);
			sessionStorage.setItem("isLogin","true");
			sessionStorage.setItem("token",json.token);
			sessionStorage.setItem("auth",json.auth);
			router.push("/main/home");
			
		}else{
			lgxInfo2(json.message)
		}
		
	});
	// router.push("/main");
 }
 function checkboxHandler(){
         if(checked1.value){
         var pwd=password.value;
           if(pwd.length!=32)
           pwd=javascriptPasswordEncode(password.value,handlerUserid(account.value));
           localStorage.setItem("loginChecked","true")
           localStorage.setItem("loginAccount",account.value)
           localStorage.setItem("loginPassword",pwd)
         }else{
           localStorage.removeItem("loginChecked");
           localStorage.removeItem("loginAccount");
           localStorage.removeItem("loginPassword");
         }
       }
  function javascriptPasswordEncode(password,userid){
       	var temp="1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM_";
       	var useridNew="";
       	for(var i=0;i<userid.length;i++){
       		if(temp.indexOf(userid.charAt(i))>=0){
       			useridNew+=userid.charAt(i);
       		}
       	}
       	userid=useridNew;
       	var pwdMd5=md5(password);
       	var useridMd5=md5(userid);
       	return md5(pwdMd5+useridMd5);
       }
{
	if(localStorage.getItem("loginChecked")=="true"){
		checked1.value=true;
		password.value=localStorage.getItem("loginPassword")
		account.value=localStorage.getItem("loginAccount")
	}
}
function toDemo(){
	router.push({path:"/tokenLogin",query:{token:"8b78749b96f681a4d814ea2be2dc8ce9fe01ce2a7fbac8fafaed7c982a04e229"}});
}
function toReg(){
	router.push({path:"/register",query:{token:"8b78749b96f681a4d814ea2be2dc8ce9fe01ce2a7fbac8fafaed7c982a04e229"}});
}
function handlerUserid(userid) {
  // 1. 声明空字符串
  let sb = '';
  const temp = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM_";

  // 2. 字符串长度是 .length，不是 .length()
  for (let i = 0; i < userid.length; i++) {
    const char = userid.charAt(i);
    if (temp.includes(char)) {
      // 3. JS 拼接字符串用 +=，不是 .append()
      sb += char;
    }
  }
  return sb;
}
 onMounted(function(){
	 
	 document.title=t('el.system.name');
	 sessionStorage.clear();
	 api.callApi({apicode:8006},function(json){
		 let version=json.data.version;
		 let preVersion=localStorage.getItem("version");
		 localStorage.setItem("version",version);
		 
		 data.value=json.data;
		 loginComment.value=json.data.loginComment;
		 sessionStorage.setItem("mainComment",json.data.mainComment)
		 isLanguage.value=("true"==json.data.isLanguage);
		 isRegister.value=("true"==json.data.isRegister);
		 isApp.value=("true"==json.data.isApp);
		 if(data.value.name){
			  document.title=data.value.name;
			  sessionStorage.setItem("sysName",data.value.name);
		 }else{
			  document.title=t('el.system.name');
		 }
		 if(version!=preVersion){
		 			 window.location.reload();
		 }
	 });
 })
	
</script>
<style scoped>
	.test{
		color: #181818 !important;
	}
</style>