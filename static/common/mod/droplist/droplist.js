var $ = require('common:jquery');

function DropList(opt){
	this.options = $.extend({
		items: {},
		list: null,
		dom: null,
		container: document.body,
		width: false,
		callback: function(){}
	}, opt || {});

	this.init();
};

DropList.prototype = {
	init: function(){
		var self = this, opts = self.options;

		self.value = '';

		self.wraper = $('<div class="ui-droplist"><i class="ui-droplist-arrow"></i></div>').appendTo(opts.container);
		self.select = $('<span class="ui-droplist-select"></span>').appendTo(self.wraper);
		self.list = $('<ul class="ui-droplist-list"></ul>').appendTo(self.wraper);

		self.dom = opts.dom ? $(opts.dom) : null;
		self.setList(opts.dom || opts.list || opts.items);

		self.resetWidth();
		self.bindEvent();
	},

	bindEvent: function(){
		var self = this, opts = self.options;

		self.wraper.hover(function(){
			!self.wraper.hasClass('ui-droplist-disabled') && self.openList();
		}, function(){
			self.closeList();
		});

		self.list.delegate('.ui-droplist-item', 'click', function(){
			self.closeList();

			var $this = $(this);
			var key = $this.attr('data-droplist-key'), value = $this.attr('data-droplist-value');

			opts.callback && opts.callback.call(this, key, value);
			self.setValue(key, value);
		});
	},

	openList: function(){
		var self = this;

		self.wraper.addClass('ui-droplist-open');
		self.resetWidth();
	},

	closeList: function(){
		this.wraper.removeClass('ui-droplist-open');
	},

	setList: function(list, defaultKey, defaultValue){
		var self = this, $dom;

		if(list.nodeType || list instanceof $ || typeof list == 'string'){
			$dom = $(list);
			list = self.dom2list(list);
		}

		self.list.html(DropList.createListHtml(list));
		self.resetWidth();

		self.dom && (!$dom || $dom[0] !== self.dom[0]) && self.resetDom(list);

		if(defaultKey){
			self.setValue(defaultKey, defaultValue);
		}else{
			var $first = $('.ui-droplist-item:first', self.list);
			self.setValue($first.attr('data-droplist-key'), $first.attr('data-droplist-value'));
		}
	},

	resetDom: function(list){
		this.dom.html(DropList.createDomHtml(list));
	},

	resetWidth: function(){
		var self = this;

		self.list.css('width', 'auto');
		self.wraper.add(self.list).css('width', self.options.width || self.list.width());
	},

	setValue: function(key, value){
		var self = this;
		
		self.select.html(key);
		self.value = value;

		self.dom && self.dom.val(value);
	},

	getValue: function(){
		return this.value;
	},

	dom2list: function(dom, ungroup){
		var obj = {}, self = this;

		if(!ungroup){
			$('> optgroup', dom).each(function(){
				obj[$(this).attr('label')] = self.dom2list(this, true);
			});
		}

		$('> option', dom).each(function(){
			obj[$(this).html()] = this.value;
		});

		return obj;
	},

	disable: function(){
		self.wraper.addClass('ui-droplist-disabled');
		self.dom && self.dom.attr('disabled', true);
	},

	enable: function(){
		self.wraper.addClass('ui-droplist-disabled');
		self.dom && self.dom.removeAttr('disabled');
	}
};

DropList.createListHtml = function(list){
	var html = [];

	$.each(list, function(key, item){
		if(typeof item == 'object' && item){
			html.push('\
				<li class="ui-droplist-group">\
					<span href="javascript:;" class="ui-droplist-group-label">' + key + '</span>\
					<ul>' + DropList.createListHtml(item) + '</ul>\
				</li>'
			);
		}else{
			html.push('<li class="ui-droplist-item" data-droplist-key="' + key + '" data-droplist-value="' + item + '"><a href="javascript:;">' + key + '</a></li>');
		}
	});

	return html.join('');
};

DropList.createDomHtml = function(list){
	var html = [];

	$.each(list, function(key, item){
		if(typeof item == 'object' && item){
			html.push('<optgroup label="' + key + '">' + DropList.createDomHtml(item) + '</optgroup>');
		}else{
			html.push('<option value="' + item + '">' + key + '</option>');
		}
	});

	return html.join('');
};

module.exports = DropList;