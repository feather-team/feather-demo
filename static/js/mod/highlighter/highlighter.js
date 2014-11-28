function SimpleHighLighter(dom, opt){
	var html = dom.innerHTML, object, opt = opt || {};
	
	switch(opt.type){
		case 'html':
			object = new HtmlHighLighter();
			break;
	
		case 'js':
			object = new JsHighLighter();
			break;
			
		case 'php':
			object = new PhpHighLighter();
			break;
			
		case 'css':
			object = new CssHighLighter();
			break;
			
		default:
			object = new BaseHighLighter();
	};
	
	html = '<pre class="simple-highlighter">' + object.parse((html || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')) + '</pre>';

	if(opt.title){
		html = '<pre class="simple-highlighter-title">' + opt.title + '</pre>' + html;
	}

	dom.innerHTML = html.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
}

function BaseHighLighter(){
	this.syntaxRegExp = {};	
	this.stylePrefix = '';
}
BaseHighLighter.prototype.parse = function(content){
	var keys = [], regs = [], skeys = [], sregs = [];

	for(var i in this.syntaxRegExp){
		if(this.syntaxRegExp.hasOwnProperty(i)){
			var reg = this.syntaxRegExp[i];
			
			if(reg instanceof Array){
				for(var j = 0; j < reg.length; j++){
					keys.push(i);
					regs.push('(' + reg[j] + ')');	
				}
			}else if(typeof reg == 'object'){
				skeys.push(i);
				sregs.push(reg);
			}else{
				keys.push(i);
				regs.push('(' + reg + ')');
			}
		}	
	}
	
	if(regs.length){
		content = this._parseBasic(content, keys, regs);
	}

	if(sregs.length){
		content = this._parseSpeical(content, skeys, sregs);
	}
	
	return this.stripTag(content);
};

BaseHighLighter.prototype.getKeyCodes = function(keycode, mode){
	return {
		keycode: keycode,
		mode: mode || 'g'
	};
};

BaseHighLighter.prototype._parseBasic = function(content, keys, regs){
	var self = this;
	
	return content.replace(new RegExp(regs.join('|'), 'g'), function(){
		for(var i = 1; i < arguments.length; i++){
			if(arguments[i]){
				return '<' + keys[i - 1] + '>' + arguments[i] + '</' + keys[i - 1] + '>';
			}	
		}
	});
};

BaseHighLighter.prototype._parseSpeical = function(content, keys, regs){
	var self = this;
	
	for(var i = 0; i < keys.length; i++){
		var reg = regs[i], keycode = reg.keycode.replace(/ /g, '|');
		var keyreg = new RegExp('(<([^>]+)>(?:(' + keycode + ')|[\\s\\S]*?)<\\/\\2>|(?:^|([^\\w_\\$\'"]))(' + keycode + ')(?:(?=[^\\w_\\$]|$)))', reg.mode);
		
		content = content.replace(keyreg, function(_0, _1, _2, _3, _4, _5){
			if(_3){
				return '<' + keys[i] + '>' + _3 + '</' + keys[i] + '>';
			}else if(_5){
				return (_4 || '') + '<' + keys[i] + '>' + _5 + '</' + keys[i] + '>';
			}
				
			return _0;	
		});	
	}
	
	return content;
};

BaseHighLighter.prototype.stripTag = function(content){
	var prefix = this.stylePrefix, stack = this.stack;
	
	return content.replace(/<([^>]+)>([\s\S]+?)<\/\1>/g, function(_0, _1, _2){
		return 	'<span class="' + prefix + _1 + '">' + _2 + '</span>';
	});	
};

BaseHighLighter.syntaxRegExp = {
	singleQuote: '\"(?:\\\\\"|[^\"\\\\]|\\\\[^\"])*?\"',
	doubleQuote: '\'(?:\\\\\'|[^\'\\\\]|\\\\[^\'])*?\'',
	comment1: '\\/\\*[\\s\\S]*?\\*\\/',
	comment2: '\\/\\/[^\\r\\n]*',
	comment3: '#[^\\r\\n]*'
};

function JsHighLighter(){
	this.syntaxRegExp = {
		quote: [BaseHighLighter.syntaxRegExp.singleQuote, BaseHighLighter.syntaxRegExp.doubleQuote],
		comment: [BaseHighLighter.syntaxRegExp.comment1, BaseHighLighter.syntaxRegExp.comment2],
		keycode: this.getKeyCodes(JsHighLighter.keyCodes),
		'function': '[\\$_\\w]+[_\\w]*(?=\\()'
	};
	
	this.stylePrefix = 'simple-highlighter-js-';
}

JsHighLighter.prototype = new BaseHighLighter();

JsHighLighter.keyCodes = 'in if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete true false null undefined NaN Infinity eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error Number Math Date String RegExp Array arguments'; 

function PhpHighLighter(){
	this.syntaxRegExp = {
		quote: [BaseHighLighter.syntaxRegExp.singleQuote, BaseHighLighter.syntaxRegExp.doubleQuote],
		comment: [BaseHighLighter.syntaxRegExp.comment1, BaseHighLighter.syntaxRegExp.comment2, BaseHighLighter.syntaxRegExp.comment3],
		keycode: this.getKeyCodes(PhpHighLighter.keyCodes, 'gi'),
		'function': '\\$?[_a-zA-Z]+[_\w]*(?=\\()',
		delimiter: '&lt;\\?(php)?|\\?&gt;'
	};

	this.stylePrefix = 'simple-highlighter-php-';
	
	this.phpstack = [];
}

PhpHighLighter.prototype = new BaseHighLighter();

PhpHighLighter.prototype.parse = function(content){
	var self = this;
	
	content = content.replace(/&lt;\?(?:php|=)[\s\S]*?(?:\?&gt;|\s*$)/g, function(_0){
		self.phpstack.push(BaseHighLighter.prototype.parse.call(self, _0));
		return '<<php>>';
	});
	
	content = (new HtmlHighLighter).parse(content);

	return content.replace(/<<php>>/g, function(){
		return self.phpstack.shift();
	});
	
	return content;
};

PhpHighLighter.keyCodes = 'and or class xor __FILE__ exception __LINE__ array as break case const continue declare default die do echo else elseif empty enddeclare endfor endforeach endif endswitch endwhile eval_r exit extends for foreach function global if include include_once isset list new print require require_once return static switch unset use var while __FUNCTION__ __CLASS__ __METHOD__ final php_user_filter interface implements extends public private protected abstract clone try catch throw cfunction old_function self';

function CssHighLighter(){
	this.syntaxRegExp = {
		comment: BaseHighLighter.syntaxRegExp.comment1,
		selector: '[#\\.]?[a-z\\*][^\\{\\}]*\\{|\\}',
		property: '\\s*[_\\-\\w]+\\w(?=:[^\\{]+?(?:[;\\}]|\\/\\*))',
		value: '[\\w#"\'][\\s\\S]+?(?=[;\\}]|\\/\\*)',
		mark: '[;:]'
	};
	
	this.stylePrefix = 'simple-highlighter-css-';
}

CssHighLighter.prototype = new BaseHighLighter();

function XmlHighLighter(){
	this.syntaxRegExp = {
		quote: [BaseHighLighter.syntaxRegExp.singleQuote, BaseHighLighter.syntaxRegExp.doubleQuote],
		property: '\\s+((?:(?!\'|"|\\/|&gt;).)+)'
	};	
	
	this.tagReg = /&lt;(?:(!--[\s\S]*?--)|([\s\S]*?))&gt;/g;
	
	this.stylePrefix = 'simple-highlighter-xml-';
}

XmlHighLighter.prototype = new BaseHighLighter();

XmlHighLighter.prototype.parse = function(content){
	var self = this;
	
	content = content.replace(this.tagReg, function(_0, _1, _2){
		if(_1){
			return '<comment>' + _0 + '</comment>';
		}else{
			return '<tag>' + BaseHighLighter.prototype.parse.call(self, _0) + '</tag>';	
		}
	});
	
	return this.stripTag(content);
};

function HtmlHighLighter(){
	this.stylePrefix = 'simple-highlighter-html-';
	this.stack = {};
}

HtmlHighLighter.prototype = new XmlHighLighter();

HtmlHighLighter.prototype.parse = function(content){
	var self = this;
	
	content = this.preProcess(content, 'script', JsHighLighter);
	content = this.preProcess(content, 'style', CssHighLighter);
	content = (new XmlHighLighter).parse(content);
	
	content = this.restoreProcess(content);
	
	return content;
};

HtmlHighLighter.prototype.preProcess = function(content, type, klass){
	var self = this;
	
	if(!self.stack[type]) self.stack[type] = [];

	return content.replace(new RegExp('(&lt;' + type + '[\\s\\S]*?&gt;)([\\s\\S]*?)(&lt;\/' + type + '&gt;)', 'g'), function(_0, _1, _2, _3){
		self.stack[type].push((new klass).parse(_2));
		return _1 + '<<' + type + '>>' + _3;
	});		
};

HtmlHighLighter.prototype.restoreProcess = function(content){
	var self = this;
	
	for(var i in self.stack){
		if(self.stack.hasOwnProperty(i)){
			content = content.replace(new RegExp('<<' + i + '>>', 'g'), function(){
				return self.stack[i].shift();	
			});
		}	
	}
	
	return content;
};

return SimpleHighLighter;