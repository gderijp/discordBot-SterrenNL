const { SlashCommandBuilder } = require("discord.js");
const { VoiceConnectionStatus } = require('@discordjs/voice');
const { joinVoiceChannel, AudioPlayer } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Leaves your voice channel.'),
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply('Moet je wel in een channel zitten mongool');
        } else {
            await interaction.reply('Ik ga al...');
            const channel = interaction.member.voice.channel;

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });

            connection.destroy();

            connection.on(VoiceConnectionStatus.Disconnected, (oldState, newState) => {
                console.log('Doeidoei!');
            });
        }
    },
};