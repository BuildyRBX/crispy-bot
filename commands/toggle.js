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

function findRole(roles, search) {
	return roles.find((role) => role.role === search.toLowerCase() || role.multiple.includes(search.toLowerCase()));
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
	exec: async (call, force = false) => {
		const GIVEN_SUCCESS = `Successfully given ${force ? 'this user' : 'you'} this role.`,
			GIVEN_FAILED = `Could not give ${force ? 'this user' : 'you'} this role, please try again.`,
			REMOVED_SUCCESS = `Successfully removed ${force ? 'this user' : 'you'} from this role.`,
			REMOVED_FAILED = `Could not remove ${force ? 'this user' : 'you'} from this role, please try again.`;

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
			let roles = [];

			if (toggleable) {
				// put multi roles into one array...
				let mainRole = call.message.guild.roles.find((m) => m.name.toLowerCase() === toggleable.role);
				if (mainRole)
					roles.push(mainRole);

				for (let r of toggleable.multiple) {
					role = call.message.guild.roles.find((m) => m.name.toLowerCase() === r);
					if (role)
						roles.push(role);
				}

				let searched = call.message.guild.roles.find((m) => m.name.toLowerCase() === search.toLowerCase());

				// check to make sure all the roles are existing, even the multi ones
				if (roles.length !== toggleable.multiple.length + 1)
					return call.message.channel.send('One or more of these roles do not exist in this server.');

				// checks permissions for toggling
				if (toggleable.required_role)
					if (force) {
						if (!call.forcer.roles.find((r) => r.name.toLowerCase() === toggleable.required_role)) {
							return call.message.channel.send('You do not have permission to force toggle this role.');
						}
					} else
					if (!call.message.member.roles.find((r) => r.name.toLowerCase() === toggleable.required_role))
						return call.message.channel.send('You do not have permission to toggle this role.');

				// check if blacklisted
				if (!force) {
					let disabled = await db.isDisabled(call.message.author.id);
					if (disabled)
						return call.message.channel.send('You have been blacklisted from toggling roles.');
				}

				// array of roles that the user already has toggled
				let currentRolesHad = call.message.member.roles.filter((role) => roles.find((m) => m.id === role.id)).array();
				// array of roles the user doesn't have toggled
				let notHad = roles.filter((r) => !currentRolesHad.find((m) => m.id === r.id));

				// if role is not a multi one
				role = roles[0];
				if (roles.length === 1)
					call.message.member.roles.has(role.id) ?
						call.message.member.removeRole(role)
							.then(() => call.message.channel.send(REMOVED_SUCCESS))
							.catch(() => call.message.channel.send(REMOVED_FAILED)) :
						call.message.member.addRole(role)
							.then(() => call.message.channel.send(GIVEN_SUCCESS))
							.catch(() => call.message.channel.send(GIVEN_FAILED));
				else {
					await call.message.member.removeRoles(currentRolesHad).catch(() => { });

					// if they want to get rid of a role that has more than two options..
					if (currentRolesHad.length === 1 && roles.length > 2 && currentRolesHad[0].id === searched.id)
						return call.message.member.removeRole(role)
							.then(() => call.message.channel.send(REMOVED_SUCCESS))
							.catch(() => call.message.channel.send(REMOVED_FAILED));

					// if they don't have more than 1 of the roles..
					if (notHad.length > 1)
						call.message.member.addRole(searched)
							.then(() => call.message.channel.send(GIVEN_SUCCESS))
							.catch(() => call.message.channel.send(GIVEN_FAILED));
					// if they don't have exactly one of the roles..
					else
						call.message.member.addRoles(notHad)
							.then(() => call.message.channel.send(GIVEN_SUCCESS))
							.catch(() => call.message.channel.send(GIVEN_FAILED));
				}
			} else
				call.message.channel.send('This role is not toggleable.');
		}
	}
};
