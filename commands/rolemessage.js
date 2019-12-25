const { client } = require('../load/database');

function hasReaction(message, emoji) {
	return message.reactions.has(emoji);
}

module.exports = {
	id: 'rolemessage',
	aliases: ['verifymessage'],
	desc: 'Creates a role message on the given message.',
	exec: async (call) => {
		let [messageLink, emoji, ...role] = call.args;

		role = role.join(' ');

		if (!messageLink)
			return call.message.reply(`please rerun the command with the message link of the role message. e.g. \`${call.client.prefix}rolemessage https://discordapp.com/channels/123/123/123 😄 Verified\``);

		let [, channel, message] = messageLink.match(/\d+/g) || [];

		if (!call.client.channels.has(channel) || !(await call.client.channels.get(channel).fetchMessage(message)))
			return call.message.reply(`please rerun the command with a valid message link of the role message. e.g. \`${call.client.prefix}rolemessage https://discordapp.com/channels/123/123/123 😄 Verified\``);

		emoji = emoji.replace(/^<a?:|>$/g, '');

		if (!emoji || !hasReaction(await call.client.channels.get(channel).fetchMessage(message), emoji))
			return call.message.reply(`please rerun the command with the emoji that is used to role the user. Make sure that the emoji is already reacted to the message. e.g \`${call.client.prefix}rolemessage https://discordapp.com/channels/123/123/123 😄 Verified\``);

		if (!role.length)
			return call.message.reply(`please rerun the comand and supply the name or ID of the role to add when to a user who reacts. e.g \`${call.client.prefix}rolemessage https://discordapp.com/channels/123/123/123 😄 Verified\``);

		role = call.message.guild.roles.find((r) => r.name.toLowerCase() === role.toLowerCase()) || call.message.guild.roles.find((r) => r.name.toLowerCase().startsWith(role.toLowerCase()));

		if (!role)
			return call.message.reply(`please rerun the comand and supply the valid name or ID of the role to add when to a user who reacts. e.g \`${call.client.prefix}rolemessage https://discordapp.com/channels/123/123/123 😄 Verified\``);

		client.query('INSERT INTO public.role_messages ("channel", "message", "emoji", "role") VALUES($1, $2, $3, $4)', [channel, message, emoji, role.id])
			.then(() => {
				call.message.reply(`successfully created a role message in <#${channel}>, with emoji <:${emoji}> and role ${role.name}. If you need to cancel this role message, simply delete the message, resend it, and then rerun this command.`);

				require('../load/roleMessages').roleMessages.push({ channel, message, emoji, role: role.id });
			}).catch((e) => {
				console.error(e);

				call.message.reply('failed to create the role message.');
			});
	}
};