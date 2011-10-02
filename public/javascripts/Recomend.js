var Recomend =
{
	video_id : null,
	page : 1,
	div : null,
	per_page : 6,
	init : function(id, div, left_nav, right_nav)
	{
		this.video_id = id;
		this.div = div;
		left_nav.click(function(){
			Recomend.prev_page();
		});
		right_nav.click(function(){
			Recomend.next_page();
		});
		this.show();
	},
	next_page : function()
	{
		Recomend.page+=1;
		this.show();
	},
	prev_page : function()
	{
		Recomend.page-=1;
		if (Recomend.page < 1)
		{
			Recomend.page = 1;
		}
		this.show();
	},
	show : function()
	{
		var i = (Recomend.page - 1) * Recomend.per_page + 1;
		var params = {id: Recomend.video_id, page: Recomend.page};
		Recomend.div.html('Loading...');
		$.get('/index/recomend.json', params, function(data) {
				if (data.length)
				{
					Recomend.div.html(Common.drawListVideo(i, data));
				}
				else
				{
					Recomend.div.html('No Recomend video');
				}
			}, 'json');
	}
}
