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
	nick_input: $('<input type="text">'),

	init: function (nick_container, nick_container_parent) {
		this.nick_container = nick_container;
		this.nick_container_parent = nick_container_parent;
		nick_container.click(function(evt) {
			evt.preventDefault();
			user_nick.nick_input.val(this.text());
			this.remove();
			nick_container_parent.append(user_nick.nick_input);
		});
		this.nick_input.blur(function(evt) {
			user_nick.update_nick_in_db();
			nick_container.text(this.val());
			this.remove();
			nick_container_parent.append(nick_container);
			messages.show_popup(' Ваш ник сохранен.');
		}).keyup(function() {
			user_nick.set_nick(this.val());
		});
	},
	set_nick : function (nick) {
		this.nick = nick;
	},
	get_nick : function () {
		return this.nick;
	},
	update_nick_in_db: function () {
		$.getJSON('/profile/nick.json', {nick: this.nick}, function (json) {

		});
	}
};