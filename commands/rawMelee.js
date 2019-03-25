const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, prefix, ingredients, ingredientNames, message, args) => {

  if (args[0]) var itemOrIngr = args[0].toLowerCase();
  if (args[1]) var level = parseInt(args[1]);
  if (args[2]) var rarity = args[2];
  if (args[3]) var itemType = args[3].toString();
  if (args[3]) var atkSpeed = args[4].toString();

  if (itemOrIngr == "it") {
    if (args.length > 4) message.channel.send("Baseline raw melee for a `" + itemType + "` is: " + fnc.calcRawMelee(level, rarity, itemType, atkSpeed));
    else if (args.length > 3) message.channel.send("Baseline raw melee for a `" + itemType + "` is: " + fnc.calcRawMelee(level, rarity, itemType));
    else message.channel.send("Baseline raw melee for an armour is: " + fnc.calcRawMelee(level, rarity, "armour") +
                              "\nBaseline raw melee for an accessory is: " + fnc.calcRawMelee(level, rarity, "necklace"));
  }
  else if (itemOrIngr == "in") {
    if (args.length > 3) message.channel.send(`Baseline raw melee for a \`t${rarity}\`, \`lvl ${level}\` \`${itemType}\` ingredient is: ${fnc.calcIngRawMelee(level, rarity, itemType)}`);
    else message.channel.send("Baseline raw melee for alchemism is: " + fnc.calcIngRawMelee(level, rarity, "alchemism") +
                              "\nBaseline raw melee for armours/weapons/scrolls is: " + fnc.calcIngRawMelee(level, rarity, "armouring") +
                              "\nBaseline raw melee for cooking is: " + fnc.calcIngRawMelee(level, rarity, "cooking") +
                              "\nBaseline raw melee for jeweling is: " + fnc.calcIngRawMelee(level, rarity, "jeweling"));
  }
  else message.channel.send("Please input either `it` or `in` as your first parameter.");
}

module.exports.help = {
  commandName: "rm"
}
