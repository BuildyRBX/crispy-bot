module.exports = {
	id: 'ping',
	aliases: ['pong'],
	desc: 'Gives you the bots ping.',
	channels: 'guild',
	exec: (call) => {
		call.message.channel.send('Pong! ' + call.client.pings[0] + 'ms D-API delay.');
	}
};
