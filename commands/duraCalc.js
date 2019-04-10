const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args, botFiles) => {

  if (args[0]) var level = parseInt(args[0]);
  if (args[1]) var rarity = args[1].toString();

  if (level > 0 && (rarity > -1 && rarity < 4)) {
    message.channel.send("Durability cost for a level `" + level + "` `t" + rarity + "` ingredient is: " + fnc.durability(level, rarity) +
    "\nDuration cost for a level `" + level + "` `t" + rarity + "` ingredient is: " + fnc.duration(level, rarity) );
}
}
module.exports.help = {
  commandName: "dura"
}
