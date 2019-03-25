const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, prefix, ingredients, ingredientNames, message, args) => {

  if (args[0]) var itemOrIngr = args[0].toLowerCase();
  if (args[1]) var level = parseInt(args[1]);
  if (args[2]) var rarity = args[2];
  if (args[3]) var itemType = args[3].toString();

  if (itemOrIngr == "it") {
    if (args.length > 3) message.channel.send("Baseline health for a `" + itemType + "` is: " + fnc.calcHealth(level, rarity, itemType));
    else message.channel.send("Baseline health for an armour/weapon is: " + fnc.calcHealth(level, rarity, "armour") +
                              "\nBaseline health for an accessory is: " + fnc.calcHealth(level, rarity, "necklace"));
  }
  else if (itemOrIngr == "in") {
    if (args.length > 3) message.channel.send(`Baseline health for a \`t${rarity}\`, \`lvl ${level}\` \`${itemType}\` ingredient is: ${fnc.calcIngHealth(level, rarity, itemType)}`);
    else message.channel.send("Baseline health for alchemism is: " + fnc.calcIngHealth(level, rarity, "alchemism") +
                              "\nBaseline health for armours/weapons/scrolls is: " + fnc.calcIngHealth(level, rarity, "armouring") +
                              "\nBaseline health for jeweling is: " + fnc.calcIngHealth(level, rarity, "jeweling") +
                              "\nBaseline health for cooking is: " + fnc.calcIngHealth(level, rarity, "cooking"));
  }
  else message.channel.send("Please input either `it` or `in` as your first parameter.");

}

module.exports.help = {
  commandName: "health"
}
