const Discord = require("discord.js");
var fnc = require("./functions");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
module.exports.run = async (client, prefix, ingredients, message, args) => {

// Picks out the users query and attaches ot to the API request URL then sends it
var userQuery = message.content.substring(prefix.length + module.exports.help.commandName.length + 1, message.length);
var apiPing = "https://api.wynncraft.com/public_api.php?action=itemDB&search=";

var request = new XMLHttpRequest();
request.open("GET", apiPing + userQuery, false);
request.send();

// Parses the response text to JSON format (this means each individual line of the JSON variable is the index of the item as an array)
var parsedReturn = JSON.parse(request.responseText);

// Sets the item to use as the first query returned by default
var item = parsedReturn.items[0];

// Checks through all the item names for a return that is exactly what the user typed. If found, that item is used, if not then the default first return is used
for (i = 0; i < parsedReturn.items.length; i++) {
  var current = parsedReturn.items[i];

  if (userQuery === current.name || userQuery === current.name.toLowerCase())
    item = parsedReturn.items[i];
}

if (parsedReturn.items.length === 0) {
  message.channel.send("No matching items.");
}
else if (parsedReturn.items.length > 1 && userQuery !== item.name && userQuery !== item.name.toLowerCase()) {
  var botResponse = "Multiple items found: ";

for (i = 0; i < parsedReturn.items.length; i++) {
  botResponse += parsedReturn.items[i].name;
  if (i + 1 < parsedReturn.items.length) botResponse += ", ";
  else botResponse += ".";
}

message.channel.send(botResponse);
}

          else {


              // Header stats. These will be included in the first line of the response text
              var iName = "";
              if (item.displayName !== undefined)
                  iName = item.displayName;
              else
                  iName = item.name;

              var iType;
              var iRarity = item.tier;
              var iSlots = item.sockets;

              var headerStats = [iName, iType, iRarity, iSlots];
              var header = "";
              if (item.type !== undefined) {
                  // if (item.type.toLowerCase() === "helmet" || item.type.toLowerCase() === "chestplate" || item.type.toLowerCase() === "leggings" || item.type.toLowerCase() === "boots" || item.type.toLowerCase() === "bow" || item.type.toLowerCase() === "spear" || item.type.toLowerCase() === "wand" || item.type.toLowerCase() === "dagger") {
                  iType = item.type;
                  header += iName + " (" + iRarity + " " + iType + ")";
                  header += "\n\n" + iSlots + " slots\n";
              }
              else if (item.accessoryType !== undefined) {
                  // else if (item.accessoryType.toLowerCase() === "ring" || item.accessoryType.toLowerCase() === "bracelet" || item.accessoryType.toLowerCase() === "necklace") {
                  header += iName + " (" + iRarity + " " + item.accessoryType + ")\n";
                  iType = "";
              }
              // Requirements
              var iLevel = item.level;
              var iStrength = item.strength;
              var iDexterity = item.dexterity;
              var iIntelligence = item.intelligence;
              var iAgility = item.agility;
              var iDefense = item.defense;

              var requirementStats = [iLevel, iStrength, iDexterity, iIntelligence, iAgility, iDefense];
              var requirementDisplay = ["level", "strength", "dexterity", "intelligence", "agility", "defense"];

              var requirements = "";
              for (i = 0; i < requirementStats.length; i++) {
                  if (requirementStats[i] !== 0 && requirementStats[i] !== undefined)
                      requirements += requirementDisplay[i] + ": " + requirementStats[i] + "\n";
              }
              if (item.classRequirement !== null && item.classRequirement !== undefined)
                  requirements += "classRequirement" + ": " + item.classRequirement + "\n";


              // Identifications. These are manipulated regardless of item type (weapon/armour/accessory)
              var iHealthRegen = item.healthRegen;
              var iManaRegen = item.manaRegen;
              var iSpellDamage = item.spellDamage;
              var iDamageBonus = item.damageBonus;
              var iLifeSteal = item.lifeSteal;
              var iManaSteal = item.manaSteal;
              var iXp = item.xpBonus;
              var iLoot = item.lootBonus;
              var iReflection = item.reflection;
              var iStrengthPoints = item.strengthPoints;
              var iDexterityPoints = item.dexterityPoints;
              var iIntelligencePoints = item.intelligencePoints;
              var iAgilityPoints = item.agilityPoints;
              var iDefensePoints = item.defensePoints;
              var iThorns = item.thorns;
              var iExploding = item.exploding;
              var iSpeed = item.speed;
              var iAttackSpeedBonus = item.attackSpeedBonus;
              var iPoison = item.poison;
              var iHealthBonus = item.healthBonus;
              var iSoulPoints = item.soulPoints;
              var iKnockback = item.knockback;
              var iEmeraldStealing = item.emeraldStealing;
              var iHealthRegenRaw = item.healthRegenRaw;
              var iSpellDamageRaw = item.spellDamageRaw;
              var iDamageBonusRaw = item.damageBonusRaw;
              var iBonusFireDamage = item.bonusFireDamage;
              var iBonusWaterDamage = item.bonusWaterDamage;
              var iBonusAirDamage = item.bonusAirDamage;
              var iBonusThunderDamage = item.bonusThunderDamage;
              var iBonusEarthDamage = item.bonusEarthDamage;
              var iBonusFireDefense = item.bonusFireDefense;
              var iBonusWaterDefense = item.bonusWaterDefense;
              var iBonusAirDefense = item.bonusAirDefense;
              var iBonusThunderDefense = item.bonusThunderDefense;
              var iBonusEarthDefense = item.bonusEarthDefense;

              var identificationStats = [iHealthRegen, iManaRegen, iSpellDamage, iDamageBonus, iLifeSteal, iManaSteal, iXp, iLoot, iReflection, iStrengthPoints, iDexterityPoints, iIntelligencePoints,
                  iAgilityPoints, iDefensePoints, iThorns, iExploding, iSpeed, iAttackSpeedBonus, iPoison, iHealthBonus, iSoulPoints, iKnockback, iEmeraldStealing, iHealthRegenRaw, iSpellDamageRaw, iDamageBonusRaw,
                  iBonusFireDamage, iBonusWaterDamage, iBonusAirDamage, iBonusThunderDamage, iBonusEarthDamage, iBonusFireDefense, iBonusWaterDefense, iBonusAirDefense, iBonusThunderDefense, iBonusEarthDefense];

              var identificationDisplay = ["healthRegen", "manaRegen", "spellDamage", "damageBonus", "lifeSteal", "manaSteal", "xpBonus", "lootBonus", "reflection", "strengthPoints",
                  "dexterityPoints", "intelligencePoints", "agilityPoints", "defensePoints", "thorns", "exploding", "speed", "attackSpeedBonus", "poison", "healthBonus", "soulPoints", "knockback",
                  "emeraldStealing", "healthRegenRaw", "spellDamageRaw", "damageBonusRaw", "bonusFireDamage", "bonusWaterDamage", "bonusAirDamage", "bonusThunderDamage", "bonusEarthDamage",
                  "bonusFireDefense", "bonusWaterDefense", "bonusAirDefense", "bonusThunderDefense", "bonusEarthDefense"];

              var identifications = "";
              for (i = 0; i < identificationStats.length; i++) {
                  if (identificationStats[i] !== 0 && identificationStats[i] !== undefined)
                      identifications += identificationDisplay[i] + ": " + identificationStats[i] + "\n";
              }


              var baseStats = "";
              if (iType.toLowerCase() === "bow" || iType.toLowerCase() === "spear" || iType.toLowerCase() === "wand" || iType.toLowerCase() === "dagger") {
                message.channel.send("Please request an armour or accessory.");
                return;
              }

              else {
                  var iHealth = item.health;
                  var iFireDefense = item.fireDefense;
                  var iWaterDefense = item.waterDefense;
                  var iAirDefense = item.airDefense;
                  var iThunderDefense = item.thunderDefense;
                  var iEarthDefense = item.earthDefense;

                  var baseStatsStats = [iFireDefense, iWaterDefense, iAirDefense, iThunderDefense, iEarthDefense];
                  var baseStatsDisplay = ["fireDefense", "waterDefense", "airDefense", "thunderDefense", "earthDefense"];

                  var baselineHealth = 0;
                  var itemHealth = 0;
                  if (item.accessoryType) {
                    baselineHealth = Math.round(fnc.calcBaseHealth(iLevel, iRarity) * .15 * 1000) / 1000;
                    baseStats += "health: " + iHealth + " --> placeholder [" + baselineHealth.toFixed(2) + " | " + (iHealth / baselineHealth).toFixed(3) + "x]" + "\n";
                    if (iHealthBonus !== 0) {
                      itemHealth = iHealth + iHealthBonus;
                      baseStats += "health (w/ health bonus): " + itemHealth + " --> placeholder [" + baselineHealth.toFixed(2) + " | " + (itemHealth / baselineHealth).toFixed(3) + "x]\n";
                    }
                  }
                  else {
                    baselineHealth = Math.round(fnc.calcBaseHealth(iLevel, iRarity) * 1000) / 1000;
                    baseStats += "health: " + iHealth + " --> placeholder [" + baselineHealth.toFixed(2) + " | " + (iHealth / baselineHealth).toFixed(3) + "x]" + "\n";
                    if (iHealthBonus !== 0) {
                      itemHealth = iHealth + iHealthBonus;
                      baseStats += "health (w/ health bonus): " + itemHealth + " --> placeholder [" + baselineHealth.toFixed(2) + " | " + (itemHealth / baselineHealth).toFixed(3) + "x]\n";
                    }
                  }

                  for (i = 0; i < baseStatsStats.length; i++) {
                      if (baseStatsStats[i] !== undefined) {
                          if (baseStatsStats[i] !== 0)
                              baseStats += baseStatsDisplay[i] + ": " + baseStatsStats[i] + "\n";
                      }
                  }

              } // End if else not weapon

              message.channel.send(header + "\n" + baseStats + "\n" + requirements + "\n" + identifications);
          } // end else no items found
      }

module.exports.help = {
  commandName: "ha"
}
