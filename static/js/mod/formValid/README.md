##FormValid

表单验证组件

###使用
```js
var fv = new FormValid({
    dom: '#form',
    rules: {
        username: {
            rule: /^\S+$/,
            errorText: '不能为空'
        },
        
        //rule也可为数组
        mobile: [       
            {
                rule: /^\S+$/,
                errorText: '不能为空'
            },
            
            {
                //rule可为函数
                rule: function(value){
                    return value.length == 11;
                },
                errorText: '手机号码必须为11位'
            }
        ]
    }
});

$('#form').submit(function(){
    if(fv.check()){
        //success
    }else{
        //error
    }
    
    return false;
});
```

###API

* check(name)   检查表单中 name值为name的项是否通过验证 如果缺省，则验证所有字段
```js
fv.check('username');
```

* error(name, text) 手动为某一元素报错

* reset(name)   为某一元素手动清除异常状态，缺省，则为所有字段

* addRule() 添加规则
```js
fv.addRule('password', {
    rule: function(){},
    errorText: 'xxxx'
});
```
