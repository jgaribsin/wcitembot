const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, prefix, ingredients, message, args) => {

  if (args[0]) var level = parseInt(args[0]);
  if (args[1]) var rarity = args[1].toString();
  if (args[2]) var thirdInput = args[2].toString();
  if (args[3]) var fourthInput = args[3].toString();

  if (args.length > 2) {
      var itemType = thirdInput.toString();

      if (itemType === "weapon" || itemType === "armour" || itemType === "armor" || itemType === "a" || itemType === "w") {
          typeMultiplier = 1.0;
message.channel.send("Baseline health is: " + (fnc.calcBaseHealth(level, rarity) * typeMultiplier).toFixed(3));
}
      else if (itemType === "necklace" || itemType === "bracelet" || itemType === "n" || itemType === "b" || itemType === "ring" || itemType === "r") {
          typeMultiplier = 0.15;
  message.channel.send("Baseline health is: " + (fnc.calcBaseHealth(level, rarity) * typeMultiplier).toFixed(3));
}
else
message.channel.send("Please enter an applicable item type: `weapon/armour/w/a` or `necklace/bracelet/ring/n/b/r`.");

  }
  else
message.channel.send("Baseline health for an armour/weapon is: " + fnc.calcBaseHealth(level, rarity).toFixed(3) +
          "\nBaseline health for a necklace/bracelet/ring is: " + (fnc.calcBaseHealth(level, rarity) * 0.15).toFixed(3));
}

module.exports.help = {
  commandName: "health"
}
