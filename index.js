

const fs = require('node:fs');
const path = require('node:path');
const { AttachmentBuilder, Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const Canvas = require('@napi-rs/canvas');

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


const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');
	let fontSize = 70;

	do {
		context.font = `${fontSize -= 10}px sans-serif`;
	} while (context.measureText(text).width > canvas.width - 300);

	return context.font;
};

client.on(Events.GuildMemberAdd, async member => {

	const channel = member.guild.channels.cache.find(channel => channel.name === "general")
	if (!channel) return;


	const canvas = Canvas.createCanvas(700, 250);
	const context = canvas.getContext('2d');

	const background = await Canvas.loadImage('./assets/imagem_teste.png');
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	// Slightly smaller text placed above the member's display name
	context.font = '28px sans-serif';
	context.fillStyle = '#ffffff';
	context.fillText('Bem vindo caralho', canvas.width / 2.5, canvas.height / 3.5);

	context.font = applyText(canvas, member.user.username);
	context.fillStyle = '#ffffff';
	context.fillText(member.user.username, canvas.width / 2.5, canvas.height / 1.8);

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'jpg' }));
	context.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });

	member.roles.add('1118356079051550730') // adicionando o cargo
	channel.send({ files: [attachment] })

	// channel.send(`Bem Vindo <@${member.user.id}>`)
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
	// onsole.log(interaction);
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