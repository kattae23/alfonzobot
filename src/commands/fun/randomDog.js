const { Collection } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dog')
		.setDescription('Random Dogs!'),
	async execute(interaction) {
		// Diferir la respuesta a la interacción
		await interaction.deferReply();

		// Agregar un cooldown de 10 segundos
		const cooldowns = new Collection();
		const cooldownAmount = 10;
		if (!cooldowns.has(interaction.commandName)) {
			cooldowns.set(interaction.commandName, new Collection());
		}
		const now = Date.now();
		const timestamps = cooldowns.get(interaction.commandName);
		const cooldownAmountMs = cooldownAmount * 1000;
		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmountMs;
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return interaction.editReply(`Please wait ${timeLeft.toFixed(1)} more seconds before using this command again.`);
			}
		}
		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmountMs);

		// Obtener una imagen aleatoria de un perro
		const response = await fetch('https://dog.ceo/api/breeds/image/random');
		const data = await response.json();
		const imageUrl = data.message;

		// Editar la respuesta diferida con la imagen
		await interaction.editReply({
			content: 'Here is a random dog picture!',
			files: [{ attachment: imageUrl }],
		});
	},
};