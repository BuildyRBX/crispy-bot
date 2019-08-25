const fs = require('fs');
const db = require('../utility/database.js');

let HELP =
`**__Commands__**
toggle (role)
toggle list
__Restricted__
toggle add (name)
toggle remove (name)
toggle enable @user
toggle disable @user
toggle force @user role`;

function findRole (roles, search) {
	return roles.find((role) => role.role === search.toLowerCase());
}

let files = fs.readdirSync('./toggle-options').map((name) => {
	try {
		return require(`./../toggle-options/${name}`);
	} catch (exc) {
		console.warn(`Failed to load ${name} toggle option.\n`, exc.stack);

		return {};
	}
});

module.exports = {
	id: 'toggle',
	desc: 'Toggles a role.',
	channels: 'guild',
	exec: async (call) => {
		let toggles = call.client.toggle.filter((m) => m.guild === call.message.guild.id);

		if (!call.args[0])
			return call.message.channel.send(HELP);

		let options = ['list'];
		if (call.message.member.roles.some((r) => ['M3'].includes(r.name)))
			options = ['list', 'add', 'remove', 'enable', 'disable', 'force'];

		let search = call.args.join(' ');
		let option = call.args.shift().toLowerCase();

		if (options.includes(option))
			try {
				files.find((o) => o.id === option).exec(call, findRole, toggles, HELP);
			} catch (exc) {
				if (exc.message.endsWith('time') || exc.message.endsWith('cancelled'))
					return;
				console.log(exc);
				call.message.channel.send('An error occured with the toggle command. Please try again later.');
			}
		else {
			let toggleable = findRole(toggles, search);
			let role;

			if (toggleable) {
				role = call.message.guild.roles.find((m) => m.name.toLowerCase() === toggleable.role);
				if (!role)
					return call.message.channel.send('This role does not exist in this server.');

				if (toggleable.required_role)
					if (!call.message.member.roles.find((r) => r.name.toLowerCase() === toggleable.required_role))
						return call.message.channel.send('You do not have permission to toggle this role.');

				let disabled = await db.isDisabled(call.message.author.id);
				if (disabled)
					return call.message.channel.send('You have been blacklisted from toggling roles.');

				call.message.member.roles.has(role.id) ?
					call.message.member.removeRole(role)
						.then(() => call.message.channel.send('Successfully removed you from this role.'))
						.catch(() => call.message.channel.send('Could not remove you from this role, please try again.')) :
					call.message.member.addRole(role)
						.then(() => call.message.channel.send('Successfully given you this role.'))
						.catch(() => call.message.channel.send('Could not give you this role, please try again.'));
			} else
				call.message.channel.send('This role is not toggleable.');
		}
	}
};
