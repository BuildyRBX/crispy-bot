const { Client } = require('pg');

module.exports = {
	id: 'database',
	client: new Client({ connectionString: process.env.CRISPY_DB || process.env.DATABASE_URL, ssl: true }),
	exec: async (bot) => {
		try {
			await module.exports.client.connect();

			bot.updateTagList = async function () {
				return bot.tags = await module.exports.client.query('SELECT * FROM public.tags').then((tags) => tags.rows);
			};

			bot.updateTagList();

			bot.updateToggles = async function () {
				return bot.toggle = await module.exports.client.query('SELECT * FROM public.toggle').then((toggles) => toggles.rows);
			};

			bot.updateToggles();

			console.log('Connected database client.');
		} catch (e) {
			console.warn('Databse failed to connect\n', e.stack);
		}
	}
};
