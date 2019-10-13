const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args, botFiles) => {

  // Picks out the users query
  var userQuery = message.content.substring(botFiles.prefix.length + module.exports.help.commandName.length + 1, message.length);
  userQuery = userQuery.toLowerCase();
  let botResponse = "";
  let matches = 0;
  let items = botFiles.items;
  let matchedItems = new Array(items.length);
  let foundItem;
  let match = false;

  items.forEach(item => {
    if (item.displayName) {
      if (item.displayName.toLowerCase().includes(userQuery)) {
        matchedItems[matches] = item;
        matches++;
      }
    }
    else if (item.name.toLowerCase().includes(userQuery)) {
      matchedItems[matches] = item;
      matches++;
    }
  });

  // Checks if there was any matches. If som sets the item as the first by default but checks for exact matches
  if (matches > 0) {
    foundItem = matchedItems[0];
    matchedItems.forEach(item => {
      if (item.displayName) {
        if (item.displayName.toLowerCase() === userQuery) {
          foundItem = item;
          match = true;
        }
      }
      else if (item.name.toLowerCase() === userQuery) {
        foundItem = item;
        match = true;
      }
    });
  }

  if (matches === 0) message.channel.send("No items found.");
  else if (matches > 1 && !match) {
    botResponse = `**${matches} items found**: `;
    let i = 0;
    while (botResponse.length < 1900 && i < matches) {
      if (matchedItems[i].displayName) botResponse += matchedItems[i].displayName;
      else botResponse += matchedItems[i].name;
      if (i + 1 < matches) botResponse += ", ";
      else botResponse += ".";
      i++;
    }
    if (botResponse.length > 1900) message.channel.send(`${botResponse.substring(0, botResponse.length - 2)} **and ${matches - i} more.**`);
    else message.channel.send(botResponse);
  }

  else {
    // Header stats. These will be included in the first line of the response text
    var iName = "";
    if (foundItem.displayName !== undefined)
      iName = foundItem.displayName;
    else
      iName = foundItem.name;

    var isIdentified = (foundItem.identified) ? foundItem.identified : false;
    var identiedText = (isIdentified) ? "Identified" : "Unidentified";

    var iType;
    var iRarity = foundItem.tier;
    var iSlots = foundItem.sockets;

    var headerStats = [iName, iType, iRarity, iSlots];
    var header = "";
    if (foundItem.type !== undefined) {
      // if (foundItem.type.toLowerCase() === "helmet" || foundItem.type.toLowerCase() === "chestplate" || foundItem.type.toLowerCase() === "leggings" || foundItem.type.toLowerCase() === "boots" || foundItem.type.toLowerCase() === "bow" || foundItem.type.toLowerCase() === "spear" || foundItem.type.toLowerCase() === "wand" || foundItem.type.toLowerCase() === "dagger") {
      iType = foundItem.type;
      header += `${iName} (${iRarity} ${iType}, ${identiedText})`;
      header += "\n\n" + iSlots + " slots\n";
    }
    else if (foundItem.accessoryType !== undefined) {
      // else if (foundItem.accessoryType.toLowerCase() === "ring" || foundItem.accessoryType.toLowerCase() === "bracelet" || foundItem.accessoryType.toLowerCase() === "necklace") {
      header += `${iName} (${iRarity} ${foundItem.accessoryType}, ${identiedText})\n`;
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

    var identificationStats = [iHealthRegen, iManaRegen, iSpellDamage, iDamageBonus, iLifeSteal, iManaSteal, iXp, iLoot, iReflection, iThorns, iExploding, iSpeed, iAttackSpeedBonus, iPoison, iHealthBonus, iSoulPoints, iKnockback, iEmeraldStealing, iHealthRegenRaw, iSpellDamageRaw, iDamageBonusRaw,
      iBonusFireDamage, iBonusWaterDamage, iBonusAirDamage, iBonusThunderDamage, iBonusEarthDamage, iBonusFireDefense, iBonusWaterDefense, iBonusAirDefense, iBonusThunderDefense, iBonusEarthDefense];

    var identificationDisplay = ["healthRegen", "manaRegen", "spellDamage", "damageBonus", "lifeSteal", "manaSteal", "xpBonus", "lootBonus", "reflection", "thorns", "exploding", "speed",
      "attackSpeedBonus", "poison", "healthBonus", "soulPoints", "knockback",
      "emeraldStealing", "healthRegenRaw", "spellDamageRaw", "damageBonusRaw", "bonusFireDamage", "bonusWaterDamage", "bonusAirDamage", "bonusThunderDamage", "bonusEarthDamage",
      "bonusFireDefense", "bonusWaterDefense", "bonusAirDefense", "bonusThunderDefense", "bonusEarthDefense"];

    var skillPointStats = [iStrengthPoints, iDexterityPoints, iIntelligencePoints, iAgilityPoints, iDefensePoints];
    var skillPointDisplay = ["strengthPoints", "dexterityPoints", "intelligencePoints", "agilityPoints", "defensePoints"];

    var skillPoints = "";
    skillPointStats.forEach((skillPoint, i) => {
      if (skillPoint !== 0 && skillPoint) skillPoints += skillPointDisplay[i] + ": " + skillPoint + "\n";
    });

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

      var baseStatsStats = [iDamage, iEarthDamage, iThunderDamage, iWaterDamage, iAirDamage, iFireDamage, iAtkSpeed];
      var baseStatsDisplay = ["damage", "earthDamage", "thunderDamage", "waterDamage", "airDamage", "fireDamage", "attackSpeed"];

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

      var baseStatsStats = [iHealth, iEarthDefense, iThunderDefense, iWaterDefense, iAirDefense, iFireDefense];
      var baseStatsDisplay = ["health", "earthDefense", "thunderDefense", "waterDefense", "airDefense", "fireDefense"];

      for (i = 0; i < baseStatsStats.length; i++) {
        if (baseStatsStats[i] !== undefined) {
          if (baseStatsStats[i] !== 0)
            baseStats += baseStatsDisplay[i] + ": " + baseStatsStats[i] + "\n";
        }
      }

    } // End if else not weapon

    //message.channel.send(header + "\n" + baseStats + "\n" + requirements + "\n" + skillPoints + "\n" + identifications);
    message.channel.send(`${header}\n${baseStats}\n${requirements}\n${skillPoints}\n${identifications}`);
  }

}
module.exports.help = {
  commandName: "it"
}
