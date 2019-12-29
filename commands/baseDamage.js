const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args, botFiles) => {

  let botResponse = "";
  if (args[0]) var level = parseInt(args[0]);
  else botResponse += "Please enter a level.\n";
  if (args[1]) var rarity = args[1].toString();
  else botResponse += "Please enter a rarity.\n";
  if (args[2]) var weaponType = args[2].toString();
  else botResponse += "Please enter a weapon type.\n";
  if (args[3]) var atkSpeed = args[3].toString();
  else botResponse += "Please enter an attack speed.\n";

  let itemRarities = ['mythic', 'fabled', 'legendary', 'rare', 'set', 'unique', 'normal'];
  ['m', 'e', 'l', 'r', 's', 'u', 'n'].forEach((x, i) => {
    if (rarity == x) rarity = itemRarities[i];
  });

  let itemTypes = ['bow', 'relik', 'dagger', 'spear', 'flail', 'wand'];
  ['b', 'r', 'd', 's', 'f', 'w'].forEach((x, i) => {
    if (weaponType == x) weaponType = itemTypes[i];
  });

  let itemSpeeds = ['superslow', 'veryslow', 'slow', 'normal', 'fast', 'veryfast', 'superfast'];
  ['ss', 'vs', 's', 'n', 'f', 'vf', 'sf'].forEach((x, i) => {
    if (atkSpeed == x) atkSpeed = itemSpeeds[i];
  });

  if (args[0] && args[1] && args[2] && args[3])
    message.channel.send(`Baseline damage for a \`${rarity}\` Lv. \`${level}\` \`${weaponType}\` at \`${atkSpeed}\` attack speed is: ${fnc.calcBaseDam(level, rarity, weaponType, atkSpeed)}`);
  else message.channel.send(botResponse);
}

module.exports.help = {
  commandName: "damage"
}
