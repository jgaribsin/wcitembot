

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

client.login('NTQ2NTk1MTk4NzY4MjUwODgy.D0qjrg.Jqq8o68uSQmU1dtuWRv4HNp6pJw');
