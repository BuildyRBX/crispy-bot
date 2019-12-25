const { client: pgClient } = require('./database');

function isEmoji(reaction, emoji) {
	return (reaction.emoji.name === emoji || reaction.emoji.id === emoji.replace(/.+:/, ''));
}

module.exports = {
	id: 'role-message',
	roleMessages: [],
	exec: async function (client) {
		this.roleMessages = await pgClient.query('SELECT "channel", "message", "emoji", "role" FROM public.role_messages').then((res) => res.rows);

		client.on('messageReactionAdd', (reaction, user) => {
			if (reaction.message.channel.type !== 'text')
				return;

			let roleMessage = this.roleMessages.find((vM) => vM.message === reaction.message.id);

			if (!roleMessage || !isEmoji(reaction, roleMessage.emoji))
				return;

			reaction.message.guild.fetchMember(user).then((member) => member.addRole(roleMessage.role))
				.then(() => user.send(`Added you to the \`${reaction.message.guild.roles.get(roleMessage.role).name}\` role.`))
				.catch(() => user.send('Failed to role you. Potential reasons: role deleted or the bot lacks permissions. Please contact a moderator if this persists.'));
		}).on('messageReactionRemove', (reaction, user) => {
			if (reaction.message.channel.type !== 'text')
				return;

			let roleMessage = this.roleMessages.find((vM) => vM.message === reaction.message.id);

			if (!roleMessage || !isEmoji(reaction, roleMessage.emoji))
				return;

			reaction.message.guild.fetchMember(user).then((member) => member.removeRole(roleMessage.role))
				.then(() => user.send(`Removed you from the \`${reaction.message.guild.roles.get(roleMessage.role).name}\` role.`))
				.catch(() => user.send('Failed to unrole you. Potential reasons: role deleted or the bot lacks permissions. Please contact a moderator if this persists.'));
		});
	}
};