var $ = require('jquery'), Mask = require('mask'), body = document.body, Math = window.Math;

/*
var l = new LightBox({
	dom: $('#lightbox img'),
	srcAttr: 'data-src'
});

//dom节点有更新，需destory后，重新new一次
l.destory
*/

var Lightbox = module.exports = function(opt){
	this.options = $.extend({
		dom: null,
		srcAttr: 'data-lightbox-url'
	}, opt || {});

	this.init();
};

Lightbox.prototype = {
	init: function(){
		var self = this;

		self.doms = $(this.options.dom);
		self.mask = new Mask({autoOpen: false});
		self.index = 0;
		self.container = $([
			'<div class="ui-lightbox-container">',
				'<div class="ui-lightbox-content">',
					'<a href="javascript:void(0);" class="ui-lightbox-prev"></a>',
					'<a href="javascript:void(0);" class="ui-lightbox-next"></a>',
				'</div>',
				'<div class="ui-lightbox-bottom">',
					'<a href="javascript:void(0);" class="ui-lightbox-close">&times;</a>',
					'<span class="ui-lightbox-alt"></span>',
				'</div>',
			'</div>'
		].join('')).appendTo(body);
		self.content = self.container.find('.ui-lightbox-content');
		self.bottom = self.container.find('.ui-lightbox-bottom');
		self.prev = self.container.find('.ui-lightbox-prev');
		self.next = self.container.find('.ui-lightbox-next');

		self.items = $.map(self.doms, function(item, k){
			return {
				alt: item.alt,
				src: $(item).attr(self.options.srcAttr)
			};
		});

		self.bindEvent();
	},

	bindEvent: function(){
		var self = this; 

		self.doms.each(function(index){
			$(this).click(function(){
				self.open(index);
				return false;
			});
		});

		$(window).resize(function(){
			self.reset();
		});

		self.bottom.find('.ui-lightbox-close').click(function(){
			self.close();
		});

		self.prev.click(function(){
			self.open(--self.index);
		});

		self.next.click(function(){
			self.open(++self.index);
		});
	},

	reset: function(){
		this.container.css('left', parseInt(($(window).width() - this.container.outerWidth())/2));
	},

	load: function(index){
		var self = this, $item = self.getItem(index), item = self.items[index];

		self.content.find('img').hide();
		self.bottom.hide().find('.ui-lightbox-alt').html(item.alt);
		self.prev.hide();
		self.next.hide();

		if(!$item.length){
			var $img = $('<img />').attr({
				src: item.src + '?lightbox-random=' + Math.random(),
				alt: item.alt,
				'data-lightbox-index': index
			}).load(function(){
				self.loadComplete($(this));
			}).appendTo(self.content);
		}else{
			self.loadComplete($item.show());
		}
	},

	loadComplete: function($item){
		var self = this, $content = self.content.css('opacity', 0);
		var width = $item.width(), height = $item.height(), _width = self.container.width(), _height = $content.height();
		var abs = Math.abs, max = Math.max, time = Lightbox.DEFAULT_TIME;

		self.container.animate({
			width: width,
			left: '-=' + (width - _width)/2
		}, time * abs(width - _width)/max(width, _width), function(){
			self.reset();
			$content
				.animate({height: height}, time2 = time * abs(height - _height)/max(height, _height))
				.animate({opacity: 1}, time, function(){
					self.index && self.prev.show();
					(self.index < self.items.length - 1) && self.next.show();
					self.bottom.slideDown();
				});
		});
	},

	getItem: function(index){
		return this.content.find('[data-lightbox-index=' + index + ']');
	},

	open: function(index){
		var self = this;

		if(!self.items.length) return;

		self.mask.open();
		self.container.show();
		self.reset();
		self.load(self.index = index == null ? self.index : index);
	},

	close: function(){
		this.mask.close();
		this.container.hide();
	},

	destory: function(){
		this.mask.destory();
		this.container.remove();
		this.items.length = 0;
	}
};

Lightbox.DEFAULT_TIME = 1000;