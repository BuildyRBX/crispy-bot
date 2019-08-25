const { RichEmbed } = require('discord.js');
const mutes = require('../load/mutes');

module.exports = {
	id: 'unmute',
	channels: 'guild',
	desc: 'Unmutes someone.',
	exec: async (call) => {
		if (!call.message.member.roles.some((r) => ['M3'].includes(r.name)))
			return call.message.channel.send('You do not have permission to use this command.');

		let member = call.args.shift();

		if (!member)
			return call.message.channel.send(`Please rerun the command and mention or supply the ID of a user to unmute e.g. \`${call.client.prefix}unmute ${call.client.owner.tag} server/voice 10m10s <optional reason>\`.`);

		member = call.message.guild.members.get(member.replace(/\D+/g, ''));

		if (!member)
			return call.message.channel.send(`Please rerun the command and mention or supply the ID of a valid user to unmute. e.g. \`${call.client.prefix}unmute ${call.client.owner.tag} server/voice 10m10s <optional reason>\`.`);

		if (member.highestRole.position >= call.message.member.highestRole.position || member.id === call.message.guild.ownerID)
			return call.message.channel.send('You do not have permission to unmute this user.');

		let type = 'server';
		if (call.args[0] && (call.args[0].toLowerCase() === 'voice' || call.args[0].toLowerCase() === 'server'))
			type = call.args.shift().toLowerCase();

		let mute = mutes.mutes.find((mute) => mute.guild === call.message.guild.id && mute.user === member.id && mute.type === type);
		if (!mute)
			return call.message.channel.send(`This user is not ${type} muted.`);

		let reason = 'none specified';
		if (call.args.join(' ') !== '')
			reason = call.args.join(' ');

		let muteRole = call.message.guild.roles.find(({ name }) => name.toLowerCase() === `${type === 'server' ? 'muted' : 'supressed'}`);
		member.removeRole(muteRole, `unmuted by ${call.message.author.tag} with reason: ${reason}`)
			.then(async () => {
				if (type === 'voice' && member.voiceChannel)
					member.setVoiceChannel(null).catch(() => {});

				call.message.guild.channels.find((m) => m.name === 'logs').send(
					new RichEmbed()
						.setColor('Green')
						.setAuthor(`${member.user.username} Unmuted` + `${type === 'server' ? '' : ' (Voice)'}`, member.user.displayAvatarURL)
						.addField('User Unmuted', member.user.toString())
						.addField('Unmuted By', call.message.author.toString())
						.addField('Reason', reason)
				).catch(() => {});

				await mutes.removeMute(mute);

				call.message.channel.send(`Successfully unmuted ${member.user.tag}.`);
			}, () => call.message.channel.send('Failed to unmute this user.'));
	}
};