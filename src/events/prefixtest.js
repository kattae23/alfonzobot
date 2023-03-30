const { Events } = require('discord.js');
const prefix = '!';
module.exports = {
	name: Events.MessageCreate,
	execute(client) {
		if (!client.content.startsWith(prefix) || client.author.bot) return;
		const args = client.content.slice(prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();
		// Aquí puedes ejecutar el código correspondiente al comando
		if (command === 'ping') {
			client.reply('pong!');
		}
	},
};