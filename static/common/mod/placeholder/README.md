##PlaceHolder
为不兼容HTML5的浏览器实现Plcaceholder属性

##使用
```html
<input type="text" id="username" name="username" placeholder="输入用户名" />
```

```js
new PlaceHolder({
    dom: '#username',
    text: 'xxx' //也可以不设置placeholder属性 而设置text字段，text字段里的内容会被自动设置成placeholder
});
```
