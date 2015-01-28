var $ = require('common:jquery'), Mask = require('common:mask'), Dialog = require('common:dialog');


function Tips(opt){
	this.options = $.extend({
		content: '',
		timeout: 3000,
		mask: false
	}, opt || {});

	this.init();
}

Tips.prototype = {
	init: function(){
		var self = this, opt = self.options;

		Tips.destroy; Tips.instance = self;

		self.$ = new Dialog({
			autoOpen: true,
			mask: opt.mask,
			title: false,
			width: false,
			content: opt.content
		});

		self.$.container.addClass('ui-tips');

		if(typeof opt.timeout == 'number'){
			self.id = setTimeout(function(){
				self.destroy();
			}, opt.timeout);	
		}
	},

	destroy: function(){
		this.$.destroy();
		clearTimeout(this.id);
	}
};

Tips.instance = null;

Tips.destroy = function(){
	if(Tips.instance){
		Tips.instance.destroy();
	}
};

Tips.show = function(content, timeout, mask, classname){
	var tips = new Tips({
		content: content,
		timeout: timeout,
		mask: mask
	});

	if(classname) tips.$.container.find('.ui-dialog-content').addClass(classname);

	return tips;
};

$.each(['success', 'error', 'warn', 'loading'], function(index, item){
	Tips[item] = function(content, timeout, mask){
		return Tips.show(content, timeout, mask, 'ui-tips-' + item);
	};
});

return Tips;