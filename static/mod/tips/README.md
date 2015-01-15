Tips
=========

###简介
额~, 你也懂的

###API
* destory 销毁对象


###使用
* new Tips(opt)
```js
var tips = new Tips({
  content: '123',
  mask: true,     //开启遮罩
  timeout: false  //手动关闭
});


setTimeout(function(){
  tips.destory();
}, 3000);
```


* Tips.show(content[, mask, timeout, classname]);
```js
Tips.show('123', true, 3000, 'ui-tips-error');
```


* Tips.error(content[, mask, timeout]);
```js
Tips.error('123', true, 3000);
```

* Tips.success(content[, mask, timeout]);

* Tips.loading(content[, mask, timeout]);

* Tips.wran(content[, mask, timeout]);
