/**
<input type="file" id="upload" />
<script>
require.async('upload', function(Upload){
    new Upload({
        dom: '#upload',
        uploader: '/test/1.json',
        width: 100,
        height: 100,
        buttonText: '编辑头像',
        swf: '/js/web/common/mod/upload/upload.swf',
        fileTypeExts: '*.jpg;*.jpeg;*.png;*.JPG;*.JPEG;*.PNG',
        onUploadSuccess: function(){
            console.log(arguments);
        }
    });
});
</script>
*/

;(function(window, factory){
if(typeof define == 'function'){
	//seajs or requirejs environment
	define(function(require, exports, module){
		return factory(
			require('common:jquery'),
			require('common:cookie'),
			require('./lib/uploadify.js')
		);
	});
}else{
	window.FeatherUi = window.FeatherUi || {};
	window.FeatherUi.Upload = factory(window.jQuery || window.$, window.FeatherUi.Cookie);
}
})(window, function($, Cookie){

var Upload = function(opt){
	this.dom = $(opt.dom);

	this.options = $.extend({
		debug: false,
		width: this.dom.width(),
		height: this.dom.height(),
		buttonText: '选择文件',
		fixedCookie: false,
		overrideEvents: [
			'onUploadProgress', 'onUploadComplete', 'onUploadSuccess', 'onUploadStart', 'onUploadError', 
			'onSelect'
		]
	}, opt || {});

	this.init();
};

Upload.prototype = {
	init: function(){
		var self = this, options = self.options;

		if(options.fixedCookie){
			options.formData = $.extend(options.formData || {}, Cookie.get() || {});
		}

		self.dom.uploadify(options);
	}
};

$.each('cancel destroy disable settings stop upload'.split(' '), function(key, method){
	Upload.prototype[method] = function(){
		this.dom.uploadify.apply(this.dom, arguments);
	};
});

return Upload;

});