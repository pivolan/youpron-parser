var Changer = {
	intervals : new Array(),
	elements : new Array(),
	images : new Array(),
	counters : new Array(),

	init : function(elem)
	{
		var id = elem.attr('id');
		this.elements[id] = elem;
		this.images[id] = JSON.parse(elem.attr('data-images'));
	},
	change : function (id)
	{
		if (Changer.counters[id])
		{
			Changer.counters[id]+=1;
		}
		else
		{
			Changer.counters[id] = 1;
		}
		if (!Changer.images[id][Changer.counters[id]])
		{
			Changer.counters[id] = 0;
		}
		var src = Changer.images[id][Changer.counters[id]];
		Changer.elements[id].attr('src', src);
	},
	startCounter : function (id)
	{
		Changer.intervals[id] = setInterval("Changer.change('"+id+"')", 500);
	},
	stopCounter : function (id)
	{
		clearInterval(Changer.intervals[id]);
		Changer.counters[id] = 0;
		Changer.elements[id].attr('src', Changer.images[id][0]);
	}
}

//Листалка картинок
$.fn.circle = function() {
	this.each(function(){
		Changer.init($(this));
		$(this).mouseover(function()
		{
			var id = $(this).attr('id');
			Changer.startCounter(id);
		});
		$(this).mouseout(function()
		{
			var id = $(this).attr('id');
			Changer.stopCounter(id);
		});
	});
}

//Добавление кнопок добавить в плейлист и в избранное
$.fn.showdetails = function()
{
	this.each(function(){
		var elem = $(this);
		var favorites = '<div class="favorite">' +
						'<a class="afavorite add_favorite" title="В избранное"></a>' +
						'<a class="aplaylist add_playlist" title="В плейлист"></a>'
						'</div>';
		elem.append(favorites);
		elem.mouseover(function(){
			elem.children('.favorite').show();
		});
		elem.mouseout(function(){
			elem.children('.favorite').hide();
		});
	});


}