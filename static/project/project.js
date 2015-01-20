require.async([':jquery', ':highlighter', ':iscroll'], function($, Highligter, IScroll){
	new IScroll('#left', {
		scrollbars: true,
		mouseWheel: true,
		interactiveScrollbars: true,
		shrinkScrollbars: 'scale',
		fadeScrollbars: true
	});

	var $as = $('#list a').click(function(){
		$as.removeClass('active');
		$(this).addClass('active')

		$('#content').load($(this).attr('data-href'), function(){
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

	$(document).mousedown(function(e){
		e.preventDefault();
	});
});

require.async(':jquery', function($){
	var hash;

	setInterval(function(){
		var tmp = location.hash.substring(1);

		if(tmp && tmp != hash){
			hash = tmp;
			$('#list').find('a[data-index="' + hash + '"]').click();
		}
	}, 100);
});