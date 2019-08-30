const { RichEmbed } = require('discord.js');
const sendPaged = require('../utility/sendPaged.js');

module.exports = {
	id: 'list',
	exec: function (call, findRole, toggles) {
		if (toggles.length === 0)
			return call.message.channel.send('There are no toggleable roles for this server.');

		let listEmbed = new RichEmbed()
			.setTitle('Toggleable Roles')
			.setColor('GREEN')
			.setFooter(`Ran by ${call.message.author.tag}`);

		sendPaged(call, listEmbed,
			{
				values: toggles.map((m) => `${m.multiple.length > 0 ? `[\`${m.role.toUpperCase()}\`, ${m.multiple.map((m) => `\`${m.toUpperCase()}\``).join(', ')}]` : `\`${m.role.toUpperCase()}\``} ${m.required_role ? `-> \`${m.required_role.toUpperCase()}\`` : ''}`).sort(),
				valuesPerPage: 10,
				dm: false,
			});
	}
};