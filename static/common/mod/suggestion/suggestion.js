;(function(window, factory){
if(typeof define == 'function'){
	//seajs or requirejs environment
	define(function(require, exports, module){
		return factory(
			require('common:jquery'),
			require('common:util')
		);
	});
}else{
	window.FeatherUi = window.FeatherUi || {};
	window.FeatherUi.Suggestion = factory(window.jQuery || window.$, window.FeatherUi.Util);
}
})(window, function($, Util){
	
function Suggestion(opts){
	this.options = $.extend({
		dom: null,
		width: false,
		max: 10,
		caching: true,
		url: null,
		data: null,
		delay: 300,
		empty2close: true,
		emptyNoCache: false,
		kw: 'kw',
		requestParams: {},
		resultField: '',
		match: null,
		format: null,
		build: function(){},
		switchCallback: function(){},
		callback: function(){},
		cancel: function(){}
	}, opts || {});

	this.init();
}

Suggestion.prototype = {
	init: function(){
		var self = this, opts = self.options;

		self.dom = $(opts.dom).attr('autocomplete', 'off');
		self.parent = self.dom.parent();

		!/fixed|absolute/.test(self.parent.css('position')) && self.parent.css('position', 'relative');

		self.suggest = $('<ul class="ui-suggestion"><li class="ui-suggestion-header"></li><li class="ui-suggestion-footer"></li></ul>').appendTo(self.parent);
		self.xhr = null;
		self.tid = null;
		self.index = null;

		self.setData(opts.data);

		self.initEvent();
	},

	initEvent: function(){
		var self = this, opts = self.options, over = false;

		self.dom.on('keyup paste cut', function(e){
			if(e.keyCode == 13){
				var $current = self.suggest.find('.ui-suggestion-active');

				if($current.length){
					self.setKw($current.attr('data-suggestion-kw'), $current, true);
				}

				return self.close();
			}else{
				!Suggestion.isUDEvent(e) && self.match();
			}
		}).focus(function(){
			self.match();
		}).keydown(function(e){
			Suggestion.isUDEvent(e) && self.switchKw(e);
		}).blur(function(e){
			if(!over){
				self.close();
				opts.cancel && opts.cancel.call(this);
			}
		});

		self.suggest.delegate('.ui-suggestion-item', 'click', function(){
			self.setKw($(this).attr('data-suggestion-kw'), $(this), true);
			self.close();
		}).hover(function(){
			over = true;
		}, function(){
			over = false;
		});

		self.suggest.find('.ui-suggestion-header, .ui-suggestion-footer').click(function(){
			self.dom.focus();
		});
	},

	setKw: function(value, $item, execCallback){
		var self = this;

		self.dom.val(value);
		execCallback && self.options.callback && self.options.callback.call(self, value, $item);
	},

	switchKw: function(e){
		var self = this;

		if(!self.items) return;

		var code = e.keyCode, max = self.items.length - 1, index = self.index == null ? -1 : self.index;

		if(code == 38){
			index--;
		}else{
			index++;
		}

		if(index < 0){
			index = max;
		}else if(index > max){
			index = 0;
		}

		self.index = index;
		
		self.items.removeClass('ui-suggestion-active');

		var $item = self.items.eq(index).addClass('ui-suggestion-active');
		var kw = $item.attr('data-suggestion-kw');

		self.setKw(kw);
		self.options.switchCallback && self.options.switchCallback.call(self, kw, $item);
		
		e.preventDefault();
	},

	setData: function(data){
		this.data = data;
	},

	setTitle: function(title){
		this.setHeader(title);
	},

	setHeader: function(header){
		var $header = this.suggest.find('.ui-suggestion-header');

		if(!header){
			$header.hide();
		}else{
			$header.html(header).show();
		}
	},

	setFooter: function(footer){
		var $footer = this.suggest.find('.ui-suggestion-footer');

		if(!footer){
			$footer.hide();
		}else{
			$footer.html(footer).show();
		}
	},

	setRequestParams: function(params){
		this.options.requestParams = params;
	},

	match: function(){
		var self = this, opts = self.options;

		self.cancelMatch();

		//request remote data
		self.tid = setTimeout(function(){
			var kw = self.dom.val();

			if(!$.trim(kw) && opts.empty2close){
				self.close();
				return;
			}

			var data = self.data, cache = opts.caching && !(!$.trim(kw) && opts.emptyNoCache) ? Suggestion.cache[kw] : false;
			
			if(data && (data = self._match.call(self, data, kw)).length){
				//if kw can be find in local data
				self.build(data, kw);
			}else if(cache){
				//if kw in cache
				self.build(cache, kw);
			}else if(opts.url){
				var params = $.extend({}, opts.requestParams);
				params[opts.kw] = kw;

				self.xhr = $.getJSON(opts.url, params, function(data){
					if(opts.resultField){
						data = Util.object.get(data, opts.resultField) || [];
					}
					
					data = Suggestion.cache[kw] = self._match.call(self, data, kw);
					self.build(data, kw);
				});
			}
		}, opts.delay);	
	},

	cancelMatch: function(){
		var self = this;

		self.xhr && self.xhr.abort();
		self.tid && clearTimeout(self.tid);
	},

	_match: function(data, kw){
		var self = this, opts = self.options;

		if(opts.match){
			data = opts.match.call(self, data, kw);
		}

		return data.slice(0, opts.max);
	},

	build: function(data, kw){
		var self = this, opts = self.options;

		self.index = null;

		if(!data.length){
			self.suggest.empty();
			self.items = null;
			self.close();
		}else{
			var html = '';
			
			$.each(data, function(key, item){
				html += '<li class="ui-suggestion-item" data-suggestion-index="' + key + '" data-suggestion-kw="' + item + '">' + self.format(item, kw) + '</li>';
			});

			self.items = $(html);
			self.suggest.find('.ui-suggestion-item').remove().end().find('.ui-suggestion-header').after(self.items);
			self.open();

			opts.build && opts.build.call(self);
		}
	},

	open: function(){
		var self = this;
		
		if(!self.items) return;

		var $dom = self.dom;
		var position = $dom.position();

		self.suggest.show().css({
			left: position.left,
			top: position.top + $dom.outerHeight(),
			width: self.options.width || ($dom.outerWidth() - 2)
		});
	},

	close: function(){
		var self = this;

		self.suggest.hide();
	},

	format: function(text, kw){
		var self = this, opts = self.options;

		if(opts.format){
			return opts.format.call(self, text, kw);
		}

		return text;
	}
};


Suggestion.cache = {};

Suggestion.isUDEvent = function(e){
	return e.keyCode == 38 || e.keyCode == 40;
};

return Suggestion;

});