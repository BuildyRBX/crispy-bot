const { Collection } = require('discord.js');
const { defaults } = require('./utils');
// eslint-disable-next-line no-unused-vars
const { createMenu } = require('./menus');

/**
 * @typedef {object} PagingOptions
 * @property {any[]} values
 */

/**
 * @type {PagingOptions}
 */
const PAGED_SEND_DEFAULTS = {
	dm: true,
	valuesPerPage: 50,
	allowFlip: true,
	bypassMultiple: false,
	joinWith: '\n',
	collectorOptions: {
		filter: () => true,
		time: 120000
	},
	startWith: '',
	endWith: ''
};

/**
 * @param {PagingOptions} options
 * @requires utils
 * @alias createPager
 * @todo Use `createMenu`.
 * @todo Consider generalizing `call` param.
 * @todo Add documentation.
 * @todo Adjust existing tests.
 * @todo Finish incomplete tests.
 */
async function pagedSend(call, embed, options = {}) {
	defaults(options, PAGED_SEND_DEFAULTS);

	let msg = null;
	let range = options.valuesPerPage;
	let totalPages = Math.ceil(options.values.length / options.valuesPerPage);
	let page = 1;
	let isPaged = options.valuesPerPage < options.values.length;

	embed
		.setDescription(options.startWith + options.values.slice(0, range).join(options.joinWith) + options.endWith)
		.setFooter(`Page ${page}/${totalPages} - ${call.message.author.tag} (${call.message.author.id})`, call.message.author.displayAvatarURL);

	if (!call.commands._pagedRequests)
		call.commands._pagedRequests = new Collection();

	if (isPaged && !options.bypassMultiple) {
		if (call.commands._pagedRequests.has(call.message.author.id))
			msg = await call.message.channel.send('You are currently in a paged prompt, please cancel your prompt (add the wastebasket 🗑 reaction to the prompt).');
		else
			call.commands._pagedRequests.set(call.message.author.id, null);
	}

	if (msg === null) {
		if (options.dm)
			msg = await call.message.author.send(embed);
		else
			msg = await call.message.channel.send(embed);

		if (options.valuesPerPage < options.values.length) {
			await msg.react('◀');
			await msg.react('▶');
			await msg.react('🗑');

			let collector = msg.createReactionCollector((r, u) => ['◀', '▶', '🗑'].includes(r.emoji.name) &&
					u.id === call.message.author.id &&
					(options.filter || (() => true))(r, u), options.collectorOptions);

			call.commands._pagedRequests.set(call.message.author.id, collector);

			collector.on('collect', (reaction) => {
				if (reaction.emoji.name === '🗑')
					return collector.stop();

				reaction.remove(call.message.author).catch(() => {});

				if (reaction.emoji.name === '◀') {
					if (page !== 1) {
						page--;
						range -= options.valuesPerPage;
					} else if (options.allowFlip) {
						page = totalPages;
						range = Math.ceil(options.values.length / options.valuesPerPage) * options.valuesPerPage;
					}
				} else if (page !== totalPages) {
					page++;
					range += options.valuesPerPage;
				} else if (options.allowFlip) {
					page = 1;
					range = options.valuesPerPage;
				}

				embed
					.setDescription(options.startWith + options.values.slice(range - options.valuesPerPage, range).join(options.joinWith) + options.endWith)
					.setFooter(`Page ${page}/${totalPages} - ${call.message.author.tag} (${call.message.author.id})`, call.message.author.displayAvatarURL);
				msg.edit(embed);
			});

			collector.on('end', () => {
				call.commands._pagedRequests.delete(call.message.author.id);
				msg.edit('Interactive embed ended.');
			});
		}
	}

	return msg;
}

module.exports = pagedSend;
