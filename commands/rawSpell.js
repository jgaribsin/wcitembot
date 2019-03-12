const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, prefix, ingredients, message, args) => {

  if (args[0]) var level = parseInt(args[0]);
  if (args[1]) var rarity = args[1].toString();
  if (args[2]) var weaponType = args[2].toString();
  if (args[3]) var atkSpeed = args[3].toString();

  if (args.length > 2) {
      var itemType = thirdInput.toString();
      message.channel.send("Baseline raw spell for a(n) `" + itemType + "` is: " + fnc.calcRawSpell(level, rarity, itemType));
  }
  else
      message.channel.send("Baseline raw spell for an armour/weapon is: " + fnc.calcRawSpell(level, rarity, "armour") +
          "\nBaseline raw spell for a necklace/bracelet/ring is: " + fnc.calcRawSpell(level, rarity, "necklace"));
}

module.exports.help = {
  commandName: "rs"
}
