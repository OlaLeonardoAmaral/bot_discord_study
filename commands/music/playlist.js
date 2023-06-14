const { SlashCommandBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("my playlist"),
    async execute(interection) {
        await interection.reply("https://open.spotify.com/playlist/2FAmaBkfM7DQHWlYjA57wW?si=08b5935973aa41ee");
    },
}

