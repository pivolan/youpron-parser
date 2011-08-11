// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var Common =
{
	page : 0,
	per_page : 25,
	page_blocked : null,
	favorites : null,

	init : function()
	{
		this.initScrolling();
		this.initCategories();
	},

	getVideo : function(data) {
		var i = (Common.page - 1) * Common.per_page + 1;
		var result = '';
		var count = 0;
		for (id in data) {
			result +=
							'<div class="screens-thumbs-index thumb-' + i + '">' +
											'<div class="thumb">' +
											'<div class="img-div">' +
											'	<a href="/index/view/' + data[id].id + '" class="show" onclick="Common.colorbox($(this))" data-video="' + data[id].id + '">' +
											'		<img image_id="img_' + data[id].id + '" class="bluga-thumbnail medium2 circle" src="' + data[id].images[0] + '" data-images=\'' + JSON.stringify(data[id].images) + '\'" />' +
											'	</a>' +
											'	<div class="favorite">' +
											'		<a class="aplaylist add_playlist" title="В плейлист" data-video="' + data[id].id + '" onclick="Playlist.addVideo($(this))" ></a>';
			if (Common.favorites.indexOf(String(data[id].id))!=-1)
			{
				result +=			'		<a class="afavorite favorited" title="В избранное"></a>';
			}
			else
			{
				result +=			'		<a class="afavorite add_favorite" title="В избранное"></a>';
			}
			result +=				'	</div>' +
											'</div>' +
											'<br/>' +
											'	<div class="indexlink">' +
											'		<a href="/index/view/' + data[id].id + '" rel="bookmark" title="' + data[id].name.slice(0, 1).toUpperCase() + data[id].name.slice(1) + '">' + data[id].name.slice(0, 1).toUpperCase() + data[id].name.slice(1) + '</a>' +
											'		<div class="nodetype"><a>' + data[id].duration + '</a></div>' +
											'	</div>' +
											'</div>' +
											'</div>';
			i += 1;
			count += 1;
		}
		if (count == 0) {
			Common.page_blocked = true;
		}
		return result;
	},
	getComment : function(data) {
		var result =
						'<div class="comment">' +
										'<span class="name">' + data.name + '</span>&nbsp;' +
										'<span class="date">' + data.published + '</span>' +
										'<span class="message">' +
										'	<p>' + data.message + '</p>' +
										'</span>' +
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
		if ('pageYOffset' in window) {	// all browsers, except IE before version 9
			return window.pageYOffset;
		}
		else {			// Internet Explorer before version 9
			return document.documentElement.scrollTop;
		}
	},

	initScrolling : function() {
		//Активация автоподгрузки видео
		$(window).scroll(function () {
			var y = Common.GetScrollPositionY();
			var mY = Common.GetScrollMaxY();
			var delta = y / mY;
			if (delta > 0.8) {
				Common.scroll();
			}
		});
		//Скрываем pagination
		$('.pagination').css('display', 'none');
	},

	scroll : function() {
		var body = $('body');
		if (body.data('status') != 'loading' && Common.page_blocked == null) {
			Common.page += 1;
			body.data('status', 'loading');
			$('#loading').css('display', 'block');
			var params = this.getCookieJson('filter');
			params.page = Common.page;
			$.get('/index/video.json', params, function(data) {
				$('#video-list').append(Common.getVideo(data));
				body.data('status', '');
				$('#loading').css('display', 'none');
			}, 'json');
		}
	},

	reInitScroll : function() {
		Common.page = 0;
		Common.page_blocked = null;
		$('#video-list').html('');
		this.scroll();
	},

	colorbox : function(elem) {
		if (!elem.hasClass('cnoxElement')) {
			elem.colorbox({'width':'680px', 'height': 'auto'});
		}
	},
	colorboxResize : function() {
		$.fn.colorbox.resize()
	},

	getCookieJson : function(name)
	{
		var data = $.cookie(name);
		if (!data)
		{
			return {};
		}
		return JSON.parse(data);
	},
	setCookieJson : function(name, data)
	{
		data = JSON.stringify(data);
		$.cookie(name, data);
	},
	pushCookieJson : function(name, key, value)
	{
		var data = this.getCookieJson(name);
		if (!data[key])
		{
			data[key] = [value];
		}
		else
		{
			var index = data[key].indexOf(String(value));
			if (index==-1)
				data[key].push(value);
		}
		this.setCookieJson(name, data);
	},
	delCookieJson : function(name, key, value)
	{
		var data = this.getCookieJson(name);
		var index = data[key].indexOf(String(value));
		if (index!=-1)
		{
			data[key].splice( index, 1 );
			this.setCookieJson(name, data);
		}
	},
	addFilterItem : function(name, id)
	{
		this.pushCookieJson('filter', name, id);
	},
	delFilterItem : function(name, id)
	{
		this.delCookieJson('filter',name,id);
	},

	initCategories : function()
	{
		var filters = this.getCookieJson('filter');
		if (filters.category)
		{
			$.each(filters.category, function(index,data){
	      $('.category[data-id='+data+']').addClass('selected');
			});
		}
		$('.category').click( function(){
			var elem = $(this);
			var id = elem.attr('data-id');
			if (elem.hasClass('selected'))
			{
				Common.delFilterItem('category',id);
				elem.removeClass('selected');
			}
			else
			{
				Common.addFilterItem('category',id);
				elem.addClass('selected');
			}
			Common.reInitScroll();
		});
	}
};

var Playlist =
{
	slide_button : null,
	playlist: null,
	list: null,
	current_playlist: null,
	select_playlist_ul: null,
	title_playlist_span: null,
	videos: {},
	step: 5,

	init: function(options) {
		this.slide_button = options.slide_button;
		this.playlist = options.playlist;
		this.list = options.list;
		this.current_playlist = options.current_playlist;
		this.select_playlist_ul = options.select_playlist_ul;
		this.title_playlist_span = options.title_playlist_span;

		this.slide_button.click(function() {
			var playlist = Playlist.playlist;
			if (playlist.hasClass('open')) {
				Playlist.playlist.removeClass('open');
				Playlist.slide_button.html('Open');
			}
			else {
				Playlist.slide_button.html('Close');
				Playlist.playlist.addClass('open');
			}
		});
		this.playlist.mousewheel(function(evt, delta){
			evt.preventDefault();
			evt.stopPropagation();
			console.log(delta);
			var list = Playlist.list;
			if(delta > 0 && list.position().left < 0)
			{
				list.css('left', '+=100px');
			}
			else if(delta < 0)
			{
				list.css('left', '-=100px');
			}
		});
		$.getJSON(options.url, {id: options.current_playlist}, function(json) {
			{
				var i;
				var list = Playlist.list;
				for (i in json.video) {
					var video = json.video[i];
					var result = Playlist.getVideo(video);
					list.append(result);
				}
			}
		});
	},

	addVideo: function(obj) {
		var video_id = obj.attr('data-video');
		$.getJSON('/playlist/add_video_to_playlist/', {playlist_id:this.current_playlist, video_id: video_id}, function(json) {
			var video = Playlist.getVideo(json);
			Playlist.list.append(video);
		});
	},
	removeVideo: function(obj){
		var video_id = obj.attr('data-video');
		$.getJSON('/playlist/remove_video_from_playlist/', {playlist_id:this.current_playlist, video_id: video_id}, function(json) {
			Playlist.videos[video_id].remove();
		});

	},
	getVideo: function(video) {
		if(this.videos[video.id])
		{
			var result = this.videos[video.id];
		}
		else
		{
			var result = $(
							'<span class="pl_video">' +
							'	<a href="/index/view/' + video.id + '" class="view show" onclick="Common.colorbox($(this))" data-video="' + video.id + '">' +
							'		<img image_id="img_' + video.id + '" class="circle" src="' + video.images[0] + '" alt="" height="100" data-images=\'' + JSON.stringify(video.images) + '\' /> ' +
							'	</a>' +
							'	<a href="/playlist/remove_video_from_playlist/' + video.id + '" class="delete" data-video="' + video.id + '" onclick="Playlist.removeVideo($(this)); return false;">' +
							'	</a>'+
							'</span>'
			);
			this.videos[video.id] = result;
		}
		return result;
	},
	create_playlist: function(){
		$.getJSON('/playlist/create_playlist/', {title:'main playlist'}, function(json){
			Playlist.current_playlist = json.id;
			Playlist.select_playlist_ul.append('<li data_id="'+json.id+'" onclick="Playlist.select_playlist($(this))">'+json.title+'</li>');
			Playlist.title_playlist_span.html(json.title);
		});
	},
	select_playlist: function(obj)
	{
		var id = obj.attr('data_id');
		var title = obj.html();
		this.current_playlist = id;
		this.title_playlist_span.html(title + '('+id+')');
		$.getJSON('/playlist/select_playlist/', {id:id}, function(json)
		{
			var i;
			var list = Playlist.list;
			list.html('');
			for (i in json.video) {
				var video = json.video[i];
				var result = Playlist.getVideo(video);
				list.append(result);
			}
		})
	}
};