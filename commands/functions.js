const Discord = require("discord.js");

// https://docs.google.com/document/d/1tt_cjHVJ5MqWxqi4EeIVd5zf2Uv8vK9TwL1bbW942Vw/edit
// All arrays have 21 numbers so it factors for every 5 levels of 0-100 (there is no 0 in game but it's effectively 1)
var normalMultipliers = [1.00, 1.00, 1.00, 0.95, 0.90, 0.85, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80]; /* 30 and above is 80%*/
var uniqueMultipliers = [1.4, 1.35, 1.3, 1.25, 1.2, 1.15, 1.1, 1.05, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; /* 40 and above is 100% */
var setMultipliers = [1.6, 1.55, 1.5, 1.45, 1.4, 1.325, 1.275, 1.225, 1.15, 1.125, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.075, 1.075, 1.05, 1.05, 1.05]; /* 90 and above is 105% */
var rareMultipliers = [1.8, 1.75, 1.7, 1.65, 1.6, 1.5, 1.45, 1.4, 1.3, 1.25, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.15, 1.15, 1.1, 1.1, 1.1]; /* 90 and above is 110% */
var legendaryMultipliers = [2.2, 2.15, 2.1, 2.05, 2, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.35, 1.35, 1.3, 1.3, 1.3]; /* 90 and above is 130% */
var fabledMultipliers = [2.4, 2.35, 2.3, 2.25, 2.2, 2.1, 2, 1.9, 1.8, 1.7, 1.6, 1.6, 1.6, 1.6, 1.6, 1.6, 1.55, 1.55, 1.5, 1.5, 1.5]; /* 90 and above is 130% */
var mythicMultipliers = [2.6, 2.55, 2.5, 2.45, 2.4, 2.3, 2.2, 2.1, 2, 1.9, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.75, 1.75, 1.7, 1.7, 1.7]; /* 90 and above is 170% */

// https://i.imgur.com/bocaBjD.png
// All arrays have 21 numbers so it factors every 5 levels of 0-100 (there is no 0 in game but it's effectively 1)
var mageDamage = [1.7, 5.1, 6.8, 10.2, 14.28, 18.36, 24.48, 30.6, 36.72, 44.48, 53.04, 63.24, 75.48, 87.72, 99.96, 112.2, 126.48, 140.76, 157.08, 173.4, 189.72];
var necromancerDamage = [1.7, 5.1, 6.8, 10.2, 14.28, 18.36, 24.48, 30.6, 36.72, 44.48, 53.04, 63.24, 75.48, 87.72, 99.96, 112.2, 126.48, 140.76, 157.08, 173.4, 189.72];
var warriorDamage = [3.4, 6.8, 10.2, 13.6, 19.04, 24.48, 32.64, 40.8, 48.96, 59.84, 70.72, 84.32, 100.64, 116.96, 133.28, 149.6, 168.64, 187.68, 209.44, 231.2, 252.96];
var assassinDamage = [5.1, 8.5, 13.6, 18.7, 23.8, 30.6, 40.8, 51, 61.2, 74.8, 88.4, 105.4, 125.8, 146.2, 166.6, 187, 210.8, 234.6, 261.8, 289, 316.2];
var archerDamage = [6.8, 10.2, 17, 22.1, 28.56, 36.72, 48.96, 61.2, 73.44, 89.76, 106.08, 126.48, 150.96, 175.44, 199.92, 224.4, 252.96, 281.52, 314.16, 346.8, 379.44];
var shamanDamage = [6.8, 10.2, 17, 22.1, 28.56, 36.72, 48.96, 61.2, 73.44, 89.76, 106.08, 126.48, 150.96, 175.44, 199.92, 224.4, 252.96, 281.52, 314.16, 346.8, 379.44];

var baseTotalHealth = [24, 53, 115, 196, 299, 442, 646, 901, 1246, 1690, 2224, 2958, 3868, 4619, 5464, 6410, 7465, 8637, 9935, 11368, 12946];
var baseHealth = [3, 11, 26, 46, 72, 108, 159, 223, 309, 420, 554, 737, 964, 1152, 1363, 1600, 1864, 2157, 2481, 2839, 3234];

module.exports.run = async (client, message, args, botFiles) => {
  return;
}

exports.prefix = ".";

exports.calcMultiplier = function (level, rarity) { // Calculate the multiplier of health/damage based off an item's rarity and level
  if (level > 100) level = 100;

  if (rarity === "normal" || rarity === "Normal" || rarity === "n")
    return normalMultipliers[Math.round(level / 5)];
  else if (rarity === "unique" || rarity === "Unique" || rarity === "u")
    return uniqueMultipliers[Math.round(level / 5)];
  else if (rarity === "set" || rarity === "Set" || rarity === "s")
    return setMultipliers[Math.round(level / 5)];
  else if (rarity === "rare" || rarity === "Rare" || rarity === "r")
    return rareMultipliers[Math.round(level / 5)];
  else if (rarity === "legendary" || rarity === "Legendary" || rarity === "l")
    return legendaryMultipliers[Math.round(level / 5)];
  else if (rarity === "fabled" || rarity === "Fabled" || rarity === "f")
    return fabledMultipliers[Math.round(level / 5)];
  else if (rarity === "mythic" || rarity === "Mythic" || rarity === "m")
    return mythicMultipliers[Math.round(level / 5)];
}

exports.calcBaseDam = function (level, rarity, weaponType, atkSpeed) { // Calculate the base damage of weapons based off level, rarity, type (dagger, bow, spear, wand) and attack speed
  var atkSpeedMultiplier; // Multiplier based off the item's attack speed
  if (level > 100) level = 100;
  
  // Checks user input for the full
  if (atkSpeed === "superslow" || atkSpeed === "ss" || atkSpeed === "SUPER_SLOW")
    atkSpeedMultiplier = 4.0; // 1.785
  else if (atkSpeed === "veryslow" || atkSpeed === "vs" || atkSpeed === "VERY_SLOW")
    atkSpeedMultiplier = 2.5; // 2.075
  else if (atkSpeed === "slow" || atkSpeed === "s" || atkSpeed === "SLOW")
    atkSpeedMultiplier = 1.4; // 2.1
  else if (atkSpeed === "normal" || atkSpeed === "n" || atkSpeed === "NORMAL")
    atkSpeedMultiplier = 1.0; // 2.05
  else if (atkSpeed === "fast" || atkSpeed === "f" || atkSpeed === "FAST")
    atkSpeedMultiplier = 0.8; // 2.00
  else if (atkSpeed === "veryfast" || atkSpeed === "vf" || atkSpeed === "VERY_FAST")
    atkSpeedMultiplier = 0.66; // 1.86
  else if (atkSpeed === "superfast" || atkSpeed === "sf" || atkSpeed === "SUPER_FAST")
    atkSpeedMultiplier = 0.48; // 1.935

  let returnValue = 0;
  var baseLevelDamage;
  if (weaponType === "wand" || weaponType === "Wand" || weaponType === "w") {
    baseLevelDamage = (mageDamage[Math.ceil(level / 5)] - mageDamage[Math.floor(level / 5)]) * (level % 5) / 5 + mageDamage[Math.floor(level / 5)];
    returnValue = Math.round(exports.calcMultiplier(level, rarity) * baseLevelDamage * atkSpeedMultiplier * 1000) / 1000;
  } else if (weaponType === "flail" || weaponType === "Flail" || weaponType === "f") {
    baseLevelDamage = (necromancerDamage[Math.ceil(level / 5)] - necromancerDamage[Math.floor(level / 5)]) * (level % 5) / 5 + necromancerDamage[Math.floor(level / 5)];
    returnValue = Math.round(exports.calcMultiplier(level, rarity) * baseLevelDamage * atkSpeedMultiplier * 1000) / 1000;
  } else if (weaponType === "spear" || weaponType === "Spear" || weaponType === "s") {
    baseLevelDamage = (warriorDamage[Math.ceil(level / 5)] - warriorDamage[Math.floor(level / 5)]) * (level % 5) / 5 + warriorDamage[Math.floor(level / 5)];
    returnValue = Math.round(exports.calcMultiplier(level, rarity) * baseLevelDamage * atkSpeedMultiplier * 1000) / 1000;
  } else if (weaponType === "dagger" || weaponType === "Dagger" || weaponType === "d") {
    baseLevelDamage = (assassinDamage[Math.ceil(level / 5)] - assassinDamage[Math.floor(level / 5)]) * (level % 5) / 5 + assassinDamage[Math.floor(level / 5)];
    returnValue = Math.round(exports.calcMultiplier(level, rarity) * baseLevelDamage * atkSpeedMultiplier * 1000) / 1000;
  } else if (weaponType === "bow" || weaponType === "Bow" || weaponType === "b") {
    baseLevelDamage = (archerDamage[Math.ceil(level / 5)] - archerDamage[Math.floor(level / 5)]) * (level % 5) / 5 + archerDamage[Math.floor(level / 5)];
    returnValue = Math.round(exports.calcMultiplier(level, rarity) * baseLevelDamage * atkSpeedMultiplier * 1000) / 1000;
  } else if (weaponType === "relik" || weaponType === "Relik" || weaponType === "r") {
    baseLevelDamage = (shamanDamage[Math.ceil(level / 5)] - shamanDamage[Math.floor(level / 5)]) * (level % 5) / 5 + shamanDamage[Math.floor(level / 5)];
    returnValue = Math.round(exports.calcMultiplier(level, rarity) * baseLevelDamage * atkSpeedMultiplier * 1000) / 1000;
  }
  if (level > 1)
    return returnValue;
  else
    return Math.round(returnValue / 1.2 * 1000) / 1000;
}

exports.calcTotalBaseHealth = function (level, rarity) {
  if (level > 100) level = 100;
  var baseLevelTotalHealth = (baseTotalHealth[Math.ceil(level / 5)] - baseTotalHealth[Math.floor(level / 5)]) * (level % 5) / 5 + baseTotalHealth[Math.floor(level / 5)];

  return Math.round(exports.calcMultiplier(level, rarity) * baseLevelTotalHealth * 1000) / 1000;
}

exports.calcHealth = function (level, rarity, itemType) {
  if (level > 100) level = 100;
  var baseLevelHealth = (baseHealth[Math.ceil(level / 5)] - baseHealth[Math.floor(level / 5)]) * (level % 5) / 5 + baseHealth[Math.floor(level / 5)];
  var typeMultiplier;

  if (itemType === "armour" || itemType === "armor" || itemType === "helmet" || itemType === "chestplate" || itemType === "leggings" || itemType === "boots")
    typeMultiplier = 1.0;
  else if (itemType === "weapon" || itemType === "spear" || itemType === "bow" || itemType === "wand" || itemType === "dagger" || itemType === "relik" || itemType === "flail")
    typeMultiplier = 0.4;
  else if (itemType === "accessory" || itemType === "necklace" || itemType === "bracelet" || itemType === "n" || itemType === "b" || itemType === "ring" || itemType === "r")
    typeMultiplier = 0.15;

  return Math.round(exports.calcMultiplier(level, rarity) * typeMultiplier * baseLevelHealth * 1000) / 1000;
}
exports.calcIngHealth = function (level, tier, job) {
  let returnValue = 0;
  let tierMultiplier = 0;
  switch (parseInt(tier)) {
    case 0:
      tierMultiplier = 1 / 6; // .1667x
      break;
    case 1:
      tierMultiplier = 0.7 / 3; //  .233x
      break;
    case 2:
      tierMultiplier = 1 / 3; // .333x
      break;
    case 3:
      tierMultiplier = 0.5;
      break;
  }

  if (job.toLowerCase() === "alchemism")
    returnValue = Math.round(exports.calcHealth(level, "rare", "armour") * 1.5 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "armouring" || job.toLowerCase() === "tailoring" || job.toLowerCase() === "weaponsmithing" || job.toLowerCase() === "woodworking" || job.toLowerCase() === "scribing")
    returnValue = Math.round(exports.calcHealth(level, "rare", "weapon") * 1.0 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "cooking")
    returnValue = Math.round(exports.calcHealth(level, "rare", "armour") * 0.5 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "jeweling")
    returnValue = Math.round(exports.calcHealth(level, "rare", "ring") * 1.0 * tierMultiplier * 1000) / 1000;

  return returnValue;
}

exports.calcRawSpell = function (level, rarity, itemType) {
  if (level > 100) level = 100;
  var typeMultiplier;

  if (itemType === "weapon" || itemType === "armour" || itemType === "armor"
    || itemType === "helmet" || itemType === "chestplate" || itemType === "leggings" || itemType === "boots"
    || itemType === "spear" || itemType === "bow" || itemType === "wand" || itemType === "dagger" || itemType === "relik" || itemType === "flail")
    typeMultiplier = 1.0;
  else if (itemType === "accessory" || itemType === "necklace" || itemType === "bracelet" || itemType === "ring")
    typeMultiplier = 1 / 3;

  return Math.round(exports.calcBaseDam(level, rarity, "dagger", "normal") * 0.63 * typeMultiplier * 1000) / 1000;
}
exports.calcIngRawSpell = function (level, tier, job) {
  let returnValue = 0;
  let tierMultiplier = 0;
  switch (parseInt(tier)) {
    case 0:
      tierMultiplier = 0.25;
      break;
    case 1:
      tierMultiplier = 0.35;
      break;
    case 2:
      tierMultiplier = 0.5;
      break;
    case 3:
      tierMultiplier = 0.75;
      break;
  }

  if (job.toLowerCase() === "alchemism")
    returnValue = Math.round(exports.calcRawSpell(level, "rare", "weapon") * 1.5 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "armouring" || job.toLowerCase() === "tailoring" || job.toLowerCase() === "weaponsmithing" || job.toLowerCase() === "woodworking" || job.toLowerCase() === "scribing")
    returnValue = Math.round(exports.calcRawSpell(level, "rare", "weapon") * 1.0 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "cooking")
    returnValue = Math.round(exports.calcRawSpell(level, "rare", "weapon") * 0.5 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "jeweling")
    returnValue = Math.round(exports.calcRawSpell(level, "rare", "ring") * 1.0 * tierMultiplier * 1000) / 1000;

  return returnValue;
}

exports.calcRawMelee = function (level, rarity, itemType, atkSpeed) {
  if (level > 100) level = 100;
  var typeMultiplier;
  let returnValue = 0;
  if (itemType === "armour" || itemType === "armor" || itemType === "helmet" || itemType === "chestplate" || itemType === "leggings" || itemType === "boots") {
    typeMultiplier = 1.0;
    returnValue = Math.round(exports.calcBaseDam(level, rarity, "dagger", "normal") * 0.82 * typeMultiplier * 1000) / 1000;
  } else if (itemType === "accessory" || itemType === "necklace" || itemType === "bracelet" || itemType === "ring") {
    typeMultiplier = 1 / 3;
    returnValue = Math.round(exports.calcBaseDam(level, rarity, "dagger", "normal") * 0.82 * typeMultiplier * 1000) / 1000;
  } else if (itemType === "spear" || itemType === "bow" || itemType === "wand" || itemType === "dagger" || itemType === "flail" || itemType === "relik") {
    var weaponDamage = exports.calcBaseDam(level, rarity, itemType, atkSpeed);
    returnValue = weaponDamage / 1.54; // .65x base damages
  }

  return returnValue;
}

exports.calcIngRawMelee = function (level, tier, job) {
  let returnValue = 0;
  let tierMultiplier = 0;
  switch (parseInt(tier)) {
    case 0:
      tierMultiplier = 0.25;
      break;
    case 1:
      tierMultiplier = 0.35;
      break;
    case 2:
      tierMultiplier = 0.5;
      break;
    case 3:
      tierMultiplier = 0.75;
      break;
  }

  if (job.toLowerCase() === "alchemism")
    returnValue = Math.round(exports.calcRawMelee(level, "rare", "armour", "normal") * 1.5 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "armouring" || job.toLowerCase() === "tailoring" || job.toLowerCase() === "weaponsmithing" || job.toLowerCase() === "woodworking" || job.toLowerCase() === "scribing")
    returnValue = Math.round(exports.calcRawMelee(level, "rare", "armour", "normal") * 1.0 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "cooking")
    returnValue = Math.round(exports.calcRawMelee(level, "rare", "armour", "normal") * 0.5 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "jeweling")
    returnValue = Math.round(exports.calcRawMelee(level, "rare", "ring", "normal") * 1.0 * tierMultiplier * 1000) / 1000;

  return returnValue;
}

exports.calcHealthRegen = function (level, rarity, itemType) {
  if (level > 100) level = 100;
  var typeMultiplier;

  if (itemType === "weapon" || itemType === "armour" || itemType === "armor"
    || itemType === "helmet" || itemType === "chestplate" || itemType === "leggings" || itemType === "boots"
    || itemType === "spear" || itemType === "bow" || itemType === "wand" || itemType === "dagger" || itemType === "relik" || itemType === "flail")
    typeMultiplier = 1.0;
  else if (itemType === "accessory" || itemType === "necklace" || itemType === "bracelet" || itemType === "ring")
    typeMultiplier = 0.5;

  return Math.round(exports.calcTotalBaseHealth(level, rarity) * 0.012 * typeMultiplier * 1000) / 1000;
}

exports.calcIngHealthRegen = function (level, tier, job) {
  let returnValue = 0;
  let tierMultiplier = 0;
  switch (parseInt(tier)) {
    case 0:
      tierMultiplier = 0.25;
      break;
    case 1:
      tierMultiplier = 0.35;
      break;
    case 2:
      tierMultiplier = 0.5;
      break;
    case 3:
      tierMultiplier = 0.75;
      break;
  }

  if (job.toLowerCase() === "alchemism")
    returnValue = Math.round(exports.calcHealthRegen(level, "rare", "weapon") * 1.5 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "armouring" || job.toLowerCase() === "tailoring" || job.toLowerCase() === "weaponsmithing" || job.toLowerCase() === "woodworking" || job.toLowerCase() === "scribing")
    returnValue = Math.round(exports.calcHealthRegen(level, "rare", "weapon") * 1.0 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "cooking")
    returnValue = Math.round(exports.calcHealthRegen(level, "rare", "weapon") * 0.5 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "jeweling")
    returnValue = Math.round(exports.calcHealthRegen(level, "rare", "ring") * 1.0 * tierMultiplier * 1000) / 1000;

  return returnValue;
}

exports.calcLifeSteal = function (level, rarity, itemType) {
  if (level > 100) level = 100;
  var typeMultiplier;

  if (itemType === "armour" || itemType === "armor" || itemType === "helmet" || itemType === "chestplate" || itemType === "leggings" || itemType === "boots")
    typeMultiplier = 1.0;
  else if (itemType === "weapon" || itemType === "spear" || itemType === "bow" || itemType === "wand" || itemType === "dagger" || itemType === "relik" || itemType === "flail")
    typeMultiplier = 1.4;
  else if (itemType === "accessory" || itemType === "necklace" || itemType === "bracelet" || itemType === "ring")
    typeMultiplier = 0.5;

  return Math.round(exports.calcTotalBaseHealth(level, rarity) * 0.0175 * typeMultiplier * 1000) / 1000;
}

exports.calcIngLifeSteal = function (level, tier, job) {
  let returnValue = 0;
  let tierMultiplier = 0;
  switch (parseInt(tier)) {
    case 0:
      tierMultiplier = 0.25;
      break;
    case 1:
      tierMultiplier = 0.35;
      break;
    case 2:
      tierMultiplier = 0.5;
      break;
    case 3:
      tierMultiplier = 0.75;
      break;
  }

  if (job.toLowerCase() === "alchemism")
    returnValue = Math.round(exports.calcLifeSteal(level, "rare", "weapon") * 1.5 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "weaponsmithing" || job.toLowerCase() === "woodworking")
    returnValue = Math.round(exports.calcLifeSteal(level, "rare", "weapon") * 1.0 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "armouring" || job.toLowerCase() === "tailoring" || job.toLowerCase() === "scribing")
    returnValue = Math.round(exports.calcLifeSteal(level, "rare", "armour") * 1.0 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "cooking")
    returnValue = Math.round(exports.calcLifeSteal(level, "rare", "weapon") * 0.5 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "jeweling")
    returnValue = Math.round(exports.calcLifeSteal(level, "rare", "ring") * 1.0 * tierMultiplier * 1000) / 1000;

  return returnValue;
}
// Note: This outputs baseline poison at a multiplier of 1. Higher multipliers may be added depending on an item's reliance on this stat
exports.calcPoison = function (level, rarity, itemType) {
  if (level > 100) level = 100;
  var typeMultiplier;
  var basePoison = 0;
  var X = level;

  if (itemType === "weapon" || itemType === "spear" || itemType === "bow" || itemType === "wand" || itemType === "dagger" || itemType === "relik" || itemType === "flail")
    typeMultiplier = 1.0;
  else if (itemType === "armour" || itemType === "armor" || itemType === "helmet" || itemType === "chestplate" || itemType === "leggings" || itemType === "boots")
    typeMultiplier = 0.7;
  else if (itemType === "accessory" || itemType === "necklace" || itemType === "bracelet" || itemType === "ring")
    typeMultiplier = 0.45;

  basePoison = 797.8714 - (797.3510319) / (1 + Math.pow(X / 119.1328, 2.507256));

  return Math.round(basePoison * typeMultiplier * exports.calcMultiplier(level, rarity) * 1000) / 1000;
}
exports.calcIngPoison = function (level, tier, job) {
  let returnValue = 0;
  let tierMultiplier = 0;

  if (job.toLowerCase() === "weaponsmithing" || job.toLowerCase() === "woodworking") {
    switch (parseInt(tier)) {
      case 0:
        tierMultiplier = 1;
        break;
      case 1:
        tierMultiplier = 1.4;
        break;
      case 2:
        tierMultiplier = 2;
        break;
      case 3:
        tierMultiplier = 3;
        break;
    }
  } else {
    switch (parseInt(tier)) {
      case 0:
        tierMultiplier = 0.5;
        break;
      case 1:
        tierMultiplier = 0.7;
        break;
      case 2:
        tierMultiplier = 1;
        break;
      case 3:
        tierMultiplier = 1.5;
        break;
    }
  }

  if (job.toLowerCase() === "alchemism")
    returnValue = Math.round(exports.calcPoison(level, "rare", "armour") * 1.5 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "weaponsmithing" || job.toLowerCase() === "woodworking")
    returnValue = Math.round(exports.calcPoison(level, "rare", "weapon") * 1.0 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "armouring" || job.toLowerCase() === "tailoring" || job.toLowerCase() === "scribing")
    returnValue = Math.round(exports.calcPoison(level, "rare", "armour") * 1.0 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "cooking")
    returnValue = Math.round(exports.calcPoison(level, "rare", "armour") * 0.5 * tierMultiplier * 1000) / 1000;
  if (job.toLowerCase() === "jeweling")
    returnValue = Math.round(exports.calcPoison(level, "rare", "ring") * 1.0 * tierMultiplier * 1000) / 1000;

  return returnValue;
}

exports.durability = function (level, tier) {
  tier = parseInt(tier);
  let durabilityMult = 1;
  switch (tier) {
    case 3:
      durabilityMult = 3;
      break;
    case 2:
      durabilityMult = 2;
      break;
    case 1:
      durabilityMult = 1.4;
      break;
    case 0:
      durabilityMult = 1;
      break;
  }
  let returnValue = Math.round((1750 + (level - 1) * 35) * durabilityMult) / 100;
  return returnValue * -1;
}
exports.duration = function (level, tier) {
  tier = parseInt(tier);
  let durabilityMult = 1;
  switch (tier) {
    case 3:
      durabilityMult = 3;
      break;
    case 2:
      durabilityMult = 2;
      break;
    case 1:
      durabilityMult = 1.4;
      break;
    case 0:
      durabilityMult = 1;
      break;
  }
  let returnValue = Math.round((36 + (level - 1) * 0.6) * durabilityMult * 100) / 100
  return returnValue * -1;
}

exports.sortJobs = function (jobsObject) {
  let topJob = "";
  if (jobsObject.includes("ALCHEMISM"))
    topjob = "ALCHEMISM";
  if (jobsObject.includes("WEAPONSMITHING") || jobsObject.includes("WOODWORKING"))
    topJob = "WEAPONSMITHING";
  if (jobsObject.includes("ARMOURING") || jobsObject.includes("TAILORING"))
    topJob = "ARMOURING";
  if (jobsObject.includes("SCRIBING"))
    topJob = "SCRIBING";
  if (jobsObject.includes("COOKING"))
    topJob = "COOKING";
  if (jobsObject.includes("JEWELING"))
    topJob = "JEWELING";

  return topJob;
}

module.exports.help = {
  commandName: "functions"
}
