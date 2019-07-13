const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args, botFiles) => {

  let display = "health regen";
  if (args[0]) var level = parseInt(args[0]);
  if (args[1]) var rarity = args[1];
  if (args[2]) var itemType = args[2].toString();
  let itemRarities = ['mythic', 'legendary', 'rare', 'set', 'unique', 'normal'];
  let ingRarities = ['0', '1', '2', '3'];
  ['m', 'l', 'r', 's', 'u', 'n'].forEach((x, i) => {
    if (rarity == x) rarity = itemRarities[i]
  });

  if (itemRarities.includes(rarity)) {
    if (args.length > 2) message.channel.send(`Baseline ${display} for a lv. \`${level}\` \`${rarity}\` \`${itemType}\` is: ${fnc.calcHealthRegen(level, rarity, itemType)}`);
    else message.channel.send(`Baseline ${display} for a lv. \`${level}\` \`${rarity}\` \`weapon\`/\`armour\` is: ${fnc.calcHealthRegen(level, rarity, "armour")}` +
      `\nBaseline ${display} for a lv. \`${level}\` \`${rarity}\` \`accessory\` is: ${fnc.calcHealthRegen(level, rarity, "accessory")}`);
  }
  else if (ingRarities.includes(rarity)) {
    if (args.length > 2) message.channel.send(`Baseline ${display} for a \`t${rarity}\`, \`lvl ${level}\` \`${itemType}\` ingredient is: ${fnc.calcIngHealthRegen(level, rarity, itemType)}`);
    else message.channel.send(`Baseline ${display} for lv. \`${level}\` \`t${rarity}\` \`alchemism\` is: ${fnc.calcIngHealthRegen(level, rarity, "alchemism")}` +
      `\nBaseline ${display} for lv. \`${level}\` \`t${rarity}\` \`armouring\`/\`tailoring\`/\`scribing\` is: ${fnc.calcIngHealthRegen(level, rarity, "armouring")}` +
      `\nBaseline ${display} for lv. \`${level}\` \`t${rarity}\` \`weaponsmithing\`/\`woodworking\` is: ${fnc.calcIngHealthRegen(level, rarity, "weaponsmithing")}` +
      `\nBaseline ${display} for lv. \`${level}\` \`t${rarity}\` \`jeweling\` is: ${fnc.calcIngHealthRegen(level, rarity, "jeweling")}` +
      `\nBaseline ${display} for lv. \`${level}\` \`t${rarity}\` \`cooking\` is: ${fnc.calcIngHealthRegen(level, rarity, "cooking")}`);
  }
  else message.channel.send("Item or Ingredient rarity not recognized.");
  
}

module.exports.help = {
  commandName: "hr"
}
