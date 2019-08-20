const db = require('../utility/database.js');

module.exports = {
	id: 'delete',
	exec: function (call, findTag, tags, HELP) {
		if (!call.args[0])
			return call.message.channel.send(HELP);

		let tag = findTag(tags, call.args.shift());

		if (!tag)
			return call.message.channel.send('Could not find this tag.');

		db.deleteTag(call.message.guild.id, tag.name).then(() => {
			call.message.channel.send('Successfully deleted tag.');

			call.client.updateTagList();
		}).catch(() => call.message.channel.send('Could not delete tag, please try again later.'));
	}
};