// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var Common =
{
	page : 0,
	per_page : 25,
	page_blocked : null,
	favorites : null,

	init : function() {
		if (!this.initGetVideo()) {
			Common.scroll();
		}
		this.initScrolling();
		this.initCategories();
		TagCloud.init();
	},

	getImage : function(url) {
		var censored = FilterSeen.get_censored_status();
		if (censored === true) {
			return 'http://placekitten.com/160/120';
		}
		if (url) {
			return url;
		}
		else {
			return 'http://placekitten.com/160/120';
		}
	},
	initGetVideo : function() {
		var id = parseInt(window.location.hash.substr(1));
		if (id) {
			this.colorbox(null, id);
			return true;
		}
		return false;
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
											'	<a href="#' + data[id].id + '" class="show" onclick="Common.colorbox($(this))" data-video="' + data[id].id + '">' +
											'		<img image_id="img_' + data[id].id + '" class="bluga-thumbnail medium2 circle" src="' + this.getImage(data[id].images[0]) + '" data-images=\'' + JSON.stringify(data[id].images) + '\'" />' +
											'	</a>' +
											'	<div class="favorite">' +
											'		'; // todo откатить плейлисты
			if (Common.favorites.indexOf(String(data[id].id)) != -1) {
				result += '		<a class="afavorite favorited" title="В избранное"></a>';
			}
			else {
				result += '		<a class="afavorite add_favorite" title="В избранное"></a>';
			}
			result += '	</div>' +
							'</div>' +
							'<br/>' +
							'	<div class="indexlink">' +
							'		<a href="#' + data[id].id + '" rel="bookmark" title="' + data[id].name.slice(0, 1).toUpperCase() + data[id].name.slice(1) + '">' + data[id].name.slice(0, 1).toUpperCase() + data[id].name.slice(1) + '</a>' +
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
			if (delta > 0.99) {
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

	colorbox : function(elem, id) {
		if (id) {
			$.colorbox({'width':'680px', 'height': 'auto', 'href':'/index/view/' + id});
		}
		else if (!elem.hasClass('cnoxElement')) {
			var id = elem.attr('data-video');
			window.location.hash = id;
			$.colorbox({'width':'680px', 'height': 'auto', 'href':'/index/view/' + id, onClosed:function() {
				window.location.hash = 'ready'
			}});
		}
	},
	colorboxResize : function() {
		$.fn.colorbox.resize()
	},

	getCookieJson : function(name) {
		var data = $.cookie(name);
		if (!data) {
			return {};
		}
		return JSON.parse(data);
	},
	setCookieJson : function(name, data) {
		data = JSON.stringify(data);
		$.cookie(name, data);
	},
	pushCookieJson : function(name, key, value) {
		var data = this.getCookieJson(name);
		if (!data[key]) {
			data[key] = [value];
		}
		else {
			var index = data[key].indexOf(String(value));
			if (index == -1) {
				data[key].push(value);
			}
		}
		this.setCookieJson(name, data);
	},
	delCookieJson : function(name, key, value) {
		var data = this.getCookieJson(name);
		var index = data[key].indexOf(String(value));
		if (index != -1) {
			data[key].splice(index, 1);
			this.setCookieJson(name, data);
		}
	},
	addFilterItem : function(name, id) {
		this.pushCookieJson('filter', name, id);
	},
	delFilterItem : function(name, id) {
		this.delCookieJson('filter', name, id);
	},

	initCategories : function() {
		var filters = this.getCookieJson('filter');
		if (filters.category) {
			$.each(filters.category, function(index, data) {
				$('.category[data-id=' + data + ']').addClass('selected');
			});
		}
		$('.category').click(function() {
			var elem = $(this);
			var id = elem.attr('data-id');
			if (elem.hasClass('selected')) {
				Common.delFilterItem('category', id);
				elem.removeClass('selected');
			}
			else {
				Common.addFilterItem('category', id);
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
		this.playlist.mousewheel(function(evt, delta) {
			evt.preventDefault();
			evt.stopPropagation();
			console.log(delta);
			var list = Playlist.list;
			if (delta > 0 && list.position().left < 0) {
				list.css('left', '+=100px');
			}
			else if (delta < 0) {
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
	removeVideo: function(obj) {
		var video_id = obj.attr('data-video');
		$.getJSON('/playlist/remove_video_from_playlist/', {playlist_id:this.current_playlist, video_id: video_id}, function(json) {
			Playlist.videos[video_id].remove();
		});

	},
	getVideo: function(video) {
		if (this.videos[video.id]) {
			var result = this.videos[video.id];
		}
		else {
			var result = $(
							'<span class="pl_video">' +
											'	<a href="/index/view/' + video.id + '" class="view show" onclick="Common.colorbox($(this))" data-video="' + video.id + '">' +
											'		<img image_id="img_' + video.id + '" class="circle" src="' + video.images[0] + '" alt="" height="100" data-images=\'' + JSON.stringify(video.images) + '\' /> ' +
											'	</a>' +
											'	<a href="/playlist/remove_video_from_playlist/' + video.id + '" class="delete" data-video="' + video.id + '" onclick="Playlist.removeVideo($(this)); return false;">' +
											'	</a>' +
											'</span>'
			);
			this.videos[video.id] = result;
		}
		return result;
	},
	create_playlist: function() {
		$.getJSON('/playlist/create_playlist/', {title:'main playlist'}, function(json) {
			Playlist.current_playlist = json.id;
			Playlist.select_playlist_ul.append('<li data_id="' + json.id + '" onclick="Playlist.select_playlist($(this))">' + json.title + '</li>');
			Playlist.title_playlist_span.html(json.title);
		});
	},
	select_playlist: function(obj) {
		var id = obj.attr('data_id');
		var title = obj.html();
		this.current_playlist = id;
		this.title_playlist_span.html(title + '(' + id + ')');
		$.getJSON('/playlist/select_playlist/', {id:id}, function(json) {
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

var TagCloud =
{
	min_size: 13,
	max_size: 30,
	count: 0,
	sum: 0,
	avg: 0,
	elems: {},

	init : function () {
		//считаем сумму и количество видео из атрибута
		$(".category").each(function() {
			var elem = $(this);
			var videos = elem.attr('data-videos');
			var id = elem.attr('data-id');
			TagCloud.count++;
			TagCloud.sum = parseInt(TagCloud.sum) + parseInt(videos);
			TagCloud.elems[id] = {elem:elem, videos:videos};
		});
		this.avg = this.sum / this.count;
		//Меняем размер шрифта
		$.each(this.elems, function(key, data) {
			var size = data.videos / TagCloud.avg * 15;
			if (size > TagCloud.max_size) {
				size = TagCloud.max_size;
			}
			else if (size < TagCloud.min_size) {
				size = TagCloud.min_size;
			}
			data.elem.css('font-size', size + 'px');
		});
	}
};
var FilterSeen =
{
	seen : null,
	unseen : null,
	clicked: null,
	unclicked: null,
	censore: null,

	get_censored_status: function () {
		var status = $.cookie('censored');
		if(status === 'true')
		{
			return true
		}
		else if(status === 'false')
		{
			return false;
		}
		else
		{
			return null;
		}
	},
	set_censored_status: function (status) {
		if(status === true)
		{
			$.cookie('censored', true);
		}
		else if(status === false)
		{
			$.cookie('censored', false);
		}
		else
		{
			return false;
		}
		return true;
	},
	init_seen: function() {
		var filter = Common.getCookieJson('filter');
		if (filter.seen) {
			this.seen.addClass('selected');
		}
		this.seen.click(function(evt) {
			evt.preventDefault();
			var filter = Common.getCookieJson('filter');
			if (filter.seen) {
				delete filter.seen;
				Common.setCookieJson('filter', filter);
				$(this).removeClass('selected');
			}
			else {
				filter.seen = true;
				Common.setCookieJson('filter', filter);
				$(this).addClass('selected');
			}
			Common.reInitScroll();
		});
	},

	init_censore : function () {
		var data = this.get_censored_status();
		if (data === true) {
			this.censore.addClass('selected');
		}
		this.censore.click(function(evt) {
			var data = FilterSeen.get_censored_status();
			evt.preventDefault();
			if (data === true) {
				FilterSeen.set_censored_status(false);
				FilterSeen.censore.removeClass('selected');
			}
			else {
				FilterSeen.set_censored_status(true);
				FilterSeen.censore.addClass('selected');
				$('img[data-images]').attr('src', Common.getImage());
			}
		});
	},

	init_unseen : function () {
		var filter = Common.getCookieJson('filter');
		if (filter.unseen) {
			this.unseen.addClass('selected');
		}
		this.unseen.click(function(evt) {
			evt.preventDefault();
			var filter = Common.getCookieJson('filter');
			if (filter.unseen) {
				delete filter.unseen;
				Common.setCookieJson('filter', filter);
				$(this).removeClass('selected');
			}
			else {
				filter.unseen = true;
				Common.setCookieJson('filter', filter);
				$(this).addClass('selected');
			}
			Common.reInitScroll();
		});
	},

	init_clicked: function () {
		var filter = Common.getCookieJson('filter');
		if (filter.clicked) {
			this.clicked.addClass('selected');
		}
		this.clicked.click(function(evt) {
			evt.preventDefault();
			var filter = Common.getCookieJson('filter');
			if (filter.clicked) {
				delete filter.clicked;
				Common.setCookieJson('filter', filter);
				$(this).removeClass('selected');
			}
			else {
				filter.clicked = true;
				Common.setCookieJson('filter', filter);
				$(this).addClass('selected');
			}
			Common.reInitScroll();
		});
	},
	init_unclicked: function () {
		var filter = Common.getCookieJson('filter');
		if (filter.unclicked) {
			this.unclicked.addClass('selected');
		}
		this.unclicked.click(function(evt) {
			evt.preventDefault();
			var filter = Common.getCookieJson('filter');
			if (filter.unclicked) {
				delete filter.unclicked;
				Common.setCookieJson('filter', filter);
				$(this).removeClass('selected');
			}
			else {
				filter.unclicked = true;
				Common.setCookieJson('filter', filter);
				$(this).addClass('selected');
			}
			Common.reInitScroll();
		});
	},

	init: function(s, us, c, uc, censore) {
		this.seen = s;
		this.unseen = us;
		this.clicked = c;
		this.unclicked = uc;
		this.censore = censore;

		this.init_censore();
		this.init_seen();
		this.init_unseen();
		this.init_unclicked();
		this.init_clicked();

	}
};