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
    // Header stats. These will be included in the first line of the response text
    var iName = "";
    if (foundItem.displayName !== undefined)
        iName = foundItem.displayName;
    else
        iName = foundItem.name;

    var iType;
    var iRarity = foundItem.tier;
    var iSlots = foundItem.sockets;

    var headerStats = [iName, iType, iRarity, iSlots];
    var header = "";
    if (foundItem.type !== undefined) {
        // if (foundItem.type.toLowerCase() === "helmet" || foundItem.type.toLowerCase() === "chestplate" || foundItem.type.toLowerCase() === "leggings" || foundItem.type.toLowerCase() === "boots" || foundItem.type.toLowerCase() === "bow" || foundItem.type.toLowerCase() === "spear" || foundItem.type.toLowerCase() === "wand" || foundItem.type.toLowerCase() === "dagger") {
        iType = foundItem.type;
        header += iName + " (" + iRarity + " " + iType + ")";
        header += "\n\n" + iSlots + " slots\n";
    }
    else if (foundItem.accessoryType !== undefined) {
        // else if (foundItem.accessoryType.toLowerCase() === "ring" || foundItem.accessoryType.toLowerCase() === "bracelet" || foundItem.accessoryType.toLowerCase() === "necklace") {
        header += iName + " (" + iRarity + " " + foundItem.accessoryType + ")\n";
        iType = "";
    }
    // Requirements
    var iLevel = foundItem.level;
    var iStrength = foundItem.strength;
    var iDexterity = foundItem.dexterity;
    var iIntelligence = foundItem.intelligence;
    var iAgility = foundItem.agility;
    var iDefense = foundItem.defense;

    var requirementStats = [iLevel, iStrength, iDexterity, iIntelligence, iAgility, iDefense];
    var requirementDisplay = ["level", "strength", "dexterity", "intelligence", "agility", "defense"];

    var requirements = "";
    for (i = 0; i < requirementStats.length; i++) {
        if (requirementStats[i] !== 0 && requirementStats[i] !== undefined)
            requirements += requirementDisplay[i] + ": " + requirementStats[i] + "\n";
    }
    if (foundItem.classRequirement !== null && foundItem.classRequirement !== undefined)
        requirements += "classRequirement" + ": " + foundItem.classRequirement + "\n";


    // Identifications. These are manipulated regardless of foundItem type (weapon/armour/accessory)
    var iHealthRegen = foundItem.healthRegen;
    var iManaRegen = foundItem.manaRegen;
    var iSpellDamage = foundItem.spellDamage;
    var iDamageBonus = foundItem.damageBonus;
    var iLifeSteal = foundItem.lifeSteal;
    var iManaSteal = foundItem.manaSteal;
    var iXp = foundItem.xpBonus;
    var iLoot = foundItem.lootBonus;
    var iReflection = foundItem.reflection;
    var iStrengthPoints = foundItem.strengthPoints;
    var iDexterityPoints = foundItem.dexterityPoints;
    var iIntelligencePoints = foundItem.intelligencePoints;
    var iAgilityPoints = foundItem.agilityPoints;
    var iDefensePoints = foundItem.defensePoints;
    var iThorns = foundItem.thorns;
    var iExploding = foundItem.exploding;
    var iSpeed = foundItem.speed;
    var iAttackSpeedBonus = foundItem.attackSpeedBonus;
    var iPoison = foundItem.poison;
    var iHealthBonus = foundItem.healthBonus;
    var iSoulPoints = foundItem.soulPoints;
    var iKnockback = foundItem.knockback;
    var iEmeraldStealing = foundItem.emeraldStealing;
    var iHealthRegenRaw = foundItem.healthRegenRaw;
    var iSpellDamageRaw = foundItem.spellDamageRaw;
    var iDamageBonusRaw = foundItem.damageBonusRaw;
    var iBonusFireDamage = foundItem.bonusFireDamage;
    var iBonusWaterDamage = foundItem.bonusWaterDamage;
    var iBonusAirDamage = foundItem.bonusAirDamage;
    var iBonusThunderDamage = foundItem.bonusThunderDamage;
    var iBonusEarthDamage = foundItem.bonusEarthDamage;
    var iBonusFireDefense = foundItem.bonusFireDefense;
    var iBonusWaterDefense = foundItem.bonusWaterDefense;
    var iBonusAirDefense = foundItem.bonusAirDefense;
    var iBonusThunderDefense = foundItem.bonusThunderDefense;
    var iBonusEarthDefense = foundItem.bonusEarthDefense;

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
    if (foundItem.addedLore !== null && foundItem.addedLore !== undefined)
        identifications += "\n" + foundItem.addedLore;


    var baseStats = "";
    if (iType.toLowerCase() === "bow" || iType.toLowerCase() === "spear" || iType.toLowerCase() === "wand" || iType.toLowerCase() === "dagger") {
        var iDamage = foundItem.damage;
        var iFireDamage = foundItem.fireDamage;
        var iWaterDamage = foundItem.waterDamage;
        var iAirDamage = foundItem.airDamage;
        var iThunderDamage = foundItem.thunderDamage;
        var iEarthDamage = foundItem.earthDamage;
        var iAtkSpeed = foundItem.attackSpeed;

        var baseStatsStats = [iDamage, iFireDamage, iWaterDamage, iAirDamage, iThunderDamage, iEarthDamage, iAtkSpeed];
        var baseStatsDisplay = ["damage", "fireDamage", "waterDamage", "airDamage", "thunderDamage", "earthDamage", "attackSpeed"];

        for (i = 0; i < baseStatsStats.length; i++) {
            if (baseStatsStats[i] !== undefined) {
                if (baseStatsStats[i].toString() !== "0-0")
                    baseStats += baseStatsDisplay[i] + ": " + baseStatsStats[i] + "\n";
            }
        }

    } // End if type weapon
    else {
        var iHealth = foundItem.health;
        var iFireDefense = foundItem.fireDefense;
        var iWaterDefense = foundItem.waterDefense;
        var iAirDefense = foundItem.airDefense;
        var iThunderDefense = foundItem.thunderDefense;
        var iEarthDefense = foundItem.earthDefense;

        var baseStatsStats = [iHealth, iFireDefense, iWaterDefense, iAirDefense, iThunderDefense, iEarthDefense];
        var baseStatsDisplay = ["health", "fireDefense", "waterDefense", "airDefense", "thunderDefense", "earthDefense"];

        for (i = 0; i < baseStatsStats.length; i++) {
            if (baseStatsStats[i] !== undefined) {
                if (baseStatsStats[i] !== 0)
                    baseStats += baseStatsDisplay[i] + ": " + baseStatsStats[i] + "\n";
            }
        }

    } // End if else not weapon

    message.channel.send(header + "\n" + baseStats + "\n" + requirements + "\n" + identifications);
}

}
module.exports.help = {
  commandName: "it"
}
