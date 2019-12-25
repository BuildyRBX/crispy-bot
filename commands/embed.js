const EmbedParser = require('../utility/EmbedParser');

const SUPPORT_STRING = `\`\`\`
TITLE: the title text of the embed.
TITLE_URL: the link that the user is directed to upon clicking on the title text.
COLOR: the color of the embed.
DESCRIPTION: the description body of the embed.
AUTHOR: the author text of the embed. 
AUTHOR_ICON: the link representing the tiny image to put on the left of the author text.
AUTHOR_URL: the link that the user is directed to upon clicking on the author text.
THUMBNAIL: the link representing the small image displayed in the top right of the embed.
FOOTER: the footer text of the embed.
FOOTER_ICON: the link representing the tiny image to put on the left of the footer text.
IMAGE: the link representing the large image to put on the bottom of the embed.
FIELD: represents a field of the embed. formatted like this: <field name>|<field text>|<field inline>, field inline should be one of 'true' or 'false. You can have up to 25 of these.
\`\`\``;

module.exports = {
	id: 'embed',
	desc: 'Sends a customized embed to the current channel.',
	channels: 'guild',
	exec: async (call) => {
		if (call.message.member.roles.every((r) => r.name !== 'M3'))
			return call.message.channel.send('You need the M3 role to use this command.');

		if (!call.args[0])
			return call.message.channel.send(`Please specify at least one embed value.${SUPPORT_STRING}e.g.\`\`\`!embed TITLE: hello\nDESCRIPTION: goodbye\`\`\``);

		if (!EmbedParser.canParse(call.cut))
			return call.message.channel.send('Failed to parse the text into an embed, please note that to have a newline in an embed, put `\\n` in the position of where the newline should be.');

		try {
			await call.message.channel.send(new EmbedParser(call.cut, call.message.member));
		} catch (exc) {
			console.warn(exc.stack);

			call.message.channel.send('An error occured: ' + exc.message);
		}
	}
};
