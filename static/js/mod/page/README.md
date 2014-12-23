Mask
===============

##简介
分页组件


##使用
```js
var page = new Page({
    dom: '#dom',
    pageTotal: 0, //整页数
    perPage: 10,  //显示几页
    url: '',    //url不为空，可直接跳转，而非调用callback
    first: true,  //显示首页
    last: true,   //显示最后一页
    currentPage: 1, //当前页码
    currentPageClassName: 'ui-page-current',  //当前页class
    pageClassName: '',  //页码class
    callback: function(page){}  //url不为空时 每次点击页码回调， 当前页不可重复点击，如需重新加载当前页，可直接调用pageto方法
});
```


##API
* PageTo(index)  index为需要跳转的页数，如果缺省，则执行当前页



    
