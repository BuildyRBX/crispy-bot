const LINK_REGEXP = new RegExp(/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi);

module.exports = {
	id: 'imageLock',
	exec: async (client) => {
		client.on('message', (message) => {
			if (message.channel.type === 'dm' || !message.channel.topic || !message.channel.topic.includes('[IMAGE_LOCK]'))
				return;

			if (!message.attachments.first() && !LINK_REGEXP.test(message.content))
				return message.delete().then(() => message.author.send('This channel is for images/links only.').catch(() => {}));
		});
	}
};
