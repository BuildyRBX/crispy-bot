const Infractions = require('../utility/infractions');
const { GuildMember, RichEmbed } = require('discord.js');

module.exports = {
	id: 'warn',
	desc: 'Warns the specified user.',
	channels: 'guild',
	exec: async (call) => {
		if (!call.message.member.roles.some((r) => ['M1', 'M2', 'M3'].includes(r.name)))
			return call.message.channel.send('You do not have permission to use this command.');

		let user = call.args[0];

		if (!user)
			return call.message.channel.send(`Please specify a user to warn. e.g. \`${call.client.prefix}warn ${call.client.owner.tag} For bullying me!\``);

		user = call.message.guild.member((user.match(/\d+/) || [])[0]);

		if (!user)
			return call.message.channel.send(`Please specify a valid user to warn. You must either mention them or supply their ID. e.g. \`${call.client.prefix}warn ${call.client.owner.tag} For bullying me!\``);

		let reason = call.cut.substring(call.args[0].length, 1500).trim();

		if (user instanceof GuildMember && (user.highestRole.position >= call.message.member.highestRole.position || user.id === call.message.guild.ownerID))
			return call.message.channel.send('You do not have permission to warn this user.');

		let infractions = Infractions.infractionsOf(user, call.message.guild.id);

		if (user instanceof GuildMember)
			user = user.user;

		infractions.addInfraction({ type: 'warn', committer: call.message.author.id, reason });

		call.message.guild.channels.find((m) => m.name === 'logs').send(
			new RichEmbed()
				.setColor('RED')
				.setAuthor(`${user.username} Warned`, user.displayAvatarURL)
				.addField('User Warned', user.toString())
				.addField('Warned By', call.message.author.toString())
				.addField('Reason', reason)
		).catch(() => {});

		user.send(`You have been warned by ${call.message.author.tag} for ${reason}`)
			.then(() => call.message.channel.send(`Successfully warned ${user.tag}`))
			.catch(() => call.message.channel.send(`Could not dm ${user.tag}, but they were warned.`));
	}
};