const db = require('../utility/database.js');

module.exports = {
	id: 'enable',
	exec: async function (call, findRole, toggles, HELP) {
		let user = call.args[0];
		if (!user)
			return call.message.channel.send(HELP);

		user = await call.client.fetchUser(user.replace(/\D/gi, '')).catch(() => {});
		if (!user)
			return call.message.channel.send('Invalid user.');

		let disabled = await db.isDisabled(user.id);
		if (!disabled)
			return call.message.channel.send('This user is not blacklisted from toggling roles.');

		db.enableToggle(user.id).then(() => {
			call.message.channel.send('Successfully enabled toggleable roles for this user.');
		}).catch(() => call.message.channel.send('Could not enable toggleable roles for this user, please try again later.'));
	}
};