var $ = require('common:jquery'), util = require('common:util'), toPad = util.string.toPad, body = document.body;

var Calendar = module.exports = function(options){
	this.options = $.extend({
		container: body,
		target: null,
		handle: null,
		maxDate: null,
		minDate: null,
		dateFormat: 'Y-m-d',
		callback: function(){},
		onSelect: function(){
			this.close();
		}
	}, options || {});

	this.init();
}

Calendar.prototype = {
	init: function(){
		var self = this, opt = self.options;

		if(self.options.target){
			self.target = $(self.options.target);
		}

		self.wraper = $('<div class="ui-calendar"></div>');
		self.container = $(self.options.container).append(self.wraper);

		self.container[0] == body && self.wraper.css('position', 'absolute');

		if(opt.minDate){
			self.minDate = typeof opt.minDate == 'string' ? opt.minDate : self.getDate(opt.minDate);
		}

		if(opt.maxDate){
			self.maxDate = typeof opt.maxDate == 'string' ? opt.maxDate : self.getDate(opt.maxDate);
		}

		self.toMonth();
		self.bindEvent();
		self.close();
	},

	bindEvent: function(){
		var self = this, opt = self.options, $handle = opt.handle ? $(opt.handle) : self.target;

		if($handle){
			$handle.click(function(){
				self.open();
				self.resetPosition();
			});
		}

		$(window).on('resize scroll', function(){
			self.resetPosition();
		});

		var handle = $handle[0];

		$(document).click(function(e){
			e.target != handle && self.close();
		});

		self.wraper.click(function(e){
			var target = $(e.target);

			if(target.hasClass('ui-calendar-prev')){
				self.prevMonth();
			}else if(target.hasClass('ui-calendar-next')){
				self.nextMonth();
			}else if(target.hasClass('ui-calendar-item') && !target.hasClass('ui-calendar-item-disable')){
				var date = target.attr('data-calendar-date');

				opt.onSelect && opt.onSelect.call(self, date);
				self.target && self.target.val(date).html(date);
			}

			e.stopPropagation();
		});
	},

	prevMonth: function(){

		this.toMonth(this.year, this.month - 1);
	},

	nextMonth: function(){
		this.toMonth(this.year, this.month + 1);
	},

	toMonth: function(year, month){
		var self = this, date = new Date;

		year && date.setFullYear(year);

		if(month != null){
			date.setDate(1);
			date.setMonth(month);
		}

		self.year = date.getFullYear();
		self.month = date.getMonth();

		self.createCalendar();
		self.options.callback && self.options.callback.call(self);
		self.resetPosition();
	},

	createCalendar: function(){
		var self = this;

		self.wraper.find('.ui-calendar-container').remove();
		$('<table class="ui-calendar-container" />').appendTo(self.wraper).append(self.createCalendarHeader(), self.createCalendarItems());
	},

	createCalendarItems: function(){
		var self = this, opt = self.options, startDate = new Date(self.year, self.month, 1), endDate = new Date(self.year, self.month + 1, 0);
		var today = self.getDate(new Date), 
			start = startDate.getDay(), 
			max = endDate.getDate(), 
			line = Math.ceil((start + max)/7),
			html = [], index = 1;

		for(var i = 0; i < line; i++){
			var x = [];

			for(var j = 0; j < 7; j++){
				if(j < start && i == 0 || index > max){
					x.push('<td>&nbsp;</td>');
				}else if(index <= max){
					var d = self.getDate(new Date(self.year, self.month, index)), cn = 'ui-calendar-item';

					if(today == d){
						cn += ' ui-calendar-item-today';
					}

					if(self.minDate && d < self.minDate || self.maxDate && d > self.maxDate){
						cn += ' ui-calendar-item-disable';
					}

					x.push('<td><a href="javascript:" data-calendar-date="' + d + '" class="' + cn + '">' + index++ + '</a></td>');
				}
			}

			html.push('<tr>' + x.join('') + '</tr>');
		}

		return '<tbody>' + html.join('') + '</tbody>';
	},

	createCalendarHeader: function(){
		var html = [], month = this.year + '.' + toPad(this.month + 1, 0, 2, true);

		$.each(Calendar.WEEKNAME, function(index, name){
			html.push('<th>' + name + '</th>');
		});

		return [
			'<thead>', 
				'<tr class="ui-calendar-title">',
					'<th colspan="7">',
						'<a href="javascript:" class="ui-calendar-next"></a>',
						'<a href="javascript:" class="ui-calendar-prev"></a>',
						'<span class="ui-calendar-date">' + month + '</span>',
					'</th>',
				'</tr>',
				'<tr>' + html.join('') + '</tr>',
			'</thead>'
		].join('');
	},

	open: function(){
		this.wraper.show();
		this.resetPosition();
	},

	close: function(){
		this.wraper.hide();
	},

	resetPosition: function(){
		if(!this.target) return;

		var self = this, offset = self.target.offset(), scrollTop = document.body.scrollTop || document.documentElement.scrollTop, top;

		if(scrollTop + $(window).height() < offset.top + self.wraper.outerHeight()){
			top = offset.top - self.wraper.outerHeight() - 1;
		}else{
			top = offset.top + self.target.outerHeight() + 1;
		}

		self.wraper.css({
			left: offset.left,
			top: top
		});
	},

	getDate: function(date){
		return util.date.date(this.options.dateFormat, date.getTime());
	}
};

Calendar.WEEKNAME = ['日', '一', '二', '三', '四', '五', '六'];

return Calendar;