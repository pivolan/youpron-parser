/**
 * Created by JetBrains RubyMine.
 * User: pechenikin
 * Date: 13.10.11
 * Time: 21:05
 * To change this template use File | Settings | File Templates.
 */
//  Клик на В избранное
var Favorite = {
	init: function() {
		$('.afavorite').live('click', function(event) {
			var video_id = $(this).parent().parent().children('a').attr('data-video');
			// добавим видео в фаворит
			if ($(this).hasClass('add_favorite')) {
				Favorite.add(video_id);
				$(this).addClass('favorited').removeClass('add_favorite');
			}
			// удалим видео из фаворитов
			else {
				Favorite.del(video_id);
				$(this).addClass('add_favorite').removeClass('favorited');
			}
			event.preventDefault();
		});
	},
	del: function (video_id) {
		$.post('/video/favorite', {'id':video_id, 'act':'del'}, function(data) {
			Playlist.removeVideoFavorite(video_id);
		});
	},
	add: function(video_id) {
		$.ajax('/video/favorite', {data:{'id':video_id, 'act':'add'}, dataType:"json",type:'post', success: function(json) {
			console.log(json);

			Playlist.addVideoFavorite(json);
		}});
	}
};