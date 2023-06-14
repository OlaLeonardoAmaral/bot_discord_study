const { ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder } = require("discord.js");


const row = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId("select")
            .setPlaceholder("Documentations")
            .addOptions(
                {
                    label: "JavaScript",
                    value: "javascript"
                },
                {
                    label: "Discord Js",
                    value: "discordjs"
                },
            )
    )

module.exports = {
    data: new SlashCommandBuilder()
        .setName("docs")
        .setDescription("Documentations"),
    async execute(interection) {

        await interection.reply({
            content: 'Selecione a documentação!',
            components: [row],
        });
    },
}