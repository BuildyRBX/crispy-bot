const { RichEmbed } = require('discord.js');

module.exports = {
	id: 'info',
	exec: function (call, findTag, tags) {
		if (!call.args[0])
			return call.message.channel.send('Usage: .tag info (name)');

		let tag = findTag(tags, call.args.shift());

		if (!tag)
			return call.message.channel.send('Could not find this tag.');

		let infoEmbed = new RichEmbed()
			.setTitle('Content')
			.setColor('GREEN')
			.setDescription(tag.content)
			.addField('Name', tag.name)
			.addField('Aliases', tag.aliases.length > 0 ? tag.aliases.join(', ') : 'None')
			.setFooter(`Ran by ${call.message.author.tag}`);

		call.message.channel.send(infoEmbed);
	}
};