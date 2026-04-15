import { ElMessage } from 'element-plus'
import i18n from '@/lang/index'
const t = i18n.global.t;

export function lgxInfo(msg){
	ElMessage({
	    showClose: true,
	    message: msg,
	    type: 'success',
	  })
}
export function lgxInfo2(msg){
	ElMessage({
	    showClose: true,
	    message: msg,
	    type: 'error',
	  })
}
export function lgxInfo2_bak(msg){
	if($("#lgxinfo").length==0){
		$("<div id='lgxinfo' ></div>").appendTo($("body"));
	}
	$("#lgxinfo").html(msg);
	$("#lgxinfo").show();
	$("#lgxinfo").css("margin-left",($("#lgxinfo").width()/2*-1-20)+"px");
	setTimeout(function(){
		$("#lgxinfo").hide();
	},3000);
}
export function lgxInfo3(msg){
	ElMessage({
	    showClose: true,
	    message: msg,
	    type: 'error',
	  })
}

export function getEntityString(array){
 if(typeof array=="string")return array;
  let temp="";
  for(let i=0;i<array.length;i++){
    if(array[i].etype=="tlingx_optionitem")return getTextString(array);
    if(array[i].islink)
    temp+="<a href='javascript:;' onclick='openViewDialog(\""+array[i].ename+" - 查看\",\""+array[i].etype+"\",\""+(array[i].id||array[i].ID)+"\",)'>"+array[i].text+"</a>,";
    else
    temp+=array[i].text+",";
  }
  if(temp.length>0)temp=temp.substring(0,temp.length-1);
  return temp;
}


export function getTextString(array){
  if(typeof array=="string")return array;
  let temp="";
  for(let i=0;i<array.length;i++){
    temp+=array[i].text+",";
  }
  if(temp.length>0)temp=temp.substring(0,temp.length-1);
  return temp;

}
export function getValueString(array){
  if(typeof array=="string")return array;
  let temp="";
  for(let i=0;i<array.length;i++){
    if(array[i].value)temp+=array[i].value+",";
  }
  if(temp.length>0)temp=temp.substring(0,temp.length-1);
  return temp;

}
export function format1(value){
	    let temp='';
	    if(typeof value=="object"){
	    temp=getEntityString(value);
	    }else{
	      temp=value;
	    }
	
	    return temp;
	
	  }

/**
 * 计算两个经纬度坐标之间的距离
 * @param {number} lat1 第一个点的纬度
 * @param {number} lon1 第一个点的经度
 * @param {number} lat2 第二个点的纬度
 * @param {number} lon2 第二个点的经度
 * @param {'km'|'m'|'mi'} [unit='km'] 返回结果的单位（千米、米、英里）
 * @returns {number} 两点之间的距离（单位取决于参数）
 */
export function distance(lat1, lon1, lat2, lon2, unit = 'm') {
  // 地球平均半径（千米）
  const R = 6371;

  // 将度数转换为弧度
  const radLat1 = (Math.PI * lat1) / 180;
  const radLon1 = (Math.PI * lon1) / 180;
  const radLat2 = (Math.PI * lat2) / 180;
  const radLon2 = (Math.PI * lon2) / 180;

  // 经纬度差值
  const deltaLat = radLat2 - radLat1;
  const deltaLon = radLon2 - radLon1;

  // Haversine 公式计算
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let distance = R * c;

  // 根据单位转换结果
  switch (unit) {
    case 'm':
      distance *= 1000; // 转换为米
      break;
    case 'mi':
      distance *= 0.621371; // 转换为英里
      break;
    // 默认单位是千米
  }

  return distance;
}
/**
 * 计算两个日期datetime14之间的差值，ms
 * @param {Object} time1
 * @param {Object} time2
 */
export function  timenum(time1,time2){
        if(time1&&time2){
          var date1=parseDate(time1);
          var date2=parseDate(time2);
          var value1=Math.abs(date1.getTime()-date2.getTime());
          if(value1>(10*60*1000))value1=0;
          return value1;
        }
        return 0;
      }
/**
 * datetime14格式化显示
 * @param {Object} value
 */
export function formatDatetime(value,p2,p3){
		if(p3)value=p3;
        if(!value)return "";
        return (value.substring(0,4)+"-"+value.substring(4,6)+"-"+value.substring(6,8)+" "+value.substring(8,10)+":"+value.substring(10,12)+":"+value.substring(12,14));
      }
export function formatDatetime2(temp){
        if(!temp)return "";
	  return temp.replace(/-/g,'').replace(' ','').replace(/:/g,'');
	  }
/**
 * 将 datetime14转为 Date对象
 * @param {Object} datestring
 */
export function parseDate(datestring){
  return new Date(datestring.substring(0,4)-0,
  datestring.substring(4,6)-0-1,
  datestring.substring(6,8)-0,
  datestring.substring(8,10)-0,
  datestring.substring(10,12)-0,
  datestring.substring(12,14)-0,
  );
      }
/**单位秒转字符串描述
 * @param {Object} time
 */
export function timeString(time){
	if(!time)return "";
      var ss=time%60;
      var mm=time/60%60;
      var hh=time/60/60;
      var str="";
      if(hh>1){
        str=parseInt(hh)+t('el.car.history.HH')+parseInt(mm)+t('el.car.history.mm');
      }else{
        if(mm>1){
          str=parseInt(mm)+t('el.car.history.mm')+ss+t('el.car.history.ss')
        }else{
           str=ss+t('el.car.history.ss')
        }
      }
      return str;
    }
export function getRotation(temp){
	          return (360-temp+360)%360;
	}
	
	
/**
 * {title:dataList[i].title,field:dataList[i].dataKey,formater:function(){return car.value.text;}}
 * 导出excel
 * @param {Object} title        标题列key-val
 * @param {Object} data         值列key-val
 * @param {Object} fileName     文件名称
 */
export function JSONToExcelConvertor(title, data, fileName) {
    var CSV = '';
    var row = "";

    for (var i = 0; i < title.length; i++) {
        if(title[i].title){
            row += title[i].title + ',';
        }
    }
    row = row.slice(0, -1);
    CSV += row + '\r\n';

    for (var i = 0; i < data.length; i++) {
        var row = "";
        for (var j = 0; j < title.length; j++) {
            if(title[j].title){
				if(title[j].formatter)title[j].formater=title[j].formatter;
               if(!title[j].formater)title[j].formater=emptyFun;
                 row += '"' + title[j].formater("","",(data[i][title[j].field]||data[i][title[j].field]==0 ? data[i][title[j].field] : "")) + '"\t,';
            }
        }
        row.slice(0, row.length - 1);
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    var fileName = fileName;
    var uri = new Blob(['\ufeff' + CSV], {type:"text/csv"});

    if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
        window.navigator.msSaveOrOpenBlob(CSV, fileName + ".csv");
    } else { // for Non-IE（chrome、firefox etc.）
        var link = document.createElement("a");
        link.href = URL.createObjectURL(uri);

        link.style = "visibility:hidden";
        link.download = fileName + ".csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function emptyFun(p1,p2,p3){return p3;}