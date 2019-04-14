const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args, botFiles) => {

  if (args[0]) var uLevel = parseInt(args[0]); // user level
  if (args[1]) var tier = parseInt(args[1]);
  if (args[2]) var itemType = args[2].toString().toUpperCase();
  var tierMult = 1;
  var socketsOrCharges = 1;
  if (uLevel > 29) socketsOrCharges = 2;
  if (uLevel > 69) socketsOrCharges = 3;
  // current: 1, 1.2, 1.45
  // proposed: 1, 1.2, 1.3
  switch (tier) {
    case 1:
    tierMult = 1;
    break;
    case 2:
    tierMult = 1.25;
    break;
    case 3:
    tierMult = 1.4;
    break;
  }
  let recipes = botFiles.recipes;
  var foundRecipe;

  recipes = recipes.filter(recipe => (recipe.type == itemType));

  if (recipes.length > 0)
  recipes.forEach(recipe => {
    if ((uLevel >= recipe.level.minimum) && (uLevel <= recipe.level.maximum))
      foundRecipe = recipe;
  });
  else message.channel.send("No recipes found.");

  if (foundRecipe) {
    const { level, duration, durability, healthOrDamage, basicDuration } = foundRecipe;
    let botResponse = "";
    botResponse += `__**Lv. ${uLevel} T${tier} ${foundRecipe.type.charAt(0).toUpperCase() + foundRecipe.type.slice(1).toLowerCase()}**__\n`;

    // if it's a consumable
    if (itemType == "POTION" || itemType == "SCROLL" || itemType == "FOOD") {
      let duraMin = Math.round(duration.minimum * tierMult);
      let duraMax = Math.round(duration.maximum * tierMult);

      let healthMin = Math.round(healthOrDamage.maximum * tierMult);
      let healthMax = Math.round(healthOrDamage.maximum * tierMult);

      botResponse += `\nCharges: ${socketsOrCharges}`;
      botResponse += `\n\n**With Ingredients**`;
      botResponse += `\nDuration: ${duraMin}s to ${duraMax}s.`;

      botResponse += `\n\n**Without Ingredients**`;
      botResponse += `\nHealing: ${healthMin} HP/${basicDuration.minimum}s to ${healthMax} HP/${basicDuration.minimum}s.`;
    }
    // if it's a gear
    else {
      let isWeapon = itemType == "SPEAR" || itemType == "BOW" || itemType == "DAGGER" || itemType == "WAND";
      let isAccessory = itemType == "RING" || itemType == "BRACELET" || itemType == "NECKLACE";

      let duraMin = Math.round(durability.minimum * tierMult);
      let duraMax = Math.round(durability.maximum * tierMult);

      let healthOrDamageMin = Math.round(healthOrDamage.minimum * tierMult);
      let healthOrDamageMax = Math.round(healthOrDamage.maximum * tierMult);
      if (!isAccessory) botResponse += `\n**Slots**: ${socketsOrCharges}`;
      botResponse += `\n**Durability**: ${duraMin} to ${duraMax}.`;
      if (!isAccessory) {
        botResponse += (isWeapon) ? "\n**Damage**: " : "\n**Health**: ";
        botResponse += `${healthOrDamageMin} to ${healthOrDamageMax}.`;
      }

    }

    // second the completed message
    message.channel.send(botResponse);
  }

}
module.exports.help = {
  commandName: "recipe"
}
