/**
 * 表格数据加载插件 （table-LMY）
 * @Author   liulong                  <335111164@qq.com>
 * @DateTime 2018-02-07T16:22:54+0800
 * @param    {[type]}                 win                window
 */

;!function($,win){

"use strict";
var config = {
	"table":"#sample-table",
	"pageIndex":1,
	"pageSize":100,
	"sortField":"",
	"sortOrder":"",
	"data":"",
	"indexelem":"",
	"indexfun":'change',
	"sizeelem":"#sizelem",
	"sizeeven":"change",
	"method":"post",
	"url":"",
	"dataType":"json",
	"trhtml":"<tr><td class=\"checktd\"><label class=\"am-checkbox\"><input type=\"checkbox\" class=\"checkBoxSelect\" value=\"\" data-am-ucheck> </label></td><td class=\"numbertd\">[num]</td><td>[ext]</td><td>[sipname]</td><td>[sippwd]</td><td>[beizhu]</td></tr>",
	"fieldinfo":['num','ext','sipname','sippwd','beizhu'],
	"datafield":"",
	"pagenode":"#show-page",
	"perpage":"#per-page",
}

//对象
var Lmy = function(options){
	this.v = "1.0.0_r";		//版本号
	this.options = $.extend({}, config, options);

};
Lmy.fn = Lmy.prototype;

Lmy.fn.page = function(){
	var param = this.options;
	var that = this;
	$(param.sizeelem).bind(param.sizeeven,function(){
		that.options.pageSize = $(param.sizeelem).val();
		that.options.pageIndex = 1;
		that.request();
	});
}

Lmy.fn.sort = function(){
	var elem = this.options.table;
	var that = this;
	$(elem).find('th.sortth').bind('click',function(){
		var sort = $(this).attr('data-options')?$(this).attr('data-options'):'';
		var field = $(this).attr('field');
		that.options.sortField = field;
		if(sort.length < 1){
			sort = 'asc';
		}
		if(sort == 'asc'){
			that.options.sortOrder = 'desc';
		}else{
			that.options.sortOrder = 'asc';
		}
		$(this).attr('data-options',that.options.sortOrder);
		that.request();
	});
}

/**
 * 分页展示 html渲染
 * @Author   liulong                  <335111164@qq.com>
 * @DateTime 2018-02-08T14:44:52+0800
 * @return   {[type]}                 [description]
 */
Lmy.fn.pageHtml = function(total,pageSize,nowPage){
	var perpage = "每页"+pageSize+"条，共"+total+"条";
	$(this.options.perpage).text(perpage);
	var show = this.options.pagenode;
	nowPage = parseInt(nowPage);
    $(show).empty();
	if(total < pageSize){
		return false;
	}
	var html = '';
	var rollPage = 5;		//显示页数5页
	var totalPages   =   Math.ceil(total/pageSize);     //总页数
    var coolPages    =   Math.ceil(totalPages/rollPage);//分页总栏数
	var nowCoolPage = Math.ceil(nowPage/rollPage);
	var upRow          =   nowPage - 1;	//上一页
    var downRow        =   nowPage + 1;	//下一页
	nowCoolPage    =   Math.ceil(nowPage/rollPage);
	if(upRow > 0){
		var upPage = "<li class=\"am-pagination-prev link-page\" data-options=\""+upRow+"\"><a href=\"javascript:;\" class=\"\">上一页</a></li>";
	}else{
		var upPage = '';
	}
	if (downRow <= totalPages){
	    var downPage   =   "<li class=\"am-pagination-next link-page\" data-options=\""+downRow+"\"><a href=\"javascript:;\" class=\"\">下一页</a></li>";
	}else{
	    var downPage   =   '';
	}

	//第一页 末页
	if(nowCoolPage == 1){
        var theFirst   =   '';
    }else{
        var theFirst   =   "<li class=\"am-pagination-first link-page\" data-options=\"1\"><a href=\"javascript:;\" class=\"\">第一页</a></li>";
    }
    if(nowCoolPage == coolPages){
        var theEnd     =   '';
    }else{
        var theEndRow  =   totalPages;
        var theEnd     =   "<li class=\"am-pagination-last link-page\" data-options=\""+theEndRow+"\"><a href=\"javascript:;\" class=\"\">最末页</a></li>";
    }
    // 1 2 3 4 5
    var linkPage = "";
    for(var i = 1;i <= rollPage;i++){
        var page       =   (nowCoolPage-1)*rollPage+i;
        if(page != nowPage){
            if(page <= totalPages){
                linkPage += "<li class=\"link-page\" data-options=\""+page+"\"><a href=\"javascript:;\" class=\"\">"+page+"</a></li>"; //去掉了此处的空格
            }else{
                break;
            }
        }else{
            if(totalPages != 1){
                // 当前页
               linkPage += "<li class=\"am-active\"><a href=\"javascript::void(0);\" class=\"am-active\">"+page+"</a></li>";
            }
        }
    }
    var pageStr = "<ul data-am-widget=\"pagination\" class=\"am-pagination am-pagination-default text_right\">";
    pageStr += theFirst+upPage+linkPage+downPage+theEnd;
    pageStr += "</ul>";
    $(pageStr).appendTo($(show));
    var that = this;
    $(show).find('.link-page').bind('click',function(){
    	that.options.pageIndex = $(this).attr("data-options");
    	that.request();
    });
}
/**
 * 	数据加载
 * @Author   liulong                  <335111164@qq.com>
 * @DateTime 2018-02-07T17:19:49+0800
 * @return   {[type]}                 [description]
 */
Lmy.fn.dataLoad = function(data){
	var elem = this.options.table;
	var str = this.options.trhtml;
	var field = this.options.fieldinfo;
	var tbody = $(elem).find('tbody');
	var datafield = this.options.datafield;
	var s1 = '';
	var html = '';
	tbody.empty();
	if(datafield.length < 1){
		var text = data;
		var total = text.length;
	}else{
		var text = eval('(data.' + datafield + ')');
		var total = data.total;
	}
	this.pageHtml(total,this.options.pageSize,this.options.pageIndex);
	$.each(text,function(it,item){
		var str_re = str;
		for (var i = 0; i <= field.length - 1; i++) {
			s1 = "["+field[i]+"]";
			if(field[i] == 'num'){
				item['num'] = i + 1;
			}
			str_re = str_re.replace(s1,item[field[i]]);
		};
		html += str_re;
	});
	$(html).appendTo(tbody);
	this.close();	
}

Lmy.fn.loading = function(){
	layer.load(1);
}

Lmy.fn.close = function(){
	layer.closeAll();
}

Lmy.fn.getPageSize = function(){
	var pageSize = $(this.options.sizeelem).val();
	this.options.pageSize = pageSize?pageSize:this.options.pageSize;
}

Lmy.fn.getPageIndex = function(){
	// var show = this.options.pagenode;
	// var pageIndex = $(show).find('.am-active').attr();

}

/**
 * 	发送请求
 * @Author   liulong                  <335111164@qq.com>
 * @DateTime 2018-02-07T17:19:31+0800
 * @return   {[type]}                 [description]
 */
Lmy.fn.request = function(){
	var param = this.options;
	var data = {
		"pageIndex":param.pageIndex - 1,
		"pageSize":param.pageSize,
		"sortField":param.sortField,
		"sortOrder":param.sortOrder
	};
	if(param.data.length > 0){
		data.data = param.data;
	}
	var that = this;
	that.loading();
    $.ajax({
        url:param.url,
        dataType:param.dataType,
        type:param.method,
        data:data,
        success:function(text){
            that.dataLoad(text);
        },
        error:function(){
        	that.close();
            layer.alert('数据请求出错');
        }
    });
}

Lmy.fn.init = function(){
	this.getPageSize();
	this.getPageIndex();
	this.page();
	this.sort();
	this.request();
}

//暴露接口
$.lmytable = function(options){
	options = options || {};
	var lmy = new Lmy(options);
	lmy.init(); 
};


}($,window);
