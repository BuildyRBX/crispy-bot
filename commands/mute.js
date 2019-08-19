const { RichEmbed } = require('discord.js');
const Infractions = require('../utility/infractions');
const mutes = require('../load/mutes');
const parseTime = require('../utility/parseTime');

module.exports = {
	id: 'mute',
	channels: 'guild',
	desc: 'Mutes someone.',
	exec: async (call) => {
		if (!call.message.member.roles.some((r) => ['M2', 'M3'].includes(r.name)))
			return call.message.channel.send('You do not have permission to use this command.');

		let member = call.args[0];

		if (!member)
			return call.message.channel.send(`Please rerun the command and mention or supply the ID of a user to mute e.g. \`${call.client.prefix}mute ${call.client.owner.tag} 10m10s <optional reason>\`.`);

		member = call.message.guild.members.get(member.replace(/\D+/g, ''));

		if (!member)
			return call.message.channel.send(`Please rerun the command and mention or supply the ID of a valid user to mute. e.g. \`${call.client.prefix}mute ${call.client.owner.tag} 10m10s <optional reason>\`.`);

		if (member.highestRole.position >= call.message.member.highestRole.position || member.id === call.message.guild.ownerID)
			return call.message.channel.send('You do not have permission to mute this user.');

		let mute = mutes.mutes.find((mute) => mute.guild === call.message.guild.id && mute.member === member.id);

		if (mute)
			return call.message.channel.send('This user is already muted.');

		let time = call.args[1];

		if (!time)
			return call.message.channel.send(`Please rerun the command and supply the length of the mute. e.g. \`${call.client.prefix}mute ${call.client.owner.tag} 10m10s <optional reason>\``);

		time = parseTime(time);

		if (!time || time <= 0)
			return call.message.channel.send(`Please rerun the command and supply a valid length of the mute. e.g. \`${call.client.prefix}mute ${call.client.owner.tag} 10m10s <optional reason>\`.`);

		let reason = call.args.slice(2).join(' ') || 'none specified';
		let muteRole = call.message.guild.roles.find(({ name }) => name.toLowerCase() === 'muted')
			|| await call.message.guild.createRole({ name: 'Muted', color: 'GRAY' });

		member.addRole(muteRole, `muted by ${call.message.author.tag} with reason: ${reason}`)
			.then(async () => {
				let infractions = Infractions.infractionsOf(member, call.message.guild.id);

				let mute = {
					type: 'mute',
					reason,
					date: Date.now(),
					length: time,
					committer: call.message.author.id
				};

				call.message.guild.channels.find((m) => m.name === 'logs').send(
					new RichEmbed()
						.setColor('RED')
						.setAuthor(`${member.user.username} Muted`, member.user.displayAvatarURL)
						.addField('User Muted', member.user.toString())
						.addField('Muted By', call.message.author.toString())
						.addField('Mute Length', parseTime(time))
						.addField('Reason', reason)
				).catch(() => {});

				infractions.addInfraction(mute);

				await mutes.addMute({ guild: call.message.guild.id, user: member.id, end_date: mute.date + mute.length }, true);

				call.message.channel.send(`Successfully muted ${member.user.tag}.`);
			}, () => call.message.channel.send('Failed to mute this user.'));
	}
};