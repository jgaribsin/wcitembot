const Discord = require('discord.js');
const client = new Discord.Client();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const { Client, Attachment } = require('discord.js');
const { RichEmbed } = require('discord.js');

//var token = '';

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    // uptimeUpdate();
});


var uptimeUpdate = function() {
    let totalSeconds = (client.uptime / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.round(totalSeconds % 60);

    let uptime = `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
    client.user.setActivity("Online for: " + uptime); 
}

// node C:\Users\Jonathan\Desktop\DiscordBots\ItemBot\bot.js

var calcMultiplier = function (level, rarity) { // Calculate the multiplier of health/damage based off an item's rarity and level
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
}

var calcBaseDam = function (level, rarity, weaponType, atkSpeed) { // Calculate the base damage of weapons based off level, rarity, type (dagger, bow, spear, wand) and attack speed
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
        returnValue = Math.round(calcMultiplier(level, rarity) * baseLevelDamage * atkSpeedMultiplier * 1000) / 1000;
    }
    else if (weaponType === "spear" || weaponType === "Spear" || weaponType === "s") {
        baseLevelDamage = (warriorDamage[Math.ceil(level / 5)] - warriorDamage[Math.floor(level / 5)]) * (level % 5) / 5 + warriorDamage[Math.floor(level / 5)];
        returnValue = Math.round(calcMultiplier(level, rarity) * baseLevelDamage * atkSpeedMultiplier * 1000) / 1000;
    }
    else if (weaponType === "dagger" || weaponType === "Dagger" || weaponType === "d") {
        baseLevelDamage = (assassinDamage[Math.ceil(level / 5)] - assassinDamage[Math.floor(level / 5)]) * (level % 5) / 5 + assassinDamage[Math.floor(level / 5)];
        returnValue = Math.round(calcMultiplier(level, rarity) * baseLevelDamage * atkSpeedMultiplier * 1000) / 1000;
    }
    else if (weaponType === "bow" || weaponType === "Bow" || weaponType === "b") {
        baseLevelDamage = (archerDamage[Math.ceil(level / 5)] - archerDamage[Math.floor(level / 5)]) * (level % 5) / 5 + archerDamage[Math.floor(level / 5)];
        returnValue = Math.round(calcMultiplier(level, rarity) * baseLevelDamage * atkSpeedMultiplier * 1000) / 1000;
    }
    if (level > 1)
        return returnValue;
    else
        return Math.round(returnValue / 1.2 * 1000) / 1000;
}

var calcBaseHealth = function (level, rarity) {
    var baseHealth = [3, 11, 26, 46, 72, 108, 159, 223, 309, 420, 554, 737, 964, 1152, 1363, 1600, 1864, 2157, 2481, 2839, 3234];
    var baseLevelHealth = (baseHealth[Math.ceil(level / 5)] - baseHealth[Math.floor(level / 5)]) * (level % 5) / 5 + baseHealth[Math.floor(level / 5)];

    return Math.round(calcMultiplier(level, rarity) * baseLevelHealth * 1000) / 1000;
}

var calcTotalBaseHealth = function (level, rarity) {
    var baseTotalHealth = [24, 53, 115, 196, 299, 442, 646, 901, 1246, 1690, 2224, 2958, 3868, 4619, 5464, 6410, 7465, 8637, 9935, 11368, 12946];
    var baseLevelTotalHealth = (baseTotalHealth[Math.ceil(level / 5)] - baseTotalHealth[Math.floor(level / 5)]) * (level % 5) / 5 + baseTotalHealth[Math.floor(level / 5)];

    return Math.round(calcMultiplier(level, rarity) * baseLevelTotalHealth * 1000) / 1000;
}

var calcRawSpell = function (level, rarity, itemType) {
    var typeMultiplier;

	if (itemType === "weapon" || itemType === "armour" || itemType === "armor" || itemType === "helmet" || itemType === "chestplate" || itemType === "leggings" || itemType === "boots" || itemType === "spear" || itemType === "bow" || itemType === "wand" || itemType === "dagger")
        typeMultiplier = 1.0;
    else if (itemType === "necklace" || itemType === "bracelet" || itemType === "ring")
        typeMultiplier = 0.333;

    return Math.round(calcBaseDam(level, rarity, "dagger", "normal") * 0.63 * typeMultiplier * 1000) / 1000;
}

var calcRawMelee = function (level, rarity, itemType, atkSpeed) {
    var baseRawMelee = [3.4, 6.8, 10.2, 13.6, 19.04, 24.48, 32.64, 40.8, 48.96, 59.84, 70.72, 84.32, 1000.64, 116.96, 133.28, 149.6, 168.64, 187.68, 209.44, 231.2, 252.96];
    var typeMultiplier;
	var returnValue = 0;
    if (itemType === "armour" || itemType === "armor" || itemType === "helmet" || itemType === "chestplate" || itemType === "leggings" || itemType === "boots")
	{
        typeMultiplier = 1.0;
		returnValue = Math.round(calcBaseDam(level, rarity, "spear", "normal") * 0.63 * typeMultiplier * 1000) / 1000;
	}
    else if (itemType === "necklace" || itemType === "bracelet" || itemType === "ring")
	{
        typeMultiplier = 0.333;
		returnValue = Math.round(calcBaseDam(level, rarity, "spear", "normal") * 0.63 * typeMultiplier * 1000) / 1000;
	}
	else  if (itemType === "spear" || itemType === "bow" || itemType === "wand" || itemType === "dagger")
	{
		var weaponDamage = calcBaseDam(level, rarity, itemType, atkSpeed);
		returnValue = weaponDamage/2;
	}

    return returnValue;
}

var calcHealthRegen = function (level, rarity, itemType) {
    var typeMultiplier;

    if (itemType === "armour" || itemType === "armor" || itemType === "weapon" || itemType === "helmet" || itemType === "chestplate" || itemType === "leggings" || itemType === "boots" || itemType === "spear" || itemType === "bow" || itemType === "wand" || itemType === "dagger")
        typeMultiplier = 1.0;
    else if (itemType === "necklace" || itemType === "bracelet" || itemType === "ring")
        typeMultiplier = 0.5;

    return Math.round(calcTotalBaseHealth(level, rarity) * 0.015 * typeMultiplier * 1000) / 1000;
}

var calcLifeSteal = function (level, rarity, itemType) {
	var baseLifeSteal = 0;
	var X = level;
	
	// some fancy formula shit poke came up with. set the first input as the level above
	if (itemType === "armour" || itemType === "armor" || itemType === "helmet" || itemType === "chestplate" || itemType === "leggings" || itemType === "boots")
        baseLifeSteal = (-9.668517 * 0.0000001) * Math.pow(X, 4) + (2.55299 * 0.0001) * Math.pow(X, 3) + (-0.0014096) * Math.pow(X, 2) + (0.082753855) * Math.pow(X, 1) + 1.491519;
    else if (itemType === "necklace" || itemType === "bracelet" || itemType == "ring")
        baseLifeSteal = (-6.5279317694023 * 0.0000001) * Math.pow(X, 4) + (1.6376006529064 * 0.0001) * Math.pow(X, 3) + (-0.0030293516228929) * Math.pow(X, 2) + (0.07433529706782) * Math.pow(X, 1) + 1.4595111575337;
    else if (itemType === "weapon" || itemType === "spear" || itemType === "bow" || itemType === "wand" || itemType === "dagger")
        baseLifeSteal = (-1.64594428 * 0.000001) * Math.pow(X, 4) + (4.2381550782939 * 0.0001) * Math.pow(X, 3) + (-0.0069026686526) * Math.pow(X, 2) + (0.23818150377979) * Math.pow(X, 1) + 1.875175802217;

    return Math.round(baseLifeSteal * calcMultiplier(level, rarity) * 1000) / 1000;
}

// Note: This outputs baseline poison at a multiplier of 1. Higher multipliers may be added depending on an item's reliance on this stat
var calcPoison = function (level, rarity, itemType) {
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
	
    return Math.round(basePoison * typeMultiplier * calcMultiplier(level, rarity) * 1000) / 1000;
}

client.on('message', message => {
    // uptimeUpdate();
    var isBotOwner = message.author.id == '153296359871479809';

    // Set the bot's prefix here. No need to update elsewhere
    var prefix = ".";

    // Splits the user's message into an array so each index can be interpretted easily as a different input
    var messageArray = message.content.split(" ");
    // Indicates that the command is the remaining string of the first index of messageArray starting from the end of the specified prefix
    var command = messageArray[0].substring(prefix.length, messageArray[0].length).toString();

    var level;
    var rarity;
    var thirdInput;
    var fourthInput = "";

    if (message.content === "ping" && !message.author.bot) {
        message.channel.send('Pong! Latency: ' + client.ping + 'ms');
    }
    else if (message.content === "listemojis" && isBotOwner) {
        const emojiList = client.emojis.map(e => e.toString()).join(" ");
        message.channel.send(emojiList);
    }
    // Checks if any readable message sent has the prefix and it is not a bot using the command
    else if (prefix === messageArray[0].substring(0, prefix.length) && !message.author.bot && (message.channel.type != "dm" || isBotOwner)) {
        // Setting the level as the second index of user input and parsing it as an integer because javascript type conversions are a residentSleeper
        if (messageArray.length > 1)
            level = parseInt(messageArray[1]);

        // Setting the rarity as the third index of user input and converting it to a string because javascript type conversions are a monkaS
        if (messageArray.length > 2)
            rarity = messageArray[2].toString();

        // Setting the fourth and fifth index as third and fourth input (the first index is the prefix and command, never manipulated based on commands) to be used depending on the cmd
        if (messageArray.length > 3)
            thirdInput = messageArray[3];

        if (messageArray.length > 4)
            fourthInput = messageArray[4];

        if (command === "restart") {

            if (isBotOwner) {
                message.channel.send('Restarting...').then(m => {
                    client.destroy().then(() => {
                        client.login(token);
                    });
                });
            }
        }

        // Checking baseline damage of a requested item based off level, rarity, weapon type and attack speed
        if (command === "damage") {
			try {
            var weaponType = thirdInput.toString();
            var atkSpeed = fourthInput.toString();
			} catch (error) {}
            message.channel.send("Baseline damage is: " + calcBaseDam(level, rarity, weaponType, atkSpeed));
        }
        // Checking baseline health of a requested item level and rarity
        else if (command === "health") {

            if (messageArray.length > 3) {
                var itemType = thirdInput.toString();

                if (itemType === "weapon" || itemType === "armour" || itemType === "armor" || itemType === "a" || itemType === "w") {
                    typeMultiplier = 1.0;
					message.channel.send("Baseline health is: " + (calcBaseHealth(level, rarity) * typeMultiplier).toFixed(3));
				}
                else if (itemType === "necklace" || itemType === "bracelet" || itemType === "n" || itemType === "b" || itemType === "ring" || itemType === "r") {
                    typeMultiplier = 0.15;
				    message.channel.send("Baseline health is: " + (calcBaseHealth(level, rarity) * typeMultiplier).toFixed(3));
				}
				else
					message.channel.send("Please enter an applicable item type: `weapon/armour/w/a` or `necklace/bracelet/ring/n/b/r`.");
					
            }
            else
				message.channel.send("Baseline health for an armour/weapon is: " + calcBaseHealth(level, rarity).toFixed(3) +
                    "\nBaseline health for a necklace/bracelet/ring is: " + (calcBaseHealth(level, rarity) * 0.15).toFixed(3));
        }

        else if (command === "mult") {
            message.channel.send("The multiplier for a level `" + level + "` `" + rarity + "` is: " + calcMultiplier(level, rarity));
        }

        // Calculating baseline health regen of a requested item based off level and rarity (is 1.5% of baseline health with various multipliers based off item type)
        else if (command === "hr") {
            if (messageArray.length > 3) {
                var itemType = thirdInput.toString();
                message.channel.send("Baseline health regen for a(n) `" + itemType + "` is: " + calcHealthRegen(level, rarity, itemType));
            }
            else
                message.channel.send("Baseline health regen for an armour/weapon is: " + calcHealthRegen(level, rarity, "armour") +
                    "\nBaseline health regen for a necklace/bracelet/ring is: " + calcHealthRegen(level, rarity, "necklace"));
        }
        // Calculating baseline lifesteal of a requested item based off level, rarity and item type (is a custom curve thanks @poke)
        else if (command === "ls") {
            if (messageArray.length > 3) {
                var itemType = thirdInput.toString();
                message.channel.send("Baseline lifesteal for a(n) `" + itemType + "` is: " + calcLifeSteal(level, rarity, itemType));
            }
            else
                message.channel.send("\nBaseline lifesteal for a weapon is: " + calcLifeSteal(level, rarity, "weapon") +
                    "\nBaseline lifesteal for an armour is: " + calcLifeSteal(level, rarity, "armour") +
                    "\nBaseline lifesteal for a necklace/bracelet/ring is: " + calcLifeSteal(level, rarity, "necklace"));
        }
        // Calculating raw spell of a requested item based off level, rarity and item type (is 63% of assassin baseline)
        else if (command === "rs") {
            if (messageArray.length > 3) {
                var itemType = thirdInput.toString();
                message.channel.send("Baseline raw spell for a(n) `" + itemType + "` is: " + calcRawSpell(level, rarity, itemType));
            }
            else
                message.channel.send("Baseline raw spell for an armour/weapon is: " + calcRawSpell(level, rarity, "armour") +
                    "\nBaseline raw spell for a necklace/bracelet/ring is: " + calcRawSpell(level, rarity, "necklace"));
        }
        // Calculating raw melee of a requested item based off level, rarity and item type (is 63% of warrior baseline)
        else if (command === "rm") {
            if (messageArray.length > 3) {
                var itemType = thirdInput.toString();
                message.channel.send("Baseline raw melee for a(n) `" + itemType + "` is: " + calcRawMelee(level, rarity, itemType, fourthInput));
            }
            else
                message.channel.send("Baseline raw melee for an armour/weapon is: " + calcRawMelee(level, rarity, "armour") +
                    "\nBaseline raw melee for a necklace/bracelet/ring is: " + calcRawMelee(level, rarity, "necklace"));
        }
		
        // Calculating poison of a requested item based off level, rarity, item type and reliance (is the assassin baseline with multipliers attached)
        // i love bracket spam
        else if (command === "poison") {
            if (messageArray.length > 3) {
                var itemType = thirdInput.toString();

                if (itemType === "accessory") {
                    var poisonMult = 1;
                    if (messageArray.length > 4) {
                        poisonMult = messageArray[4];
                        message.channel.send("Baseline poison for a `" + 'bracelet/necklace/ring' + "` at a multiplier of `" + poisonMult + "` is: " + (calcPoison(level, rarity, "bracelet") * poisonMult).toFixed(3));
                    }
                    else
                        message.channel.send("Baseline poison for a `" + 'bracelet/necklace/ring' + "` at a multiplier of `" + poisonMult + "` is: " + calcPoison(level, rarity, "bracelet").toFixed(3));
                }
                else {
                    var poisonMult = 1;
                    if (messageArray.length > 4) {
                        poisonMult = messageArray[4];
                        message.channel.send("Baseline poison for a(n) `" + itemType + "` at a multiplier of `" + poisonMult + "` is: " + (calcPoison(level, rarity, itemType) * poisonMult).toFixed(3));
                    }
                    else
                        message.channel.send("Baseline poison for a(n) `" + itemType + "` at a multiplier of `" + poisonMult + "` is: " + calcPoison(level, rarity, itemType).toFixed(3));
                }
            }
            else
                message.channel.send("Please input an item type: `ring/necklace/bracelet/armour/weapon`");
        } // end poison cmd
		
        else if (command === "b") {
            // Picks out the users query and attaches it to the API request URL then sends it
            var userQuery = message.content.substring(prefix.length + 2, message.length);
            var apiPing = "https://api.wynncraft.com/public_api.php?action=itemDB&search=";

            var request = new XMLHttpRequest();
            request.open("GET", apiPing + userQuery, false);
            request.send();

			var parsedReturn;
            // Parses the response text to JSON format (this means each individual line of the JSON variable is the index of the item as an array)
            try {
                parsedReturn = JSON.parse(request.responseText);

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
                        botResponse += parsedReturn.items[i].name + ", ";
                    }

                    message.channel.send(botResponse);
                }
                else {

                    var botResponse;
                    var baseDamages;
                    var BaselineComp = "";

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
					var rawMeleeBaseline = calcRawMelee(itemLevel, itemRarity, functionType, attackSpeed);
                    var healthBonus = itemRequested.healthBonus;

                    // Creating variables to the baseline value for the current item
                    var poisonBaseline = calcPoison(itemLevel, itemRarity, functionType);
                    var rawSpellBaseline = calcRawSpell(itemLevel, itemRarity, functionType);
                    
                    var rawHealthRegenBaseline = calcHealthRegen(itemLevel, itemRarity, functionType);
                    var lifestealBaseline = calcLifeSteal(itemLevel, itemRarity, functionType);

                    var healthBonusBaseline = calcBaseHealth(itemLevel, itemRarity);
                    if (itemType !== undefined) {
                        if (itemType.toLowerCase() === "dagger" || itemType.toLowerCase() === "spear" || itemType.toLowerCase() === "wand" || itemType.toLowerCase() === "bow") {

                            attackSpeed = itemRequested.attackSpeed;
							rawMeleeBaseline = calcRawMelee(itemLevel, itemRarity, functionType, attackSpeed);
							
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

                            var baselineDamage = calcBaseDam(itemLevel, itemRarity, itemType, attackSpeed);

                            BaselineComp += "Base Damage: " + totalBaseDamage + " [" + baselineDamage.toFixed(2) + " | " + ((totalBaseDamage / baselineDamage) * 100).toFixed(2) + "%]" + "\n";
                            if (healthBonus !== 0 && healthBonus !== undefined)
                                BaselineComp += "Health Bonus: " + healthBonus + " [" + healthBonusBaseline.toFixed(2) + " | " + ((healthBonus / healthBonusBaseline) * 100).toFixed(2) + "%]" + "\n";
                            if (rawHealthRegen !== 0 && rawHealthRegen !== undefined)
                                BaselineComp += "Health Regen: " + rawHealthRegen + " [" + rawHealthRegenBaseline.toFixed(2) + " | " + ((rawHealthRegen / rawHealthRegenBaseline) * 100).toFixed(2) + "%]" + "\n";
                            if (rawSpell !== 0 && rawSpell !== undefined)
                                BaselineComp += "Raw Spell: " + rawSpell + " [" + rawSpellBaseline.toFixed(2) + " | " + ((rawSpell / rawSpellBaseline) * 100).toFixed(2) + "%]" + "\n";
                            if (rawMelee !== 0 && rawMelee !== undefined)
                                BaselineComp += "Raw Melee: " + rawMelee + " [" + rawMeleeBaseline.toFixed(2) + " | " + ((rawMelee / rawMeleeBaseline) * 100).toFixed(2) + "%]" + "\n";
                            if (lifesteal !== 0 && lifesteal !== undefined)
                                BaselineComp += "Lifesteal: " + lifesteal + " [" + lifestealBaseline.toFixed(2) + " | " + ((lifesteal / lifestealBaseline) * 100).toFixed(2) + "%]" + "\n";
                            if (poison !== 0 && poison !== undefined)
                                BaselineComp += "Poison: " + poison + " [" + poisonBaseline.toFixed(2) + " | " + ((poison / poisonBaseline) * 100).toFixed(2) + "%]" + "\n";

                            message.channel.send(itemDamages + "\n\n" + BaselineComp);
                        } // End bracket 'if bow/dagger/spear/wand'

                        else if (itemType.toLowerCase() === "boots" || itemType.toLowerCase() === "leggings" || itemType.toLowerCase() === "chestplate" || itemType.toLowerCase() === "helmet") {
                            var itemHealth = itemRequested.health + healthBonus;
                            var baselineHealth = calcBaseHealth(itemLevel, itemRarity);

                            if (healthBonus !== 0 && healthBonus !== undefined) {
                                BaselineComp += "Health: " + itemRequested.health + " [" + baselineHealth.toFixed(2) + " | " + ((itemRequested.health / baselineHealth) * 100).toFixed(2) + "%]" + "\n";
                                BaselineComp += "Health (with health bonus): " + itemHealth + " (" + itemRequested.health + " + " + healthBonus + ") [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";
                            }
                            else
                                BaselineComp += "Health: " + itemHealth + " [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";

                            if (rawHealthRegen !== 0 && rawHealthRegen !== undefined)
                                BaselineComp += "Health Regen: " + rawHealthRegen + " [" + rawHealthRegenBaseline.toFixed(2) + " | " + ((rawHealthRegen / rawHealthRegenBaseline) * 100).toFixed(2) + "%]" + "\n";
                            if (rawSpell !== 0 && rawSpell !== undefined)
                                BaselineComp += "Raw Spell: " + rawSpell + " [" + rawSpellBaseline.toFixed(2) + " | " + ((rawSpell / rawSpellBaseline) * 100).toFixed(2) + "%]" + "\n";
                            if (rawMelee !== 0 && rawMelee !== undefined)
                                BaselineComp += "Raw Melee: " + rawMelee + " [" + rawMeleeBaseline.toFixed(2) + " | " + ((rawMelee / rawMeleeBaseline) * 100).toFixed(2) + "%]" + "\n";
                            if (lifesteal !== 0 && lifesteal !== undefined)
                                BaselineComp += "Lifesteal: " + lifesteal + " [" + lifestealBaseline.toFixed(2) + " | " + ((lifesteal / lifestealBaseline) * 100).toFixed(2) + "%]" + "\n";
                            if (poison !== 0 && poison !== undefined)
                                BaselineComp += "Poison: " + poison + " [" + poisonBaseline.toFixed(2) + " | " + ((poison / poisonBaseline) * 100).toFixed(2) + "%]" + "\n";

                            message.channel.send(itemName + " (Lv. " + itemLevel + " " + itemRarity + " " + itemType + ")" + "\n\n" + itemRequested.sockets + " slots\n" + "\n" + BaselineComp);
                        } // End bracket 'if helmet/chestplate/leggings/boots'
                    } // end itemType check undefined
                    else if (itemRequested.accessoryType.toLowerCase() === "ring") {
                        var itemHealth = itemRequested.health + healthBonus;
                        var baselineHealth = calcBaseHealth(itemLevel, itemRarity) * 0.15;

                        if (healthBonus !== 0 && healthBonus !== undefined) {
                            BaselineComp += "Health: " + itemRequested.health + " [" + baselineHealth.toFixed(2) + " | " + ((itemRequested.health / baselineHealth) * 100).toFixed(2) + "%]" + "\n";
                            BaselineComp += "Health (with health bonus): " + itemHealth + " (" + itemRequested.health + " + " + healthBonus + ") [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";
                        }
                        else
                            BaselineComp += "Health: " + itemHealth + " [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";

                        if (rawHealthRegen !== 0 && rawHealthRegen !== undefined)
                            BaselineComp += "Health Regen: " + rawHealthRegen + " [" + rawHealthRegenBaseline.toFixed(2) + " | " + ((rawHealthRegen / rawHealthRegenBaseline) * 100).toFixed(2) + "%]" + "\n";
                        if (rawSpell !== 0 && rawSpell !== undefined)
                            BaselineComp += "Raw Spell: " + rawSpell + " [" + rawSpellBaseline.toFixed(2) + " | " + ((rawSpell / rawSpellBaseline) * 100).toFixed(2) + "%]" + "\n";
                        if (rawMelee !== 0 && rawMelee !== undefined)
                            BaselineComp += "Raw Melee: " + rawMelee + " [" + rawMeleeBaseline.toFixed(2) + " | " + ((rawMelee / rawMeleeBaseline) * 100).toFixed(2) + "%]" + "\n";
                        if (lifesteal !== 0 && lifesteal !== undefined)
                            BaselineComp += "Lifesteal: " + lifesteal + " [" + lifestealBaseline.toFixed(2) + " | " + ((lifesteal / lifestealBaseline) * 100).toFixed(2) + "%]" + "\n";
                        if (poison !== 0 && poison !== undefined)
                            BaselineComp += "Poison: " + poison + " [" + poisonBaseline.toFixed(2) + " | " + ((poison / poisonBaseline) * 100).toFixed(2) + "%]" + "\n";

                        message.channel.send(itemName + " (Lv. " + itemLevel + " " + itemRarity + " " + itemRequested.accessoryType + ")" + "\n\n" + BaselineComp);
                    }
                    else if (itemRequested.accessoryType.toLowerCase() === "bracelet") {
                        var itemHealth = itemRequested.health + healthBonus;
                        var baselineHealth = calcBaseHealth(itemLevel, itemRarity) * 0.15;

                        if (healthBonus !== 0 && healthBonus !== undefined) {
                            BaselineComp += "Health: " + itemRequested.health + " [" + baselineHealth.toFixed(2) + " | " + ((itemRequested.health / baselineHealth) * 100).toFixed(2) + "%]" + "\n";
                            BaselineComp += "Health (with health bonus): " + itemHealth + " (" + itemRequested.health + " + " + healthBonus + ") [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";
                        }
                        else
                            BaselineComp += "Health: " + itemHealth + " [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";

                        if (rawHealthRegen !== 0 && rawHealthRegen !== undefined)
                            BaselineComp += "Health Regen: " + rawHealthRegen + " [" + rawHealthRegenBaseline.toFixed(2) + " | " + ((rawHealthRegen / rawHealthRegenBaseline) * 100).toFixed(2) + "%]" + "\n";
                        if (rawSpell !== 0 && rawSpell !== undefined)
                            BaselineComp += "Raw Spell: " + rawSpell + " [" + rawSpellBaseline.toFixed(2) + " | " + ((rawSpell / rawSpellBaseline) * 100).toFixed(2) + "%]" + "\n";
                        if (rawMelee !== 0 && rawMelee !== undefined)
                            BaselineComp += "Raw Melee: " + rawMelee + " [" + rawMeleeBaseline.toFixed(2) + " | " + ((rawMelee / rawMeleeBaseline) * 100).toFixed(2) + "%]" + "\n";
                        if (lifesteal !== 0 && lifesteal !== undefined)
                            BaselineComp += "Lifesteal: " + lifesteal + " [" + lifestealBaseline.toFixed(2) + " | " + ((lifesteal / lifestealBaseline) * 100).toFixed(2) + "%]" + "\n";
                        if (poison !== 0 && poison !== undefined)
                            BaselineComp += "Poison: " + poison + " [" + poisonBaseline.toFixed(2) + " | " + ((poison / poisonBaseline) * 100).toFixed(2) + "%]" + "\n";

                        message.channel.send(itemName + " (Lv. " + itemLevel + " " + itemRarity + " " + itemRequested.accessoryType + ")" + "\n\n" + BaselineComp);
                    }
                    else if (itemRequested.accessoryType.toLowerCase() === "necklace") {
                        var itemHealth = itemRequested.health + healthBonus;
                        var baselineHealth = calcBaseHealth(itemLevel, itemRarity) * 0.15;

                        if (healthBonus !== 0 && healthBonus !== undefined) {
                            BaselineComp += "Health: " + itemRequested.health + " [" + baselineHealth.toFixed(2) + " | " + ((itemRequested.health / baselineHealth) * 100).toFixed(2) + "%]" + "\n";
                            BaselineComp += "Health (with health bonus): " + itemHealth + " (" + itemRequested.health + " + " + healthBonus + ") [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";
                        }
                        else
                            BaselineComp += "Health: " + itemHealth + " [" + baselineHealth.toFixed(2) + " | " + ((itemHealth / baselineHealth) * 100).toFixed(2) + "%]" + "\n\n";

                        if (rawHealthRegen !== 0 && rawHealthRegen !== undefined)
                            BaselineComp += "Health Regen: " + rawHealthRegen + " [" + rawHealthRegenBaseline.toFixed(2) + " | " + ((rawHealthRegen / rawHealthRegenBaseline) * 100).toFixed(2) + "%]" + "\n";
                        if (rawSpell !== 0 && rawSpell !== undefined)
                            BaselineComp += "Raw Spell: " + rawSpell + " [" + rawSpellBaseline.toFixed(2) + " | " + ((rawSpell / rawSpellBaseline) * 100).toFixed(2) + "%]" + "\n";
                        if (rawMelee !== 0 && rawMelee !== undefined)
                            BaselineComp += "Raw Melee: " + rawMelee + " [" + rawMeleeBaseline.toFixed(2) + " | " + ((rawMelee / rawMeleeBaseline) * 100).toFixed(2) + "%]" + "\n";
                        if (lifesteal !== 0 && lifesteal !== undefined)
                            BaselineComp += "Lifesteal: " + lifesteal + " [" + lifestealBaseline.toFixed(2) + " | " + ((lifesteal / lifestealBaseline) * 100).toFixed(2) + "%]" + "\n";
                        if (poison !== 0 && poison !== undefined)
                            BaselineComp += "Poison: " + poison + " [" + poisonBaseline.toFixed(2) + " | " + ((poison / poisonBaseline) * 100).toFixed(2) + "%]" + "\n";

                        message.channel.send(itemName + " (Lv. " + itemLevel + " " + itemRarity + " " + itemRequested.accessoryType + ")" + "\n\n" + BaselineComp);
                    }
                }
            }
			catch(error) {
       // shrug
				}
        } // End of 'b command'

        else if (command === "i") {
            // Picks out the users query and attaches ot to the API request URL then sends it
            var userQuery = message.content.substring(prefix.length + 2, message.length);
            var apiPing = "https://api.wynncraft.com/public_api.php?action=itemDB&search=";

            var request = new XMLHttpRequest();
            request.open("GET", apiPing + userQuery, false);
            request.send();

            // Parses the response text to JSON format (this means each individual line of the JSON variable is the index of the item as an array)
            try {
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
                        botResponse += parsedReturn.items[i].name + ", ";
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
                    if (item.addedLore !== null && item.addedLore !== undefined)
                        identifications += "\n" + item.addedLore;


                    var baseStats = "";
                    if (iType.toLowerCase() === "bow" || iType.toLowerCase() === "spear" || iType.toLowerCase() === "wand" || iType.toLowerCase() === "dagger") {
                        var iDamage = item.damage;
                        var iFireDamage = item.fireDamage;
                        var iWaterDamage = item.waterDamage;
                        var iAirDamage = item.airDamage;
                        var iThunderDamage = item.thunderDamage;
                        var iEarthDamage = item.earthDamage;
                        var iAtkSpeed = item.attackSpeed;

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
                        var iHealth = item.health;
                        var iFireDefense = item.fireDefense;
                        var iWaterDefense = item.waterDefense;
                        var iAirDefense = item.airDefense;
                        var iThunderDefense = item.thunderDefense;
                        var iEarthDefense = item.earthDefense;

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
                } // end else no items found
            }
            catch(error) {
                // shrug
            }
        } // End if 'i command' */

        else if (command === "a") {
            var userNumbers = message.content.split(" ");

            var evenCheck = userNumbers.length % 2;
            var average = 0;
            var total = 0;

            if (evenCheck === 1) {
                for (i = 1; i < userNumbers.length; i++) {
                    total += parseInt(userNumbers[i]);
                } // End for loop
                average = total / 2.0;
                message.channel.send("Average of these numbers is: " + average);
            } // End if statement

            else
                message.channel.send("Please input an even number of numbers.");

        } // End actual command
		else if (command == "av") {
			var userNumbers = message.content.split(" ");
			var average = 0;
            var total = 0;
			var count = 0;
			
			for (i = 1; i < userNumbers.length; i++) {
                    total += parseInt(userNumbers[i]);
					count++;
			} // end for loop
			average = total / count;
            message.channel.send("Average of these numbers is: " + average);
		} // end avg command
		else if (command == "poll") {
			var userNumbers = message.content.split(" ");
			var votesFive = userNumbers[1] - 1;
			var votesFour = userNumbers[2] - 1;
			var votesThree = userNumbers[3] - 1;
			var votesTwo = userNumbers[4] - 1;
			var votesOne = userNumbers[5] - 1;
			
			var total = 0;
			var votes = 0;
			votes += votesFive;
			votes += votesFour;
			votes += votesThree;
			votes += votesTwo;
			votes += votesOne;
			
			for (i = 0; i < votesFive ; i++) {
				total += 5;
			}
			for (i = 0; i < votesFour ; i++) {
				total += 4;
			}
			for (i = 0; i < votesThree ; i++) {
				total += 3;
			}
			for (i = 0; i < votesTwo ; i++) {
				total += 2;
			}
			for (i = 0; i < votesOne ; i++) {
				total += 1;
			}
			var average = total / votes;
			var roundedAvg = Math.round(average*100)/100;
			message.channel.send("Average of `" + votesFive + " 5s`, `" + votesFour + " 4s`, `"  + votesThree + " 3s`, `"  + votesTwo + " 2s` and `"  + votesOne + " 1s `"  + " is: " + roundedAvg);
		}
        else if (command === "m") {
            var userNumbers = message.content.split(" ");

            if (userNumbers.length !== 3)
                message.channel.send("Please input two numbers.");
            else
                message.channel.send("The product of `" + userNumbers[1] + "` and `" + userNumbers[2] + "` is: " + (userNumbers[1] * userNumbers[2]));
        } // end m command
		else if (command === "d") {
            var userNumbers = message.content.split(" ");

            if (userNumbers.length !== 3)
                message.channel.send("Please input two numbers.");
            else
                message.channel.send("The quotient of `" + userNumbers[1] + "` and `" + userNumbers[2] + "` is: " + (userNumbers[1] / userNumbers[2]));
        } // end d command
        else if (command === "powder") {
            switch (level) {
                case 1:
                    const powders1 = new Attachment("https://i.imgur.com/XxGqDPo.png");
                    message.channel.send(powders1);
                    break;
                case 2:
                    const powders2 = new Attachment("https://i.imgur.com/sDUIZOU.png");
                    message.channel.send(powders2);
                    break;
                case 3:
                    const powders3 = new Attachment("https://i.imgur.com/pKJog9M.png");
                    message.channel.send(powders3);
                    break;
                case 4:
                    const powders4 = new Attachment("https://i.imgur.com/zF7Y4cC.png");
                    message.channel.send(powders4);
                    break;
                case 5:
                    const powders5 = new Attachment("https://i.imgur.com/5nbNhMv.png");
                    message.channel.send(powders5);
                    break;
                case 6:
                    const powders6 = new Attachment("https://i.imgur.com/KTVFcw9.png");
                    message.channel.send(powders6);
                    break;
            }
        } // end powder command
		
		/* INGREDIENT STUFF BELOW */
		/* INGREDIENT STUFF BELOW */
		/* INGREDIENT STUFF BELOW */
		
		else if (command === "durab") {
			var durabilityMult = 0;
			if (rarity === "0")
				durabilityMult = 1.0;
			if (rarity === "1")
				durabilityMult = 1.4;
			if (rarity === "2")
				durabilityMult = 2.0;
			if (rarity === "3")
				durabilityMult = 3.0;
			
			if (level > 0 && (rarity > -1 && rarity < 4))
				message.channel.send("Durability cost for a level `" + level + "` `t" + rarity + "` ingredient is: " + (10000 + (level - 1) * 200) * durabilityMult );
			else 
				message.channel.send("Incorrect request; level must be above 0 and rarity must be 0 to 3.");
		} // end durab command
		else if (command === "durat" && message.guild.id !== '476152252130656276') {
			var durabilityMult = 0;
			if (rarity === "0")
				durabilityMult = 1.0;
			if (rarity === "1")
				durabilityMult = 1.4;
			if (rarity === "2")
				durabilityMult = 2.0;
			if (rarity === "3")
				durabilityMult = 3.0;
			
			if (level > 0 && (rarity > -1 && rarity < 4))
				message.channel.send("Duration cost for a level `" + level + "` `t" + rarity + "` ingredient is: " + (12 + (level - 1) * 0.2) * durabilityMult );
			else 
				message.channel.send("Incorrect request; level must be above 0 and rarity must be 0 to 3.");
		} // end durat command
		else if (command === "cost" && message.guild.id !== '476152252130656276') {
			var durabilityMult = 0;
			if (rarity === "0")
				durabilityMult = 1.0;
			if (rarity === "1")
				durabilityMult = 1.4;
			if (rarity === "2")
				durabilityMult = 2.0;
			if (rarity === "3")
				durabilityMult = 3.0;
			
			if (level > 0 && (rarity > -1 && rarity < 4)) {
				message.channel.send("Durability cost for a level `" + level + "` `t" + rarity + "` ingredient is: " + (10000 + (level - 1) * 200) * durabilityMult +
				"\nDuration cost for a level `" + level + "` `t" + rarity + "` ingredient is: " + (12 + (level - 1) * 0.2) * durabilityMult );
			}
			else 
				message.channel.send("Incorrect request; level must be above 0 and rarity must be 0 to 3.");
		} // end cost command
				else if (command === "c" && message.guild.id !== '476152252130656276') {
			var durabilityMult = 0;
			if (rarity === "0")
				durabilityMult = 1.0;
			if (rarity === "1")
				durabilityMult = 1.4;
			if (rarity === "2")
				durabilityMult = 2.0;
			if (rarity === "3")
				durabilityMult = 3.0;
			
			if (level > 0 && (rarity > -1 && rarity < 4)) {
				message.channel.send("Durability cost for a level `" + level + "` `t" + rarity + "` ingredient is: " + (10000 + (level - 1) * 200) * durabilityMult +
				"\nDuration cost for a level `" + level + "` `t" + rarity + "` ingredient is: " + (12 + (level - 1) * 0.2) * durabilityMult );
			}
			else 
				message.channel.send("Incorrect request; level must be above 0 and rarity must be 0 to 3.");
		} // end cost command
		else if (command === "maxdurab" && message.guild.id !== '476152252130656276') {
			var maxDurabilityMult = 0;
			if (rarity === "1")
				maxDurabilityMult = 1.0;
			if (rarity === "2")
				maxDurabilityMult = 1.35;
			if (rarity === "3")
				maxDurabilityMult = 1.7;
			
			if (level > 0 && (rarity > 0 && rarity < 4))
				message.channel.send("Durability for a level `" + level + "` `t" + rarity + "` item is: " + (10000 + (level - 1) * 200) * maxDurabilityMult);
			else 
				message.channel.send("Incorrect request; level must be above 0 and rarity must be 1 to 3.");
		} // end maxdurab command
		else if (command === "maxdurat" && message.guild.id !== '476152252130656276') {
			var maxDurabilityMult = 0;
			if (rarity === "1")
				maxDurabilityMult = 1.0;
			if (rarity === "2")
				maxDurabilityMult = 1.35;
			if (rarity === "3")
				maxDurabilityMult = 1.7;
			
			if (level > 0 && (rarity > 0 && rarity < 4))
				message.channel.send("Durability for a level `" + level + "` `t" + rarity + "` item is: " + (120 + (level - 1) * 2) * maxDurabilityMult);
			else 
				message.channel.send("Incorrect request; level must be above 0 and rarity must be 1 to 3.");
		} // end maxdurat command
		else if (command === "maxcost" && message.guild.id !== '476152252130656276') {
			var maxDurabilityMult = 0;
			if (rarity === "1")
				maxDurabilityMult = 1.0;
			if (rarity === "2")
				maxDurabilityMult = 1.35;
			if (rarity === "3")
				maxDurabilityMult = 1.7;
			
			if (level > 0 && (rarity > -1 && rarity < 4)) {
				message.channel.send("Durability cost for a level `" + level + "` `t" + rarity + "` ingredient is: " + (10000 + (level - 1) * 200) * maxDurabilityMult +
				"\nDuration cost for a level `" + level + "` `t" + rarity + "` ingredient is: " + (120 + (level - 1) * 2) * maxDurabilityMult );
			}
			else 
				message.channel.send("Incorrect request; level must be above 0 and rarity must be 0 to 3.");
		} // end cost command

    }

});

client.login(process.env.TOKEN);
