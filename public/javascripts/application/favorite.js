/**
 * Created by JetBrains RubyMine.
 * User: pechenikin
 * Date: 13.10.11
 * Time: 21:05
 * To change this template use File | Settings | File Templates.
 */
//  Клик на В избранное
var Favorite = {
	init: function()
	{
		$('.afavorite').live('click', function(event) {
			var video = $(this).parent().parent().children('a').attr('data-video');
			// добавим видео в фаворит
			if ($(this).hasClass('add_favorite')) {
				$.post('/video/favorite', {'id':video, 'act':'add'}, function(data) {
					console.log(data);
				});
				$(this).addClass('favorited').removeClass('add_favorite');
			}
			// удалим видео из фаворитов
			else {
				$.post('/video/favorite', {'id':video, 'act':'del'}, function(data) {
					console.log(data);
					var json = JSON.parse(data);
					var video_render = Playlist.getVideosList(json);
					Playlist.addVideo(video_render);
				});
				$(this).addClass('add_favorite').removeClass('favorited');
			}
			event.preventDefault();
		});
	}
};