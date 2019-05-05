const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args, botFiles) => {

  if (args[0]) var itemOrIngr = args[0].toLowerCase();
  if (args[1]) var level = parseInt(args[1]);
  if (args[2]) var rarity = args[2];
  if (args[3]) var itemType = args[3].toString();

  if (itemOrIngr == "it") {
    if (args.length > 3) message.channel.send("Baseline health regen for a `" + itemType + "` is: " + fnc.calcHealthRegen(level, rarity, itemType));
    else message.channel.send("Baseline health regen for an armour/weapon is: " + fnc.calcHealthRegen(level, rarity, "armour") +
      "\nBaseline health regen for an accessory is: " + fnc.calcHealthRegen(level, rarity, "necklace"));
  }
  else if (itemOrIngr == "in") {
    if (args.length > 3) message.channel.send(`Baseline health regen for a \`t${rarity}\`, \`lvl ${level}\` \`${itemType}\` ingredient is: ${fnc.calcIngHealthRegen(level, rarity, itemType)}`);
    else message.channel.send("Baseline health regen for alchemism is: " + fnc.calcIngHealthRegen(level, rarity, "alchemism") +
      "\nBaseline health regen for armours/weapons/scrolls is: " + fnc.calcIngHealthRegen(level, rarity, "armouring") +
      "\nBaseline health regen for jeweling is: " + fnc.calcIngHealthRegen(level, rarity, "jeweling") +
      "\nBaseline health regen for cooking is: " + fnc.calcIngHealthRegen(level, rarity, "cooking"));
  }
  else message.channel.send("Please input either `it` or `in` as your first parameter.");
}

module.exports.help = {
  commandName: "hr"
}
