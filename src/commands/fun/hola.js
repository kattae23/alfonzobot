const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hola')
		.setDescription('Replies with hola!'),
	async execute(interaction) {
		await interaction.reply(`Hola ${interaction.author.username}`);
	},
};