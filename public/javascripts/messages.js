/**
 * Created by JetBrains RubyMine.
 * User: pivo
 * Date: 01.10.11
 * Time: 0:46
 * To change this template use File | Settings | File Templates.
 */
var messages =
{
	message_container : null,
	timeout_id : null,

	init: function (message_container) {
		this.message_container = message_container;

	},
	show_popup : function(msg, delay) {
		if (delay == undefined) {
			delay = 1000;
		}
		this.message_container.text(msg).removeClass('hidden');

		clearTimeout(this.timeout_id);

		this.timeout_id = setTimeout(function() {
			messages.hide_popup();
		}, delay)
	},
	hide_popup: function () {
		this.message_container.addClass('hidden');
	}
};