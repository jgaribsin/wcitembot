const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, prefix, ingredients, ingredientNames, commands, items, message, args) => {

  if (args[0]) var level = parseInt(args[0]);
  else message.channel.send("Please enter a level.");
  if (args[1]) var rarity = args[1].toString();
  else message.channel.send("Please enter a rarity.");
  if (args[2]) var weaponType = args[2].toString();
  else message.channel.send("Please enter a weapon type.");
  if (args[3]) var atkSpeed = args[3].toString();
  else message.channel.send("Please enter an attack speed.");

  message.channel.send("Baseline damage is: " + fnc.calcBaseDam(level, rarity, weaponType, atkSpeed));
}

module.exports.help = {
  commandName: "damage"
}
