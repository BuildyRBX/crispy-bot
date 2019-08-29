const { MessageReaction } = require('discord.js');

module.exports = {
	id: 'raw',
	exec: (client) => {
		client.on('raw', async (packet) => {
			if (packet.t === 'MESSAGE_REACTION_ADD') {
				let channel = client.channels.get(packet.d.channel_id);

				if (channel && !channel.messages.has(packet.d.message_id)) {
					let msg = await channel.fetchMessage(packet.d.message_id);
					let user = await client.fetchUser(packet.d.user_id);

					// messageReactionAdd, identical to the real event, used for emitting reactions added to messages created before startup.
					client.emit('messageReactionAdd', msg.reactions.get(`${packet.d.emoji.name}${packet.d.emoji.id ? `:${packet.d.emoji.id}` : ''}`), user);
				}
			} else if (packet.t === 'MESSAGE_REACTION_REMOVE') {
				let channel = client.channels.get(packet.d.channel_id);

				if (channel && !channel.messages.has(packet.d.message_id)) {
					let msg = await channel.fetchMessage(packet.d.message_id);
					let user = await client.fetchUser(packet.d.user_id);
					let reaction = msg.reactions.get(packet.d.emoji.id || packet.d.emoji.name) ||
						new MessageReaction(msg, packet.d.emoji, 0, false);

					// messageReactionAdd, identical to the real event, used for emitting reactions added to messages created before startup.
					client.emit('messageReactionRemove', reaction, user);
				}
			} else if (packet.t === 'TYPING_START') {
				client.emit('realTypingStart', client.channels.get(packet.d.channel_id), client.users.get(packet.d.user_id));
			}
		});
	}
};