var CryptoJS = require('./lib/crypto.js'), base64 = require('./lib/base64.js');
var object = require('./object.js');

module.exports = {
	/**
	 * 将一个string 进行左右补全
	 * @param str
	 * @param pad  补全的字符
	 * @param length  补全的长度
	 * @param leftmode  是否左边补全
	 * @returns
	 */
	toPad: function(str, pad, length, leftmode){
		var temp = '';

		str = String(str);

		pad = String(pad);

		length = length - str.length;

		while(length-- > 0){
			temp += pad;
		}

		return leftmode == true ? (temp + str) : (str + temp);
	},

	pad: function(str, pad, length, leftmode){
		return this.toPad(str, pad, length, leftmode);
	},
	
	/**
	 * 将string中的换行符替换为 html换行
	 */
	nl2br: function(str){
		return String(str || '').replace(/[\r\n]/g, '<br />');
	},
	
	/**
	 * 检查一个字符串是否为空
	 */
	empty: function(str){
		return /^\s*$/.test(str);
	},

	reverse: function(string){
		return String(string).split('').reverse().join('');
	},

	md5: function(string, pad){
		string = CryptoJS.MD5(String(string)).toString();

		if(pad){
			return this.md5(this.reverse(string) + pad);
		}

		return string;
	},

	base64Encode: function(str){
		return base64.btoa(str);
	},

	base64Decode: function(str){
		return base64.atob(str);
	},

	crypto: CryptoJS,

	toJSONString: object.toJSONString,
	jsonEncode: object.toJSONString,
	parseJSON: object.parseJSON,
	jsonDecode: object.parseJSON
};