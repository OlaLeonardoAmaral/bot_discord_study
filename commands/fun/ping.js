const { SlashCommandBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replices with Pong"),
    async execute(interection) {
        await interection.reply("Pong!");
    },
}