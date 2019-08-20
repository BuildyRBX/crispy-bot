const LINK_REGEXP = new RegExp(/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi);

module.exports = {
	id: 'imageLock',
	exec: async (client) => {
		function check (o, n) {
			let message = n || o;

			if (message.channel.type === 'dm' || !message.channel.topic || !message.channel.topic.includes('[IMAGE_LOCK]'))
				return;

			if (!message.attachments.first() && !LINK_REGEXP.test(message.content))
				return message.delete().then(() => message.author.send('This channel is for images/links only.').catch(() => {}));
		}
		client.on('message', (check));
		client.on('messageUpdate', (check));
	}
};
