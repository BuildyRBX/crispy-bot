const db = require('../utility/database.js');

module.exports = {
	id: 'create',
	exec: function (call, findTag, tags, HELP) {
		if (!call.args[1])
			return call.message.channel.send(HELP);

		let name = call.args[0].toLowerCase();
		let content = call.cut.substring(name.length).trim();
		let tag = findTag(tags, name);

		if (tag)
			return call.message.channel.send('This tag already exists.');

		db.createTag(call.message.guild.id, name, content.trim()).then(() => {
			call.message.channel.send('Successfully created tag.');

			call.client.updateTagList();
		}).catch(() => call.message.channel.send('Could not create tag, please try again later.'));
	}
};
