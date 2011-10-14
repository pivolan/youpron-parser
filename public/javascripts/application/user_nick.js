/**
 * Created by JetBrains RubyMine.
 * User: pivo
 * Date: 30.09.11
 * Time: 23:59
 * To change this template use File | Settings | File Templates.
 */
var user_nick =
{
	nick:null,
	nick_container:null,
	nick_container_parent:null,
	nick_input: $('<input class="nick" type="text">'),

	init: function (nick_container, nick_container_parent) {
		this.nick_container = nick_container;
		this.nick_container_parent = nick_container_parent;

		// замена span на input
		this.nick_container.click(function(evt) {
			var _this = $(this);
			evt.preventDefault();
			user_nick.nick_input.val(_this.text()).show();
			_this.hide();
			nick_container_parent.append(user_nick.nick_input);
			user_nick.nick_input.focus().select();
		});


		// замена input на span
		this.nick_input.blur(function(evt){user_nick.blur(evt)}).keyup(function(evt) {
			if (evt.which == 13) {
				user_nick.blur();
				this.blur();
				return;
			}
			user_nick.set_nick(this.value);
		});
	},
	blur: function () {
		user_nick.update_nick_in_db();
		user_nick.nick_container.text(user_nick.nick_input.val());
		user_nick.nick_input.hide();
		user_nick.nick_container.show();
//		messages.show_popup(' Ваш ник сохранен.');
	},
	set_nick : function (nick) {
		this.nick = nick;
	},
	get_nick : function () {
		return this.nick;
	},
	update_nick_in_db: function () {
		$.getJSON('/profile/nick', {nick: this.nick}, function (json) {

		});
	}
};