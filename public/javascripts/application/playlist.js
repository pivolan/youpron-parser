/**
 * Created by JetBrains RubyMine.
 * User: pivo
 * Date: 13.10.11
 * Time: 0:38
 * To change this template use File | Settings | File Templates.
 */
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
					var result = Playlist.getVideosList(video);
					list.append(result);
				}
			}
		});
	},

	addVideo: function(obj) {
		var video_id = obj.attr('data-video');
		$.getJSON('/playlist/add_video/', {playlist_id:this.current_playlist, video_id: video_id}, function(json) {
			var video = Playlist.getVideosList(json);
			Playlist.list.append(video);
		});
	},
	removeVideo: function(obj) {
		var video_id = obj.attr('data-video');
		$.getJSON('/playlist/remove_video/', {playlist_id:this.current_playlist, video_id: video_id}, function(json) {
			Playlist.videos[video_id].remove();
		});

	},
	getVideosList: function(video) {
		if (this.videos[video.id]) {
			var result = this.videos[video.id];
		}
		else {
			var result = $(
							'<span class="pl_video">' +
											'	<a href="#' + video.id + '" class="view show" onclick="return Common.colorbox($(this));" data-video="' + video.id + '">' +
											'		<img image_id="img_' + video.id + '" class="circle" src="' + video.images[0] + '" alt="" height="100" data-images=\'' + JSON.stringify(video.images) + '\' /> ' +
											'	</a>' +
											'	<a href="/playlist/remove_video/' + video.id + '" class="delete" data-video="' + video.id + '" onclick="return Playlist.removeVideo($(this))">' +
											'	</a>' +
											'</span>'
			);
			this.videos[video.id] = result;
		}
		return result;
	},
	create_playlist: function() {
		$.getJSON('/playlist/create/', {title:'main playlist'}, function(json) {
			Playlist.current_playlist = json.id;
			Playlist.select_playlist_ul.append('<li data_id="' + json.id + '" onclick="Playlist.select($(this))">' + json.title + '</li>');
			Playlist.title_playlist_span.html(json.title);
		});
	},
	select_playlist: function(obj) {
		var id = obj.attr('data_id');
		var title = obj.html();
		this.current_playlist = id;
		this.title_playlist_span.html(title + '(' + id + ')');
		$.getJSON('/playlist/select/', {id:id}, function(json) {
			var i;
			var list = Playlist.list;
			list.html('');
			for (i in json.video) {
				var video = json.video[i];
				var result = Playlist.getVideosList(video);
				list.append(result);
			}
		})
	},

	select_playlist_favorite: function(obj) {
		this.current_playlist = 'favorite';
		var title = 'favorite';
		var id = 'favorite';
		this.title_playlist_span.html(title + '(' + id + ')');
		$.getJSON('/playlist/select_favorite/', {id:id}, function(json) {
			var i;
			var list = Playlist.list;
			list.html('');
			for (i in json.video) {
				var video = json.video[i];
				var result = Playlist.getVideosList(video);
				list.append(result);
			}
		})
	}

};
