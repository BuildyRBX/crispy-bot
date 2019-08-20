const db = require('../utility/database.js');

module.exports = {
	id: 'remove_alias',
	exec: function (call, findTag, tags, HELP) {
		if (!call.args[1])
			return call.message.channel.send(HELP);

		let tag = findTag(tags, call.args.shift());
		if (!tag)
			return call.message.channel.send('Could not find this tag.');

		let alias = call.args[0].toLowerCase().trim();

		let index = tag.aliases.indexOf(alias);
		if (index === -1)
			return call.message.channel.send('This alias does not belong to this tag.');

		tag.aliases.splice(index, 1);

		db.updateAliases(call.message.guild.id, tag.name, tag.aliases).then(() => {
			call.message.channel.send('Successfully edited tag aliases.');

			call.client.updateTagList();
		}).catch(() => call.message.channel.send('Could not edit tag aliases, please try again later.'));
	}
};