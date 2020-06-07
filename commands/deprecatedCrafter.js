const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args, botFiles) => {

  message.channel.send(`**Command deprecated.**\n\nYou have 30 days left in your free trial. Contact Major for a premium subscription (please don't actually)`);
  return;
  
  // setting inputs to relevant variables
  if (args[0]) var itemType = args[0].toString().toUpperCase();
  else {
    message.channel.send("Please enter an item type.\n");
    return;
  }
  if (itemType == "BOW" || itemType == "WAND" || itemType == "SPEAR" || itemType == "DAGGER" || itemType == "RELIK" || itemType == "FLAIL") {
    if (args[1]) var atkSpeed = args[1].toString().toUpperCase();
    else {
      message.channel.send("Please enter an attack speed.\n");
      return;
    }
    if (args[2]) var uLevel = parseInt(args[2]);
    else {
      message.channel.send("Please enter a level.\n");
      return;
    }
    if (args[3]) var tier = parseInt(args[3]);
    else {
      message.channel.send("Please enter a tier.\n");
      return;
    }
    if (args[4])
      var userIngreds = message.content.substring(botFiles.prefix.length + module.exports.help.commandName.length + 1 + args[0].length + 1 + args[1].length + 1 + args[2].length + 1 + args[3].length + 1, message.length);
    else {
      message.channel.send("Please enter some ingredients.\n");
      return;
    }
  }
  else {
    if (args[1]) var uLevel = parseInt(args[1]);
    else {
      message.channel.send("Please enter a level.\n");
      return;
    }
    if (args[2]) var tier = parseInt(args[2]);
    else {
      message.channel.send("Please enter a tier.\n");
      return;
    }
    if (args[3])
      var userIngreds = message.content.substring(botFiles.prefix.length + module.exports.help.commandName.length + 1 + args[0].length + 1 + args[1].length + 1 + args[2].length + 1, message.length);
    else {
      message.channel.send("Please enter some ingredients.\n");
      return;
    }
  }
  userIngreds = userIngreds.split(", ");

  /* ----------------------------------------------------------------------------------- */
  //                                                                                     //
  //                                     Configs                                         //
  //                                                                                     //
  /* ----------------------------------------------------------------------------------- */

  // base stat multipliers per tier
  var tierOneMatMult = 1;
  var tierTwoMatMult = 1.25;
  var tierThreeMatMult = 1.4;

  // ele def multipliers for armour
  var accessoryEleDefMult = 1.5;
  var armourEleDefMult = 3;

  // damage range of weapons
  var lowerRange = 0.9;
  var higherRange = 1.1;

  var charges = 1;
  if (uLevel >= 30) charges = 2;
  if (uLevel >= 70) charges = 3;

  var slots = 1;
  if (uLevel >= 30) slots = 2;
  if (uLevel >= 70) slots = 3;

  // assigning correct amount of slots able to be used
  var ingredientSlots = 6;
  // if (uLevel >= 10) ingredientSlots = 2;
  // if (uLevel >= 30) ingredientSlots = 3;
  // if (uLevel >= 50) ingredientSlots = 4;
  // if (uLevel >= 70) ingredientSlots = 5;
  // if (uLevel >= 90) ingredientSlots = 6;

  /* ----------------------------------------------------------------------------------- */

  var recipes = botFiles.recipes.recipes;
  let ingrArr = botFiles.ingredients.ingredients;

  var botResponse = "";
  var foundRecipe;
  var err = false;
  // searching for the right recipe file
  recipes = recipes.filter(recipe => (recipe.type == itemType));
  if (recipes.length > 0) {
    recipes.forEach(recipe => {
      if ((uLevel >= recipe.level.minimum) && (uLevel <= recipe.level.maximum))
        foundRecipe = recipe;
    });
  }
  else {
    message.channel.send(`No recipes found for \`T${tier}\` Lv. \`${uLevel}\`. 0 length`);
    err = true;
    return;
  }
  if (!foundRecipe) {
    message.channel.send(`No recipes found for \`T${tier}\` Lv. \`${uLevel}\`.`);
    err = true;
    return;
  }
  var isWeapon = foundRecipe.skill == "WOODWORKING" || foundRecipe.skill == "WEAPONSMITHING";
  var isArmour = foundRecipe.skill == "TAILORING" || foundRecipe.skill == "ARMOURING";
  var isAccessory = foundRecipe.skill == "JEWELING";
  var isConsumable = foundRecipe.skill == "COOKING" || foundRecipe.skill == "SCRIBING" || foundRecipe.skill == "ALCHEMISM";

  // assigning correct base stats for each recipe
  if (foundRecipe) {
    var tierMult = 1;
    switch (tier) {
      case 1:
        tierMult = tierOneMatMult;
        break;
      case 2:
        tierMult = tierTwoMatMult;
        break;
      case 3:
        tierMult = tierThreeMatMult;
        break;
    }
  }

  var maxLevel = uLevel;
  if (userIngreds.length > ingredientSlots) {
    message.channel.send(`You requested more slots than allotted at that level. You can only utilize \`${ingredientSlots}\` at level \`${uLevel}\`.`);
    return;
  }

  var errMsg = new Array(userIngreds.length);
  var ingredientArray = new Array(userIngreds.length);
  let perfectMatched = false;
  let perfectMatch;

  userIngreds.forEach((currentIngredient, i) => {
    perfectMatch = undefined;

    // filtering out ingredients that aren't applicable for the recipe's job
    ingredientArray[i] = ingrArr.filter(x => x.skills.includes(foundRecipe.skill));

    // filtering for ingredient name and setting current index to the ingredients found
    ingredientArray[i] = ingredientArray[i].filter(x => {
      let currentName;
      if (x.displayName) currentName = x.displayName;
      else currentName = x.name;

      if (currentName.toLowerCase() == currentIngredient.toLowerCase()) {
        perfectMatched = true;
        perfectMatch = x;
      }
      return currentName.toLowerCase().includes(currentIngredient.toLowerCase());
    });
    // message if no ingredients found
    if (ingredientArray[i].length == 0 || ingredientArray[i] == "") {
      botResponse += `\nNo ingredients found for slot ${i + 1}: \`${currentIngredient}\``;
      err = true;
    }
    // printing list if multiple ingredients found
    else if (ingredientArray[i].length > 1 && !perfectMatch) {
      err = true;
      let matches = ingredientArray[i].length;
      let currArray = ingredientArray[i];
      botResponse += `\n\n**${matches} ingredients found for slot ${i + 1}**: `;
      let k = 0;
      while (botResponse.length < 1900 && k < matches) {
        if (currArray.displayName) botResponse += currArray[k].displayName.slice(0, currArray[k].displayName.length);
        else botResponse += currArray[k].name.slice(0, currArray[k].name.length);
        if (k + 1 < matches) botResponse += ", ";
        else botResponse += ".";
        k++;
      }
      if (botResponse.length > 1900) botResponse = `${botResponse.substring(0, botResponse.length - 2)} **and ${matches - k} more.**`;
    }
    // if user query is that ingredients name it'll use that
    else if (perfectMatch) ingredientArray[i] = perfectMatch;
    // runs if only one ingredient was found, setting it to that ingredient of the array (there is only one index)
    else ingredientArray[i] = ingredientArray[i][0];
  });

  // checking each ingredient and setting the max level
  ingredientArray.forEach((x, i) => {
    if (x.level > maxLevel) maxLevel = x.level;
    if (x.level > foundRecipe.level.maximum) {
      botResponse += (x.displayName) ? `\n\n${x.displayName}` : `\n\n${x.name}`;
      botResponse += ` at slot ${i + 1} is too high level. Max level is ${foundRecipe.level.maximum}.`;
    }
  });
  if (!err) {
    // intializing the effectiveness values for each slot

    var effectiveness = new Array(6).fill(100);
    var leftMod = new Array(6).fill(0);
    var rightMod = new Array(6).fill(0);
    var aboveMod = new Array(6).fill(0);
    var belowMod = new Array(6).fill(0);
    var touchingMod = new Array(6).fill(0);
    var notTouchingMod = new Array(6).fill(0);

    var fireConv = [0, 0, 0, 0, 0, 0];
    var waterConv = [0, 0, 0, 0, 0, 0];
    var airConv = [0, 0, 0, 0, 0, 0];
    var thunderConv = [0, 0, 0, 0, 0, 0];
    var earthConv = [0, 0, 0, 0, 0, 0];

    // setting effectiveness values for each ingredient
    ingredientArray.forEach((x, i) => {
      leftMod[i] = x.ingredientPositionModifiers.left;
      rightMod[i] = x.ingredientPositionModifiers.right;
      aboveMod[i] = x.ingredientPositionModifiers.above;
      belowMod[i] = x.ingredientPositionModifiers.under;
      touchingMod[i] = x.ingredientPositionModifiers.touching;
      notTouchingMod[i] = x.ingredientPositionModifiers.notTouching;

      if (x.identifications.FIREDAMAGECONVERT) fireConv[i] = x.identifications.FIREDAMAGECONVERT.minimum / 100;
      if (x.identifications.WATERDAMAGECONVERT) waterConv[i] = x.identifications.WATERDAMAGECONVERT.minimum / 100;
      if (x.identifications.AIRDAMAGECONVERT) airConv[i] = x.identifications.AIRDAMAGECONVERT.minimum / 100;
      if (x.identifications.THUNDERDAMAGECONVERT) thunderConv[i] = x.identifications.THUNDERDAMAGECONVERT.minimum / 100;
      if (x.identifications.EARTHDAMAGECONVERT) earthConv[i] = x.identifications.EARTHDAMAGECONVERT.minimum / 100;
    });
    // reminder slots are left to right, top to bottom starting at 0 ending at 5

    // top row
    // 1 - 1 left, 2/4 above, 3/4/5 not touching, 1/2 touching
    // 2 - 0 right, 3/5 above, 2/4/5 not touching, 0/3 touching
    effectiveness[0] += leftMod[1] + aboveMod[2] + aboveMod[4] + notTouchingMod[3] + notTouchingMod[4] + notTouchingMod[5] + touchingMod[1] + touchingMod[2];
    effectiveness[1] += rightMod[0] + aboveMod[3] + aboveMod[5] + notTouchingMod[2] + notTouchingMod[4] + notTouchingMod[5] + touchingMod[0] + touchingMod[3];
    // middle row
    // 3 - 3 left, 0 below, 4 above, 1/5 not touching, 0/3/4 touching
    // 4 - 2 right, 1 below, 5 above, 0/4 not touching, 1/2/5 touching
    effectiveness[2] += leftMod[3] + belowMod[0] + aboveMod[4] + notTouchingMod[1] + notTouchingMod[5] + touchingMod[0] + touchingMod[3] + touchingMod[4];
    effectiveness[3] += rightMod[2] + belowMod[1] + aboveMod[5] + notTouchingMod[0] + notTouchingMod[4] + touchingMod[1] + touchingMod[2] + touchingMod[5];
    // bottom row
    // 5 - 5 left, 0/2 below, 0/1/3 not touching, 2/5 touching
    // 6 - 4 right, 1/3 below, 0/1/2 not touching, 3/4 touching
    effectiveness[4] += leftMod[5] + belowMod[0] + belowMod[2] + notTouchingMod[0] + notTouchingMod[1] + notTouchingMod[3] + touchingMod[2] + touchingMod[5];
    effectiveness[5] += rightMod[4] + belowMod[1] + belowMod[3] + notTouchingMod[0] + notTouchingMod[1] + notTouchingMod[2] + touchingMod[3] + touchingMod[4];

    effectiveness[0] /= 100;
    effectiveness[1] /= 100;
    effectiveness[2] /= 100;
    effectiveness[3] /= 100;
    effectiveness[4] /= 100;
    effectiveness[5] /= 100;

    var totalIdentifications = {
      "HEALTHREGEN": {
        "minimum": 0,
        "maximum": 0
      },
      "KNOCKBACK": {
        "minimum": 0,
        "maximum": 0
      },
      "MANAREGEN": {
        "minimum": 0,
        "maximum": 0
      },
      "DAMAGEBONUS": {
        "minimum": 0,
        "maximum": 0
      },
      "SPELLDAMAGE": {
        "minimum": 0,
        "maximum": 0
      },
      "LIFESTEAL": {
        "minimum": 0,
        "maximum": 0
      },
      "MANASTEAL": {
        "minimum": 0,
        "maximum": 0
      },
      "XPBONUS": {
        "minimum": 0,
        "maximum": 0
      },
      "LOOTBONUS": {
        "minimum": 0,
        "maximum": 0
      },
      "LOOT_QUALITY": {
        "minimum": 0,
        "maximum": 0
      },
      "LOOTBONUS": {
        "minimum": 0,
        "maximum": 0
      },
      "REFLECTION": {
        "minimum": 0,
        "maximum": 0
      },
      "THORNS": {
        "minimum": 0,
        "maximum": 0
      },
      "EXPLODING": {
        "minimum": 0,
        "maximum": 0
      },
      "SPEED": {
        "minimum": 0,
        "maximum": 0
      },
      "STAMINA": {
        "minimum": 0,
        "maximum": 0
      },
      "STAMINA_REGEN": {
        "minimum": 0,
        "maximum": 0
      },
      "ATTACKSPEED": {
        "minimum": 0,
        "maximum": 0
      },
      "POISON": {
        "minimum": 0,
        "maximum": 0
      },
      "HEALTHBONUS": {
        "minimum": 0,
        "maximum": 0
      },
      "SOULPOINTS": {
        "minimum": 0,
        "maximum": 0
      },
      "EMERALDSTEALING": {
        "minimum": 0,
        "maximum": 0
      },
      "STRENGTHPOINTS": {
        "minimum": 0,
        "maximum": 0
      },
      "DEXTERITYPOINTS": {
        "minimum": 0,
        "maximum": 0
      },
      "INTELLIGENCEPOINTS": {
        "minimum": 0,
        "maximum": 0
      },
      "AGILITYPOINTS": {
        "minimum": 0,
        "maximum": 0
      },
      "DEFENSEPOINTS": {
        "minimum": 0,
        "maximum": 0
      },
      "HEALTHREGENRAW": {
        "minimum": 0,
        "maximum": 0
      },
      "SPELLDAMAGERAW": {
        "minimum": 0,
        "maximum": 0
      },
      "DAMAGEBONUSRAW": {
        "minimum": 0,
        "maximum": 0
      },
      "FIREDAMAGEBONUS": {
        "minimum": 0,
        "maximum": 0
      },
      "WATERDAMAGEBONUS": {
        "minimum": 0,
        "maximum": 0
      },
      "AIRDAMAGEBONUS": {
        "minimum": 0,
        "maximum": 0
      },
      "THUNDERDAMAGEBONUS": {
        "minimum": 0,
        "maximum": 0
      },
      "EARTHDAMAGEBONUS": {
        "minimum": 0,
        "maximum": 0
      },
      "FIREDEFENSE": {
        "minimum": 0,
        "maximum": 0
      },
      "WATERDEFENSE": {
        "minimum": 0,
        "maximum": 0
      },
      "AIRDEFENSE": {
        "minimum": 0,
        "maximum": 0
      },
      "THUNDERDEFENSE": {
        "minimum": 0,
        "maximum": 0
      },
      "EARTHDEFENSE": {
        "minimum": 0,
        "maximum": 0
      },
      "FIREDAMAGERAW": {
        "minimum": 0,
        "maximum": 0
      },
      "FIREDEFENSERAW": {
        "minimum": 0,
        "maximum": 0
      },
      "FIREDAMAGECONVERT": {
        "minimum": 0,
        "maximum": 0
      },
      "WATERDAMAGERAW": {
        "minimum": 0,
        "maximum": 0
      },
      "WATERDEFENSERAW": {
        "minimum": 0,
        "maximum": 0
      },
      "WATERDAMAGECONVERT": {
        "minimum": 0,
        "maximum": 0
      },
      "AIRDAMAGERAW": {
        "minimum": 0,
        "maximum": 0
      },
      "AIRDEFENSERAW": {
        "minimum": 0,
        "maximum": 0
      },
      "AIRDAMAGECONVERT": {
        "minimum": 0,
        "maximum": 0
      },
      "THUNDERDAMAGERAW": {
        "minimum": 0,
        "maximum": 0
      },
      "THUNDERDEFENSERAW": {
        "minimum": 0,
        "maximum": 0
      },
      "THUNDERDAMAGECONVERT": {
        "minimum": 0,
        "maximum": 0
      },
      "EARTHDAMAGERAW": {
        "minimum": 0,
        "maximum": 0
      },
      "EARTHDEFENSERAW": {
        "minimum": 0,
        "maximum": 0
      },
      "EARTHDAMAGECONVERT": {
        "minimum": 0,
        "maximum": 0
      }
    };
    let recipeIngredients = [' ', ' ', ' ', ' ', ' ', ' '];

    // key names to exclude during display/calculations
    let dontDisplay = ['FIREDAMAGERAW', 'FIREDEFENSERAW', 'FIREDAMAGECONVERT', 'WATERDAMAGERAW', 'WATERDEFENSERAW', 'WATERDAMAGECONVERT', 'AIRDAMAGERAW',
      'AIRDEFENSERAW', 'AIRDAMAGECONVERT', 'THUNDERDAMAGERAW', 'THUNDERDEFENSERAW', 'THUNDERDAMAGECONVERT', 'EARTHDAMAGERAW', 'EARTHDEFENSERAW', 'EARTHDAMAGECONVERT'];
    // iterating through each ID of each ingredient and applying effectiveness
    ingredientArray.forEach((ingredient, i) => {
      if (ingredient.name == "blank") recipeIngredients[i] = " ";
      else if (ingredient.displayName) recipeIngredients[i] = ingredient.displayName;
      else if (ingredient.name) recipeIngredients[i] = ingredient.name;
      let idKeys = Object.keys(ingredient.identifications);
      idKeys.forEach(key => {
        var currMin = ingredient.identifications[key].minimum;
        var currMax = ingredient.identifications[key].maximum;

        // makes sure it's not working with powders
        if (!dontDisplay.includes(key)) {
          // if it's not a powder stat then applies effectiveness to that slot
          currMin = Math.floor(currMin * effectiveness[i]);
          currMax = Math.floor(currMax * effectiveness[i]);
        }

        totalIdentifications[key].minimum += currMin;
        totalIdentifications[key].maximum += currMax;
      });
    });
    recipeIngredients = `[${recipeIngredients[0]}] [${recipeIngredients[1]}]\n[${recipeIngredients[2]}] [${recipeIngredients[3]}]\n[${recipeIngredients[4]}] [${recipeIngredients[5]}]`;
    let identificationsDisplay = "";
    Object.keys(totalIdentifications).forEach(id => {
      if (dontDisplay.includes(id)) return;
      if (totalIdentifications[id].minimum != 0 || totalIdentifications[id].maximum != 0) {
        if (totalIdentifications[id].minimum == totalIdentifications[id].maximum)
          identificationsDisplay += `\n${id}: ${totalIdentifications[id].minimum}`;
        else
          identificationsDisplay += (totalIdentifications[id].maximum > totalIdentifications[id].minimum) ? `\n${id}: ${totalIdentifications[id].minimum} to ${totalIdentifications[id].maximum}` : `\n${id}: ${totalIdentifications[id].maximum} to ${totalIdentifications[id].minimum}`;
      }
    });
    // making the display values look nicer
    var backDisplay = ["KNOCKBACK", "MANAREGEN", "LIFESTEAL", "MANASTEAL", "XPBONUS", "LOOTBONUS",
      "REFLECTION", "THORNS", "EXPLODING", "ATTACKSPEED", "SPEED", "POISON", "HEALTHBONUS", "SOULPOINTS", "EMERALDSTEALING",
      "STRENGTHPOINTS", "DEXTERITYPOINTS", "INTELLIGENCEPOINTS", "AGILITYPOINTS", "DEFENSEPOINTS", "HEALTHREGENRAW",
      "SPELLDAMAGERAW", "DAMAGEBONUSRAW", "FIREDAMAGEBONUS", "WATERDAMAGEBONUS", "AIRDAMAGEBONUS", "THUNDERDAMAGEBONUS",
      "EARTHDAMAGEBONUS", "FIREDEFENSE", "WATERDEFENSE", "AIRDEFENSE", "THUNDERDEFENSE", "EARTHDEFENSE", "DAMAGEBONUS", "SPELLDAMAGE", "HEALTHREGEN",
      "SCRIBING", "JEWELING", "ALCHEMISM", "COOKING", "WEAPONSMITHING", "TAILORING", "WOODWORKING", "ARMOURING", "STAMINA_REGEN", "STAMINA", "LOOT_QUALITY"];

    var frontDisplay = ["Knockback %", "Mana Regen", "Lifesteal", "Mana Steal",
      "XP Bonus", "Loot Bonus", "Reflection", "Thorns", "Exploding", "Attack Speed", "Speed", "Poison", "Health Bonus", "Soul Point Regen",
      "Stealing", "Strength Points", "Dexterity Points", "Intelligence Points", "Agility Points", "Defense Points", "Raw Health Regen",
      "Raw Spell Damage", "Raw Melee Damage", "Fire Damage %", "Water Damage %", "Air Damage %", "Thunder Damage %",
      "Earth Damage %", "Fire Defense %", "Water Defense %", "Air Defense %", "Thunder Defense %", "Earth Defense %", "Melee Damage %", "Spell Damage %", "Health Regen %",
      "Scribing", "Jeweling", "Alchemism", "Cooking", "Weaponsmithing", "Tailoring", "Woodworking", "Armouring", "Spring Regen", "Stamina", "Loot Quality"];

    backDisplay.forEach((x, i) => identificationsDisplay = identificationsDisplay.split(backDisplay[i]).join(frontDisplay[i]));
    if (identificationsDisplay.length < 1) identificationsDisplay = "No identifications";
    // totalling requirements here
    if (!isConsumable) {
      var durabilityCost = 0;
      var strReq = 0;
      var dexReq = 0;
      var intReq = 0;
      var defReq = 0;
      var agiReq = 0;

      slots = (slots > 1) ? `${slots} slots` : `${slots} slot`;

      ingredientArray.forEach((x, i) => {
        strReq += Math.round(x.itemOnlyIDs.strengthRequirement * effectiveness[i]);
        dexReq += Math.round(x.itemOnlyIDs.dexterityRequirement * effectiveness[i]);
        intReq += Math.round(x.itemOnlyIDs.intelligenceRequirement * effectiveness[i]);
        defReq += Math.round(x.itemOnlyIDs.defenceRequirement * effectiveness[i]);
        agiReq += Math.round(x.itemOnlyIDs.agilityRequirement * effectiveness[i]);
        durabilityCost += x.itemOnlyIDs.durabilityModifier / 1000;
      });

      var requirements = `Combat Lv. Min: ${maxLevel}`;
      if (strReq > 0) requirements += `\nStrength Min: ${strReq}`;
      if (dexReq > 0) requirements += `\nDexterity Min: ${dexReq}`;
      if (intReq > 0) requirements += `\nIntelligence Min: ${intReq}`;
      if (defReq > 0) requirements += `\nDefense Min: ${defReq}`;
      if (agiReq > 0) requirements += `\nAgility Min: ${agiReq}`;
    }
    else if (isConsumable) {
      var durationCost = 0;

      ingredientArray.forEach((x, i) => {
        charges += x.consumableOnlyIDs.charges;
        durationCost += x.consumableOnlyIDs.duration;
      });
      charges = `Charges: ${charges}`;
    }

    if (isWeapon) {
      var baseDamage = {
        "Neutral": {
          "damage": 0,
          "min": 0,
          "max": 0
        },
        "Earth": {
          "damage": 0,
          "min": 0,
          "max": 0
        },
        "Thunder": {
          "damage": 0,
          "min": 0,
          "max": 0
        },
        "Water": {
          "damage": 0,
          "min": 0,
          "max": 0
        },
        "Fire": {
          "damage": 0,
          "min": 0,
          "max": 0
        },
        "Air": {
          "damage": 0,
          "min": 0,
          "max": 0
        }
      }
      if (atkSpeed == "SUPERSLOW") var atkSpeedMult = 3.5;
      if (atkSpeed == "VERYSLOW") var atkSpeedMult = 2.5;
      if (atkSpeed == "SLOW") var atkSpeedMult = 1.4;
      if (atkSpeed == "NORMAL") var atkSpeedMult = 1;
      if (atkSpeed == "FAST") var atkSpeedMult = 0.8;
      if (atkSpeed == "VERYFAST") var atkSpeedMult = 0.6;
      if (atkSpeed == "SUPERFAST") var atkSpeedMult = 0.45;

      let avgDmg = (foundRecipe.healthOrDamage.minimum * tierMult + foundRecipe.healthOrDamage.maximum * tierMult) / 2;
      avgDmg *= atkSpeedMult;
      baseDamage.Neutral.damage = avgDmg;
      baseDamage.Fire.damage = (totalIdentifications.FIREDAMAGERAW.minimum + totalIdentifications.FIREDAMAGERAW.maximum) / 2;
      baseDamage.Water.damage = (totalIdentifications.WATERDAMAGERAW.minimum + totalIdentifications.WATERDAMAGERAW.maximum) / 2;
      baseDamage.Air.damage = (totalIdentifications.AIRDAMAGERAW.minimum + totalIdentifications.AIRDAMAGERAW.maximum) / 2;
      baseDamage.Thunder.damage = (totalIdentifications.THUNDERDAMAGERAW.minimum + totalIdentifications.THUNDERDAMAGERAW.maximum) / 2;
      baseDamage.Earth.damage = (totalIdentifications.EARTHDAMAGERAW.minimum + totalIdentifications.EARTHDAMAGERAW.maximum) / 2;

      fireConv.forEach((val, i) => {
        if (fireConv[i] != 0) {
          baseDamage.Fire.damage += baseDamage.Neutral.damage * fireConv[i];
          baseDamage.Neutral.damage = baseDamage.Neutral.damage * (1 - fireConv[i]);
        }
        else if (waterConv[i] != 0) {
          baseDamage.Water.damage += baseDamage.Neutral.damage * waterConv[i];
          baseDamage.Neutral.damage = baseDamage.Neutral.damage * (1 - waterConv[i]);
        }
        else if (airConv[i] != 0) {
          baseDamage.Air.damage += baseDamage.Neutral.damage * airConv[i];
          baseDamage.Neutral.damage = baseDamage.Neutral.damage * (1 - airConv[i]);
        }
        else if (thunderConv[i] != 0) {
          baseDamage.Thunder.damage += baseDamage.Neutral.damage * thunderConv[i];
          baseDamage.Neutral.damage = baseDamage.Neutral.damage * (1 - thunderConv[i]);
        }
        else if (earthConv[i] != 0) {
          baseDamage.Earth.damage += baseDamage.Neutral.damage * earthConv[i];
          baseDamage.Neutral.damage = baseDamage.Neutral.damage * (1 - earthConv[i]);
        }
      });
      var baseDmg = "";
      Object.keys(baseDamage).forEach(x => {
        baseDamage[x].min = Math.round(baseDamage[x].damage * lowerRange);
        baseDamage[x].max = Math.round(baseDamage[x].damage * higherRange);

        if (baseDamage[x].damage != 0) baseDmg += `\n${x} Damage: ${baseDamage[x].min}-${baseDamage[x].max}`;
      });

      var durabilityMin = Math.round(foundRecipe.durability.minimum * tierMult) + durabilityCost;
      var durabilityMax = Math.round(foundRecipe.durability.maximum * tierMult) + durabilityCost;
      if (durabilityMin < 1) durabilityMin = 1;
      if (durabilityMax < 1) durabilityMax = 1;

      var durabilityDisplay = (durabilityMin == durabilityMax) ? `1` : `${durabilityMin} to ${durabilityMax}`;
      const embed = new Discord.RichEmbed().setColor(5451185)
        .setThumbnail("https://cdn.discordapp.com/avatars/483420548156620804/cd145c8296494d1dd75d64a80bfdb123.png")
        .setTitle(`Crafted ${foundRecipe.type.charAt(0)}${foundRecipe.type.substring(1).toLowerCase()}`)
        .setDescription(`${atkSpeed.charAt(0)}${atkSpeed.substring(1).toLowerCase()} Attack Speed\n${slots}\n${baseDmg}\n___`)
        .addField("Requirements: ", `${requirements}\n___`, false)
        .addField("Identifications: ", `${identificationsDisplay}\n___`, false)
        .addField("Durability: ", `${durabilityDisplay}`, false)
        .addField("Recipe: ", `${recipeIngredients}`, false)
        ;
      message.channel.send(embed);
    }
    else if (isArmour) {
      var baseHealth = (foundRecipe.healthOrDamage.minimum * tierMult) + (foundRecipe.healthOrDamage.maximum * tierMult);
      baseHealth = Math.round(baseHealth / 2);

      var baseStats = `Health: ${baseHealth}`;
      let fireDefense = Math.round(totalIdentifications.FIREDEFENSERAW.minimum * armourEleDefMult);
      let waterDefense = Math.round(totalIdentifications.WATERDEFENSERAW.minimum * armourEleDefMult);
      let airDefense = Math.round(totalIdentifications.AIRDEFENSERAW.minimum * armourEleDefMult);
      let thunderdefense = Math.round(totalIdentifications.THUNDERDEFENSERAW.minimum * armourEleDefMult);
      let earthDefense = Math.round(totalIdentifications.EARTHDEFENSERAW.minimum * armourEleDefMult);

      if (fireDefense != 0) baseStats += `\nFire Defense: ${fireDefense}`;
      if (waterDefense != 0) baseStats += `\nWater Defense: ${waterDefense}`;
      if (airDefense != 0) baseStats += `\nAir Defense: ${airDefense}`;
      if (thunderdefense != 0) baseStats += `\nThunder Defense: ${thunderdefense}`;
      if (earthDefense != 0) baseStats += `\nEarth Defense: ${earthDefense}`;

      var durabilityMin = Math.round(foundRecipe.durability.minimum * tierMult) + durabilityCost;
      var durabilityMax = Math.round(foundRecipe.durability.maximum * tierMult) + durabilityCost;
      if (durabilityMin < 1) durabilityMin = 1;
      if (durabilityMax < 1) durabilityMax = 1;

      var durabilityDisplay = (durabilityMin == durabilityMax) ? `1` : `${durabilityMin} to ${durabilityMax}`;

      const embed = new Discord.RichEmbed().setColor(5451185)
        .setThumbnail("https://cdn.discordapp.com/avatars/483420548156620804/cd145c8296494d1dd75d64a80bfdb123.png")
        .setTitle(`Crafted ${foundRecipe.type.charAt(0)}${foundRecipe.type.substring(1).toLowerCase()}`)
        .setDescription(`${slots}\n\n${baseStats}\n___`)
        .addField("Requirements: ", `${requirements}\n___`, false)
        .addField("Identifications: ", `${identificationsDisplay}\n___`, false)
        .addField("Durability: ", `${durabilityDisplay}\n___`, false)
        .addField("Recipe: ", `${recipeIngredients}`, false)
        ;
      message.channel.send(embed);
    }
    else if (isAccessory) {
      var baseStats = ``;
      let fireDefense = Math.round(totalIdentifications.FIREDEFENSERAW.minimum * accessoryEleDefMult);
      let waterDefense = Math.round(totalIdentifications.WATERDEFENSERAW.minimum * accessoryEleDefMult);
      let airDefense = Math.round(totalIdentifications.AIRDEFENSERAW.minimum * accessoryEleDefMult);
      let thunderdefense = Math.round(totalIdentifications.THUNDERDEFENSERAW.minimum * accessoryEleDefMult);
      let earthDefense = Math.round(totalIdentifications.EARTHDEFENSERAW.minimum * accessoryEleDefMult);

      if (fireDefense != 0) baseStats += `\nFire Defense: ${fireDefense}`;
      if (waterDefense != 0) baseStats += `\nWater Defense: ${waterDefense}`;
      if (airDefense != 0) baseStats += `\nAir Defense: ${airDefense}`;
      if (thunderdefense != 0) baseStats += `\nThunder Defense: ${thunderdefense}`;
      if (earthDefense != 0) baseStats += `\nEarth Defense: ${earthDefense}`;

      var durabilityMin = Math.round(foundRecipe.durability.minimum * tierMult) + durabilityCost;
      var durabilityMax = Math.round(foundRecipe.durability.maximum * tierMult) + durabilityCost;
      if (durabilityMin < 1) durabilityMin = 1;
      if (durabilityMax < 1) durabilityMax = 1;

      var durabilityDisplay = (durabilityMin == durabilityMax) ? `1` : `${durabilityMin} to ${durabilityMax}`;
      const embed = new Discord.RichEmbed().setColor(5451185)
        .setThumbnail("https://cdn.discordapp.com/avatars/483420548156620804/cd145c8296494d1dd75d64a80bfdb123.png")
        .setTitle(`Crafted ${foundRecipe.type.charAt(0)}${foundRecipe.type.substring(1).toLowerCase()}`)
        .setDescription(`\n${baseStats}\n___`)
        .addField("Requirements: ", `${requirements}\n___`, false)
        .addField("Identifications: ", `${identificationsDisplay}\n___`, false)
        .addField("Durability: ", `${durabilityDisplay}\n___`, false)
        .addField("Recipe: ", `${recipeIngredients}`, false)
        ;
      message.channel.send(embed);
    }
    else if (isConsumable) {
      var durationMin = Math.round(foundRecipe.duration.minimum * tierMult) + durationCost;
      var durationMax = Math.round(foundRecipe.duration.maximum * tierMult) + durationCost;

      if (durationMin < 10) durabilityMin = 10;
      if (durationMin < 10) durabilityMin = 10;
      if (durationMin > 60) {
        let minutesMin = Math.floor(durationMin / 60);
        let minutesMax = Math.floor(durationMax / 60);

        let secondsMin = durationMin % 60;
        let secondsMax = durationMax % 60;

        durationMin = `${minutesMin} mins, ${secondsMin} secs`;
        durationMax = `${minutesMax} mins, ${secondsMax} secs`;
      }
      else {
        durationMin = `${durationMin}s`;
        durationMax = `${durationMax}s`;
      }
      var durationDisplay = (durationMin == durationMax) ? `10` : `Duration: \`${durationMin}\` to \`${durationMax}\` `;
      const embed = new Discord.RichEmbed().setColor(5451185)
        .setThumbnail("https://cdn.discordapp.com/avatars/483420548156620804/cd145c8296494d1dd75d64a80bfdb123.png")
        .setTitle(`Crafted ${foundRecipe.type.charAt(0)}${foundRecipe.type.substring(1).toLowerCase()}`)
        .setDescription(`\n${durationDisplay}\n${charges}\n___`)
        .addField("Identifications: ", `${identificationsDisplay}\n___`, false)
        .addField("Recipe: ", `${recipeIngredients}`, false)
        ;
      message.channel.send(embed);
    }
  }
  if (botResponse.length > 0 && botResponse.length < 2000) message.channel.send(botResponse);
  else if (botResponse.length > 2000) message.channel.send("\`Err\`: Message length greater than 2,000.");
}
module.exports.help = {
  commandName: "craft"
}
