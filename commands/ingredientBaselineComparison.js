const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args, botFiles) => {

  var ingrStats = [ "HEALTHREGEN", "KNOCKBACK", "MANAREGEN", "DAMAGEBONUS", "SPELLDAMAGE", "LIFESTEAL", "MANASTEAL", "XPBONUS", "LOOTBONUS",
  "REFLECTION", "THORNS", "EXPLODING", "SPEED", "ATTACKSPEED", "POISON", "HEALTHBONUS", "SOULPOINTS", "EMERALDSTEALING",
  "STRENGTHPOINTS", "DEXTERITYPOINTS", "INTELLIGENCEPOINTS", "AGILITYPOINTS", "DEFENSEPOINTS", "HEALTHREGENRAW",
  "SPELLDAMAGERAW", "DAMAGEBONUSRAW", "FIREDAMAGEBONUS", "WATERDAMAGEBONUS", "AIRDAMAGEBONUS", "THUNDERDAMAGEBONUS",
  "EARTHDAMAGEBONUS", "FIREDEFENSE", "WATERDEFENSE", "AIRDEFENSE", "THUNDERDEFENSE", "EARTHDEFENSE", "FIREDAMAGERAW",
  "WATERDAMAGERAW", "AIRDAMAGERAW", "THUNDERDAMAGERAW", "EARTHDAMAGERAW", "FIREDAMAGECONVERT", "WATERDAMAGECONVERT", "AIRDAMAGECONVERT",
  "THUNDERDAMAGECONVERT", "EARTHDAMAGECONVERT", "FIREDEFENSERAW", "WATERDEFENSERAW", "AIRDEFENSERAW", "THUNDERDEFENSERAW", "EARTHDEFENSERAW"];

  var ingrDisplay = [ "Health Regen %", "Knockback %", "Mana Regen", "Melee Damage %", "Spell Damage %", "Lifesteal", "Mana Steal",
  "XP Bonus", "Loot Bonus", "Reflection", "Thorns", "Exploding", "Speed", "Attack Speed", "Poison", "Health Bonus", "Soul Point Regen",
  "Stealing", "Strength Points", "Dexterity Points", "Intelligence Points", "Agility Points", "Defense Points", "Raw Health Regen",
  "Raw Spell Damage", "Raw Melee Damage", "Fire Damage %", "Water Damage %", "Air Damage %", "Thunder Damage %",
  "Earth Damage %", "Fire Defense %", "Water Defense %", "Air Defense %", "Thunder Defense %", "Earth Defense %", "Raw Fire Damage",
  "Raw Water Damage", "Raw Air Damage", "Raw Thunder Damage", "Raw Earth Damage", "Fire Damage % Convert", "Water Damage % Convert", "Air Damage % Convert",
  "Thunder Damage % Convert", "Earth Damage % Convert", "Raw Fire Defense", "Raw Water Defense", "Raw Air Defense", "Raw Thunder Defense", "Raw Earth Defense"];

var userQuery = message.content.substring(botFiles.prefix.length + module.exports.help.commandName.length + 1, message.length);
let ingrArr = Array.from(botFiles.ingredients);
let ingNames = Array.from(botFiles.ingredientNames);
let matchedIngs = new Array(ingrArr.length);
let matches = 0;
let botResponse = "";
let perfectMatched = false;
let perfectMatch;
for (var i = 0; i < ingNames.length; i++) {
  if (ingNames[i].toString().toLowerCase().includes(userQuery.toLowerCase()) ) {
    matchedIngs[matches] = i;
    matches++;
  }
    if (ingNames[i].toString().toLowerCase().slice(0, ingNames[i][0].length) == userQuery.toLowerCase() ) {
      perfectMatched = true;
      perfectMatch = i;
    }
}

if (matches <= 0) botResponse = "No ingredients found.";
else if (matches > 1 && !perfectMatched) {
  botResponse = `**${matches} ingredients found**: `;
  let i = 0;
    while (botResponse.length < 1900 && i < matches) {
      botResponse += ingNames[matchedIngs[i]].slice(0, ingNames[matchedIngs[i]].length-1);
      if (i + 1 < matches) botResponse += ", ";
      else botResponse += ".";
      i++;
    }
    if (botResponse.length > 1900) message.channel.send(`${botResponse.substring(0, botResponse.length-2)} **and ${matches - i} more.**`);
    else message.channel.send(botResponse);
}

else {
  let foundIngr;
  if (perfectMatched) foundIngr = ingrArr[perfectMatch][0];
  else foundIngr = ingrArr[matchedIngs[0]][0];

  let identifications = Object.keys(foundIngr.identifications);
  let priorityJob = "";
  let jobsKeys = Object.keys(foundIngr.skills);
  if (jobsKeys.length == 1) priorityJob = foundIngr.skills[0];
  else priorityJob = fnc.sortJobs(foundIngr.skills);

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

  botResponse += `Lv. ${foundIngr.level}, `;
  for (var i = 0; i < foundIngr.skills.length; i++) {
    botResponse += foundIngr.skills[i].charAt(0) + foundIngr.skills[i].substring(1, foundIngr.skills[i].length).toLowerCase();
    if (i + 1 < foundIngr.skills.length) botResponse += ", ";
    else botResponse += "\n";
  }

  let durability = foundIngr.itemOnlyIDs.durabilityModifier;
  let duration = foundIngr.consumableOnlyIDs.duration;
  let charges = foundIngr.consumableOnlyIDs.charges;
  var atkSpeedMod;
  if (foundIngr.itemOnlyIDs.attackSpeedModifier) atkSpeedMod = foundIngr.itemOnlyIDs.attackSpeedModifier;
  var powderSlotMod;
  if (foundIngr.itemOnlyIDs.powderSlotModifier) powderSlotMod = foundIngr.itemOnlyIDs.attackSpeedModifier;

  // lifesteal > poison > health bonus > health regen > spell damage > melee damage
  if (foundIngr.identifications.LIFESTEAL) {
    let baselineLifesteal = fnc.calcIngLifeSteal(foundIngr.level, foundIngr.tier, priorityJob);
    let lifestealMin = foundIngr.identifications.LIFESTEAL.minimum;
    let lifestealMax = foundIngr.identifications.LIFESTEAL.maximum;
    let lifestealComparison = ((lifestealMax/baselineLifesteal) * 100).toFixed(2);
    botResponse += `\n- Lifesteal: ${lifestealMin} to ${lifestealMax} \[${baselineLifesteal} | ${lifestealComparison}%\]`;
  }
  if (foundIngr.identifications.POISON) {
    let baselinePoison = fnc.calcIngPoison(foundIngr.level, foundIngr.tier, priorityJob);
    let poisonMin = foundIngr.identifications.POISON.minimum;
    let poisonMax = foundIngr.identifications.POISON.maximum;
    let poisonComparison = ((poisonMax/baselinePoison) * 100).toFixed(2);
    botResponse += `\n- Poison: ${poisonMin} to ${poisonMax} \[${baselinePoison} | ${poisonComparison}%\]`;
  }
  if (foundIngr.identifications.HEALTHBONUS) {
    let baselineHealth = fnc.calcIngHealth(foundIngr.level, foundIngr.tier, priorityJob);
    let healthMin = foundIngr.identifications.HEALTHBONUS.minimum;
    let healthMax = foundIngr.identifications.HEALTHBONUS.maximum;
    let healthComparison = ((healthMax/baselineHealth) * 100).toFixed(2);
    botResponse += `\n- Health Bonus: ${healthMin} to ${healthMax} \[${baselineHealth} | ${healthComparison}%\]`;
  }
  if (foundIngr.identifications.HEALTHREGENRAW) {
    let baselineHealthRegen = fnc.calcIngHealthRegen(foundIngr.level, foundIngr.tier, priorityJob);
    let regenMin = foundIngr.identifications.HEALTHREGENRAW.minimum;
    let regenMax = foundIngr.identifications.HEALTHREGENRAW.maximum;
    let regenComparison = ((regenMax/baselineHealthRegen) * 100).toFixed(2);
    botResponse += `\n- Health Regen: ${regenMin} to ${regenMax} \[${baselineHealthRegen} | ${regenComparison}%\]`;
  }
  if (foundIngr.identifications.SPELLDAMAGERAW) {
    let baselineRawSpell = fnc.calcIngRawSpell(foundIngr.level, foundIngr.tier, priorityJob);
    let rawSpellMin = foundIngr.identifications.SPELLDAMAGERAW.minimum;
    let rawSpellMax = foundIngr.identifications.SPELLDAMAGERAW.maximum;
    let rawSpellComparison = ((rawSpellMax/baselineRawSpell) * 100).toFixed(2);
    botResponse += `\n- Raw Spell: ${rawSpellMin} to ${rawSpellMax} \[${baselineRawSpell} | ${rawSpellComparison}%\]`;
  }
  if (foundIngr.identifications.DAMAGEBONUSRAW) {
    let baselineRawMelee = fnc.calcIngRawMelee(foundIngr.level, foundIngr.tier, priorityJob);
    let rawMeleeMin = foundIngr.identifications.DAMAGEBONUSRAW.minimum;
    let rawMeleeMax = foundIngr.identifications.DAMAGEBONUSRAW.maximum;
    let rawMeleeComparison = ((rawMeleeMax/baselineRawMelee) * 100).toFixed(2);
    botResponse += `\n- Raw Melee: ${rawMeleeMin} to ${rawMeleeMax} \[${baselineRawMelee} | ${rawMeleeComparison}%\]`;
  }
  botResponse += `\n`;
  if (foundIngr.skills.includes("ARMOURING") || foundIngr.skills.includes("TAILORING") || foundIngr.skills.includes("WOODWORKING")
   || foundIngr.skills.includes("WEAPONSMITHING")  || foundIngr.skills.includes("JEWELING") || foundIngr.skills.includes("TAILORING")) {
     let baselineDurability = fnc.durability(foundIngr.level, foundIngr.tier);
     let durability = foundIngr.itemOnlyIDs.durabilityModifier/1000;
     let durabilityComparison = ((durability/baselineDurability) * 100).toFixed(2);
     botResponse += `\n- Durability: ${durability} \[${baselineDurability} | ${durabilityComparison}%\]`;
  }
  if (foundIngr.skills.includes("COOKING")) {
    let baselineDuration = Math.round(fnc.duration(foundIngr.level, foundIngr.tier) * 30)/10;
    let duration = foundIngr.consumableOnlyIDs.duration;
    let durationComparison = ((duration/baselineDuration) * 100).toFixed(2);
    botResponse += `\n- Duration: ${duration} \[${baselineDuration} | ${durationComparison}%\]`;
  }
  else if (foundIngr.skills.includes("ALCHEMISM") || foundIngr.skills.includes("SCRIBING")) {
     let baselineDuration = fnc.duration(foundIngr.level, foundIngr.tier);
     let duration = foundIngr.consumableOnlyIDs.duration;
     let durationComparison = ((duration/baselineDuration) * 100).toFixed(2);
     botResponse += `\n- Duration: ${duration} \[${baselineDuration} | ${durationComparison}%\]`;
  }

message.channel.send(botResponse);
} // end else statement

}
module.exports.help = {
  commandName: "inb"
}
