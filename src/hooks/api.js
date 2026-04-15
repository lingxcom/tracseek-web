import router from '@/router' 
import i18n from '@/lang'
import axios from 'axios'
import {lgxInfo,lgxInfo2,lgxInfo3} from '@/hooks/lingx'
function Api(){
	var _this=this;
	_this.callApi=function(params,callback){
		if(sessionStorage.getItem("token")!=null){
			params.lingxtoken=sessionStorage.getItem("token");
		}
		params.language=i18n.global.locale.value;
		 var dataStr= JSON.stringify(params);
		        axios.post(window.apiUrl,dataStr)//dataStr https://www.gb35658.com/lingx3api
		        .then(function(ret){
		          if(ret.data.code==40001){
		           router.push({path:'/login'})
		            return;
		          }else if(ret.data.code==40002){
		            lgxInfo3("无权限(no permissions)");
		            return;
		          }else{
		            callback(ret.data);
		          }
		          //alert(ret.data.message);
		        })
		        .catch(function (error) {
		　　      console.log(error);
		lgxInfo3("API ERROR");
		          // router.push({path:'/login'})
		            return;
		        // _this.lgxInfo2("API调用错误");
		      });
	}
}
const api =new Api();
export default api
