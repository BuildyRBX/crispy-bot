const { RichEmbed } = require('discord.js');

module.exports = {
	id: 'announce',
	desc: 'Announces a message to the specified channel with a custom message.',
	channels: 'guild',
	exec: async function (call) {
		if (!call.message.member.roles.some((r) => ['M3'].includes(r.name)))
			return call.message.channel.send('You do not have permission to run this command.');

		let channel = call.message.guild.channels.find((m) => m.name === 'announcements');
		if (!channel)
			return call.message.channel.send('Could not find the announcements channel in this server.');

		let content = call.cut;
		let annTitle = content.split(':')[0];
		let annDescription = content.split(':').slice(1).join(':');

		if (annTitle.length === 0 || annTitle.length > 256 || !annDescription)
			return call.message.channel.send(`Please rerun the command with a valid title. e.g. \`${call.client.prefix}announce Title: Content\``);

		let pingMethod = await call.prompt('What ping do you want to send with the announcement? Options: `here`, `everyone`, `normal` or anything else for a custom message.').then((m) => m.content.toLowerCase());

		channel.send(['everyone', 'here'].includes(pingMethod) ? `@${pingMethod}` : pingMethod === 'normal' ? '' : pingMethod,
			{
				embed: new RichEmbed()
					.setColor('GREEN')
					.setTitle(annTitle)
					.setDescription(annDescription)
					.setFooter(`Announced by ${call.message.author.tag}`),
				disableEveryone: false
			})
			.then(() => call.message.channel.send('Successfully sent the announcement.'))
			.catch(() => call.message.channel.send('Failed to send the announcement, please check my permissions and try again.'));
	}
};
