const { SlashCommandBuilder } = require("discord.js");
const { VoiceConnectionStatus } = require('@discordjs/voice');
const { joinVoiceChannel } = require('@discordjs/voice');
const { createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

const player = createAudioPlayer();
const resource = createAudioResource('https://icecast.omroep.nl/radio2-sterrennl-mp3');

let infoMessage = null;
let prevTitle = '';
let interval = null;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Joins your voice channel for a little party!'),
    async execute(interaction) {
        let startMessage = null;
        let inactivityCount = 0;
        let isDestroyed = false;
        
        // reset vars if bot is restarted
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
        infoMessage = null;
        prevTitle = '';
        
        // throw error if user is not in voice channel
        if (!interaction.member.voice.channel) {
            return interaction.reply({
                content: 'Moet je wel in een channel zitten mongool',
                ephemeral: true,
            });
        }

        // delete message if info message was loaded
        startMessage = await interaction.reply('Ik join hoor wacht effe');

        // join vc
        const voiceChannel = interaction.member.voice.channel;
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        // remove start msg upon joining vc
        connection.on(VoiceConnectionStatus.Ready, async () => {
            if (startMessage) {
                try {
                    await startMessage.delete();
                } catch (err) {
                    console.error('Start message kon niet worden verwijderd:', err);
                }
            }
            console.log('Jan paparazzi is erbij hoor!');
        });

        // start the radio and send default msg
        player.play(resource);
        connection.subscribe(player);
        infoMessage = await interaction.channel.send('Info ophalen...');

        // send info message and delete starting message
        await displayInfo();

        // refresh info message every 5 seconds
        if (interval) clearInterval(interval);
        interval = setInterval(async () => {
            displayInfo;

            // members var to check how many users are in vc
            let members = voiceChannel.members.map(member => member);
            if (members.length > 1) {
                inactivityCount = 0;
                return;
            }

            inactivityCount++;

            // leave vc if bot is longer alone than maxInactivitySeconds
            const maxInactivitySeconds = 300;
            if (inactivityCount >= maxInactivitySeconds && !isDestroyed) {
                isDestroyed = true;

                clearInterval(interval);

                await infoMessage.edit({
                    content: `Zomaar laat je me alleen :(`
                });

                connection.disconnect();

                await interaction.channel.send(`Zomaar laat je me alleen :(`);
                console.log('Jan paparazzi left the building');
            }
        }, 1000);
    },
};

/**
 * fetches and updates radio info and image
 * @returns
 */
async function displayInfo() {
    if (!infoMessage) return;

    try {
        const response = await fetch("http://live.dabmonitor.nl:8692/data/8001/8212/");
        const buffer = await response.arrayBuffer();
        const html = iconv.decode(Buffer.from(buffer), 'latin1');
        const $ = cheerio.load(html);

        const artistEl = $('b[title="ITEM.ARTIST"]').first();
        const titleEl = $('b[title="ITEM.TITLE"]').first();
        const imageEl = $('img').first();

        if (!artistEl.length || !titleEl.length) return;

        const artist = artistEl.text().trim();
        const title = titleEl.text().trim();

        // skip if title is the same
        if (title === prevTitle) return;
        prevTitle = title;

        let files = [];
        if (imageEl.length) {
            const rawUrl = imageEl.attr('src').replace(/%2E/, '.');
            const imageUrl = `http://live.dabmonitor.nl:8692/data/8001/8212/${rawUrl}`;
            files = [imageUrl];
        }

        if (infoMessage) {
            try {
                await infoMessage.edit({
                    content: `Nu op **SterrenNL**:\n**${artist}** - *${title}*`,
                    files
                });
            } catch (err) {
                console.error('Info message kon niet worden bijgewerkt:', err);
            }
        }
    } catch (err) {
        infoMessage.edit('Kon informatie niet ophalen');
        console.error(err);
    }
}