;(function(window, factory){
if(typeof define == 'function'){
	//seajs or requirejs environment
	define(function(require, exports, module){
		return factory(
			require('common:jquery'),
			require('common:mask')
		);
	});
}else{
	window.FeatherUi = window.FeatherUi || {};
	window.FeatherUi.Dialog = factory(window.jQuery || window.$, window.FeatherUi.Mask);
}
})(window, function($, Mask){

var doc = document;

function Dialog(opt){
	this.options = $.extend({
		title: '',
		container: doc.body,
		dom: null,
		width: 400,
		height: false,
		content: '',
		url: '',
		esc: false,	//ESC是否开启，ESC按下自动关闭
		mask: true,					//蒙版
		autoOpen: false,
		buttons: {},
		handle: null,				//指定打开和关闭dialog的元素
		open: function(){},
		firstOpen: function(){},	//第一次打开执行
		close: function(){},
		className: ''
	}, opt || {});

	this.init();
}

Dialog.prototype = {
	init: function(){
		this.firstOpenStatus = false;

		var wraper = this.wraper = $(this.options.container);

		if(wraper[0] != doc.body){
			!/fixed|absolute/.test(wraper.css('position')) && wraper.css('position', 'relative');
		}

		this.create();
		this.options.autoOpen && this.open();
	},

	create: function(){
		this.createMask();
		this.createContainer();
		this.bindEvent();
	},

	bindEvent: function(){
		this.bindClose();

		var t = this;

		$(window).resize(function(){
			t.resetPosition();
		});

		if(this.options.handle){
			var t = this;
			
			$(t.options.handle).click(function(){
				t.open();
			});	
		}
	},

	//创建遮罩
	createMask: function(){
		if(!this.options.mask)return;

		this.mask = new Mask({autoOpen: false, container: this.wraper});
	},

	//创建内容部分
	//包括创建内容　按钮
	createContainer: function(){
		var $container = this.container = $('<div class="ui-dialog-container">').html([
			'<div class="ui-dialog-content"></div>'
		].join('')).appendTo(this.wraper).addClass(this.options.className);

		$container.prepend([
			'<strong class="ui-dialog-header">',
	    		'<a href="javascript:void(0);" class="ui-dialog-close">&times;</a>',
	    		'<span class="ui-dialog-title"></span>',
	    	'</strong>'
	    ].join(''));

		this.setTitle(this.options.title);
		this.createButtons();
		this.setContent();

		$container.find('.ui-dialog-content').css({
			width: this.options.width,
			height: this.options.height
		});

		$container.css('width', this.options.width);
	},

	setContent: function(content){
		var t = this, options = t.options, content = content || options.content;
		var $content = t.container.find('.ui-dialog-content');

		if(content){
			$content.html(content);
		}else if(options.dom){
			$content.empty().append($(options.dom).show());
		}else if(options.url){
			t.load(options.url);
		}

		setTimeout(function(){
			t.resetPosition();
		}, 0);
	},

	load: function(url){
		var self = this;

		self.container.find('.ui-dialog-content').load(url, function(){
			self.resetPosition();
		});
	},

	createButtons: function(){
		if($.isEmptyObject(this.options.buttons)) return;

		var t = this;

		var $buttons = $('<div class="ui-dialog-buttons">').appendTo(t.container);

		$.each(t.options.buttons, function(index, item){
			if($.isFunction(item)){
				item = {
					events: {
						click: item
					},

					classname: ''
				};	
			}

			var $button = $('<a href="javascript:void(0);" class="ui-dialog-button" />').text(index).appendTo($buttons);

			$button.addClass(item.classname || item.className);

			$.each(item.events, function(index, callback){
				$button.bind(index, function(){
					callback.call(t, $button);
				});
			});
		});
	},

	bindClose: function(){
		var t = this;

		t.container.find('.ui-dialog-close').click(function(){
			t.close();
		});

		if(t.options.esc){
			$(document).keyup(function(e){
				//esc关闭
				if(e.keyCode == 27){
					t.close();
				}
			});
		}
	},

	setTitle: function(title){
		var $header = this.container.find('.ui-dialog-header');

		$header.removeClass('ui-dialog-header-nob').show();

		if(title === false){
			$header.hide();
		}else if(title == ''){
			$header.addClass('ui-dialog-header-nob');
		}

		$header.find('.ui-dialog-title').html(title);
	},

	resetPosition: function(){
		this.mask && this.mask.resetPosition();

		var wraper = this.wraper[0], position;

		if(wraper === doc.body){
			position = 'fixed';
			wraper = window;
		}else{
			position = 'absolute';
		}

		this.container.css({
			left: parseInt(($(wraper).outerWidth() - this.container.outerWidth())/2),
			top: parseInt(($(wraper).outerHeight() - this.container.outerHeight())/2),
			position: position
		});
	},

	open: function(){
		this.mask && this.mask.open();
		this.container.show();
		this.resetPosition();

		if(this.firstOpenStatus && $.isFunction(this.options.firstOpen)){
			this.firstOpenStatus = true;
			this.options.firstOpen.call(this);
		}

		$.isFunction(this.options.open) && this.options.open.call(this);
	},

	close: function(){
		this.mask && this.mask.close();
		this.container.hide();
		$.isFunction(this.options.close) && this.options.close.call(this);
	},

	destory: function(){
		this.destroy();
	},

	destroy: function(){
		this.mask && this.mask.destroy();
		this.container.remove();
	}
};

return Dialog;

});