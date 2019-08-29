const { Message } = require('discord.js');

module.exports = {
	id: 'client-extensions',
	exec: () => {
		Message.prototype.reactMultiple = async function(reactions) {
			for (let reaction of reactions)
				await this.react(reaction);

			return this;
		};
	}
};