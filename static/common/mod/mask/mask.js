;(function(window, factory){
if(typeof define == 'function'){
	//seajs or requirejs environment
	define(function(require, exports, module){
		return factory(
			require('common:jquery')
		);
	});
}else{
	window.FeatherUi = window.FeatherUi || {};
	window.FeatherUi.Mask = factory(window.jQuery || window.$);
}
})(window, function($){

var doc = document;

function Mask(opt){
	this.options = $.extend({
		autoOpen: true,
		container: doc.body,
		color: '#000',
		opacity: 0.6
	}, opt || {});

	this.init();
}

Mask.prototype = {
	init: function(){
		var self = this, container = self.container = $(self.options.container);

		if(container[0] != doc.body){
			!/fixed|absolute/.test(container.css('position')) && container.css('position', 'relative');
		}
		
		self.mask = $('<div class="ui-mask">').hide().css({
			backgroundColor: self.options.color,
			opacity: self.options.opacity
		}).appendTo(self.container);

		self.options.autoOpen && this.open();

		$(window).resize(function(){
			self.resetPosition();
		});
	},

	open: function(){
		this.resetPosition();
		this.mask.show();
	},

	close: function(){
		this.mask.hide();
	},

	resetPosition: function(){
		var container = this.container[0];

		this.mask.css({
			width: container.scrollWidth || doc.documentElement.scrollWidth,
			height: container.scrollHeight || doc.documentElement.scrollHeight
		});
	},

	destory: function(){
		this.destroy();
	},

	destroy: function(){
		this.mask.remove();	
	}
};

return Mask;

});