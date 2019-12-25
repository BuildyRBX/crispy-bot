const { RichEmbed } = require('discord.js');

const welcomeVariables = [
	{ name: 'user', det: (member) => member.toString(), desc: 'the mention of the user', maxLen: 21 },
	{ name: 'user-name', det: (member) => member.user.username, desc: 'the username of the user', maxLen: 32 },
	{ name: 'user-id', det: (member) => member.id, desc: 'the id of the user', maxLen: 18 },
	{ name: 'user-discrim', det: (member) => member.user.discriminator, desc: 'the discriminator of the user (XXXX)', maxLen: 4 },
	{ name: 'user-avatar-url', det: (member) => member.user.displayAvatarURL, desc: 'the avatar of the user', maxLen: 100 },
	{ name: 'user-game', det: (member) => (member.presence.game || {}).name || 'none', desc: 'the current game of the user', maxLen: 128 },
	{ name: 'user-status', det: (member) => member.presence.status, desc: 'the current status of the user', maxLen: 7 },
	{ name: 'owner', det: (member) => member.guild.owner.toString(), desc: 'the owner of the guild\'s mention', maxLen: 21 },
	{ name: 'owner-name', det: (member) => member.guild.owner.user.username, desc: 'the username of the guild\'s owner', maxLen: 32 },
	{ name: 'owner-id', det: (member) => member.guild.owner.id, desc: 'the id of the guild\'s owner', maxLen: 18},
	{ name: 'owner-discrim', det: (member) => member.guild.owner.user.discriminator, desc: 'the discriminator of the guild\'s owner (XXXX)', maxLen: 4 },
	{ name: 'owner-avatar-url', det: (member) => member.guild.owner.user.displayAvatarURL, desc: 'the avatar of the the guild\'s owner', maxLen: 100 },
	{ name: 'owner-game', det: (member) => (member.guild.owner.presence.game || {}).name || 'none', desc: 'the current game of the guild\'s owner', maxLen: 128 },
	{ name: 'owner-status', det: (member) => member.guild.owner.presence.status, desc: 'the current status of the user', maxLen: 7 },
	{ name: 'guild-name', det: (member) => member.guild.name, desc: 'the server\'s name at the time of joining', maxLen: 100 },
	{ name: 'guild-id', det: (member) => member.guild.id, desc: 'the id of the server', maxLen: 18 },
	{ name: 'guild-membercount', det: (member) => member.guild.memberCount.toString(), desc: 'the server\'s membercount at the time of joining', maxLen: 6 },
	{ name: 'guild-logo', det: (member) => member.guild.iconURL || 'none', desc: 'the server\'s logo at the time of joining', maxLen: 88 },
	{ name: 'guild-region', det: (member) => member.guild.region, desc: 'the voice region of the server', maxLen: 12 }
];

function replaceVars(content, member) {
	let result = content;
	if (content instanceof EmbedParser) {
		result.setTitle(replaceVars(content.title, member));
		result.setDescription(replaceVars(content.description, member));
		result.setFooter(replaceVars(content.footer.text, member));
		result.fields = result.fields.map((field) => {
			return { name: replaceVars(field.name, member), value: replaceVars(field.value, member), inline: field.inline };
		});
	} else {
		for (let value of welcomeVariables) {
			result = result.replace(new RegExp('{' + value.name + '}', 'g'), value.det(member));
		}
	}
	return result;
}

const OPTIONS = [
	'TITLE_URL',
	'TITLE',
	'COLOR',
	'DESCRIPTION',
	'AUTHOR_ICON',
	'AUTHOR_URL',
	'AUTHOR',
	'THUMBNAIL',
	'FOOTER_ICON',
	'FOOTER',
	'IMAGE',
	'FIELD'
];

/**
 * Represents a custom embed.
 */
class EmbedParser extends RichEmbed {
	/**
	 * Determines whether or not a string can be parsed
	 * @param {string} raw The raw string.
	 * @returns {boolean} Whether or not parsing is possible on the string.
	 * @static
	 */
	static canParse(raw) {
		return raw.split('\n').every((r) => OPTIONS.some((opt) => r.toUpperCase().startsWith(opt + ':')));
	}

	constructor(raw, member) {
		super();

		/**
		 * Whether or not the raw content is valid.
		 * @type {boolean}
		 */
		this.valid = EmbedParser.canParse(raw);

		if (this.valid)
			this.set(raw, member);
	}

	/**
	 * The raw embed options specified currently.
	 * @type {string[]}
	 * @readonly
	 */
	get options() {
		return this.raw.split('\n');
	}

	/**
	 * Reads an option's value.
	 * @param {string} option The option. Must be included in EmbedParser.OPTIONS.
	 * @returns {string} the value of the option.
	 */
	parseOption(option) {
		let type = this.options.find((g) => g.toUpperCase().startsWith(option));

		if (type)
			return type.replace(
				new RegExp(EmbedParser.OPTIONS.find((opt) => type.toUpperCase().startsWith(opt)) + ':', 'i'), ''
			).trim().replace(/\\n/g, '\n');
		else
			return;
	}

	/**
	 * Edits <EmbedParser>.raw to deal the new/changed option.
	 * @param {string} option The option to change. Must be included in EmbedParser#OPTIONS.
	 * @param {string} newValue The new value of that option.
	 * @returns {void}
	 */
	changeValue(option, newValue) {
		let parsed = this.parseOption(option);

		if (newValue == null)
			return;
		if (!EmbedParser.OPTIONS.includes(option))
			throw new TypeError('Invalid option supplied.');
		if (parsed != null && option !== 'FIELD')
			this.raw = this.raw.replace(new RegExp(option + ':.+'), option + ':' + newValue);
		else
			this.raw += `\n${option}:${newValue}`;
	}

	/**
	 * Sets this embed to meet the properties specified in the string.
	 * @param {string} raw The string.
	 * @param {boolean} member If provided, it is used to replace variables
	 */
	set(raw, member) {
		this.raw = raw;

		if (member)
			this.raw = replaceVars(this.raw, member);

		if (EmbedParser.canParse(raw)) {
			this
				.setAuthor(this.parseOption('AUTHOR') || '', this.parseOption('AUTHOR_ICON'), this.parseOption('AUTHOR_URL'))
				.setTitle(this.parseOption('TITLE') || '')
				.setURL(this.parseOption('TITLE_URL'))
				.setColor(this.parseOption('COLOR'))
				.setDescription(this.parseOption('DESCRIPTION') || '')
				.setFooter(this.parseOption('FOOTER') || '', this.parseOption('FOOTER_ICON'))
				.setThumbnail(this.parseOption('THUMBNAIL'))
				.setImage(this.parseOption('IMAGE'));
			let i = 0;
			for (let field of this.options.filter((opt) => opt.toUpperCase().startsWith('FIELD:'))) {
				++i;
				field = field.replace(/FIELD:/i, '');
				let opts = field.split(/(?<!\\)\|/g).map((fieldOpt) => fieldOpt.trim().replace(/\\n/g, '\n'));
				if (opts[2] != null)
					opts[2] = opts[2] === 'true' ? true : opts[2] === 'false' ? false : null;
				this.addField(...opts);
				// Maximum of 25 fields.
				if (i >= 25)
					break;
			}
			return this;
		} else {
			throw new TypeError('Cannot parse an embed off of given string.');
		}
	}

	setTitle(title) {
		super.setTitle(title);
		this.changeValue('TITLE', title ? title.replace(/\n/g, '\\n') : '');
		return this;
	}

	setAuthor(name, icon, url) {
		super.setAuthor(name, icon, url);
		this.changeValue('AUTHOR', name || '');
		this.changeValue('AUTHOR_ICON', icon);
		this.changeValue('AUTHOR_URL', url);
		return this;
	}

	setURL(url) {
		super.setURL(url);
		this.changeValue('TITLE_URL', url || '');
		return this;
	}

	setColor(color) {
		super.setColor(color);
		this.changeValue('COLOR', (this.color || '').toString());
		return this;
	}

	setDescription(description) {
		super.setDescription(description);
		this.changeValue('DESCRIPTION', description);
		return this;
	}

	setFooter(text, url) {
		super.setFooter(text, url);
		this.changeValue('FOOTER', text);
		this.changeValue('FOOTER_ICON', url);
		return this;
	}

	setThumbnail(url) {
		super.setThumbnail(url);
		this.changeValue('THUMBNAIL', url);
		return this;
	}

	setImage(url) {
		super.setImage(url);
		this.changeValue('IMAGE', url);
		return this;
	}

	addField(name, value, inline) {
		super.addField(name, value, inline);
		this.changeValue('FIELD', `${name}|${value}|${inline}`);
		return this;
	}
}

EmbedParser.OPTIONS = OPTIONS;

module.exports = EmbedParser;