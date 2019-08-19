const Infractions = require('../utility/infractions');
const { GuildMember, RichEmbed } = require('discord.js');

module.exports = {
	id: 'ban',
	desc: 'Bans the specified user.',
	channels: 'guild',
	exec: async (call) => {
		if (!call.message.member.roles.some((r) => ['M3'].includes(r.name)))
			return call.message.channel.send('You do not have permission to use this command.');

		let user = call.args[0];

		if (!user)
			return call.message.channel.send(`Please specify a user to ban. e.g. \`${call.client.prefix}ban ${call.client.owner.tag} For bullying me!\``);

		user = call.message.guild.member((user.match(/\d+/) || [])[0]) || await call.client.fetchUser(user).catch(() => null);

		if (!user)
			return call.message.channel.send(`Please specify a valid user to ban. You must either mention them or supply their ID. e.g. \`${call.client.prefix}ban ${call.client.owner.tag} For bullying me!\``);

		let reason = call.cut.substring(call.args[0].length, 250).trim();

		if (user instanceof GuildMember && (user.highestRole.position >= call.message.member.highestRole.position || user.id === call.message.guild.ownerID))
			return call.message.channel.send('You do not have permission to ban this user.');

		let infractions = Infractions.infractionsOf(user, call.message.guild.id);

		if (user instanceof GuildMember)
			user = user.user;

		call.message.guild.ban(user, `Banned by ${call.message.author.tag} for ${reason}`)
			.then(() => {
				call.message.guild.channels.find((m) => m.name === 'logs').send(
					new RichEmbed()
						.setColor('RED')
						.setAuthor(`${user.username} Banned`, user.displayAvatarURL)
						.addField('User Banned', user.toString())
						.addField('Banned By', call.message.author.toString())
						.addField('Reason', reason)
				).catch(() => {});

				infractions.addInfraction({ type: 'ban', committer: call.message.author.id, reason });

				call.message.channel.send(`Successfully banned ${user.tag}`);
			})
			.catch(() => call.message.channel.send(`Failed to ban ${user.tag}.`));
	}
};