const { SlashCommandBuilder } = require("discord.js");
const { client } = require('../../index');
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Gives detailed information about the current song playing'),
    async execute(interaction) {
        await interaction.deferReply();

        if (!interaction.member.voice.channel) {
            await interaction.reply('Moet je wel in een channel zitten mongool');
            return;
        } else {
            try {
                const response = await fetch("http://live.dabmonitor.nl:8692/data/8001/8212/");

                const buffer = await response.arrayBuffer();
                const html = await iconv.decode(Buffer.from(buffer), 'latin1');

                const $ = cheerio.load(html);

                const paragraphs = $('b[title="ITEM.ARTIST"]').toArray();
                const titles = $('b[title="ITEM.TITLE"]').toArray();
                const images = $('IMG').toArray();

                if (paragraphs.length > 0 && titles.length > 0) {
                    const artist = $(paragraphs[0]).text().trim();
                    const title = $(titles[0]).text().trim();
                    const url = images[0].attribs.src;
                    const rebuiltUrl = url.replace(/%2E/, '.');
                    const imageUrl = `http://live.dabmonitor.nl:8692/data/8001/8212/${rebuiltUrl}`;

                    await interaction.editReply({
                        content: `Nu op SterrenNL: **${artist}** - *${title}*`,
                        files: [imageUrl]
                    });

                } else {
                    await interaction.editReply(`Kon de huidige trackinformatie niet vinden.`);
                }

            } catch (error) {
                console.error(error);
                await interaction.editReply("Something went wrong while fetching the information");
            }
        }
    },
};
