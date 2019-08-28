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

		let member = call.args.shift();

		if (!member)
			return call.message.channel.send(`Please rerun the command and mention or supply the ID of a user to mute e.g. \`${call.client.prefix}mute ${call.client.owner.tag} server/voice 10m10s <optional reason>\`.`);

		member = call.message.guild.members.get(member.replace(/\D+/g, ''));

		if (!member)
			return call.message.channel.send(`Please rerun the command and mention or supply the ID of a valid user to mute. e.g. \`${call.client.prefix}mute ${call.client.owner.tag} server/voice 10m10s/perm <optional reason>\`.`);

		if (member.highestRole.position >= call.message.member.highestRole.position || member.id === call.message.guild.ownerID)
			return call.message.channel.send('You do not have permission to mute this user.');

		let type = 'server';
		if (call.args[0] && (call.args[0].toLowerCase() === 'voice' || call.args[0].toLowerCase() === 'server'))
			type = call.args.shift().toLowerCase();

		let mute = mutes.mutes.find((mute) => mute.guild === call.message.guild.id && mute.user === member.id && mute.type === type);

		if (mute)
			return call.message.channel.send('This user is already muted.');

		let time = call.args.shift();

		if (!time)
			return call.message.channel.send(`Please rerun the command and supply the length of the mute. e.g. \`${call.client.prefix}mute ${call.client.owner.tag} server/voice 10m10s/perm <optional reason>\``);

		time = time === 'perm' ? 'perm' : parseTime(time);

		if (!time || time <= 0)
			return call.message.channel.send(`Please rerun the command and supply a valid length of the mute. e.g. \`${call.client.prefix}mute ${call.client.owner.tag} server/voice 10m10s/perm <optional reason>\`.`);

		let reason = 'none specified';
		if (call.args.join(' ') !== '')
			reason = call.args.join(' ');

		let muteRole = call.message.guild.roles.find(({ name }) => name.toLowerCase() === `${type === 'server' ? 'muted' : 'supressed'}`);
		member.addRole(muteRole, `muted by ${call.message.author.tag} with reason: ${reason}`)
			.then(async () => {
				if (type === 'voice' && member.voiceChannel)
					member.setVoiceChannel(null).catch(() => {});

				let infractions = Infractions.infractionsOf(member, call.message.guild.id);

				let mute = {
					type: `${type === 'server' ? '' : 'voice '}` + 'mute',
					reason,
					date: Date.now(),
					length: time,
					committer: call.message.author.id
				};

				call.message.guild.channels.find((m) => m.name === 'logs').send(
					new RichEmbed()
						.setColor('RED')
						.setAuthor(`${member.user.username} Muted` + `${type === 'server' ? '' : ' (Voice)'}`, member.user.displayAvatarURL)
						.addField('User Muted', member.user.toString())
						.addField('Muted By', call.message.author.toString())
						.addField('Mute Length', time === 'perm' ? 'perm' : parseTime(time))
						.addField('Reason', reason)
				).catch(() => {});

				infractions.addInfraction(mute);

				await mutes.addMute({ guild: call.message.guild.id, user: member.id, end_date: time === 'perm' ? 'perm' : mute.date + mute.length, type: type }, true);

				call.message.channel.send(`Successfully muted ${member.user.tag}.`);
			}, () => call.message.channel.send('Failed to mute this user.'));
	}
};