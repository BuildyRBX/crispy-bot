const db = require('../utility/database.js');

module.exports = {
	id: 'rename',
	exec: function (call, findTag, tags, HELP) {
		if (!call.args[1])
			return call.message.channel.send(HELP);

		let tag = findTag(tags, call.args.shift());

		if (!tag)
			return call.message.channel.send('Could not find this tag.');

		db.updateName(call.message.guild.id, tag.name, call.args[0].toLowerCase().trim()).then(() => {
			call.message.channel.send('Successfully edited tag name.');

			call.client.updateTagList();
		}).catch(() => call.message.channel.send('Could not edit tag name, please try again later.'));
	}
};