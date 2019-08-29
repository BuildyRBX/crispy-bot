const fs = require('fs');

const HELP =
`**OPTIONS**
ticket create
ticket close
ticket edit
`;

function prompt(call, message, opts = {}, lC = false, image = false) {
	return call.prompt(message, { ...opts, channel: call.message.author.dmChannel })
		.then((m) => lC ? m.content.toLowerCase() :
			image && m.content ? m.content :
				image && m.attachments.first() ? m.attachments.first().url :
					m.content);
}

let files = fs.readdirSync('./ticket-options').map((name) => {
	try {
		return require(`./../ticket-options/${name}`);
	} catch (exc) {
		console.warn(`Failed to load ${name} ticket option.\n`, exc.stack);

		return {};
	}
});

module.exports = {
	id: 'ticket',
	desc: 'Creates or modifies a ticket.',
	channels: 'guild',
	exec: async (call) => {
		if (!call.args[0])
			return call.message.channel.send(HELP);

		let options = ['create', 'close', 'edit'];

		let option = call.args[0];

		if (options.includes(option))
			try {
				files.find((o) => o.id === option).exec(call, prompt, HELP);
			} catch (exc) {
				if (exc.message.endsWith('time') || exc.message.endsWith('cancelled'))
					return;

				call.message.channel.send('An error occured with the ticket command. Please try again later.');
			}
		else {
			call.message.channel.send(HELP);
		}
	}
};
