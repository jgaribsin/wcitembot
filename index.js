const Discord = require('discord.js');
const client = new Discord.Client();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require("fs");
client.commands = new Discord.Collection();

const { Client, Attachment } = require('discord.js');
const { RichEmbed } = require('discord.js');

fs.readdir("./commands", (err, files) => {

  if (err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if (jsfile.length <= 0) {
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) => {
      let props = require(`./commands/${f}`);
      console.log(`${f} loaded!`);
      client.commands.set(props.help.commandName, props);
  });

});

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity("aaaAAAAAAAAAAAAAA", {type: 'PLAYING'});
});

client.on('message', message => {
  // set the bot's prefix here. No need to update elsewhere. then checks the first character of the message against the prefix(es)
  var prefix = ".";
  var usedProperPrefix = prefix == message.content.substring(0, 1);
  if (!usedProperPrefix) return;

  // does nothing if the message was sent by a bot, or in DMs and is not the owner
  if (message.author.bot) return;
  if (message.channel.type == "dm" && !isBotOwner) return;

  // allows to check if the message was sent by the bot owner, Major#1275
  var isBotOwner = message.author.id == '153296359871479809';

  // splits the message into an array separated by spaces for ease of use
  let messageArray = message.content.split(" ");
  // sets the command to the first index of the message array, but removing the prefix
  let command = messageArray[0].slice(prefix.length);
  // sets an array of arguements as the message array excluding the first index, so excluding the prefix+command
  let args = messageArray.slice(1);

  let commandFile = client.commands.get(command);
  if (commandFile) commandFile.run(client, message, args);
  });

client.login(process.env.TOKEN);
