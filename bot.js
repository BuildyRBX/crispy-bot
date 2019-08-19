const { Client, Collection } = require('discord.js');
const handler = require('d.js-command-handler');
const token = process.env.BOT_TOKEN;
const fs = require('fs');

let client = new Client({ disableEveryone: true });
const loaders = new Collection(fs.readdirSync('./load').map((n) => require(`./load/${n}`)).filter((l) => l.id).map((l) => [l.id, l]));

client.ownerID = '390950851725754378';
client.owner = { id: '390950851725754378', tag: 'gt_crispy#1318' };

client.on('ready', () => {
	console.log(client.user.username + ' has successfully booted up.');

	for (let loader of loaders.values())
		if (typeof loader.exec === 'function')
			loader.exec(client);

	client.logChannel = client.channels.get('612422618246676511');
});

handler(__dirname + '/commands', client, { customPrefix: ',' });

client.login(token);
