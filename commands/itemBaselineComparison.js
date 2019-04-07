const Discord = require("discord.js");
var fnc = require("./functions");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
module.exports.run = async (client, prefix, ingredients, ingredientNames, commands, message, args) => {

// Picks out the users query and attaches it to the API request URL then sends it
var userQuery = message.content.substring(prefix.length + module.exports.help.commandName.length + 1, message.length);
var apiPing = "https://api.wynncraft.com/public_api.php?action=itemDB&search=";

var request = new XMLHttpRequest();
request.open("GET", apiPing + userQuery, false);
request.send();

// Parses the response text to JSON format (this means each individual line of the JSON variable is the index of the item as an array)
var parsedReturn = JSON.parse(request.responseText);

// Sets the item to use as the first query returned by default
var itemRequested = parsedReturn.items[0];

var current;
// Checks through all the item names for a return that is exactly what the user typed. If found, that item is used, if not then the default first return is used
for (i = 0; i < parsedReturn.items.length; i++) {
    current = parsedReturn.items[i];
    if (userQuery === current.name || userQuery === current.name.toLowerCase())
        itemRequested = parsedReturn.items[i];
}

if (parsedReturn.items.length === 0) {
    message.channel.send("No matching items.");
}
else if (parsedReturn.items.length > 1 && userQuery !== itemRequested.name && userQuery !== itemRequested.name.toLowerCase()) {
    var botResponse = "Multiple items found: ";

    for (i = 0; i < parsedReturn.items.length; i++) {
        botResponse += parsedReturn.items[i].name;
        if (i + 1 < parsedReturn.items.length) botResponse += ", ";
        else botResponse += ".";
    }

    message.channel.send(botResponse);
}
          else {

              var botResponse;
              var baseDamages;
              var baselineComp = "";

              var itemName = "";
              if (itemRequested.displayName !== undefined)
                  itemName = itemRequested.displayName;
              else
                  itemName = itemRequested.name;

              var itemLevel = itemRequested.level;
              var itemRarity = itemRequested.tier;
              var itemType = itemRequested.type;

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
                  if (itemRequested.accessoryType.toLowerCase() === "ring")
                      functionType = "ring";
                  else if (itemRequested.accessoryType.toLowerCase() === "bracelet")
                      functionType = "bracelet";
                  else if (itemRequested.accessoryType.toLowerCase() === "necklace")
                      functionType = "necklace";
              }

              var poison = itemRequested.poison;
              var rawSpell = itemRequested.spellDamageRaw;
              var rawMelee = itemRequested.damageBonusRaw;
              var lifesteal = itemRequested.lifeSteal;
              var rawHealthRegen = itemRequested.healthRegenRaw;
              var attackSpeed = ""; // setting a blank so \/ doesn't break. is reassigned if it's a weapon later
              var rawMeleeBaseline = fnc.calcRawMelee(itemLevel, itemRarity, functionType, attackSpeed);
              var healthBonus = itemRequested.healthBonus;

              // Creating variables to the baseline value for the current item
              var poisonBaseline = fnc.calcPoison(itemLevel, itemRarity, functionType);
              var rawSpellBaseline = fnc.calcRawSpell(itemLevel, itemRarity, functionType);

              var rawHealthRegenBaseline = fnc.calcHealthRegen(itemLevel, itemRarity, functionType);
              var lifestealBaseline = fnc.calcLifeSteal(itemLevel, itemRarity, functionType);

              var healthBonusBaseline = fnc.calcHealth(itemLevel, itemRarity, functionType);
              if (itemType !== undefined) {
                  if (itemType.toLowerCase() === "dagger" || itemType.toLowerCase() === "spear" || itemType.toLowerCase() === "wand" || itemType.toLowerCase() === "bow") {

                      attackSpeed = itemRequested.attackSpeed;
                      rawMeleeBaseline = fnc.calcRawMelee(itemLevel, itemRarity, functionType, attackSpeed);

                      var neutralDamage = itemRequested.damage;
                      var earthDamage = itemRequested.earthDamage;
                      var thunderDamage = itemRequested.thunderDamage;
                      var waterDamage = itemRequested.waterDamage;
                      var fireDamage = itemRequested.fireDamage;
                      var airDamage = itemRequested.airDamage;

                      var damages = [neutralDamage, earthDamage, thunderDamage, waterDamage, fireDamage, airDamage];
                      var damageNames = ["Neutral", "Earth", "Thunder", "Water", "Fire", "Air"];

                      var totalBaseDamage = 0;
                      var min = 0;
                      var max = 0;
                      var damageArray;

                      itemDamages = itemName + " (" + itemLevel + " " + itemRarity + " " + itemType + ")\n\n" + itemRequested.sockets + " slots" + "\n";

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
                      var itemHealth = itemRequested.health + healthBonus;
                      var baselineHealth = fnc.calcHealth(itemLevel, itemRarity, functionType);

                      if (healthBonus !== 0 && healthBonus !== undefined) {
                          baselineComp += "Health: " + itemRequested.health + " [" + baselineHealth.toFixed(2) + " | " + ((itemRequested.health / baselineHealth) * 100).toFixed(2) + "%]" + "\n";
                          baselineComp += "Health (with health bonus): " + itemHealth + " (" + itemRequested.health + " + " + healthBonus + ") [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";
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

                      message.channel.send(itemName + " (Lv. " + itemLevel + " " + itemRarity + " " + itemType + ")" + "\n\n" + itemRequested.sockets + " slots\n" + "\n" + baselineComp);
                  } // End bracket 'if helmet/chestplate/leggings/boots'
              } // end itemType check undefined
              else if (itemRequested.accessoryType.toLowerCase() === "ring") {
                  var itemHealth = itemRequested.health + healthBonus;
                  var baselineHealth = fnc.calcHealth(itemLevel, itemRarity, functionType) * 0.15;

                  if (healthBonus !== 0 && healthBonus !== undefined) {
                      baselineComp += "Health: " + itemRequested.health + " [" + baselineHealth.toFixed(2) + " | " + ((itemRequested.health / baselineHealth) * 100).toFixed(2) + "%]" + "\n";
                      baselineComp += "Health (with health bonus): " + itemHealth + " (" + itemRequested.health + " + " + healthBonus + ") [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";
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

                  message.channel.send(itemName + " (Lv. " + itemLevel + " " + itemRarity + " " + itemRequested.accessoryType + ")" + "\n\n" + baselineComp);
              }
              else if (itemRequested.accessoryType.toLowerCase() === "bracelet") {
                  var itemHealth = itemRequested.health + healthBonus;
                  var baselineHealth = fnc.calcHealth(itemLevel, itemRarity, functionType) * 0.15;

                  if (healthBonus !== 0 && healthBonus !== undefined) {
                      baselineComp += "Health: " + itemRequested.health + " [" + baselineHealth.toFixed(2) + " | " + ((itemRequested.health / baselineHealth) * 100).toFixed(2) + "%]" + "\n";
                      baselineComp += "Health (with health bonus): " + itemHealth + " (" + itemRequested.health + " + " + healthBonus + ") [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";
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

                  message.channel.send(itemName + " (Lv. " + itemLevel + " " + itemRarity + " " + itemRequested.accessoryType + ")" + "\n\n" + baselineComp);
              }
              else if (itemRequested.accessoryType.toLowerCase() === "necklace") {
                  var itemHealth = itemRequested.health + healthBonus;
                  var baselineHealth = fnc.calcHealth(itemLevel, itemRarity, functionType) * 0.15;

                  if (healthBonus !== 0 && healthBonus !== undefined) {
                      baselineComp += "Health: " + itemRequested.health + " [" + baselineHealth.toFixed(2) + " | " + ((itemRequested.health / baselineHealth) * 100).toFixed(2) + "%]" + "\n";
                      baselineComp += "Health (with health bonus): " + itemHealth + " (" + itemRequested.health + " + " + healthBonus + ") [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";
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

                  message.channel.send(itemName + " (Lv. " + itemLevel + " " + itemRarity + " " + itemRequested.accessoryType + ")" + "\n\n" + baselineComp);
              }
          }
}
module.exports.help = {
  commandName: "itb"
}
