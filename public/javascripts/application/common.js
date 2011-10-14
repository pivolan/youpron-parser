// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var Common =
{
	page : 1,
	per_page : 25,
	page_blocked : null,
	favorites : null,

	init : function() {
		this.initGetVideo();
//		if (!this.initGetVideo()) {
		Common.scroll(true);
//		}
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
		result = Common.drawListVideo(i, data);
		if (result == '') {
			Common.page_blocked = true;
		}
		return result;
	},
	drawListVideo : function(i, data) {
		var result = '';
		count = 0;
		for (id in data) {
			result +=
							'<div class="screens-thumbs-index thumb-' + i + '">' +
											'<div class="thumb">' +
											'<div class="img-div">' +
											'	<a href="#' + data[id].id + '" class="show" onclick="Common.colorbox($(this))" data-video="' + data[id].id + '">' +
											'		<img image_id="img_' + data[id].id + '" class="bluga-thumbnail medium2 circle" src="' + this.getImage(data[id].images[0]) + '" data-images=\'' + JSON.stringify(data[id].images) + '\'" />' +
											'	</a>' +
											'	<div class="favorite">' +
											'		<a class="aplaylist add_playlist" title="В плейлист" data-video="' + data[id].id + '" onclick="Playlist.addVideo($(this))" ></a>';
			if (Common.favorites) {
				if (Common.favorites.indexOf(String(data[id].id)) != -1) {
					result += '		<a class="afavorite favorited" title="В избранное"></a>';
				}
				else {
					result += '		<a class="afavorite add_favorite" title="В избранное"></a>';
				}
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
				Common.scroll(false);
			}
		});
		//Скрываем pagination
		$('.pagination').css('display', 'none');
	},

	scroll : function(is_first) {
		var body = $('body');
		if (body.data('status') != 'loading' && Common.page_blocked == null) {
			if (!is_first) {
				Common.page += 1;
			}
			body.data('status', 'loading');
			$('#loading').css('display', 'block');
			var params = this.getCookieJson('filter');
			params.page = Common.page;
			$.get('/video/index.json', params, function(data) {
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
		this.scroll(false);
	},

	colorbox : function(elem, id) {
		if (id) {
			$.colorbox({'width':'680px', 'href':'/video/view/' + id, onClosed:function() {
				window.location.hash = 'ready'
			}});
		}
		else if (!elem.hasClass('cnoxElement')) {
			var id = elem.attr('data-video');
			window.location.hash = id;
			$.colorbox({'width':'680px', 'href':'/video/view/' + id, onClosed:function() {
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