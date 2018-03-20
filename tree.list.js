/**
 * 树形列表 change队列
 * @Author   liulong                  <335111164@qq.com>
 * @DateTime 2018-03-16T15:47:57+0800
 * @param    {[type]}                 $                  [description]
 * @param    {[type]}                 win                [description]
 * @return   {[type]}                                    [description]
 */
;!function($,win){
"use strict";
var config = {
	elem: '',
	cl_url: '',
	ch_url: '',
	data:'',
}

//对象
var Lmy = function(options){
	this.v = "1.0.0_r";		//版本号
	this.options = $.extend({}, config, options);
	//弹窗标识
	this.mk = 1;
};
Lmy.fn = Lmy.prototype;

/**
 * 点击事件
 * @Author   liulong                  <335111164@qq.com>
 * @DateTime 2018-03-16T16:01:04+0800
 * @return   {[type]}                 [description]
 */
Lmy.fn.click = function(){
	var that = this;
	// $(that.options.elem).bind('focus',function(){
	// 	if($("#tree-list-div").hasClass('tree-list-div')){
	// 		return false;
	// 	}
	// 	var agent = $(this).val();
	// 	if(agent.length > 0){
	// 		var values = {}
	// 		values['name'] = ['like','%'+agent+'%'];
	// 		var keyword = JSON.stringify(values);
	// 	}else{
	// 		var keyword = '';
	// 	}
	// 	//发送请求
	// 	that.request(that.options.cl_url,keyword,1);		
	// });
	$("body").bind('click',function(event){
		if (!(event.target.id == "tree-list-div" || '#'+event.target.id == that.options.elem 
			|| $(event.target).parent().parent().hasClass("tree-list-div"))) {
			that.closeDog();
		}
	});
}

/**
 * 光标变化
 * @Author   liulong                  <335111164@qq.com>
 * @DateTime 2018-03-16T19:41:33+0800
 * @return   {[type]}                 [description]
 */
Lmy.fn.keyup = function(){
	var that = this;
	$(that.options.elem).bind('keyup',function(){
		var agent = $(this).val();
		if(agent.length > 0){
			var values = {}
			values['name'] = ['like','%'+agent+'%'];
			var keyword = JSON.stringify(values);
		}else{
			var keyword = '';
		}
		$(that.options.elem).prev('input').val('');
		that.request(that.options.cl_url,keyword,1);	
	});
}

/**
 * 弹窗定制
 * @Author   liulong                  <335111164@qq.com>
 * @DateTime 2018-03-16T16:25:34+0800
 * @return   {[type]}                 [description]
 */
Lmy.fn.dailog = function(data,type){
	this.closeDog();
	//html拼接
	var html = '<div style="width:230px;height:310px;position:absolute;background-color:#FFFEEE;overflow-y:scroll;" class="tree-list-div" id="tree-list-div">'+
				'<ul class="am-list am-list-border am-list-striped">';
	if(type == 1){
		var fr = 0;
		$.each(data,function(it,item){
			html += '<li data-am-li="'+item.id+'" data-am-name="'+item.name+'" style="cursor:pointer">'+item.name+'('+item.level_name+')'+'</li>';
			fr = 1;
		});
		if(fr == 0){
			html += '<li>没有搜索到任何数据</li>';
		}
		html += '</ul></div>';
		$(html).appendTo($('body'));
		var obj = $(this.options.elem);
		var offset = obj.offset();
		$("#tree-list-div").css({left:1+offset.left + "px", top:offset.top + obj.outerHeight() + "px"}).slideDown("fast");
		this.clickLi();	
	}	
}

/**
 * li点击事件
 * @Author   liulong                  <335111164@qq.com>
 * @DateTime 2018-03-16T20:49:26+0800
 * @return   {[type]}                 [description]
 */
Lmy.fn.clickLi = function(){
	var that = this;
	$("#tree-list-div").find('li').bind('click',function(){
		$(that.options.elem).prev('input').val($(this).attr('data-am-li'));
		$(that.options.elem).val($(this).attr('data-am-name'));
		that.closeDog();
	});
}

Lmy.fn.closeDog = function(){
	$("#tree-list-div").remove();
}

Lmy.fn.loading = function(){
	layer.load(1);
}

Lmy.fn.close = function(){
	layer.closeAll();
}

Lmy.fn.alert = function(msg){
	layer.alert(msg);
}

/**
 * 发送请求
 * @Author   liulong                  <335111164@qq.com>
 * @DateTime 2018-03-16T16:01:19+0800
 * @return   {[type]}                 [description]
 */
Lmy.fn.request = function(url,kword,type){
	var param = this.options;
	var that = this;
	that.loading();
	var data = {"page_index":1,"page_size":10000,"order_field":'id',"order_way":'desc','field':'id,name,level_name'};
	if(kword.length > 1){
		console.log(kword);
		data.data = kword;
	}
    $.ajax({
        url:url,dataType:'json',type:'post',
        data:data,
        success:function(text){
            that.dailog(text.data.data,type);
        	that.close();
        },
        error:function(){
        	that.close();
            that.alert('数据请求出错');
        }
    });
}

Lmy.fn.init = function(){
	this.click();
	this.keyup();
}

//接口
$.zList = function(options){
	options = options || {};
	var lmy = new Lmy(options);
	lmy.init(); 
};
}($,window);
