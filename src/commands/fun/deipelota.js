const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dei')
		.setDescription('Replies with DeiPelota⚽🏈!'),
	async execute(interaction) {
		await interaction.reply('DeiPelota⚽🏈!');
	},
};