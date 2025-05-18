const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require('@discordjs/voice');
const { createAudioPlayer } = require('@discordjs/voice');

const player = createAudioPlayer();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Leaves your voice channel.'),
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply('Moet je wel in een channel zitten mongool');
            return;
        } else {
            const connection = getVoiceConnection(interaction.guild.id);

            if (!connection) {
                await interaction.reply('Ik zit niet eens in een call papzak');
                return;
            }

            player.stop();
            player.on('error', error => {
                console.error(`Error: ${error.message}`);
                player.play(getNextResource());
            });

            await interaction.reply('Ik ga al...');

            connection.destroy();

            console.log('Daag bot!');
        }
    },
};