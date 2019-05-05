const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args, botFiles) => {

  if (args[0]) var itemOrIngr = args[0].toLowerCase();
  if (args[1]) var level = parseInt(args[1]);
  if (args[2]) var rarity = args[2];
  if (args[3]) var itemType = args[3].toString();

  if (itemOrIngr == "it") {
    if (args.length > 3) message.channel.send("Baseline lifesteal for a `" + itemType + "` is: " + fnc.calcLifeSteal(level, rarity, itemType));
    else message.channel.send("Baseline lifesteal for an weapon is: " + fnc.calcLifeSteal(level, rarity, "weapon") +
      "\nBaseline lifesteal for an armour is: " + fnc.calcLifeSteal(level, rarity, "armour") +
      "\nBaseline lifesteal for an accessory is: " + fnc.calcLifeSteal(level, rarity, "necklace"));
  }
  else if (itemOrIngr == "in") {
    if (args.length > 3) message.channel.send(`Baseline lifesteal for a \`t${rarity}\`, \`lvl ${level}\` \`${itemType}\` ingredient is: ${fnc.calcIngLifeSteal(level, rarity, itemType)}`);
    else message.channel.send("Baseline lifesteal for alchemism is: " + fnc.calcIngLifeSteal(level, rarity, "alchemism") +
      "\nBaseline lifesteal for weapons is: " + fnc.calcIngLifeSteal(level, rarity, "weaponsmithing") +
      "\nBaseline lifesteal for armours/scrolls is: " + fnc.calcIngLifeSteal(level, rarity, "armouring") +
      "\nBaseline lifesteal for jeweling is: " + fnc.calcIngLifeSteal(level, rarity, "jeweling") +
      "\nBaseline lifesteal for cooking is: " + fnc.calcIngLifeSteal(level, rarity, "cooking"));
  }
  else message.channel.send("Please input either `it` or `in` as your first parameter.");
}

module.exports.help = {
  commandName: "ls"
}
