const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, prefix, ingredients, ingredientNames, message, args) => {

  if (args[0]) var level = parseInt(args[0]);
  if (args[1]) var rarity = args[1].toString();

  var durabilityMult = 0;
  if (rarity === "0")
    durabilityMult = 1.0;
  if (rarity === "1")
    durabilityMult = 1.4;
  if (rarity === "2")
    durabilityMult = 2.0;
  if (rarity === "3")
    durabilityMult = 3.0;

  if (level > 0 && (rarity > -1 && rarity < 4)) {
    message.channel.send("Durability cost for a level `" + level + "` `t" + rarity + "` ingredient is: " + (10000 + (level - 1) * 200) * durabilityMult +
    "\nDuration cost for a level `" + level + "` `t" + rarity + "` ingredient is: " + Math.round((36 + (level - 1) * 0.6) * durabilityMult * 100)/100 );
}
}
module.exports.help = {
  commandName: "cost"
}
