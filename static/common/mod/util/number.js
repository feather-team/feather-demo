var string = require('./string.js');

module.exports = {
	//给数字加千分位XX
	format: function(num){
		if(!num) return 0;
		return string.reverse(string.reverse(num).replace(/\d{3}/g, '$&,')).replace(/^,/, '');
	},

	toInt: function(number){
		number = parseInt(number);
		return isNaN(number) ? 0 : number;
	}
};