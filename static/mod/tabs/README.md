##Tabs

###使用
```js
var tabs = new Tabs({
    dom: '#dom',  //外层dom
    attr: 'href',   //元素的获取target标识的属性
    currentclass: '',   //当前class
    currentindex: 0,    //当前初始化index
    callback: function(){}  //某次tab调用的callback
});
```

###API

* tabTo(index)  切换至某一项
