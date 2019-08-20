const db = require('../utility/database.js');

module.exports = {
	id: 'remove',
	exec: function (call, findRole, toggles, HELP) {
		if (!call.args[0])
			return call.message.channel.send(HELP);

		let name = call.args.join(' ').toLowerCase().trim();
		let role = findRole(toggles, name);

		if (!role)
			return call.message.channel.send('This role is not toggleable.');

		db.removeToggleable(call.message.guild.id, role.role).then(() => {
			call.message.channel.send('Successfully removed toggleable role.');

			call.client.updateToggles();
		}).catch(() => call.message.channel.send('Could not remove toggleable role, please try again later.'));
	}
};