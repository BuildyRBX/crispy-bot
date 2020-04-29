const EmbedParser = require('../utility/EmbedParser');

const SUPPORT_STRING = `\`\`\`
TITLE: Embed Title.
TITLE_URL: Embed Title Link
COLOR: Embed Color
DESCRIPTION: Embed Description Body
AUTHOR: Embed Author Text
AUTHOR_ICON: Embed Author Image
AUTHOR_URL: Embed Author Text Link
THUMBNAIL: Embed Thumbnail Image (Top Right)
FOOTER: Embed Footer Text
FOOTER_ICON: Embed Footer Image
IMAGE: Embed Image (Largest Image)
FIELD: Add Embed Field [Format: Field Name | Field Description | inline: true/false] (Up to 25) 
\`\`\``;

module.exports = {
	id: 'embed',
	desc: 'Sends a customized embed to the current channel.',
	channels: 'guild',
	exec: async (call) => {
		if (call.message.member.roles.every((r) => r.name !== 'M3'))
			return call.message.channel.send('You do not have permission to run this command.');

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
