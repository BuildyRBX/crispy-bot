const { RichEmbed } = require('discord.js');

module.exports = {
	id: 'edit',
	exec: async function (call, prompt) {
		let queue = call.message.guild.channels.find((m) => m.name === 'ticket-queue');
		if (!queue)
			return call.message.channel.send('Could not find the ticket queue in this server.');

		call.message.channel.send('Prompt will continue in dms.');

		await call.message.author.createDM();

		let number = await prompt(call, 'What is the number of the ticket you want to edit?');

		let tickets = await queue.fetchMessages({ limit: 100 });

		let toEdit = tickets.find((m) => m.embeds[0] &&
			m.embeds[0].footer.text.split('ID: ')[1] === call.message.author.id &&
			m.embeds[0].title === `Ticket #${number}`);

		if (!toEdit)
			return call.message.author.send('Could not find your ticket. Prompt cancelled.');

		let embed = new RichEmbed(toEdit.embeds[0]);

		let newTicket = await prompt(call, ['What do you want to edit your ticket to?', embed]);

		embed = embed.setDescription(newTicket);

		let confirmation = await prompt(call, ['Here is your new ticket. Are you sure you want to edit it? Options: `yes`, `no`', embed], { filter: ['yes', 'no'] }, true);
		if (confirmation === 'yes')
			toEdit.edit(embed)
				.then(() => {
					call.message.author.send('Successfully edited your ticket. Here is a copy of your new ticket.', { embed });
				}).catch(() => call.message.author.send('Failed to edit your ticket, please try again later.'));
		else
			call.message.author.send('Did not edit the ticket.');
	}
};