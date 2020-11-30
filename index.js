const fs = require('fs'); // node.js file system module
require('dotenv').config(); // stores info
const Discord = require('discord.js'); // links discord.js api to file

const client = new Discord.Client(); // creates bot user
client.prefixes = new Discord.Collection(); // stores server prefixes for all servers bot is in
client.colors = new Discord.Collection(); // stores all server's preferred colors
client.commands = new Discord.Collection(); // collection is an extension of JS' map class. this one stores commands

var connection; // for database

(async () => {
	connection = await require('./database.js'); // links database file that creates connection to this file
	await client.login(process.env.TOKEN); // bot goes from offline to online
})();



date = new Date();

console.info(`[${date.toLocaleString()}] INFO | Searching /commands/ folder for files\n-`);
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
console.info(`[${date.toLocaleString()}] INFO | Found ${commandFiles.length} files:\n${commandFiles.join('\n')}\n-`);

console.info(`[${date.toLocaleString()}] INFO | Loading commands from found files\n-`);
commandFiles.forEach(file => { // iterates through all the .js files in /commands/
	const command = require(`./commands/${file}`); // grabs scripting from the command file
	client.commands.set(command.name, command); // adds the command name and script to the names collection
});
console.info(`[${date.toLocaleString()}] INFO | Loaded ${client.commands.size} commands\n-`);

const cooldowns = new Discord.Collection(); // stores command usage cooldowns for each command

client.once('ready', () => {
	console.info(`[${date.toLocaleString()}] INFO | Querying database for prefixes\n-`);
	client.guilds.cache.forEach(guild => {
		connection.query(`SELECT prefix FROM guildConfig WHERE guildID = '${guild.id}'`)
		.then(result => client.prefixes.set(guild.id, result[0][0].prefix)).catch(err => console.error(err));
		connection.query(`SELECT color FROM guildConfig WHERE guildID = '${guild.id}'`)
		.then(result => client.colors.set(guild.id, result[0][0].color)).catch(err => console.error(err));
	});
	console.info(`[${date.toLocaleString()}] INFO | Recieved prefixes\n-`);
	console.info(`[${date.toLocaleString()}] INFO | Ready, logged in as ${client.user.tag} (${client.user.id})\n-`);
});



client.on('guildCreate', async guild => { // when bot joins a server
	try {
		await connection.query(`INSERT INTO guildInfo VALUES('${guild.id}', '${guild.ownerID}')`); // query database to add server info to database
		await connection.query(`INSERT INTO guildConfig (guildID) VALUES('${guild.id}')`); // query database to add server info to database
	} catch(err) {
		console.error(err);
	}
});

client.on('guildDelete', async guild => { // when bot is kicked from server
	try {
		await connection.query(`DELETE FROM guildInfo WHERE guildID = '${guild.id}'`); // query database to delete server from table
		await connection.query(`DELETE FROM guildConfig WHERE guildID = '${guild.id}'`); // query database to delete server from table
	} catch(err) {
		console.error(err);
	}
});



client.on('message', message => { // when message is sent
	const prefix = client.prefixes.get(message.guild.id);
	const color = client.colors.get(message.guild.id);

	if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type == 'dm') return; // message ignored if it doesn't start with prefix, is sent by bot, or if it is bot's DMs

	const args = message.content.slice(prefix.length).trim().split(/ +/); // prefix and leading/trailing spaces are removed. words separated by spaces are then shoved into array
	const commandName = args.shift().toLowerCase(); // lowercases everything and returns the first element

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)); // searches for command in collection and sets command

	if (!command) return; // checks command is not null
	if (command.args && !args.length) { // if command takes arguments and there are no arguments in message
		reply = `Incorrect number of arguments`;
		if (command.usage) reply += `: \`${prefix}${command.name} ${command.usage}\``; // improper usage of command
		const embed = new Discord.MessageEmbed().setTitle(reply).setColor(`${color}`); return message.channel.send(embed); // sends message to channel
	}


	
	now = Date.now(); // time elapsed in seconds since January 1st, 1970

	if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection()); // if cooldown collection does not have command name then create a new cooldown element for command
	
	const timestamps = cooldowns.get(command.name); // get command cooldown from cooldown collection
	const cooldownAmount = (command.cooldown || 3) * 1000; // cooldown defaults to 3 seconds if cooldown is not defined

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount; // time of day cooldown expires
		if (now < expirationTime) { // if current time is less than the cooldown expiration time
			const timeLeft = (expirationTime - now) / 1000; // calculates time left in cooldown
			const embed = new Discord.MessageEmbed().setTitle(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing \`${prefix}${command.name}\``).setColor(`${color}`); return message.channel.send(embed);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		console.log(`[${date.toLocaleString()}] LOG | ${message.author.tag}: ${message.content}`); // send log to console
		command.execute(message, args, connection); // run command
	} catch (err) {
		console.error(err); // send error to console
		const embed = new Discord.MessageEmbed().setTitle(`Error executing \`${prefix}${command.name}\``).setColor(`${color}`); message.channel.send(embed);
	}
});