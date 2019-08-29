const { RichEmbed } = require('discord.js');

module.exports = {
	id: 'close',
	exec: async function (call, prompt) {
		let queue = call.message.guild.channels.find((m) => m.name === 'ticket-queue');
		let logs = call.message.guild.channels.find((m) => m.name === 'ticket-logs');
		if (!queue || !logs)
			return call.message.channel.send('Could not find the ticket queue or the ticket logs channel in this server.');

		call.message.channel.send('Prompt will continue in dms.');

		await call.message.author.createDM();

		let number = await prompt(call, 'What is the number of the ticket you want to close?');

		let tickets = await queue.fetchMessages({ limit: 100 });

		let toClose = tickets.find((m) => m.embeds[0] &&
			m.embeds[0].footer.text.split('ID: ')[1] === call.message.author.id &&
			m.embeds[0].title === `Ticket #${number}`);

		if (!toClose)
			return call.message.author.send('Could not find your ticket. Prompt cancelled.');

		let embed = new RichEmbed(toClose.embeds[0]);

		let confirmation = await prompt(call, ['Are you sure you want to close this ticket? Options: `yes`, `no`', embed], { filter: ['yes', 'no'] }, true);
		if (confirmation === 'yes')
			logs.send(embed.setColor())
				.then(() => {
					toClose.delete();

					call.message.author.send('Successfully closed your ticket. Here is a copy of your ticket.', { embed });
				}).catch(() => call.message.author.send('Failed to close your ticket, please try again later.'));
		else
			call.message.author.send('Did not close the ticket.');
	}
};