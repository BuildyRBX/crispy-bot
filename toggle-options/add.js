const db = require('../utility/database.js');

function prompt(call, message, opts = {}, lC = false) {
	return call.prompt(message, { ...opts, channel: call.message.author.channel })
		.then((m) => lC ? m.content.toLowerCase() : m.content);
}

module.exports = {
	id: 'add',
	exec: async function (call, findRole, toggles, HELP) {
		if (!call.args[0])
			return call.message.channel.send(HELP);

		let name = call.args.join(' ').toLowerCase().trim();
		let role = findRole(toggles, name);

		if (role)
			return call.message.channel.send('This role is already toggleable.');

		let required_role = await prompt(call, 'What role is required in order to give this role? Say `skip` to not have a role requirement.', {}, true);
		if (required_role === 'skip')
			required_role = undefined;

		db.addToggleable(call.message.guild.id, name, required_role).then(() => {
			call.message.channel.send('Successfully added role to toggle list.');

			call.client.updateToggles();
		}).catch(() => call.message.channel.send('Could not add role to toggle list, please try again later.'));
	}
};