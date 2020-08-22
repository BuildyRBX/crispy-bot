module.exports = {
	id: 'dm',
	desc: 'Dms a user with a message',
	channels: 'guild',
	exec: async (call) => {
		if if (!call.message.member.roles.some((r) => ['M3'].includes(r.name))) {
			let author = call.client.users.get(((call.args[0] || '').match(/\d+/) || [])[0]);
			if (author != null) {
				let content = call.message.content.substring(call.prefixUsed.length).trim().substring(4 + call.args[0].length).trim();
				if (content) {
					let send = await call.message.guild.fetchMember(author);

					send.send(content)
						.then(() => call.message.react('✅'))
						.catch(() => call.message.react('❌'));
				} else {
					call.message.channel.send('Invalid content. e.g. `,dm @user noob`');
				}
			} else {
				call.message.channel.send('Invalid content. e.g. `,dm @user noob`');
			}
		}
	}
};
