const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, prefix, ingredients, ingredientNames, message, args) => {

  if (args[0]) var level = parseInt(args[0]);
  if (args[1]) var rarity = args[1].toString();
  if (args[2]) var thirdInput = args[2].toString();
  if (args[3]) var fourthInput = args[3].toString();

  if (args.length > 2) {
      var itemType = thirdInput;

      if (itemType === "accessory") {
          var poisonMult = 1;
          if (args.length > 3) {
              poisonMult = args[3];
              message.channel.send("Baseline poison for a `" + 'bracelet/necklace/ring' + "` at a multiplier of `" + poisonMult + "` is: " + (fnc.calcPoison(level, rarity, "bracelet") * poisonMult).toFixed(3));
          }
          else
              message.channel.send("Baseline poison for a `" + 'bracelet/necklace/ring' + "` at a multiplier of `" + poisonMult + "` is: " + fnc.calcPoison(level, rarity, "bracelet").toFixed(3));
      }
      else {
          var poisonMult = 1;
          if (args.length > 3) {
              poisonMult = args[3];
              message.channel.send("Baseline poison for a(n) `" + itemType + "` at a multiplier of `" + poisonMult + "` is: " + (fnc.calcPoison(level, rarity, itemType) * poisonMult).toFixed(3));
          }
          else
              message.channel.send("Baseline poison for a(n) `" + itemType + "` at a multiplier of `" + poisonMult + "` is: " + fnc.calcPoison(level, rarity, itemType).toFixed(3));
      }
  }
  else
      message.channel.send("Please input an item type: `ring/necklace/bracelet/armour/weapon`");
}

module.exports.help = {
  commandName: "poison"
}
