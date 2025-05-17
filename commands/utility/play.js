const { SlashCommandBuilder } = require("discord.js");
const { VoiceConnectionStatus } = require('@discordjs/voice');
const { joinVoiceChannel, AudioPlayer } = require('@discordjs/voice');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Joins your voice channel for a little party!'),
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply('Moet je wel in een channel zitten mongool');
            return;
        } else {
            await interaction.reply('Ik join hoor wacht effe');
            const channel = interaction.member.voice.channel;

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });

            connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
                console.log('Jan paparazzi is erbij hoor!');
            });
        }
    },
};