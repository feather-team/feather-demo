Draggable
=============

拖拽插件

##使用
```js
var d = new Draggable({
  dom: '#drag',//拖拽的元素
  handle: null,   //触发事件的dom
  start: function(){},  //拖动开始时触发的事件
  drag: function(){}, //拖动过程中触发的事件
  stop: function(){}, //停止拖动时发生的事件
  axis: null  //是否只X，Y轴拖动，默认为NULL， 水平拖动可填x，反之y
});
```

