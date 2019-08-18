/**
 * @module menus
 * @description A set of functions involving picking an item out of a set of
 * items.
 */

const { defaults } = require('./utils');

/**
 * @callback MenuCallback
 * @param {string} emoji The user's choice.
 * @returns {?Promise}
 */

/**
 * @summary Creates a menu with a message.
 * @description
 * Prompts the user to make a choice using a reaction. When a choice is made,
 * the `callback` is invoked, and the user's reaction is removed.
 * @param {Message} message The message to attach the menu to.
 * @param {string[]} emojis The emojis to add.
 * @param {CollectorOptions} collectorOptions Options to pass to the
 * `ReactionCollector`.
 * @param {MenuCallback} callback Called when a user makes a choice.
 */
async function createMenu(message, emojis, collectorOptions, callback) {
	let accepting = false;
	// Add reactions.
	let messageReactions;
	let addReactions = async () => {
		let awaiting = [];
		messageReactions = [];
		for (let emoji of emojis)
			awaiting.push(message.react(emoji));
		messageReactions = await Promise.all(awaiting);
	};
	await addReactions();
	// Create the collector.
	let collector = message.createReactionCollector(
		(reaction) => messageReactions.some((value) => value.emoji === reaction.emoji),
		defaults({ maxEmojis: emojis.length }, collectorOptions));
	// Connect to the collector.
	let handle = async (reaction) => {
		// Refresh reactions.
		await message.clearReactions();
		await addReactions();
		if (accepting) {
			accepting = false;
			// Call the callback.
			await Promise.resolve(callback(reaction.emoji));
			accepting = true;
		}
	};
	collector.on('collect', handle);
	collector.once('end', () => collector.off('collect', handle));
	accepting = true;
	return collector;
}

module.exports.createMenu = createMenu;
