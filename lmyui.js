/*!

 @Title: lmy照片墙
 @Description：lmy照片墙
 @Site: xxx
 @Author: illmy

 */

;!function(win){

"use strict";
//全局配置，如果采用默认均不需要改动
var config =  {
	elem: '',	//选择元素
	path: '',	//图片地址
	auto: true,	//是否自动更新
	sec: 3		//更新时间默认为3秒
};

var Lmy = function(options){
	this.v = "1.0.0_r";		//版本号
	if(!options.auto && options.auto != false){
		options.auto = config.auto;
	}
	options.sec = options.sec || config.sec;
	this.options = options;
}
Lmy.fn = Lmy.prototype;

var doc = document,t,

//获取lmy.js所在目录
getPath = function(){
    var js = doc.scripts, jsPath = js[js.length - 1].src;
    //console.log(jsPath);
    return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
}(),

//异常提示
error = function(msg){
  //win.console && console.error && console.error('Lmy hint: ' + msg);
};


//创建元素
function createElement(element,elem,src,o){
	//计算位置
	var screens = getScreen(),
	div_width = 125,div_height = 125,
	img_width = 115,img_height = 115,
	margin_top = 5,margin_left = 5,
	b_m = 165,										//左边距
	h_m = 70,										//上边距
	div_w = parseInt(div_width) + b_m,
	div_h = parseInt(div_height) + h_m,
	line_num = parseInt(screens.width/div_w),
	p_l = parseInt(o/line_num),						//同一排第几个
	p_y = o%line_num,								//同一列第几排
	top = h_m + p_l * div_h,
	left = b_m + p_y * div_w;
	switch (element){
		case 'div':
			var elem_obj = doc.createElement('div');
			var div_style = {position:"absolute","width":div_width+'px',"height":div_height+'px',"left":left+'px',"top":top+'px',
			"background-repeat":"no-repeat","background-attachment":"faxed","background-position":"center","background-color":"#FFFFFF",
			"box-shadow":"1px 1px 3px","transform":"rotate("+stransform()+"deg)"};
			setCss(elem_obj,div_style);
			var img = doc.createElement("img");
			var img_style = {"width":img_width+'px',"height":img_height+'px',"src":src,"margin-top":margin_top+"px","margin-left":margin_left+"px"};
			setCss(img,img_style);
			elem_obj.appendChild(img);
			break;
	}
	elem.style.backgroundColor = "#FFFF88";
	elem.appendChild(elem_obj);
}
//产生随机数
function grandom(ratio){
	return Math.random() * ((Math.random() > 0.5)?1 : -1) * ratio;
}
//转换角度
function stransform(){
	//角度区间
	var l = -60,r = 60;
	//随机数
	var random = grandom(60);
	return random;
}
//转换动画
function sanimate(obj){
	var lobj = obj.childNodes;
	for(var k in lobj){
		if(!isNaN(k)){
			var srandom = parseInt(stransform());										//需要转到的角度
			var erandom = parseInt(lobj[k].style.transform.replace(/[^\d\.]/g,''));		//起始角度
			timedCount(lobj[k],srandom,erandom,0.01);
		}	
	}
	return true;
}
//计时器
function timedCount(obj,sr,er,sec){
	if(er > sr){
		sr++;
	}else if(er < sr){
		sr--;
	}else{
		return false;
	}
	var style = {"transform":"rotate("+sr+"deg)"};
	setCss(obj,style);
	if(er == sr){
		clearTimeout(t);
	}else{
		t = setTimeout(function(){timedCount(obj,sr,er,sec);},sec * 1000);
	}
}
//获取屏幕大小
function getScreen(){
	var reen = {};
	reen.width = win.screen.availWidth;
	reen.height = win.screen.availHeight;
	return reen;
}
//样式设置 字符不能设置属性 需重写的方法
function setCss(obj,style){
	obj.style.position = "absolute";
	for(var o in style){
		var os = o.replace(/\-([a-z]{1})/,function($1){ var arr = $1.split('-');return arr[1].toLocaleUpperCase()});
		switch(os){
			case 'position':
				obj.style.position = style[o];
				break;
			case 'width':
				obj.style.width = style[o];
				break;
			case 'height':
				obj.style.height = style[o];
				break;
			case 'left':
				obj.style.left = style[o];
				break;
			case 'top':
				obj.style.top = style[o];
				break;
			case 'transform':
				obj.style.transform = style[o];
				break;
			case 'backgroundRepeat':
				obj.style.backgroundRepeat = style[o];
				break;
			case 'backgroundAttachment':
				obj.style.backgroundAttachment = style[o];
				break;
			case 'backgroundPosition':
				obj.style.backgroundPosition = style[o];
				break;
			case 'backgroundColor':
				obj.style.backgroundColor = style[o];
				break;
			case 'marginTop':
				obj.style.marginTop = style[o];
				break;
			case 'marginLeft':
				obj.style.marginLeft = style[o];
				break;
			case 'boxShadow':
				obj.style.boxShadow = style[o];
				break;
			case 'src':
				obj.src = style[o];
				break;
		}
	}
}
Lmy.fn.init = function(elem){
	var $ = this,options = $.options;		//防干扰
	$.ajax(options.path,options.method,$.show,elem);
};
//照片展示
Lmy.fn.show = function(result,elem,obj){
	var $ = obj;		//防干扰
	var data = result.data;;
	for(var o in data){  
        createElement('div',elem,data[o].src,o);  
    }
    if(sanimate(elem)){
    	$.click(elem); 
    }    
};
//点击放大
Lmy.fn.click = function(elem){
	var $ = this,options = $.options;
	var zelem = elem.childNodes;
	for(var n in zelem){
		if(!isNaN(n)){
			zelem[n].onclick = function(){
				console.log('ss');
			}
		}
	}
};

function xmlHttp(){
	var xmlhttp = null;
	if (window.XMLHttpRequest){
	    //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
	    xmlhttp = new XMLHttpRequest();
	}
	else{
	    // IE6, IE5 浏览器执行代码
	    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	return xmlhttp;
}
function readyState(xmlhttp,callback,elem,obj){
	xmlhttp.onreadystatechange = function(){
  		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
    		var result = JSON.parse(xmlhttp.responseText);
    		if (typeof callback === "function"){
	            callback(result,elem,obj); 
	        }
    	}else{
    		error(xmlhttp.status);
    	}	
  	};
}
function sendInfo(xmlhttp,method,url){
	method = method || "GET";
	xmlhttp.open(method,url,true);
	if(method == "POST"){
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	}
	xmlhttp.send();
}
//ajax 请求
Lmy.fn.ajax = function(url,method,callback,elem){
	var $ = this,options = $.options,
	xmlhttp = xmlHttp();
	readyState(xmlhttp,callback,elem,$);
	sendInfo(xmlhttp,method,url);
};

//暴露接口
win.lmyshow = function(options){
	options = options || {};
	var lmy = new Lmy(options);
	var elem = doc.getElementById(options.elem);
	lmy.init(elem); 
};

}(window);