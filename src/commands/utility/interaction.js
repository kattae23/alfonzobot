const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('react')
		.setDescription('react to a message'),
	async execute(interaction) {
		const message = await interaction.reply({ content: 'Interaction!', fetchReply: true });
		message.react('😄');
	},
};