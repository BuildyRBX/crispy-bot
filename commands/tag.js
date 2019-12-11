const { RichEmbed } = require('discord.js')
const fs = require('fs');

let HELP =
`**__Commands__**
tag list
tag info (name)
__Restricted__
tag create (name) (desc)
tag delete (name)
tag edit (name) (desc)
tag rename (name) (new_name)
tag alias (name) (alias)
tag remove_alias (name) (alias)`;

function titleCase(str) {
	return str.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });
}

function findTag(tags, search) {
	return tags.find((tag) => tag.name === search.toLowerCase() || tag.aliases.includes(search.toLowerCase()));
}

let files = fs.readdirSync('./tag-options').map((name) => {
	try {
		return require(`./../tag-options/${name}`);
	} catch (exc) {
		console.warn(`Failed to load ${name} tag option.\n`, exc.stack);

		return {};
	}
});

module.exports = {
	id: 'tag',
	desc: 'Tag create, delete, list, etc.',
	channels: 'guild',
	exec: (call) => {
		let tags = call.client.tags.filter((m) => m.guild === call.message.guild.id);

		if (!call.args[0])
			return call.message.channel.send(HELP);

		let options = ['info', 'list'];
		if (call.message.member.roles.some((r) => ['M3'].includes(r.name)))
			options = ['info', 'list', 'create', 'delete', 'rename', 'edit', 'alias', 'remove_alias'];

		let option = call.args.shift().toLowerCase();

		if (options.includes(option))
			try {
				files.find((o) => o.id === option).exec(call, findTag, tags, HELP);
			} catch (exc) {
				if (exc.message.endsWith('time') || exc.message.endsWith('cancelled'))
					return;

				call.message.channel.send('An error occured with the tag command. Please try again later.');
			}
		else {
			let tag = findTag(tags, option);
			if (tag)
				call.message.channel.send(
					new RichEmbed()
						.setColor('BLUE')
						.setFooter(call.message.author.username, call.message.author.displayAvatarURL)
						.setTitle(`${titleCase(tag.name)} Tag`)
						.setDescription(tag.content)
				console.error);
			else
				call.message.channel.send('Could not find this tag.');

		}
	}
};
