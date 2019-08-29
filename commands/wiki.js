const fetch = require('node-fetch');
const DESC_REGEXP = /(<div class="markdown-field-data">)(.|\n)+?(<\/p>|<br>)/gi;
const { RichEmbed } = require('discord.js');

module.exports = {
	id: 'wiki',
	channels: 'guild',
	desc: 'Searches roblox wiki',
	exec: async (call) => {
		if (!call.args[0])
			return call.message.channel.send('You must provide a search.');

		let search = call.cut.replace(/\s/g, '').replace(/^./, (c) => c.toUpperCase());

		let url = `https://developer.roblox.com/en-us/api-reference/class/${search}`;

		fetch(url).then(async (res) => {
			let description;
			if (res.status === 200) {
				description = await res.text().then((r) => r.match(DESC_REGEXP)[0].replace(/<.+?>|\w+\|/gi, ''));

				let embed = new RichEmbed()
					.setTitle(search)
					.setColor('RED')
					.setDescription(description)
					.addField('Link', `[${search}](${url})`)
					.setFooter(`Ran by ${call.message.author.tag}`, call.message.author.displayAvatarURL);

				call.message.channel.send(embed);
			}
			else
				call.message.channel.send(`Could not find the \`${search}\` class on the wiki.`);

		}, () => call.message.channel.send('Error occured in the wiki command.'));
	}
};
