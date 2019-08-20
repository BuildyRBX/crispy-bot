const db = require('../utility/database.js');

module.exports = {
	id: 'alias',
	exec: function (call, findTag, tags, HELP) {
		if (!call.args[1])
			return call.message.channel.send(HELP);

		let tag = findTag(tags, call.args.shift());
		if (!tag)
			return call.message.channel.send('Could not find this tag.');

		let alias = call.args[0].toLowerCase().trim();
		let tagCopy = findTag(tags, alias);
		if (tagCopy)
			return call.message.channel.send('There is already a tag with this name or alias.');

		tag.aliases.push(alias);

		db.updateAliases(call.message.guild.id, tag.name, tag.aliases).then(() => {
			call.message.channel.send('Successfully edited tag aliases.');

			call.client.updateTagList();
		}).catch(() => call.message.channel.send('Could not edit tag aliases, please try again later.'));

		return;
	}
};