;(function(window, factory){
if(typeof define == 'function'){
	//seajs or requirejs environment
	define(function(require, exports, module){
		return factory();
	});
}else{
	window.FeatherUi = window.FeatherUi || {};
	window.FeatherUi.Template = factory();
}
})(window, function(){

return {
	REG: /(')|([\r\n]+)|<%(=?)([\s\S]*?)%>/g,

	fetch: function(id, data){
		var elem = document.getElementById(id);
		return this.parse(elem.value || elem.innerHTML, data);
	},

	parse: function(content, data){
		try{
			var tmp = this.parseSyntax(content);
			return (new Function('d', 'r', tmp))(data, []);
		}catch(e){
			console && console.log(content, tmp);
			throw new Error(e.message);
		}
	},

	parseSyntax: function(content){
		return "with(d){r.push('" 
                + 
                content.replace(this.REG, function(_0, _1, _2, _3, _4){
                    return _1 ? "\\'" : _2 ? "" : _3 ? "'," + _4 + ",'" : "'); \r\n" + _4 + "; \r\nr.push('";
                }) 
                + 
                "');}return r.join('');";
	}
};

});