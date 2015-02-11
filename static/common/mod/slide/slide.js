var $ = require('common:jquery'), now = $.now;//, Draggable = require('draggable');

var Slide = module.exports = function(opt) {
	this.options = $.extend({
		time: 1000,
		dom: null,
		cps: 1,
		noGap: false,
		easing: null,
		mode: 'horizontal',
		before: function(){},
		after: function(){}
	}, opt || {});

	this.init();
};

Slide.prototype = {
	init: function(){
		var self = this;
		self.index = 0;
		self.isRuning = false;
		self._start = 0;	//为了兼容日后的一个问题
		self.mode = Slide.getMode(self.options.mode);
		self.dom = $(self.options.dom);
		
		!/absolute|fixed/.test(self.dom.css('position')) && self.dom.css('position', 'relative');

		this.refresh();
		/*this.bindDrag();*/
	},

	refresh: function(){
		var self = this, opt = self.options, attr = Slide.DATA_CLONE;
		self.children = self.dom.children().filter(function(){
			return this.getAttribute(attr) == null;
		});

		if(opt.noGap){
			self.dom.children('[' +  attr + ']').remove();

			var $clone = self.children.clone().prependTo(self.dom).attr(attr, '');
			$clone.clone().appendTo(self.dom);

			self._start = self.children.length;
		}

		self.max = self.getMaxIndex();
		self.count = self.max + 1;
		self.all = self.dom.children();
		self.dom.css(self.mode, self.getTargetValue(self.index));
	},

/*	bindDrag: function(){
		var self = this, source;

		new Draggable({
			axis: self.mode == 'left' ? 'x' : 'y',
			dom: self.dom,
			start: function(left, top){
				source = self.mode == 'left' ? left : top;
			},
			stop: function(){
				var 
				move = parseInt(self.dom.css(self.mode)) - source, 
				index = self.index + (move < 0 ? 1 : -1),
				range = Math.abs(self.getTargetValue(index) - self.getTargetValue(self.index));
				var time = move = Math.abs(move);

				if(move < range/2){
					index = self.index;
				}else{
					time = range - move;
				}

				self.to(index, self.options.time * time / range, true);
			}
		});
	},*/

	to: function(index, time, uncheck){
		var self = this;

		if(self.isRuning || !uncheck && self.index == index) return;

		if(!self.options.noGap){
			if(index < 0 || index > self.max) return;

			self.start(self.index = index, time);
		}else{
			self._index = index;
			self.index = index % self.count;

			if(self.index < 0){
				self.index = self.count + index;
			}

			self.start(index, time);
		}
	},

	start: function(index, time){
		var self = this, opt = self.options, obj = {};

		obj[self.mode] = self.getTargetValue(index);

		self.isRuning = true;
		opt.before && opt.before.call(self);

		self._duration = time || opt.time;
		self._startTime = now();
		self.dom.animate(obj, self._duration, opt.easing, function(){
			if(index != self.index){
				self.dom.css(self.mode, self.getTargetValue(self.index));
			}
			
			self.isRuning = false;
			opt.after && opt.after.call(self);
		});
	},

	stop: function(){
		this.dom.stop();
		this.isRuning = false;
	},

	pause: function(){
		this._endTime = now();
		this.stop();
	},

	resume: function(){
		var self = this, time;

		time = Math.max(1, self._duration - (self._endTime - self._startTime));
		self.start(self.options.noGap ? self._index : self.index, time);
	},

	toNext: function(){
		this.to(this.index + 1);
	},

	toPrev: function(){
		this.to(this.index - 1);
	},

	toFirst: function(){
		this.to(0);
	},

	toLast: function(){
		this.to(this.max);
	},

	isFirst: function(){
		return this.index == 0;
	},

	isLast: function(){
		return this.index == this.max;
	},

	getMaxIndex: function(){
		var self = this;
		return Math.ceil(self.children.length / self.options.cps) - 1;
	},

	getChildren: function(index){
		var self = this;
		return self.all.eq(self._start + index * self.options.cps);
	},

	getTargetValue: function(index){
		return -this.getChildren(index).position()[this.mode];
	}
};

$.extend(Slide, {
	DATA_CLONE: 'data-slide-clone',

	getMode: function(mode){
		return mode == 'horizontal' ? 'left' : 'top';
	}
});