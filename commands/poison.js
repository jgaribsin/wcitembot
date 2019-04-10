const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args, botFiles) => {

  if (args[0]) var itemOrIngr = args[0].toLowerCase();
  if (args[1]) var level = parseInt(args[1]);
  if (args[2]) var rarity = args[2];
  if (args[3]) var itemType = args[3].toString();
  if (args[4]) var poisonMult = parseInt(args[4]);

  if (itemOrIngr == "it") {
    if (args.length > 4) message.channel.send("Baseline poison for a `" + itemType + "` is: " + fnc.calcPoison(level, rarity, itemType) * poisonMult);
    else if (args.length > 3) message.channel.send("Baseline poison for a `" + itemType + "` is: " + fnc.calcPoison(level, rarity, itemType));
    else message.channel.send("Baseline poison for a weapon is: " + fnc.calcPoison(level, rarity, "weapon") +
                              "\nBaseline poison for an armour is: " + fnc.calcPoison(level, rarity, "armour") +
                              "\nBaseline poison for an accessory is: " + fnc.calcPoison(level, rarity, "necklace"));
  }
  else if (itemOrIngr == "in") {
    if (args.length > 3) message.channel.send(`Baseline poison for a \`t${rarity}\`, \`lvl ${level}\` \`${itemType}\` ingredient is: ${fnc.calcIngPoison(level, rarity, itemType)}`);
    else message.channel.send("Baseline poison for weapons is: " + fnc.calcIngPoison(level, rarity, "weaponsmithing") +
                              "\nBaseline poison for alchemism is: " + fnc.calcIngPoison(level, rarity, "alchemism") +
                              "\nBaseline poison for armours/scrolls is: " + fnc.calcIngPoison(level, rarity, "armouring") +
                              "\nBaseline poison for jeweling is: " + fnc.calcIngPoison(level, rarity, "jeweling") +
                              "\nBaseline poison for cooking is: " + fnc.calcIngPoison(level, rarity, "cooking"));
  }
  else message.channel.send("Please input either `it` or `in` as your first parameter.");

}

module.exports.help = {
  commandName: "poison"
}
