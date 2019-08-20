let client = require('../load/database.js').client;

class Database {
	static getTags() {
		return client.query('SELECT * FROM public.tags').then((tags) => tags.rows);
	}
	static createTag(guild, name, content) {
		return client.query(`INSERT INTO public.tags (guild, name, aliases, content)
			VALUES ($1, $2, $3, $4)`, [guild, name, JSON.stringify([]), content]);
	}
	static deleteTag(guild, name) {
		return client.query(`DELETE FROM public.tags
			WHERE guild = $1 AND name = $2;`, [guild, name]);
	}
	static editTag(guild, name, newContent) {
		return client.query(`UPDATE public.tags
		SET content = $3
		WHERE guild = $1 AND name = $2`, [guild, name, newContent]);
	}
	static updateName(guild, name, newName) {
		return client.query(`UPDATE public.tags
		SET name = $3
		WHERE guild = $1 AND name = $2`, [guild, name, newName]);
	}
	static updateAliases(guild, name, aliases) {
		return client.query(`UPDATE public.tags
		SET aliases = $3
		WHERE guild = $1 AND name = $2`, [guild, name, JSON.stringify(aliases)]);
	}
	static getToggleable() {
		return client.query('SELECT * FROM public.toggle').then((toggles) => toggles.rows);
	}
	static addToggleable(guild, role) {
		return client.query(`INSERT INTO public.toggle (guild, role)
			VALUES ($1, $2)`, [guild, role]);
	}
	static removeToggleable(guild, role) {
		return client.query(`DELETE FROM public.toggle
			WHERE guild = $1 AND role = $2;`, [guild, role]);
	}
}
module.exports = Database;