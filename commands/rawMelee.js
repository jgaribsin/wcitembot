const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, prefix, ingredients, ingredientNames, message, args) => {

  if (args[0]) var level = parseInt(args[0]);
  if (args[1]) var rarity = args[1].toString();
  if (args[2]) var itemType = args[2].toString();
  if (args[3]) var atkSpeed = args[3].toString();

  if (args.length > 2) {
      message.channel.send("Baseline raw melee for a(n) `" + itemType + "` is: " + fnc.calcRawMelee(level, rarity, itemType, atkSpeed));
  }
  else
      message.channel.send("Baseline raw melee for an armour/weapon is: " + fnc.calcRawMelee(level, rarity, "armour") +
          "\nBaseline raw melee for a necklace/bracelet/ring is: " + fnc.calcRawMelee(level, rarity, "necklace"));
}

module.exports.help = {
  commandName: "rm"
}
