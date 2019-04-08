const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, prefix, ingredients, ingredientNames, commands, items, message, args) => {

// Picks out the users query
var userQuery = message.content.substring(prefix.length + module.exports.help.commandName.length + 1, message.length);
userQuery = userQuery.toLowerCase();
let botResponse = "";
let matches = 0;
let matchedItems = new Array(items.length);
let foundItem;
let match = false;
items.forEach(item => {
   if (item.name.toLowerCase().includes(userQuery)) {
    matchedItems[matches] = item;
    matches++;
  }
});

// Checks if there was any matches. If som sets the item as the first by default but checks for exact matches
if (matches > 0) {
  foundItem = matchedItems[0];
  matchedItems.forEach(item => {
    if (item.name.toLowerCase() === userQuery) {
      foundItem = item;
      match = true;
    }
  });
}

if (matches === 0) message.channel.send("No matching items.")
else if (matches > 1 && !match) {
  botResponse = `${matches} items found: `;

  matchedItems.forEach( (individualItem, i) => {
    botResponse += individualItem.name;
    if (i + 1 < matches) botResponse += ", ";
    else botResponse += ".";
  });
  if (botResponse.length > 2000) message.channel.send(`${matches} items found. List cannot be displayed due to length.`);
  else message.channel.send(botResponse);
}

else {
  var baseDamages;
  var baselineComp = "";

  var itemName = "";
  if (foundItem.displayName !== undefined)
      itemName = foundItem.displayName;
  else
      itemName = foundItem.name;

  var itemLevel = foundItem.level;
  var itemRarity = foundItem.tier;
  var itemType = foundItem.type;

  // Creating and setting a variable equal to a phrase that can be used by various functions. This is used to calculate baseline values for the stats below these checks
  var functionType;
  if (itemType !== undefined && itemType !== "") {
    if (itemType.toLowerCase() === "dagger")
          functionType = "dagger";
    else if (itemType.toLowerCase() === "spear")
          functionType = "spear";
    else if (itemType.toLowerCase() === "wand")
          functionType = "wand";
    else if (itemType.toLowerCase() === "bow")
          functionType = "bow";
      else if (itemType.toLowerCase() === "boots" || itemType.toLowerCase() === "leggings" || itemType.toLowerCase() === "chestplate" || itemType.toLowerCase() === "helmet")
          functionType = "armour";
  }
  else {
    if (foundItem.accessoryType.toLowerCase() === "ring")
        functionType = "ring";
    else if (foundItem.accessoryType.toLowerCase() === "bracelet")
        functionType = "bracelet";
    else if (foundItem.accessoryType.toLowerCase() === "necklace")
        functionType = "necklace";
  }

  var poison = foundItem.poison;
  var rawSpell = foundItem.spellDamageRaw;
  var rawMelee = foundItem.damageBonusRaw;
  var lifesteal = foundItem.lifeSteal;
  var rawHealthRegen = foundItem.healthRegenRaw;
  var attackSpeed = ""; // setting a blank so \/ doesn't break. is reassigned if it's a weapon later
  var rawMeleeBaseline = fnc.calcRawMelee(itemLevel, itemRarity, functionType, attackSpeed);
  var healthBonus = foundItem.healthBonus;

  // Creating variables to the baseline value for the current item
  var poisonBaseline = fnc.calcPoison(itemLevel, itemRarity, functionType);
  var rawSpellBaseline = fnc.calcRawSpell(itemLevel, itemRarity, functionType);

  var rawHealthRegenBaseline = fnc.calcHealthRegen(itemLevel, itemRarity, functionType);
  var lifestealBaseline = fnc.calcLifeSteal(itemLevel, itemRarity, functionType);

  var healthBonusBaseline = fnc.calcHealth(itemLevel, itemRarity, functionType);
  if (itemType !== undefined) {
      if (itemType.toLowerCase() === "dagger" || itemType.toLowerCase() === "spear" || itemType.toLowerCase() === "wand" || itemType.toLowerCase() === "bow") {

          attackSpeed = foundItem.attackSpeed;
          rawMeleeBaseline = fnc.calcRawMelee(itemLevel, itemRarity, functionType, attackSpeed);

          var neutralDamage = foundItem.damage;
          var earthDamage = foundItem.earthDamage;
          var thunderDamage = foundItem.thunderDamage;
          var waterDamage = foundItem.waterDamage;
          var fireDamage = foundItem.fireDamage;
          var airDamage = foundItem.airDamage;

          var damages = [neutralDamage, earthDamage, thunderDamage, waterDamage, fireDamage, airDamage];
          var damageNames = ["Neutral", "Earth", "Thunder", "Water", "Fire", "Air"];

          var totalBaseDamage = 0;
          var min = 0;
          var max = 0;
          var damageArray;

          itemDamages = itemName + " (" + itemLevel + " " + itemRarity + " " + itemType + ")\n\n" + foundItem.sockets + " slots" + "\n";

          for (var i = 0; i < 6; i++) {
              if (damages[i] !== undefined) {
                  damageArray = damages[i].split("-");

                  min = parseInt(damageArray[0]);
                  max = parseInt(damageArray[1]);

                  totalBaseDamage += (min + max) / 2.0;

                  if (damageArray[1] > 0)
                      itemDamages += "\n" + damageNames[i] + " Damage: " + damages[i];
              } // End bracket 'for loop'
          }
          itemDamages += "\n" + "Attack Speed: " + attackSpeed;

          var baselineDamage = fnc.calcBaseDam(itemLevel, itemRarity, itemType, attackSpeed);

          baselineComp += "Base Damage: " + totalBaseDamage + " [" + baselineDamage.toFixed(2) + " | " + ((totalBaseDamage / baselineDamage) * 100).toFixed(2) + "%]" + "\n";
          if (healthBonus !== 0 && healthBonus !== undefined)
              baselineComp += "Health Bonus: " + healthBonus + " [" + healthBonusBaseline.toFixed(2) + " | " + ((healthBonus / healthBonusBaseline) * 100).toFixed(2) + "%]" + "\n";
          if (rawHealthRegen !== 0 && rawHealthRegen !== undefined)
              baselineComp += "Health Regen: " + rawHealthRegen + " [" + rawHealthRegenBaseline.toFixed(2) + " | " + ((rawHealthRegen / rawHealthRegenBaseline) * 100).toFixed(2) + "%]" + "\n";
          if (rawSpell !== 0 && rawSpell !== undefined)
              baselineComp += "Raw Spell: " + rawSpell + " [" + rawSpellBaseline.toFixed(2) + " | " + ((rawSpell / rawSpellBaseline) * 100).toFixed(2) + "%]" + "\n";
          if (rawMelee !== 0 && rawMelee !== undefined)
              baselineComp += "Raw Melee: " + rawMelee + " [" + rawMeleeBaseline.toFixed(2) + " | " + ((rawMelee / rawMeleeBaseline) * 100).toFixed(2) + "%]" + "\n";
          if (lifesteal !== 0 && lifesteal !== undefined)
              baselineComp += "Lifesteal: " + lifesteal + " [" + lifestealBaseline.toFixed(2) + " | " + ((lifesteal / lifestealBaseline) * 100).toFixed(2) + "%]" + "\n";
          if (poison !== 0 && poison !== undefined)
              baselineComp += "Poison: " + poison + " [" + poisonBaseline.toFixed(2) + " | " + ((poison / poisonBaseline) * 100).toFixed(2) + "%]" + "\n";

          message.channel.send(itemDamages + "\n\n" + baselineComp);
      } // End bracket 'if bow/dagger/spear/wand'

      else if (itemType.toLowerCase() === "boots" || itemType.toLowerCase() === "leggings" || itemType.toLowerCase() === "chestplate" || itemType.toLowerCase() === "helmet") {
          var itemHealth = foundItem.health + healthBonus;
          var baselineHealth = fnc.calcHealth(itemLevel, itemRarity, functionType);

          if (healthBonus !== 0 && healthBonus !== undefined) {
              baselineComp += "Health: " + foundItem.health + " [" + baselineHealth.toFixed(2) + " | " + ((foundItem.health / baselineHealth) * 100).toFixed(2) + "%]" + "\n";
              baselineComp += "Health (with health bonus): " + itemHealth + " (" + foundItem.health + " + " + healthBonus + ") [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";
          }
          else
              baselineComp += "Health: " + itemHealth + " [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";

          if (rawHealthRegen !== 0 && rawHealthRegen !== undefined)
              baselineComp += "Health Regen: " + rawHealthRegen + " [" + rawHealthRegenBaseline.toFixed(2) + " | " + ((rawHealthRegen / rawHealthRegenBaseline) * 100).toFixed(2) + "%]" + "\n";
          if (rawSpell !== 0 && rawSpell !== undefined)
              baselineComp += "Raw Spell: " + rawSpell + " [" + rawSpellBaseline.toFixed(2) + " | " + ((rawSpell / rawSpellBaseline) * 100).toFixed(2) + "%]" + "\n";
          if (rawMelee !== 0 && rawMelee !== undefined)
              baselineComp += "Raw Melee: " + rawMelee + " [" + rawMeleeBaseline.toFixed(2) + " | " + ((rawMelee / rawMeleeBaseline) * 100).toFixed(2) + "%]" + "\n";
          if (lifesteal !== 0 && lifesteal !== undefined)
              baselineComp += "Lifesteal: " + lifesteal + " [" + lifestealBaseline.toFixed(2) + " | " + ((lifesteal / lifestealBaseline) * 100).toFixed(2) + "%]" + "\n";
          if (poison !== 0 && poison !== undefined)
              baselineComp += "Poison: " + poison + " [" + poisonBaseline.toFixed(2) + " | " + ((poison / poisonBaseline) * 100).toFixed(2) + "%]" + "\n";

          message.channel.send(itemName + " (Lv. " + itemLevel + " " + itemRarity + " " + itemType + ")" + "\n\n" + foundItem.sockets + " slots\n" + "\n" + baselineComp);
      } // End bracket 'if helmet/chestplate/leggings/boots'
  } // end itemType check undefined
  else if (foundItem.accessoryType.toLowerCase() === "ring") {
      var itemHealth = foundItem.health + healthBonus;
      var baselineHealth = fnc.calcHealth(itemLevel, itemRarity, functionType) * 0.15;

      if (healthBonus !== 0 && healthBonus !== undefined) {
          baselineComp += "Health: " + foundItem.health + " [" + baselineHealth.toFixed(2) + " | " + ((foundItem.health / baselineHealth) * 100).toFixed(2) + "%]" + "\n";
          baselineComp += "Health (with health bonus): " + itemHealth + " (" + foundItem.health + " + " + healthBonus + ") [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";
      }
      else
          baselineComp += "Health: " + itemHealth + " [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";

      if (rawHealthRegen !== 0 && rawHealthRegen !== undefined)
          baselineComp += "Health Regen: " + rawHealthRegen + " [" + rawHealthRegenBaseline.toFixed(2) + " | " + ((rawHealthRegen / rawHealthRegenBaseline) * 100).toFixed(2) + "%]" + "\n";
      if (rawSpell !== 0 && rawSpell !== undefined)
          baselineComp += "Raw Spell: " + rawSpell + " [" + rawSpellBaseline.toFixed(2) + " | " + ((rawSpell / rawSpellBaseline) * 100).toFixed(2) + "%]" + "\n";
      if (rawMelee !== 0 && rawMelee !== undefined)
          baselineComp += "Raw Melee: " + rawMelee + " [" + rawMeleeBaseline.toFixed(2) + " | " + ((rawMelee / rawMeleeBaseline) * 100).toFixed(2) + "%]" + "\n";
      if (lifesteal !== 0 && lifesteal !== undefined)
          baselineComp += "Lifesteal: " + lifesteal + " [" + lifestealBaseline.toFixed(2) + " | " + ((lifesteal / lifestealBaseline) * 100).toFixed(2) + "%]" + "\n";
      if (poison !== 0 && poison !== undefined)
          baselineComp += "Poison: " + poison + " [" + poisonBaseline.toFixed(2) + " | " + ((poison / poisonBaseline) * 100).toFixed(2) + "%]" + "\n";

      message.channel.send(itemName + " (Lv. " + itemLevel + " " + itemRarity + " " + foundItem.accessoryType + ")" + "\n\n" + baselineComp);
  }
  else if (foundItem.accessoryType.toLowerCase() === "bracelet") {
      var itemHealth = foundItem.health + healthBonus;
      var baselineHealth = fnc.calcHealth(itemLevel, itemRarity, functionType) * 0.15;

      if (healthBonus !== 0 && healthBonus !== undefined) {
          baselineComp += "Health: " + foundItem.health + " [" + baselineHealth.toFixed(2) + " | " + ((foundItem.health / baselineHealth) * 100).toFixed(2) + "%]" + "\n";
          baselineComp += "Health (with health bonus): " + itemHealth + " (" + foundItem.health + " + " + healthBonus + ") [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";
      }
      else
          baselineComp += "Health: " + itemHealth + " [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";

      if (rawHealthRegen !== 0 && rawHealthRegen !== undefined)
          baselineComp += "Health Regen: " + rawHealthRegen + " [" + rawHealthRegenBaseline.toFixed(2) + " | " + ((rawHealthRegen / rawHealthRegenBaseline) * 100).toFixed(2) + "%]" + "\n";
      if (rawSpell !== 0 && rawSpell !== undefined)
          baselineComp += "Raw Spell: " + rawSpell + " [" + rawSpellBaseline.toFixed(2) + " | " + ((rawSpell / rawSpellBaseline) * 100).toFixed(2) + "%]" + "\n";
      if (rawMelee !== 0 && rawMelee !== undefined)
          baselineComp += "Raw Melee: " + rawMelee + " [" + rawMeleeBaseline.toFixed(2) + " | " + ((rawMelee / rawMeleeBaseline) * 100).toFixed(2) + "%]" + "\n";
      if (lifesteal !== 0 && lifesteal !== undefined)
          baselineComp += "Lifesteal: " + lifesteal + " [" + lifestealBaseline.toFixed(2) + " | " + ((lifesteal / lifestealBaseline) * 100).toFixed(2) + "%]" + "\n";
      if (poison !== 0 && poison !== undefined)
          baselineComp += "Poison: " + poison + " [" + poisonBaseline.toFixed(2) + " | " + ((poison / poisonBaseline) * 100).toFixed(2) + "%]" + "\n";

      message.channel.send(itemName + " (Lv. " + itemLevel + " " + itemRarity + " " + foundItem.accessoryType + ")" + "\n\n" + baselineComp);
  }
  else if (foundItem.accessoryType.toLowerCase() === "necklace") {
      var itemHealth = foundItem.health + healthBonus;
      var baselineHealth = fnc.calcHealth(itemLevel, itemRarity, functionType) * 0.15;

      if (healthBonus !== 0 && healthBonus !== undefined) {
          baselineComp += "Health: " + foundItem.health + " [" + baselineHealth.toFixed(2) + " | " + ((foundItem.health / baselineHealth) * 100).toFixed(2) + "%]" + "\n";
          baselineComp += "Health (with health bonus): " + itemHealth + " (" + foundItem.health + " + " + healthBonus + ") [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";
      }
      else
          baselineComp += "Health: " + itemHealth + " [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";

      if (rawHealthRegen !== 0 && rawHealthRegen !== undefined)
          baselineComp += "Health Regen: " + rawHealthRegen + " [" + rawHealthRegenBaseline.toFixed(2) + " | " + ((rawHealthRegen / rawHealthRegenBaseline) * 100).toFixed(2) + "%]" + "\n";
      if (rawSpell !== 0 && rawSpell !== undefined)
          baselineComp += "Raw Spell: " + rawSpell + " [" + rawSpellBaseline.toFixed(2) + " | " + ((rawSpell / rawSpellBaseline) * 100).toFixed(2) + "%]" + "\n";
      if (rawMelee !== 0 && rawMelee !== undefined)
          baselineComp += "Raw Melee: " + rawMelee + " [" + rawMeleeBaseline.toFixed(2) + " | " + ((rawMelee / rawMeleeBaseline) * 100).toFixed(2) + "%]" + "\n";
      if (lifesteal !== 0 && lifesteal !== undefined)
          baselineComp += "Lifesteal: " + lifesteal + " [" + lifestealBaseline.toFixed(2) + " | " + ((lifesteal / lifestealBaseline) * 100).toFixed(2) + "%]" + "\n";
      if (poison !== 0 && poison !== undefined)
          baselineComp += "Poison: " + poison + " [" + poisonBaseline.toFixed(2) + " | " + ((poison / poisonBaseline) * 100).toFixed(2) + "%]" + "\n";

      message.channel.send(itemName + " (Lv. " + itemLevel + " " + itemRarity + " " + foundItem.accessoryType + ")" + "\n\n" + baselineComp);
  }
}

}
module.exports.help = {
  commandName: "itb"
}
