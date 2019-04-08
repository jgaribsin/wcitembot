const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, prefix, ingredients, ingredientNames, commands, items, message, args) => {

  var ingrStats = [ "HEALTHREGEN", "KNOCKBACK", "MANAREGEN", "DAMAGEBONUS", "SPELLDAMAGE", "LIFESTEAL", "MANASTEAL", "XPBONUS", "LOOTBONUS",
  "REFLECTION", "THORNS", "EXPLODING", "SPEED", "ATTACKSPEED", "POISON", "HEALTHBONUS", "SOULPOINTS", "EMERALDSTEALING",
  "STRENGTHPOINTS", "DEXTERITYPOINTS", "INTELLIGENCEPOINTS", "AGILITYPOINTS", "DEFENSEPOINTS", "HEALTHREGENRAW",
  "SPELLDAMAGERAW", "DAMAGEBONUSRAW", "FIREDAMAGEBONUS", "WATERDAMAGEBONUS", "AIRDAMAGEBONUS", "THUNDERDAMAGEBONUS",
  "EARTHDAMAGEBONUS", "FIREDEFENSE", "WATERDEFENSE", "AIRDEFENSE", "THUNDERDEFENSE", "EARTHDEFENSE"];

  var ingrDisplay = [ "Health Regen %", "Knockback %", "Mana Regen", "Melee Damage %", "Spell Damage %", "Lifesteal", "Mana Steal",
  "XP Bonus", "Loot Bonus", "Reflection", "Thorns", "Exploding", "Speed", "Attack Speed", "Poison", "Health Bonus", "Soul Point Regen",
  "Stealing", "Strength Points", "Dexterity Points", "Intelligence Points", "Agility Points", "Defense Points", "Raw Health Regen",
  "Raw Spell Damage", "Raw Melee Damage", "Fire Damage %", "Water Damage %", "Air Damage %", "Thunder Damage %",
  "Earth Damage %", "Fire Defense %", "Water Defense %", "Air Defense %", "Thunder Defense %", "Earth Defense %"];

var userQuery = message.content.substring(prefix.length + module.exports.help.commandName.length + 1, message.length);
let ingrArr = Array.from(ingredients);
let ingNames = Array.from(ingredientNames);
let matchedIngs = new Array(ingrArr.length);
let count = 0;
let botResponse = "";
let perfectMatched = false;
let perfectMatch;
for (var i = 0; i < ingNames.length; i++) {
  if (ingNames[i].toString().toLowerCase().includes(userQuery.toLowerCase()) ) {
    matchedIngs[count] = i;
    count++;
  }
    if (ingNames[i].toString().toLowerCase().slice(0, ingNames[i][0].length) == userQuery.toLowerCase() ) {
      perfectMatched = true;
      perfectMatch = i;
    }
}

if (count > 1 && !perfectMatched) {
  botResponse = `${count} ingredients found: `;

  for (i = 0; i < count; i++) {
    botResponse += ingNames[matchedIngs[i]].slice(0, ingNames[matchedIngs[i]].length-1);
    if (i + 1 < count) botResponse += ", ";
    else botResponse += ".";
    }
}
else if (count <= 0) botResponse = "No ingredients found.";
else {
  let foundIngr;
  if (perfectMatched) foundIngr = ingrArr[perfectMatch][0];
  else foundIngr = ingrArr[matchedIngs[0]][0];
  let keys = Object.keys(foundIngr.identifications);
  if (foundIngr.displayName) botResponse += `**${foundIngr.displayName}** ` ;
  else botResponse += `**${foundIngr.name}** ` ;
  switch (foundIngr.tier) {
    case 0:
      botResponse += "☆☆☆\n";
      break;
    case 1:
      botResponse += "★☆☆\n";
      break;
    case 2:
      botResponse += "★★☆\n";
      break;
    case 3:
      botResponse += "★★★\n";
      break;
  }
  for (var i = 0; i < foundIngr.skills.length; i++) {
    botResponse += foundIngr.skills[i].charAt(0) + foundIngr.skills[i].substring(1, foundIngr.skills[i].length).toLowerCase();
    if (i + 1 < foundIngr.skills.length) botResponse += ", ";
    else botResponse += "\n";
  }


  let strengthReq = foundIngr.itemOnlyIDs.strengthRequirement != 0;
  let dexterityReq = foundIngr.itemOnlyIDs.dexterityRequirement != 0;
  let intelligenceReq = foundIngr.itemOnlyIDs.intelligenceRequirement != 0;
  let defenceReq = foundIngr.itemOnlyIDs.defenceRequirement != 0;
  let agilityReq = foundIngr.itemOnlyIDs.agilityRequirement != 0;

  let leftMod = foundIngr.ingredientPositionModifiers.left != 0;
  let rightMod = foundIngr.ingredientPositionModifiers.right != 0;
  let aboveMod = foundIngr.ingredientPositionModifiers.above != 0;
  let underMod = foundIngr.ingredientPositionModifiers.under != 0;
  let touchingMod = foundIngr.ingredientPositionModifiers.touching != 0;
  let notTouchingMod = foundIngr.ingredientPositionModifiers.notTouching != 0;

  let durability = foundIngr.itemOnlyIDs.durabilityModifier != 0;
  let duration = foundIngr.consumableOnlyIDs.duration != 0;
  let charges = foundIngr.consumableOnlyIDs.charges != 0;
  var atkSpeedMod = false;
  if (foundIngr.itemOnlyIDs.attackSpeedModifier) atkSpeedMod = foundIngr.itemOnlyIDs.attackSpeedModifier != 0;
  var powderSlotMod = false;
  if (foundIngr.itemOnlyIDs.powderSlotModifier) powderSlotMod = foundIngr.itemOnlyIDs.attackSpeedModifier != 0;

  botResponse += "\n**Requirements**\n";
  botResponse += `Level: ${foundIngr.level}\n`;
  if (strengthReq || dexterityReq || intelligenceReq || defenceReq || agilityReq) {
    if (strengthReq) botResponse += "- Strength: " + foundIngr.itemOnlyIDs.strengthRequirement + "\n";
    if (dexterityReq) botResponse += "- Dexterity: " + foundIngr.itemOnlyIDs.dexterityRequirement + "\n";
    if (intelligenceReq) botResponse += "- Intelligence: " + foundIngr.itemOnlyIDs.intelligenceRequirement + "\n";
    if (defenceReq) botResponse += "- Defence: " + foundIngr.itemOnlyIDs.defenceRequirement + "\n";
    if (agilityReq) botResponse += "- Agility: " + foundIngr.itemOnlyIDs.agilityRequirement + "\n";
  }

  if (leftMod || rightMod || aboveMod || underMod || touchingMod || notTouchingMod) {
    botResponse += "\n**Position Modifiers**\n";
    if (leftMod) botResponse += "- Left: " + foundIngr.ingredientPositionModifiers.left + "\n";
    if (rightMod) botResponse += "- Right: " + foundIngr.ingredientPositionModifiers.right + "\n";
    if (aboveMod) botResponse += "- Above: " + foundIngr.ingredientPositionModifiers.above + "\n";
    if (underMod) botResponse += "- Under: " + foundIngr.ingredientPositionModifiers.under + "\n";
    if (touchingMod) botResponse += "- Touching: " + foundIngr.ingredientPositionModifiers.touching + "\n";
    if (notTouchingMod) botResponse += "- Not Touching: " + foundIngr.ingredientPositionModifiers.notTouching + "\n";
  }

  if (keys.length > 0) botResponse += "\n**Identifications**\n";
  for (var i = 0; i < ingrStats.length; i++) {
    for (var j = 0; j < keys.length; j++) {
      if (keys[j] == ingrStats[i]) {
        botResponse += "- " + ingrDisplay[i] + ": ";
        if (foundIngr.identifications[keys[j]].minimum == foundIngr.identifications[keys[j]].maximum)
        botResponse += foundIngr.identifications[keys[j]].minimum;
        else botResponse += foundIngr.identifications[keys[j]].minimum + " to " + foundIngr.identifications[keys[j]].maximum;
        botResponse += "\n";
      }
    }
  }
  botResponse += "\n**Effects**\n";
  if (foundIngr.skills.includes("ARMOURING") || foundIngr.skills.includes("TAILORING") || foundIngr.skills.includes("WOODWORKING")
   || foundIngr.skills.includes("WEAPONSMITHING")  || foundIngr.skills.includes("JEWELING") || foundIngr.skills.includes("TAILORING"))
    botResponse += "- Durability: " + foundIngr.itemOnlyIDs.durabilityModifier/1000 + "\n";
  if (foundIngr.skills.includes("ALCHEMISM") || foundIngr.skills.includes("SCRIBING") || foundIngr.skills.includes("COOKING"))
    botResponse += "- Duration: " + foundIngr.consumableOnlyIDs.duration + "\n"
  if (charges) botResponse += "- Charges: " + foundIngr.consumableOnlyIDs.charges + "\n";
  if (atkSpeedMod) botResponse += "- Attack Speed Modifier: " + foundIngr.itemOnlyIDs.attackSpeedModifier + "\n";
  if (powderSlotMod) botResponse += "- Powder Slot Modifier: " + foundIngr.itemOnlyIDs.powderSlotModifier + "\n";
} // end else statement

if (botResponse.length > 0) message.channel.send(botResponse);
}
module.exports.help = {
  commandName: "in"
}
