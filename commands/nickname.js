module.exports = {
	id: 'nickname',
	aliases: ['nick'],
	desc: 'Nicknames a user',
	channels: 'guild',
	exec: async (call) => {
		if (!call.message.member.roles.some((r) => ['M1', 'M2', 'M3'].includes(r.name)))
			return call.message.channel.send('You do not have permission to use this command.');

		if (!call.args[1])
			return call.message.channel.send('Invalid usage: `,nickname @user (username)`');

		let member = call.message.guild.member(call.args.shift().replace(/\D/gi, ''));
		if (!member)
			return call.message.channel.send('Could not find this user in this guild.');

		member.setNickname(call.args.join(' ').trim())
			.then(() => call.message.channel.send('Successfully nicknamed this user.'))
			.catch(() => call.message.channel.send('Could not nickname this user, make sure the username is not too short or too long, or check my permissions and try again.'));
	}
};