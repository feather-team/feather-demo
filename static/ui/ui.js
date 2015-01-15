require.async([':jquery', ':highlighter'], function($, Highligter){
	$(document).ajaxStop(function(){
		$('script[type="text/html"]', this).each(function(){
			var text = this.text;
			if($(this).attr("data-type") == "noclick") {
				(new Function(text)).call(window);
			} else if ($(this).attr("data-type") != "noclick" && $(this).attr("data-type") != "show"){
				$('<a href="javascript:void(0);" class="run-btn">').text('点击运行').insertBefore(this).click(function(){
					(new Function(text)).call(window);
				});
			}


			var $pre = $('<pre class="code">').text(text).insertBefore(this);

			Highligter($pre[0], {
				type: 'js',
				title: $(this).attr('data-title')
			});
		});
	});

	require.async('../project/project.js');
});
