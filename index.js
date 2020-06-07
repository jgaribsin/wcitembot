const Discord = require('discord.js');
const client = new Discord.Client();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require("fs");
client.commands = new Discord.Collection();
client.recipes = new Discord.Collection();
var ingredients;
var recipes;
const { Client, Attachment } = require('discord.js');
const { RichEmbed } = require('discord.js');

// sets the guild IDs of the servers the bot is supposed to be in.
let whitelistedGuilds = ['333532482060156939' /* pancke, personal test server */, '271518744243732481' /* wynncraft staff server */];

let items = require('./items.json');
let revampItems = require('./elemRevamp.json');

var ingredientsLoaded = 0;
var recipesLoaded = 0;

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

fs.readdir("./ingredients", (err, files) => {

  if (err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "json")
  if (jsfile.length <= 0) {
    console.log("\nCouldn't find ingredients.");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./ingredients/${f}`);
    ingredients += JSON.stringify(props, null, 2);
    if (i != jsfile.length - 1) ingredients += ",\n";
  });
});

fs.readdir("./recipes", (err, files) => {

  if (err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "json")
  if (jsfile.length <= 0) {
    console.log("\nCouldn't find recipes.");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./recipes/${f}`);
    if (props.durability) {
      props.durability.minimum = Math.round(props.durability.minimum / 1000);
      props.durability.maximum = Math.round(props.durability.maximum / 1000);
    }
    recipes += JSON.stringify(props, null, 2);
    if (i != jsfile.length - 1) recipes += ",\n";
  });
});

client.on('ready', () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.guilds.forEach(guild => {
  console.log(`${guild.name} ${guild.id}`)
});
  client.user.setActivity("D:", { type: 'PLAYING' });
  console.log(`Successfully loaded ${items.items.length} items!`);

  ingredients = `{"ingredients":[${ingredients.split("undefined").join("")}]}`;
  ingredients = JSON.parse(ingredients);

  recipes = `{"recipes":[${recipes.split("undefined").join("")}]}`;
  recipes = JSON.parse(recipes);

  fs.writeFileSync(`ingredientsFile.json`, JSON.stringify(ingredients, null, 2));
  fs.writeFileSync(`recipesFile.json`, JSON.stringify(recipes, null, 2));

  console.log(`Successfully loaded ${ingredients.ingredients.length - 31} ingredients!`); // subtracting 31 because 30 powders, 1 blank ingredient for the crafter
  console.log(`Successfully loaded ${recipes.recipes.length} recipes!`);
});

client.on('message', message => {
  if (message.content.includes("_ _")) reactNumbers(message);
  if (message.content.includes("_vote2_")) reactTwoLetters(message);
  if (message.content.includes("_vote3_")) reactThreeLetters(message);
  if (message.content.includes("_vote4_")) reactFourLetters(message);
  if (message.content.includes("_vote5_")) reactFiveLetters(message);
  //console.log(ingredients);
  // set the bot's prefix here. No need to update elsewhere. then checks the first character of the message against the prefix(es)
  // var prefix = ",";
  var prefix = ".";
  var usedProperPrefix = prefix == message.content.substring(0, 1);
  if (!usedProperPrefix) return;

  // does nothing if the message was sent by a bot, or in DMs and is not the owner
  if (message.author.bot) return;
  if (message.channel.type == "dm" && !isBotOwner) return;

  // sends a message and returns if the current server is not whitelisted
  if (!whitelistedGuilds.includes(message.guild.id)) {
    message.channel.send(`**Err**: This server is not whitelisted.`);
    return;
  }
  // allows to check if the message was sent by the bot owner, Major#1275
  var isBotOwner = message.author.id == '153296359871479809';

  // splits the message into an array separated by spaces for ease of use
  let messageArray = message.content.split(" ");
  // sets the command to the first index of the message array, but removing the prefix
  let command = messageArray[0].slice(prefix.length);
  // sets an array of arguements as the message array excluding the first index, so excluding the prefix+command
  let args = messageArray.slice(1);


  var botFiles = new Object();
  botFiles.ingredients = require("./ingredientsFile.json");
  botFiles.recipes = require("./recipesFile.json");
  botFiles.commands = client.commands;
  botFiles.items = items.items;
  botFiles.revampItems = revampItems.items;
  botFiles.prefix = prefix;

  let commandFile = client.commands.get(command);
  if (commandFile) commandFile.run(client, message, args, botFiles);
});

// client.login('NTQ2NTk1MTk4NzY4MjUwODgy.D0qjrg.Jqq8o68uSQmU1dtuWRv4HNp6pJw');
client.login(process.env.TOKEN);

const reactNumbers = async function (message) {
  await message.react('5⃣');
  await message.react('4⃣');
  await message.react('3⃣');
  await message.react('2⃣');
  await message.react('1⃣');
}

const reactTwoLetters = async function (message) {
  await message.react('🇦');
  await message.react('🇧');
}

const reactThreeLetters = async function (message) {
  await message.react('🇦');
  await message.react('🇧');
  await message.react('🇨');
}

const reactFourLetters = async function (message) {
  await message.react('🇦');
  await message.react('🇧');
  await message.react('🇨');
  await message.react('🇩');
}

const reactFiveLetters = async function (message) {
  await message.react('🇦');
  await message.react('🇧');
  await message.react('🇨');
  await message.react('🇩');
  await message.react('🇪');
}
