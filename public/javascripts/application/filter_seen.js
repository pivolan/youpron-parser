/**
 * Created by JetBrains RubyMine.
 * User: pivo
 * Date: 13.10.11
 * Time: 0:42
 * To change this template use File | Settings | File Templates.
 */
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
