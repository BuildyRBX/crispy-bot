const { RichEmbed } = require('discord.js');
const mutes = require('../load/mutes');

module.exports = {
	id: 'unmute',
	channels: 'guild',
	desc: 'Unmutes someone.',
	exec: async (call) => {
		if (!call.message.member.roles.some((r) => ['Senior Moderator', 'Administrator', 'Directorship Team', 'Overseer', 'Owner'].includes(r.name)))
			return call.message.channel.send('You do not have permission to use this command.');

		let member = call.args[0];

		if (!member)
			return call.message.channel.send(`Please rerun the command and mention or supply the ID of a user to unmute e.g. \`${call.client.prefix}unmute ${call.client.owner.tag} 10m10s <optional reason>\`.`);

		member = call.message.guild.members.get(member.replace(/\D+/g, ''));

		if (!member)
			return call.message.channel.send(`Please rerun the command and mention or supply the ID of a valid user to unmute. e.g. \`${call.client.prefix}unmute ${call.client.owner.tag} 10m10s <optional reason>\`.`);

		if (member.highestRole.position >= call.message.member.highestRole.position || member.id === call.message.guild.ownerID)
			return call.message.channel.send('You do not have permission to unmute this user.');

		let mute = mutes.mutes.find((mute) => mute.guild === call.message.guild.id && mute.user === member.id);

		if (!mute)
			return call.message.channel.send('This user is not muted.');

		let reason = call.args.slice(1).join(' ') || 'none specified';
		let muteRole = call.message.guild.roles.find(({ name }) => name.toLowerCase() === 'muted');

		member.removeRole(muteRole, `unmuted by ${call.message.author.tag} with reason: ${reason}`)
			.then(async () => {
				call.client.logChannel.send(
					new RichEmbed()
						.setColor('Green')
						.setAuthor(`${member.user.username} Unmuted`, member.user.displayAvatarURL)
						.addField('User Unmuted', member.user.toString())
						.addField('Unmuted By', call.message.author.toString())
						.addField('Reason', reason)
				).catch(() => {});

				await mutes.removeMute(mute);

				call.message.channel.send(`Successfully unmuted ${member.user.tag}.`);
			}, () => call.message.channel.send('Failed to unmute this user.'));
	}
};