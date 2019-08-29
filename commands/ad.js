const { RichEmbed } = require('discord.js');

function prompt(call, message, opts = {}, lC = false, image = false) {
	return call.prompt(message, { ...opts, channel: call.message.author.dmChannel })
		.then((m) => lC ? m.content.toLowerCase() :
			image && m.content ? m.content :
				image && m.attachments.first() ? m.attachments.first().url :
					m.content);
}

module.exports = {
	id: 'ad',
	desc: 'Send an advertisement.',
	channels: 'guild',
	exec: async (call) => {
		let approvalChannel = call.message.guild.channels.find((m) => m.name === 'ad-approval');
		if (!approvalChannel)
			return call.message.channel.send('Could not find the ad approval channel in this server.');

		call.message.channel.send('Prompt will continue in dms.');

		await call.message.author.createDM();

		let ad = await prompt(call, 'Please send your advertisement.');
		let image = await prompt(call, 'Please provide an image for your advertisement. If you do not have an image, say `skip`.', {}, false, true);

		let embed = new RichEmbed()
			.setAuthor(call.message.author.tag, call.message.author.displayAvatarURL)
			.setColor('BLUE')
			.setDescription(ad)
			.setFooter(`ID: ${call.message.author.id}`)
			.setImage(image);

		approvalChannel.send(embed)
			.then((m) => {
				call.message.author.send('Successfully sent ad for approval.');

				m.reactMultiple(['✅', '❌']);
			})
			.catch(() => {
				approvalChannel.send(embed.setImage(undefined))
					.then((m) => {
						call.message.author.send('Successfully sent ad for approval.');

						m.reactMultiple(['✅', '❌']);
					})
					.catch(() => call.message.author.send('Failed to send ad for approval.'));
			});

	}
};
