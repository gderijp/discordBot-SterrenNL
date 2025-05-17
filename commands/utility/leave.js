const { SlashCommandBuilder } = require("discord.js");
const { VoiceConnectionStatus } = require('@discordjs/voice');
const { joinVoiceChannel, AudioPlayer } = require('@discordjs/voice');
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
            player.stop();
            player.on('error', error => {
                console.error(`Error: ${error.message}`);
                player.play(getNextResource());
            });

            await interaction.reply('Ik ga al...');
            const channel = interaction.member.voice.channel;

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });

            connection.destroy();

            console.log('Bot zegt doeidoei!');
        }
    },
};