Class
=====================

##使用
```js
//book类
var Book = Class({
	//构造函数传进来的参数
	options: {
		//书的名字
		name: '',
		//书的价格
		price: 0		
	},
	
	//在bookcache中的id
	bookid: 0,
	
	//构造函数
	initialize: function( opt ){
		//设置传进来的参数
		this.setOptions( opt );
		
		//设置bookid
		this.bookid = Book.bookCache.length;
		
		//缓存
		Book.bookCache[this.bookid] = this;
	},
	
	//获取bookid
	getBookid: function(){
		return this.bookid;	
	},
	
	
	//获取name
	getName: function(){
		return this.options.name;
	},
	
	//获取price
	getPrice: function(){
		return this.options.price;	
	}
});
//book类的静态属性  缓存所有被实例化的书
Book.bookCache = [];
//一个 打折扣的书的类
var RebateBook = Class({
	//继承于 book类
	extend: Book,
	
	//默认折扣1 不打折
	rebate: 1,
	
	//此处可不设置, 因为演示 子类会自动去继承父类的initialize
	initialize: function( opt ){
		//执行父类的构造函数
		this.parent( opt );	
	},
	
	//设置折扣
	setRebate: function( rebate ){
		this.rebate = rebate;
	},
	
	//获取价格
	getPrice: function(){
		//调用父类的方法 返回正常的价格后 * 折扣 = 真实价格
		return this.parent.getPrice.call( this ) * this.rebate;	
	}
});
//实例化一本书
var a = new RebateBook({
	name: 'china',
	price: 100	
});
//设置a的折扣
a.setRebate( 0.5 );
//实例化一本书
var b = new RebateBook({
	name: 'usa',
	price: 50	
});
//设置b的折扣
b.setRebate( 0.8 );
//打印a的bookid
//a bookid:  0
console.log( 'a bookid: ', a.getBookid() );
//打印a的price
//a price:  50
console.log( 'a price: ', a.getPrice() );
//打印b的bookid
//b bookid:  1
console.log( 'b bookid: ', b.getBookid() );
//打印b的price
//b price:  40
console.log( 'b price: ', b.getPrice() );
//打印book cache length
//book cache length:  2
console.log( 'book cache length: ', Book.bookCache.length );
```

##构造函数initialize
```js
var A = Class({
  initialize: function(){
    console.log(1);
  }
});

new A; //console 1
```

##重写默认options参数
```js
var A = Class({
  options: {
    name: 123
  },
  
  intialize: function(opt){
    this.setOptions(opt);
  }
});

var a = new A({name: '333'});
console.log(a.options.name) //333
```

##继承方式
```js
var A = Class({
  getName: function(){
    return 'aa';
  }
});

var B = Class({
  extend: A

  getName: function(){
    this.parent.getName.call(this) + 'bb';
  }
});

var b = new B;
console.log(b.getName()) //aabb
```
