var $ = require('common:jquery'), doc = document, body = doc.body;

function Mask(opt){
	this.options = $.extend({
		autoOpen: true,
		container: body
	}, opt || {});

	this.init();
}

Mask.prototype = {
	init: function(){
		var self = this, container = self.container = $(self.options.container);

		if(container[0] != body){
			!/fixed|absolute/.test(container.css('position')) && container.css('position', 'relative');
		}
		
		self.mask = $('<div class="ui-mask">').hide().appendTo(self.container);

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