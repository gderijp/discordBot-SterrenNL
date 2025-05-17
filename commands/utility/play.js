const { SlashCommandBuilder } = require("discord.js");
const { VoiceConnectionStatus } = require('@discordjs/voice');
const { joinVoiceChannel, AudioPlayer } = require('@discordjs/voice');
const { createAudioPlayer, createAudioResource } = require('@discordjs/voice');

const player = createAudioPlayer();
const resource = createAudioResource('https://icecast.omroep.nl/radio2-sterrennl-mp3');

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

            player.play(resource);
            player.on('error', error => {
                console.error(`Error: ${error.message}`);
                player.play(getNextResource());
            });

            connection.subscribe(player);


            // // Subscribe the connection to the audio player (will play audio on the voice connection)
            // const subscription = connection.subscribe(audioPlayer);

            // // subscription could be undefined if the connection is destroyed!
            // if (subscription) {
            //     // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
            //     setTimeout(() => subscription.unsubscribe(), 5_000);
            // }
        }
    },
};