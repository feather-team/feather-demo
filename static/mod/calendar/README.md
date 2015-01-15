Calendar
==================

日历插件

##使用
```js
var c = new Calendar({
	target: '#input',	//需要绑定日历的元素，日历点击后的元素的值会自动设置
	handle: null,	//触发日历打开的元素，默认为空，则为target元素
	dateFormat: 'Y/m/d',	//参考util插件中的date.date使用，同php date函数调用
	minDate: '2014/11/03',	//最小能点击的日期，格式同dateFormat,否则可能会出现异常，也可为一Date类型对象 new Date(2001, 1, 1);
	maxDate: '2014/12/12',	//最大能点击日期
	onSelect: function(date){this.close();}	//每次选择后，触发的时间，默认会自动关闭日历，如重写后需手动触发关闭事件
});
```

##API

* prevMonth()	回到上个月

* nextMonth()	跳到下个月

* toMonth(year, month)	跳至指定月份

* open() 打开日历

* close() 关闭日历
 
* reset()	重新设置日历位置，位置发生异常时，可调用该方法，该方法默认触发为 window发生resize和scroll以及open和重新创建日历时，均会触发该方法	