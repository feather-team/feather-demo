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
	window.FeatherUi.PlaceHolder = factory(window.jQuery || window.$);
}
})(window, function($){

function PlaceHolder(opt){
	this.options = $.extend({
		dom: null,
		text: ''
	}, opt || {});

	this.init();
}

PlaceHolder.prototype = {
	init: function(){
		var self = this, $dom = self.dom = $(self.options.dom);
		var text = self.options.text || $dom.attr('placeholder') || $dom.attr('data-placeholder');

		if(PlaceHolder.isSupport){
			$dom.attr('placeholder', text);
		}else{
			var gid = $dom.attr('data-ui-placeholder-gid');

			if(gid && PlaceHolder.CACHE[gid]){
				PlaceHolder.CACHE[gid].setPlaceHolder(text);
				return;
			}

			PlaceHolder.CACHE[self.GID = PlaceHolder.GID++] = self;

			self.setPlaceHolder(text);

			$dom.blur(function(){
				this.value == '' && self.placeholder.show();
			}).blur().attr({
				'data-placeholder': text,
				'data-ui-placeholder-gid': self.GID
			}).focus(function(){
				self.placeholder.hide();
			}).removeAttr('placeholder');
		}
	},

	setPlaceHolder: function(text){
		var $dom = this.dom;

		if(!this.placeholder){
			if(!/fixed|absolute/.test($dom.parent().css('position'))){
				$dom.parent().css('position', 'relative');
			}

			this.placeholder = $('<input type="text" />').css({
				width: $dom.innerWidth(),
				height: $dom.innerHeight(),
				lineHeight: $dom.innerHeight() + 'px',
				background: 'transparent'
			}).insertAfter($dom).addClass('ui-placeholder').click(function(){
				$(this).hide();
				$dom.focus();
			});
		}

		this.placeholder.css({
			top: $dom.position().top + parseInt($dom.css('border-top-width')),
			left: $dom.position().left + parseInt($dom.css('border-left-width'))
		}).val(text);
	}
};

PlaceHolder.isSupport = 'placeholder' in document.createElement('input');
PlaceHolder.CACHE = [];
PlaceHolder.GID = 1;

return PlaceHolder;
});