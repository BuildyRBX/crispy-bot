const { RichEmbed } = require('discord.js');
const sendPaged = require('../utility/sendPaged.js');

module.exports = {
	id: 'list',
	exec: function (call, findTag, tags) {
		if (tags.length === 0)
			return call.message.channel.send('There are no tags for this server.');

		let listEmbed = new RichEmbed()
			.setTitle('All Tags')
			.setColor('GREEN')
			.setFooter(`Ran by ${call.message.author.tag}`);

		sendPaged(call, listEmbed,
			{
				values: tags.map((m) => `\`${m.name}\``).sort(),
				valuesPerPage: 10,
				dm: false,
			});
	}
};