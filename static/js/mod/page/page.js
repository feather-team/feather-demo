var $ = require('jquery');

function Page(opt){
    this.options = $.extend({
		dom: null,
		pageTotal: 0,	//整页数
		perPage: 10,	//显示几页
		url: '',		//url不为空，可直接跳转，而非调用callback
		first: true,	//显示首页
		last: true,		//显示最后一页
		currentPage: 1,	//当前页码
		currentPageClassName: 'ui-page-current',	//当前页class
		pageClassName: '',	//页码class
		callback: function(page){}	//url不为空时 每次点击页码回调， 当前页不可重复点击，如需重新加载当前页，可直接调用pageto方法
	}, opt || {});

    this.initialize();
}
	
Page.prototype = {
    initialize: function(){
		if(this.options.pageTotal == 0) return; 
		
		this.container = $('<ul class="ui-page">');
		this.dom = $(this.options.dom).empty().append(this.container);
		
		this.index = parseInt(this.options.currentPage);
		this.createPage();
		this.bindEvent();
	},
	
	pageTo: function(i){
		var opt = this.options;

		this.index = i ? parseInt(i < 1 ? 1 : i > opt.pageTotal ? opt.pageTotal : i ) : this.index;
		opt.callback && opt.callback.call(this, this.index);
		this.createPage();
	},

	bindEvent: function(){
		var self = this;

		self.container.delegate('a', 'click', function(){
			self.pageTo($(this).attr('data-page'));
		});
	},
	
	createPage: function(){
		var self = this, res = self.getPageResult(), opt = self.options;

		self.container.empty();

		$.each(res, function(key, value){
			var _0 = value[0], _1 = value[1], $html;

			if(_1 != self.index){
				$html = $('<li><a href="' + (opt.url ? opt.url + _1 : 'javascript:void(0);') + '" data-page="' + _1 + '">' + _0 + '</a></li>').addClass(value[2]);
			}else{  
				$html = $('<li>' + _1 + '</li>').addClass(opt.currentPageClassName);
			}

			$html.addClass(opt.pageClassName).appendTo(self.container);
		});
	},

	getPageResult: function(){
		var self = this, opt = self.options;
		var total = parseInt(opt.pageTotal), per = opt.perPage, index = this.index, start = 0, end = 0, middle = Math.ceil(per / 2), m = parseInt(per / 2);

		if(total < per){
			start = 1;
			end = total;
		}else{
			if(index <= middle){
				start = 1;
				end = per;
			}else if(index > middle){
				if(index + middle <= total){
					start = index - middle + 1;
					end = index + m;
				}else{
					start = total - per + 1;
					end = total;
				}
			}
		}

		var arr = [];

		if(index > 1){
			arr.push([opt.previous || '&nbsp;', index - 1, 'ui-page-previous']);
		}

		if(opt.first){
			if(start > 2){
				arr.push(['1..', 1]);
			}else if(start == 2){
				arr.push(['1', 1]);
			}
		}
		
		var i = start;

		while(i <= end) arr.push([i, i++]);

		if(opt.last){
			if(end < total - 1){
				arr.push(['..' + total, total]);
			}else if(end == total - 1){
				arr.push([total, total]);
			}
		}

		if(index < total){
			arr.push([opt.next || '&nbsp;', index + 1, 'ui-page-next']);
		}

		return arr;
	}
};	

return Page;