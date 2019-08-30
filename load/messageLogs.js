const { RichEmbed } = require('discord.js');

module.exports = {
	id: 'messageLogs',
	exec: async (client) => {
		client.on('messageDelete', (msg) => {
			if (msg.author.bot)
				return;

			let logs = msg.guild.channels.find((m) => m.name === 'msg-logs');
			if (!logs)
				return;

			let embed = new RichEmbed()
				.setColor('RED')
				.setAuthor(`Message Delete by ${msg.author.tag}`, msg.author.displayAvatarURL)
				.setDescription(`\`\`\`${msg.content.replace(/`/g, '').substring(0, 2000)}\`\`\``)
				.addField('Channel', msg.channel);

			logs.send(embed);
		});
		client.on('messageUpdate', (oldMsg, newMsg) => {
			if (newMsg.author.bot || oldMsg.content === newMsg.content)
				return;

			let logs = newMsg.guild.channels.find((m) => m.name === 'msg-logs');
			if (!logs)
				return;

			let embed = new RichEmbed()
				.setColor('ORANGE')
				.setAuthor(`Message Edit by ${newMsg.author.tag}`, newMsg.author.displayAvatarURL)
				.addField('Before', `\`\`\`${oldMsg.content.replace(/`/g, '').substring(0, 2000)}\`\`\``)
				.addField('After', `\`\`\`${newMsg.content.replace(/`/g, '').substring(0, 2000)}\`\`\``)
				.addField('Channel', newMsg.channel);

			logs.send(embed);
		});
	}
};
