// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var Common =
{
	page : 1,
	per_page : 25,
	page_blocked : null,

	getVideo : function(data)
	{
		var i = (Common.page - 1) * Common.per_page + 1;
		var result = '';
		var count = 0;
		for (id in data)
		{
			result +=
						'<div class="screens-thumbs-index thumb-' + i + '">' +
						'<div class="thumb">' +
						'<div class="img-div">' +
						'	<a href="/index/view/' + data[id].id + '" class="show" data-video="' + data[id].id + '">' +
						'		<img id="img_' + data[id].id + '" class="bluga-thumbnail medium2 circle" src="' + data[id].images[0] + '" data-images=\'' + JSON.stringify(data[id].images) + '\'" />'+
						'	</a>' +
						'	<div class="favorite">' +
						'		<a class="afavorite add_favorite" title="В избранное"></a>' +
						'		<a class="aplaylist add_playlist" title="В плейлист"></a>' +
						'	</div>' +
						'</div>' +
						'<br/>' +
						'	<div class="indexlink">' +
						'		<a href="/index/view/' + data[id].id + '" rel="bookmark" title="' + data[id].name.slice(0,1).toUpperCase() + data[id].name.slice(1) + '">' + data[id].name.slice(0,1).toUpperCase() + data[id].name.slice(1) + '</a>' +
						'		<div class="nodetype"><a>' + data[id].duration + '</a></div>' +
						'	</div>' +
					 '</div>' +
					 '</div>';
			i+=1;
			count +=1;
		}
		if (count==0)
		{
			Common.page_blocked = true;
		}
		return result;
	},
	getComment : function(data)
	{
		var result =
			'<div class="comment">'+
				'<span class="name">'+data.name+'</span>&nbsp;'+
				'<span class="date">'+data.published+'</span>'+
				'<span class="message">'+
				'	<p>'+data.message+'</p>'+
				'</span>'+
			'</div>';
		return result;
	},

	GetScrollMaxY : function() {
		if ('scrollMaxX' in window) {
			return window.scrollMaxY;
		}
		else {
			return document.documentElement.scrollHeight - document.documentElement.clientHeight;
		}
	},

	GetScrollPositionY : function() {
		if ('pageYOffset' in window) {  // all browsers, except IE before version 9
			return window.pageYOffset;
		}
		else {      // Internet Explorer before version 9
			return document.documentElement.scrollTop;
		}
	},

	initScrolling : function()
	{
		//Активация автоподгрузки видео
		$(window).scroll(function ()
		{
			var y = Common.GetScrollPositionY();
			var mY = Common.GetScrollMaxY();
			var delta = y / mY;
			if (delta > 0.8)
			{
				var body = $('body');
				if (body.data('status') != 'loading' && Common.page_blocked==null)
				{
					Common.page += 1;
					body.data('status', 'loading');
					$('#loading').css('display', 'block');
					$.get('/index/video.json', {'page': Common.page}, function(data)
					{
						$('#video-list').append( Common.getVideo(data) );
						body.data('status', '');
						$('#loading').css('display', 'none');
					}, 'json');
				}
			}
		});
		//Скрываем pagination
		$('.pagination').css('display', 'none');
	}
}
