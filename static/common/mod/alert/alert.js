var Dialog = require('common:dialog');

return {
	alert: function(content, callback, unclose, opt){
		return new Dialog($.extend({
			title: '提示',
			width: 400,
			content: '<div class="ui-alert">' + content + '</div>',
			autoOpen: true,
			buttons: {
				'确定': {
					events: {
						click: function(){
							callback && callback();
							!unclose && this.destroy();
						}
					},

					className: 'ui-alert-button-confirm'
				}
			}
		}, opt || {}));
	},
	/**
	 * 同浏览器默认的confirm 
	 * content：显示内容
	 * callback：确认后执行的函数
	 * unclose：点击确认后不关闭
	 * 
	 * 当unclose为true时 可手动执行close或者destory方法关闭弹窗
	 */
	confirm: function(content, callback, unclose, opt){
		return new Dialog($.extend({
			title: '提示',
			width: 400,
			content: '<div class="ui-alert">' + content + '</div>',
			autoOpen: true,
			buttons: {
				'确定': {
					events: {
						click: function(){
							callback();
							!unclose && this.destroy();
						}
					},

					className: 'ui-alert-button-confirm'
				},

				'取消': {
					events: {
						click: function(){
							this.destroy();
						}
					},

					className: 'ui-alert-button-cancel'
				}
			}
		}, opt || {}));
	}
};