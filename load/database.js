const { Client } = require('pg');

module.exports = {
	id: 'database',
	client: new Client({ connectionString: process.env.CRISPY_DB || process.env.DATABASE_URL, ssl: true }),
	exec: async () => {
		try {
			await module.exports.client.connect();

			console.log('Connected database client.');
		} catch (e) {
			console.warn('Databse failed to connect\n', e.stack);
		}
	}
};
