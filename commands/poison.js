const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args, botFiles) => {

  let display = "poison";
  if (args[0]) var level = parseInt(args[0]);
  if (args[1]) var rarity = args[1];
  if (args[2]) var itemType = args[2].toString();
  let itemRarities = ['mythic', 'fabled', 'legendary', 'rare', 'set', 'unique', 'normal'];
  let ingRarities = ['0', '1', '2', '3'];
  ['m', 'f', 'l', 'r', 's', 'u', 'n'].forEach((x, i) => {
    if (rarity == x) rarity = itemRarities[i]
  });

  if (itemRarities.includes(rarity)) {
    if (args.length > 2) message.channel.send(`Baseline ${display} for a lv. \`${level}\` \`${rarity}\` \`${itemType}\` is: ${fnc.calcPoison(level, rarity, itemType)}`);
    else message.channel.send(`Baseline ${display} for a lv. \`${level}\` \`${rarity}\` \`weapon\` is: ${fnc.calcPoison(level, rarity, "weapon")}` +
      `\nBaseline ${display} for a lv. \`${level}\` \`${rarity}\` \`armour\` is: ${fnc.calcPoison(level, rarity, "armour")}` +
      `\nBaseline ${display} for a lv. \`${level}\` \`${rarity}\` \`accessory\` is: ${fnc.calcPoison(level, rarity, "accessory")}`);
  }
  else if (ingRarities.includes(rarity)) {
    if (args.length > 2) message.channel.send(`Baseline ${display} for a \`t${rarity}\`, \`lvl ${level}\` \`${itemType}\` ingredient is: ${fnc.calcIngPoison(level, rarity, itemType)}`);
    else message.channel.send(`Baseline ${display} for lv. \`${level}\` \`t${rarity}\` \`alchemism\` is: ${fnc.calcIngPoison(level, rarity, "alchemism")}` +
      `\nBaseline ${display} for lv. \`${level}\` \`t${rarity}\` \`armouring\`/\`tailoring\`/\`scribing\` is: ${fnc.calcIngPoison(level, rarity, "armouring")}` +
      `\nBaseline ${display} for lv. \`${level}\` \`t${rarity}\` \`weaponsmithing\`/\`woodworking\` is: ${fnc.calcIngPoison(level, rarity, "weaponsmithing")}` +
      `\nBaseline ${display} for lv. \`${level}\` \`t${rarity}\` \`jeweling\` is: ${fnc.calcIngPoison(level, rarity, "jeweling")}` +
      `\nBaseline ${display} for lv. \`${level}\` \`t${rarity}\` \`cooking\` is: ${fnc.calcIngPoison(level, rarity, "cooking")}`);
  }
  else message.channel.send("Item or Ingredient rarity not recognized.");
  
}

module.exports.help = {
  commandName: "poison"
}
