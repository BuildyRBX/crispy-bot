const { RichEmbed } = require('discord.js');

module.exports = {
	id: 'create',
	exec: async function (call, prompt) {
		let queue = call.message.guild.channels.find((m) => m.name === 'ticket-queue');
		if (!queue)
			return call.message.channel.send('Could not find the ticket queue in this server.');

		call.message.channel.send('Prompt will continue in dms.');

		await call.message.author.createDM();

		let problem = await prompt(call, 'Please describe the problem you are having or what you need help with.');

		let currentNumber = 1;
		if (queue.topic)
			currentNumber = parseInt(queue.topic) || 1;

		queue.setTopic(currentNumber + 1);

		let embed = new RichEmbed()
			.setAuthor(call.message.author.tag, call.message.author.displayAvatarURL)
			.setTitle(`Ticket #${currentNumber}`)
			.setColor('ORANGE')
			.setDescription(problem)
			.setFooter(`ID: ${call.message.author.id}`);

		let confirmation = await prompt(call, ['Ready to send ticket? Options: `yes`, `no`', embed], { filter: ['yes', 'no'] }, true);
		if (confirmation === 'yes')
			queue.send(embed)
				.then((m) => {
					call.message.author.send('Successfully sent your ticket. Here is a copy of your ticket.', { embed });

					m.reactMultiple(['✅', '✏']);
				}).catch(() => call.message.author.send('Failed to send your ticket, please try again later.'));
		else
			call.message.author.send('Did not send ticket.');
	}
};