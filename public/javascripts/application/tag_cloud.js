/**
 * Created by JetBrains RubyMine.
 * User: pivo
 * Date: 13.10.11
 * Time: 0:42
 * To change this template use File | Settings | File Templates.
 */
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
