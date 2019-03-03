const Discord = require("discord.js");

module.exports.run = async (client, message, args) => { return; }


exports.calcMultiplier = function (level, rarity) { // Calculate the multiplier of health/damage based off an item's rarity and level
    // https://docs.google.com/document/d/1tt_cjHVJ5MqWxqi4EeIVd5zf2Uv8vK9TwL1bbW942Vw/edit
    // All arrays have 21 numbers so it factors for every 5 levels of 0-100 (there is no 0 in game but it's effectively 1)
    var normalMultipliers = [1.00, 1.00, 1.00, 0.95, 0.90, 0.85 /* 30 and above is 80%*/, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80, 0.80];
    var uniqueMultipliers = [1.4, 1.35, 1.3, 1.25, 1.2, 1.15, 1.1, 1.05 /* 40 and above is 100% */, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    var setMultipliers = [1.6, 1.55, 1.5, 1.45, 1.4, 1.325, 1.275, 1.225, 1.15, 1.125, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.075, 1.075 /* 90 and above is 105% */, 1.05, 1.05, 1.05];
    var rareMultipliers = [1.8, 1.75, 1.7, 1.65, 1.6, 1.5, 1.45, 1.4, 1.3, 1.25, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.15, 1.15 /* 90 and above is 110% */, 1.1, 1.1, 1.1];
    var legendaryMultipliers = [2.2, 2.15, 2.1, 2.05, 2, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.35, 1.35 /* 90 and above is 130% */, 1.3, 1.3, 1.3];
    var mythicMultipliers = [2.6, 2.55, 2.5, 2.45, 2.4, 2.3, 2.2, 2.1, 2, 1.9, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.75, 1.75 /* 90 and above is 170% */, 1.7, 1.7, 1.7];

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
    else if (rarity === "mythic" || rarity === "Mythic" || rarity === "m")
        return mythicMultipliers[Math.round(level / 5)];
};

exports.calcBaseDam = function (level, rarity, weaponType, atkSpeed) { // Calculate the base damage of weapons based off level, rarity, type (dagger, bow, spear, wand) and attack speed
    // https://i.imgur.com/bocaBjD.png
    // All arrays have 21 numbers so it factors every 5 levels of 0-100 (there is no 0 in game but it's effectively 1)
    var mageDamage = [1.7, 5.1, 6.8, 10.2, 14.28, 18.36, 24.48, 30.6, 36.72, 44.48, 53.04, 63.24, 75.48, 87.72, 99.96, 112.2, 126.48, 140.76, 157.08, 173.4, 189.72];
    var warriorDamage = [3.4, 6.8, 10.2, 13.6, 19.04, 24.48, 32.64, 40.8, 48.96, 59.84, 70.72, 84.32, 100.64, 116.96, 133.28, 149.6, 168.64, 187.68, 209.44, 231.2, 252.96];
    var assassinDamage = [5.1, 8.5, 13.6, 18.7, 23.8, 30.6, 40.8, 51, 61.2, 74.8, 88.4, 105.4, 125.8, 146.2, 166.6, 187, 210.8, 234.6, 261.8, 289, 316.2];
    var archerDamage = [6.8, 10.2, 17, 22.1, 28.56, 36.72, 48.96, 61.2, 73.44, 89.76, 106.08, 126.48, 150.96, 175.44, 199.92, 224.4, 252.96, 281.52, 314.16, 346.8, 379.44];

    var atkSpeedMultiplier; // Multiplier based off the item's attack speed
    // Checks user input for the full
    if (atkSpeed === "superslow" || atkSpeed === "ss" || atkSpeed === "SUPER_SLOW")
        atkSpeedMultiplier = 3.5;
    else if (atkSpeed === "veryslow" || atkSpeed === "vs" || atkSpeed === "VERY_SLOW")
        atkSpeedMultiplier = 2.5;
    else if (atkSpeed === "slow" || atkSpeed === "s" || atkSpeed === "SLOW")
        atkSpeedMultiplier = 1.4;
    else if (atkSpeed === "normal" || atkSpeed === "n" || atkSpeed === "NORMAL")
        atkSpeedMultiplier = 1.0;
    else if (atkSpeed === "fast" || atkSpeed === "f" || atkSpeed === "FAST")
        atkSpeedMultiplier = 0.8;
    else if (atkSpeed === "veryfast" || atkSpeed === "vf" || atkSpeed === "VERY_FAST")
        atkSpeedMultiplier = 0.6;
    else if (atkSpeed === "superfast" || atkSpeed === "sf" || atkSpeed === "SUPER_FAST")
        atkSpeedMultiplier = 0.45;

    var returnValue;
    var baseLevelDamage;
    if (weaponType === "wand" || weaponType === "Wand" || weaponType === "w") {
        baseLevelDamage = (mageDamage[Math.ceil(level / 5)] - mageDamage[Math.floor(level / 5)]) * (level % 5) / 5 + mageDamage[Math.floor(level / 5)];
        returnValue = Math.round(exports.calcMultiplier(level, rarity) * baseLevelDamage * atkSpeedMultiplier * 1000) / 1000;
    }
    else if (weaponType === "spear" || weaponType === "Spear" || weaponType === "s") {
        baseLevelDamage = (warriorDamage[Math.ceil(level / 5)] - warriorDamage[Math.floor(level / 5)]) * (level % 5) / 5 + warriorDamage[Math.floor(level / 5)];
        returnValue = Math.round(exports.calcMultiplier(level, rarity) * baseLevelDamage * atkSpeedMultiplier * 1000) / 1000;
    }
    else if (weaponType === "dagger" || weaponType === "Dagger" || weaponType === "d") {
        baseLevelDamage = (assassinDamage[Math.ceil(level / 5)] - assassinDamage[Math.floor(level / 5)]) * (level % 5) / 5 + assassinDamage[Math.floor(level / 5)];
        returnValue = Math.round(exports.calcMultiplier(level, rarity) * baseLevelDamage * atkSpeedMultiplier * 1000) / 1000;
    }
    else if (weaponType === "bow" || weaponType === "Bow" || weaponType === "b") {
        baseLevelDamage = (archerDamage[Math.ceil(level / 5)] - archerDamage[Math.floor(level / 5)]) * (level % 5) / 5 + archerDamage[Math.floor(level / 5)];
        returnValue = Math.round(exports.calcMultiplier(level, rarity) * baseLevelDamage * atkSpeedMultiplier * 1000) / 1000;
    }
    if (level > 1)
        return returnValue;
    else
        return Math.round(returnValue / 1.2 * 1000) / 1000;
};

exports.calcBaseHealth = function (level, rarity) {
    var baseHealth = [3, 11, 26, 46, 72, 108, 159, 223, 309, 420, 554, 737, 964, 1152, 1363, 1600, 1864, 2157, 2481, 2839, 3234];
    var baseLevelHealth = (baseHealth[Math.ceil(level / 5)] - baseHealth[Math.floor(level / 5)]) * (level % 5) / 5 + baseHealth[Math.floor(level / 5)];

    return Math.round(exports.calcMultiplier(level, rarity) * baseLevelHealth * 1000) / 1000;
}

exports.calcTotalBaseHealth = function (level, rarity) {
    var baseTotalHealth = [24, 53, 115, 196, 299, 442, 646, 901, 1246, 1690, 2224, 2958, 3868, 4619, 5464, 6410, 7465, 8637, 9935, 11368, 12946];
    var baseLevelTotalHealth = (baseTotalHealth[Math.ceil(level / 5)] - baseTotalHealth[Math.floor(level / 5)]) * (level % 5) / 5 + baseTotalHealth[Math.floor(level / 5)];

    return Math.round(exports.calcMultiplier(level, rarity) * baseLevelTotalHealth * 1000) / 1000;
}

exports.calcRawSpell = function (level, rarity, itemType) {
    var typeMultiplier;

	if (itemType === "weapon" || itemType === "armour" || itemType === "armor" || itemType === "helmet" || itemType === "chestplate" || itemType === "leggings" || itemType === "boots" || itemType === "spear" || itemType === "bow" || itemType === "wand" || itemType === "dagger")
        typeMultiplier = 1.0;
    else if (itemType === "necklace" || itemType === "bracelet" || itemType === "ring")
        typeMultiplier = 0.333;

    return Math.round(exports.calcBaseDam(level, rarity, "dagger", "normal") * 0.63 * typeMultiplier * 1000) / 1000;
}

exports.calcRawMelee = function (level, rarity, itemType, atkSpeed) {
    var baseRawMelee = [3.4, 6.8, 10.2, 13.6, 19.04, 24.48, 32.64, 40.8, 48.96, 59.84, 70.72, 84.32, 1000.64, 116.96, 133.28, 149.6, 168.64, 187.68, 209.44, 231.2, 252.96];
    var typeMultiplier;
	var returnValue = 0;
    if (itemType === "armour" || itemType === "armor" || itemType === "helmet" || itemType === "chestplate" || itemType === "leggings" || itemType === "boots")
	{
        typeMultiplier = 1.0;
		returnValue = Math.round(exports.calcBaseDam(level, rarity, "spear", "normal") * 0.63 * typeMultiplier * 1000) / 1000;
	}
    else if (itemType === "necklace" || itemType === "bracelet" || itemType === "ring")
	{
        typeMultiplier = 0.333;
		returnValue = Math.round(exports.calcBaseDam(level, rarity, "spear", "normal") * 0.63 * typeMultiplier * 1000) / 1000;
	}
	else  if (itemType === "spear" || itemType === "bow" || itemType === "wand" || itemType === "dagger")
	{
		var weaponDamage = exports.calcBaseDam(level, rarity, itemType, atkSpeed);
		returnValue = weaponDamage/2;
	}

    return returnValue;
}

exports.calcHealthRegen = function (level, rarity, itemType) {
    var typeMultiplier;

    if (itemType === "armour" || itemType === "armor" || itemType === "weapon" || itemType === "helmet" || itemType === "chestplate" || itemType === "leggings" || itemType === "boots" || itemType === "spear" || itemType === "bow" || itemType === "wand" || itemType === "dagger")
        typeMultiplier = 1.0;
    else if (itemType === "necklace" || itemType === "bracelet" || itemType === "ring")
        typeMultiplier = 0.5;

    return Math.round(exports.calcTotalBaseHealth(level, rarity) * 0.015 * typeMultiplier * 1000) / 1000;
}

exports.calcLifeSteal = function (level, rarity, itemType) {
	var baseLifeSteal = 0;
	var X = level;

	// some fancy formula shit poke came up with. set the first input as the level above
	if (itemType === "armour" || itemType === "armor" || itemType === "helmet" || itemType === "chestplate" || itemType === "leggings" || itemType === "boots")
        baseLifeSteal = (-9.668517 * 0.0000001) * Math.pow(X, 4) + (2.55299 * 0.0001) * Math.pow(X, 3) + (-0.0014096) * Math.pow(X, 2) + (0.082753855) * Math.pow(X, 1) + 1.491519;
    else if (itemType === "necklace" || itemType === "bracelet" || itemType == "ring")
        baseLifeSteal = (-6.5279317694023 * 0.0000001) * Math.pow(X, 4) + (1.6376006529064 * 0.0001) * Math.pow(X, 3) + (-0.0030293516228929) * Math.pow(X, 2) + (0.07433529706782) * Math.pow(X, 1) + 1.4595111575337;
    else if (itemType === "weapon" || itemType === "spear" || itemType === "bow" || itemType === "wand" || itemType === "dagger")
        baseLifeSteal = (-1.64594428 * 0.000001) * Math.pow(X, 4) + (4.2381550782939 * 0.0001) * Math.pow(X, 3) + (-0.0069026686526) * Math.pow(X, 2) + (0.23818150377979) * Math.pow(X, 1) + 1.875175802217;

    return Math.round(baseLifeSteal * exports.calcMultiplier(level, rarity) * 1000) / 1000;
}

// Note: This outputs baseline poison at a multiplier of 1. Higher multipliers may be added depending on an item's reliance on this stat
exports.calcPoison = function (level, rarity, itemType) {
    var typeMultiplier;
	var basePoison = 0;
	var X = level;

    if (itemType === "armour" || itemType === "armor" || itemType === "helmet" || itemType === "chestplate" || itemType === "leggings" || itemType === "boots")
        typeMultiplier = 0.7;
    else if (itemType === "weapon" || itemType === "spear" || itemType === "bow" || itemType === "wand" || itemType === "dagger")
        typeMultiplier = 1.0;
    else if (itemType === "necklace" || itemType === "bracelet" || itemType === "ring")
        typeMultiplier = 0.45;

	basePoison = 797.8714 + (0.5203681-797.8714)/(1 + Math.pow(X/119.1328, 2.507256));

    return Math.round(basePoison * typeMultiplier * exports.calcMultiplier(level, rarity) * 1000) / 1000;
}

module.exports.help = {
  name: "functions"
}
