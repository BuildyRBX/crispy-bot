module.exports = {
	id: 'speak',
	desc: 'Says something in another channel.',
	channels: 'guild',
	exec: async (call) => {
		if (call.client.ownerID !== call.message.author.id)
			return;

		if (!call.args[0])
			return call.message.channel.send('Invalid usage. Usage: `,speak #channel msg`');

		let channel = call.message.guild.channels.get(call.args[0].replace(/\D/gi, ''));
		if (!channel)
			return call.message.channel.send('Could not find this channel in this guild.');

		channel.send(call.cut.substring(call.args[0].length).trim())
			.then(() => call.message.react('✅'))
			.catch(() => call.message.react('❌'));
	}
};