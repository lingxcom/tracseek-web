let ishttps = document.location.protocol == "https:";
let host = document.location.host;
let apiUrl = null;
let wsUrl = null;
let uploadUrl=null;

if (location.hostname.indexOf('127.0.0.1') != -1 || location.hostname.indexOf('localhost') != -1 || location.host.indexOf('192.168.1') != -1) {
   apiUrl = "http://" + host + "/api";
   uploadUrl = "http://" + host + "/upload";
   wsUrl =  "ws://" + host + "/websocket";

 if(host.indexOf("5173")>0){
	apiUrl="http://127.0.0.1:8800/api";
    uploadUrl = "http://127.0.0.1:8800/upload";
	wsUrl="ws://127.0.0.1:8800/websocket"; 
 }

} else {
    if (ishttps) {
        apiUrl = "https://" + host + "/api";
		uploadUrl = "https://" + host + "/upload";
        wsUrl = "wss://" + host + "/websocket";
    } else {
        apiUrl = "http://" + host + "/api";
		uploadUrl = "http://" + host + "/upload";
		wsUrl = "ws://" + host + "/websocket";
    }
}

window.apiUrl = apiUrl;
window.wsUrl = wsUrl;
window.uploadUrl = uploadUrl;
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};