const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chuck')
		.setDescription('Replies with a fun fact about chuck norris'),
	async execute(interaction) {

		const response = await fetch('https://api.chucknorris.io/jokes/random');
		const res = await response.json();
		const info = res.value;
		console.log(info);
		await interaction.reply(info);
	},
};