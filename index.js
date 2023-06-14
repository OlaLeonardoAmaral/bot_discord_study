

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const { TOKEN } = process.env;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
	],
});

client.commands = new Collection()

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.GuildMemberAdd, async member => {

	const channel = member.guild.channels.cache.find(channel => channel.name === "general")
    if (!channel) return;

	member.roles.add('1118356079051550730')

	channel.send(`Bem Vindo <@${member.user.id}>`)

	// console.log(member)
})

client.on(Events.InteractionCreate, async interaction => {

	if (interaction.isStringSelectMenu()) {
		const select = interaction.values[0]

		if (select == "javascript") {
			await interaction.reply("Documentation the JavaScript: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript")
		} else if (select == "discordjs") {
			await interaction.reply("Documentation the DiscordJs: https://discordjs.guide/#before-you-begin")
		} else {
			return
		}
	}

	if (!interaction.isChatInputCommand()) return;
	 console.log(interaction);
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(TOKEN);