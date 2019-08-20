const db = require('../utility/database.js');

module.exports = {
	id: 'add',
	exec: function (call, findRole, toggles, HELP) {
		if (!call.args[0])
			return call.message.channel.send(HELP);

		let name = call.args.join(' ').toLowerCase().trim();
		let role = findRole(toggles, name);

		if (role)
			return call.message.channel.send('This role is already toggleable.');

		db.addToggleable(call.message.guild.id, name).then(() => {
			call.message.channel.send('Successfully added role to toggle list.');

			call.client.updateToggles();
		}).catch(() => call.message.channel.send('Could not add role to toggle list, please try again later.'));
	}
};