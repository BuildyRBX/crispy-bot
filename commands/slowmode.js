const parseTime = require('../utility/parseTime.js');
const { RichEmbed, Collection } = require('discord.js');

module.exports = {
	id: 'slowmode',
	channels: 'guild',
	currentSlow: new Collection(),
	desc: 'Sets the slowmode',
	exec: async (call) => {
		if (!call.message.member.roles.some((r) => ['Administrator', 'Directorship Team', 'Overseer', 'Owner'].includes(r.name)))
			return call.message.channel.send('You do not have permission to use this command.');

		let channel = call.message.channel;
		let length = call.args[0];

		if (!length)
			return call.message.channel.send('Usage: `,slowmode <length> <?duration>`');

		let duration = call.args[1];

		length = length.toLowerCase() === '0s' ? 0 : parseTime(length);
		if (!length && length !== 0)
			return call.message.channel.send('Invalid length.');

		if (length > 21600000 || length < 0)
			return call.message.channel.send('Please specify a valid slowmode duration, between 0 and 6 hours');

		duration = duration ? parseTime(duration) : 0;

		channel.setRateLimitPerUser(length / 1000).then(() => {
			call.message.channel.send('Successfully changed the slowmode for this channel.');

			let channelSlow = module.exports.currentSlow.get(channel.id);

			if (channelSlow)
				clearTimeout(channelSlow);

			if (length > 0 && duration > 0) {
				module.exports.currentSlow.set(channel.id,
					call.client.setTimeout(() => {
						channel.setRateLimitPerUser(0);
					}, duration)
				);
			}
		}, () => call.message.channel.send('Could not change the slowmode for this channel.'));

		call.client.logChannel.send(new RichEmbed()
			.setTitle('Slowmode Changed')
			.setColor('RED')
			.addField('Length', call.args[0])
			.addField('Duration', call.args[1] || 0)
			.addField('Channel', call.message.channel)
			.addField('Moderator', call.message.author.toString())).catch(() => {});
	}
};
