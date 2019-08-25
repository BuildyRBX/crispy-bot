module.exports = {
	id: 'force',
	exec: async function (call, findRole, toggles, HELP) {
		if (!call.args[1])
			return call.message.channel.send(HELP);

		let member = call.args.shift();
		if (!member)
			return call.message.channel.send(HELP);

		member = call.message.guild.member(member.replace(/\D/gi, ''));
		if (!member)
			return call.message.channel.send('Invalid user.');

		let search = call.args.join(' ');
		let toggleable = findRole(toggles, search);
		let role;

		if (toggleable) {
			role = call.message.guild.roles.find((m) => m.name.toLowerCase() === toggleable.role);
			if (!role)
				return call.message.channel.send('This role does not exist in this server.');

			if (toggleable.required_role)
				if (!call.message.member.roles.find((r) => r.name.toLowerCase() === toggleable.required_role))
					return call.message.channel.send('You do not have permission to force toggle this role.');

			member.roles.has(role.id) ?
				member.removeRole(role)
					.then(() => call.message.channel.send('Successfully removed this user from this role.'))
					.catch(() => call.message.channel.send('Could not remove this user from this role, please try again.')) :
				member.addRole(role)
					.then(() => call.message.channel.send('Successfully given this user this role.'))
					.catch(() => call.message.channel.send('Could not give this user this role, please try again.'));
		} else
			call.message.channel.send('This role is not toggleable.');
	}
};