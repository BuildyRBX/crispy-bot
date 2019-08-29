const { RichEmbed } = require('discord.js');

module.exports = {
	id: 'ad',
	exec: (client) => {
		client.on('messageReactionAdd', async (messageReaction, user) => {
			if (user.bot || messageReaction.message.channel.name !== 'ad-approval')
				return;

			let adChannel = messageReaction.message.guild.channels.find((m) => m.name === 'advertisements');
			if (!adChannel)
				return user.send('Could not find the advertisements channel in this server.');

			let embed = new RichEmbed(messageReaction.message.embeds[0]);

			let author = await client.fetchUser(embed.footer.text.split('ID: ')[1]).catch(() => {});

			if (messageReaction.emoji.name === '✅') {
				adChannel.send(embed).then(() => {
					if (author)
						author.send('Your advertisement was approved.').catch(() => {});

					messageReaction.message.delete();
				}).catch(() => messageReaction.message.react('⚠'));
			} else if (messageReaction.emoji.name === '❌') {
				if (author)
					author.send('Your advertisement was denied.').catch(() => {});

				messageReaction.message.delete();
			}
		});
	}
};
