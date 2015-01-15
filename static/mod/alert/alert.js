var Dialog = require(':dialog');

return {
	alert: function(content){
		return new Dialog({
			title: '提示',
			width: 400,
			content: '<div class="ui-alert">' + content + '</div>',
			autoOpen: true,
			buttons: {
				'确定': function(){
					this.destory();
				}
			}
		});
	},
	/**
	 * 同浏览器默认的confirm 
	 * content：显示内容
	 * callback：确认后执行的函数
	 * unclose：点击确认后不关闭
	 * 
	 * 当unclose为true时 可手动执行close或者destory方法关闭弹窗
	 */
	confirm: function(content, callback, unclose){
		return new Dialog({
			title: '提示',
			width: 500,
			content: '<div class="ui-alert">' + content + '</div>',
			autoOpen: true,
			buttons: {
				'确定': function(){
					callback();
					!unclose && this.destory();
				},

				'取消': function(){
					this.destory();
				}
			}
		});
	}
};