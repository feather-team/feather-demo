var CryptoJS = require('./lib/md5.js');

var util = module.exports = {
	object: {
		get: function(data, name){
			if(data[name]){
				return data[name];
			}

			name = name.split('.');

			var i = 0, len = name.length, tmp = data;

			for(; i < len; i++){
				tmp = tmp[name[i]];

				if(tmp == null) return null;
			}

			return tmp;
		},

		set: function(data, name, value){
			if(typeof value == 'undefined'){
				data = name;
			}else{
				name = name.split('.');

				var i = 0, len = name.length - 1, tmp = data;

				for(; i < len; i++){
					var tmpName = name[i];

					if(typeof tmp[tmpName] != 'object' || !tmp[tmpName]){
						tmp[tmpName] = {};
					}

					tmp = tmp[tmpName];
				}

				tmp[name[i]] = value;
			}
		}
	},

	number: {
		//给数字加千分位XX
		format: function(num){
			if(!num) return 0;
			return util.string.reverse(util.string.reverse(num).replace(/\d{3}/g, '$&,')).replace(/^,/, '');
		}
	},

	string: {
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
		
		toInt: function(number){
			number = parseInt(number);
			return isNaN(number) ? 0 : number;
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
		}
	},

	date: {
		//获取当前时间戳
		time: function(){
			return (new Date).getTime();	
		},

		//返回和php一样的时间格式
		//如Date.date('Y-m-d H:i:s'); 2012-09-10 11:10:00
		//Y 4位年
		//y 2位年
		//m 2位月
		//n 不加0的月
		//d 2位 当前多少日
		//j 不加0的日
		//D 星期几
		//h 不加0的小时
		//H 2位小时
		//i 2位分
		//s 2位秒
		//a am或者pm
		//A AM或者PM
		//t 当前月有多少天
		date: function(str, time){
			if( !str ) return ;

			var date = new Date, temp = [], toPad = util.string.toPad;

			if( time ) date.setTime( time );

			for( var i = 0, j = str.length; i < j; i++ ){
				var value = str.charAt(i);

				switch( value ){
					case 'Y': value = date.getFullYear(); break;
					case 'y': value = String( date.getFullYear() ).substring( 0, 2 ); break;
					case 'm': value = toPad( date.getMonth() + 1, 0, 2, true ); break;
					case 'n': value = date.getMonth() + 1; break;	
					case 'd': value = toPad( date.getDate(), 0, 2, true ); break;
					case 'j': value = date.getDate(); break;
					case 'D': value = date.getDay() + 1; break;
					case 'h': value = toPad( date.getHours() % 12, 0, 2, true ); break;
					case 'H': value = toPad( date.getHours(), 0, 2, true ); break;
					case 'i': value = toPad( date.getMinutes(), 0, 2, true ); break;
					case 's': value = toPad( date.getSeconds(), 0, 2, true ); break;
					case 'a': value = date.getHours() - 12 < 0 ? 'am' : 'pm'; break;
					case 'A': value = date.getHours() - 12 < 0 ? 'AM' : 'PM'; break;
					case 't': value = (new Date( date.getFullYear(), date.getMonth() + 1, 0 ) ).getDate(); break;

					default: ;
				};

				temp.push( value );
			}

			return temp.join('');
		}	
	}
};