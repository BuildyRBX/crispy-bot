const { RichEmbed } = require('discord.js');
let handler = require('d.js-command-handler');

function prompt(call = {}, message, opts = {}, lC = false, image = false) {
	return call.handlerPrompt(message, { ...opts, channel: call.message.author.dmChannel })
		.then((m) => lC ? m.content.toLowerCase() :
			image && m.content ? m.content :
				image && m.attachments.first() ? m.attachments.first().url :
					m.content);
}

module.exports = {
	id: 'ticketQueue',
	exec: (client) => {
		client.on('messageReactionAdd', async (messageReaction, user) => {
			if (user.bot || messageReaction.message.channel.name !== 'ticket-queue')
				return;

			let handlerPrompt = new handler.Call(client).prompt;
			let call = {
				handlerPrompt,
				message: {
					author: user
				}
			};

			messageReaction.remove(user);

			let logs = messageReaction.message.guild.channels.find((m) => m.name === 'ticket-logs');
			if (!logs)
				return user.send('Could not find the ticket logs channel in this server.');

			let embed = new RichEmbed(messageReaction.message.embeds[0]);

			let author = await client.fetchUser(embed.footer.text.split('ID: ')[1]).catch(() => {});

			if (messageReaction.emoji.name === '✅') {
				if (!embed.fields.find((m) => m.name === 'Moderator'))
					embed.addField('Moderator', user.tag);

				logs.send(embed.setColor('GREEN')).then(() => {
					if (author)
						author.send('Your ticket has been closed.', { embed }).catch(() => {});

					messageReaction.message.delete();
				}).catch(() => messageReaction.message.react('⚠'));
			} else if (messageReaction.emoji.name === '✏') {
				await user.createDM();

				let note = await prompt(call, 'What would you like to set the note as?');

				if (embed.fields.find((m) => m.name === 'Moderator')) {
					embed.fields.find((m) => m.name === 'Moderator').value = user.tag;
					embed.fields.find((m) => m.name === 'Moderator Note').value = note;
				} else {
					embed.addField('Moderator', user.tag);
					embed.addField('Moderator Note', note);
				}

				messageReaction.message.edit(embed)
					.then(() => user.send('Successfully set the moderator note.'))
					.catch(() => user.send('Could not set the moderator note, please try again.'));
			}
		});
	}
};
