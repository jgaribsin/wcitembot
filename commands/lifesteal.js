const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, prefix, ingredients, ingredientNames, message, args) => {

  if (args[0]) var level = parseInt(args[0]);
  if (args[1]) var rarity = args[1].toString();
  if (args[2]) var itemType = args[2].toString();
  if (args[3]) var atkSpeed = args[3].toString();

  if (args.length > 2) {
      message.channel.send("Baseline lifesteal for a(n) `" + itemType + "` is: " + fnc.calcLifeSteal(level, rarity, itemType));
  }
  else
      message.channel.send("\nBaseline lifesteal for a weapon is: " + fnc.calcLifeSteal(level, rarity, "weapon") +
          "\nBaseline lifesteal for an armour is: " + fnc.calcLifeSteal(level, rarity, "armour") +
          "\nBaseline lifesteal for a necklace/bracelet/ring is: " + fnc.calcLifeSteal(level, rarity, "necklace"));
}

module.exports.help = {
  commandName: "ls"
}
