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

		call.forcer = call.message.member;
		call.message.member = member;

		call.commands.get('toggle').exec(call, true);
	}
};