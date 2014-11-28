require.async([':jquery', ':highlighter'], function($, Highligter){
	var $as = $('#list a').click(function(){
		$as.removeClass('active');
		$(this).addClass('active')

		$('#right').load($(this).attr('data-href'), function(){
			$(this).removeClass('loading');

			$('pre', this).each(function(){
				Highligter(this, {
					type: $(this).attr('data-type'),
					title: $(this).attr('data-title')
				});
			});
		}).addClass('loading');
	});

	$as.first().click();
});

require.async(':jquery', function($){
	var hash;

	setInterval(function(){
		var tmp = location.hash.substring(1);

		if(tmp && tmp != hash){
			hash = tmp;
			console.log(hash);
			$('#list').find('a[data-index="' + hash + '"]').click();
		}
	}, 100);
});