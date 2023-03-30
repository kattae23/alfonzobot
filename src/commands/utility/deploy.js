const { SlashCommandBuilder } = require('discord.js');
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('../../config.json');
const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('discord.js');
const { GatewayIntentBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deploy')
		.setDescription('Restart commands!.'),
	async execute(interaction) {
		const commands = [];
		// Grab all the command folders from the commands directory you created earlier
		const foldersPath = path.join(__dirname, '../../commands');
		const commandFolders = fs.readdirSync(foldersPath);

		for (const folder of commandFolders) {
			// Grab all the command files from the commands directory you created earlier
			const commandsPath = path.join(foldersPath, folder);
			const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
			// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
			for (const file of commandFiles) {
				const filePath = path.join(commandsPath, file);
				const command = require(filePath);
				commands.push(command.data.toJSON());
			}
		}

		// Construct and prepare an instance of the REST module
		const rest = new REST({ version: '10' }).setToken(token);

		// and deploy your commands!
		(async () => {


			const client = new Client({
				intents: [
					GatewayIntentBits.AutoModerationConfiguration,
					GatewayIntentBits.AutoModerationExecution,
					GatewayIntentBits.DirectMessageReactions,
					GatewayIntentBits.DirectMessageTyping,
					GatewayIntentBits.DirectMessages,
					GatewayIntentBits.GuildBans,
					GatewayIntentBits.GuildEmojisAndStickers,
					GatewayIntentBits.GuildIntegrations,
					GatewayIntentBits.GuildInvites,
					GatewayIntentBits.GuildMembers,
					GatewayIntentBits.GuildMessageReactions,
					GatewayIntentBits.GuildMessageTyping,
					GatewayIntentBits.GuildMessages,
					GatewayIntentBits.GuildModeration,
					GatewayIntentBits.GuildPresences,
					GatewayIntentBits.GuildScheduledEvents,
					GatewayIntentBits.GuildVoiceStates,
					GatewayIntentBits.GuildWebhooks,
					GatewayIntentBits.Guilds,
					GatewayIntentBits.MessageContent,
				] });

			const eventsPath = path.join(__dirname, '../../events');
			const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

			for (const file of eventFiles) {
				const filePath = path.join(eventsPath, file);
				const event = require(filePath);
				if (event.once) {
					client.once(event.name, (...args) => event.execute(...args));
					console.log('actualizando eventos');
				}
				else {
					client.on(event.name, (...args) => event.execute(...args));
				}
			}


			try {
				console.log(`Started refreshing ${commands.length} application (/) commands.`);
				// interaction.reply(`Started refreshing ${commands.length} application (/) commands.`);

				// The put method is used to fully refresh all commands in the guild with the current set
				const data = await rest.put(
					Routes.applicationGuildCommands(clientId, guildId),
					{ body: commands },
				);

				console.log(`Successfully reloaded ${data.length} application (/) commands.`);
				interaction.reply(`Successfully reloaded ${data.length} application (/) commands.`);
			}
			catch (error) {
				// And of course, make sure you catch and log any errors!
				console.error(error);
			}
		})();


	},
};