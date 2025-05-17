import { Client, VoiceChannel, Intents } from 'discord.js';
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    StreamType,
    AudioPlayerStatus,
    VoiceConnectionStatus,
} from '@discordjs/voice';
import { createDiscordJSAdapter } from './adapter';

const player = createAudioPlayer();

function playSong() {
    const resource = createAudioResource('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', {
        inputType: StreamType.Arbitrary,
    });

    player.play(resource);

    return entersState(player, AudioPlayerStatus.Playing, 5e3);
}

async function connectToChannel(channel) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: createDiscordJSAdapter(channel),
    });

    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
        return connection;
    } catch (error) {
        connection.destroy();
        throw error;
    }
}

const client = new Client({
    ws: { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] },
});

client.login('token here');

client.on('ready', async () => {
    console.log('Discord.js client is ready!');

    try {
        await playSong();
        console.log('Song is ready to play!');
    } catch (error) {
        console.error(error);
    }
});

// interaction.member.voice.channel

client.on('message', async (message) => {
    if (!message.guild) return;

    if (message.content === '-join') {
        const channel = message.member?.voice.channel;

        if (channel) {
            try {
                const connection = await connectToChannel(channel);
                connection.subscribe(player);
                message.reply('Playing now!');
            } catch (error) {
                console.error(error);
            }
        } else {
            message.reply('Join a voice channel then try again!');
        }
    }
});


// TODO: Misschien heb ik dit bestand helemaal niet nodig