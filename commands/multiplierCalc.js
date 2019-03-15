const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, prefix, ingredients, ingredientNames, message, args) => {
  
  if (args[0]) var level = parseInt(args[0]);
  if (args[1]) var rarity = args[1].toString();
  if (args[2]) var weaponType = args[2].toString();
  if (args[3]) var atkSpeed = args[3].toString();

  message.channel.send("The multiplier for a level `" + level + "` `" + rarity + "` is: " + fnc.calcMultiplier(level, rarity));
}

module.exports.help = {
  commandName: "mult"
}
