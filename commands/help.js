const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args, botFiles) => {

const embed = new Discord.RichEmbed()
.setTitle("wcitembot command list: ")
.setColor(5451185)
.setThumbnail("https://cdn.discordapp.com/avatars/483420548156620804/cd145c8296494d1dd75d64a80bfdb123.png")

.setDescription(`\nInformation\n- Prefix: \`${botFiles.prefix}\`\n- Mandatory Params: \`<>\`\n- Optional Params: \`[]\`\n\n__**Full Command List**__ `)

.addField("Damage Baseline", "`.damage <level> <rarity> <itemType> <attackSpeed>`", false)
.addField("Health Baseline", "`Items: .health <it> <level> <tier> [itemType]`\n`Ingredients: .health <in> <level> <tier> [profession]`", false)
.addField("Lifesteal Baseline", "`Items: .ls <it> <level> <tier>  [itemType]`\n`Ingredients: .ls <in> <level> <tier> [profession]`", false)
.addField("Poison Baseline", "`Items: .poison <it> <level> <tier>  [itemType] [poisonMultiplier]`\n`Ingredients: .poison <in> <level> <tier> [profession]`", false)
.addField("Raw Regen Baseline", "`Items: .hr <it> <level> <tier>  [itemType]`\n`Ingredients: .hr <in> <level> <tier> [profession]`", false)
.addField("Raw Melee Baseline", "`Weapons: .rm <it> <level> <tier>  <weaponType> <attackSpeed>`\n`Armours/Accessories: .rm <it> <level> <tier>  [itemType]`\n`Ingredients: .rm <in> <level> <tier> [profession]`", false)
.addField("Raw Spell Baseline", "`Items: .rs <it> <level> <tier>  [itemType]`\n`Ingredients: .rs <in> <level> <tier> [profession]`", false)

.addField("Durability & Duration Baseline", "`.dura <level> <tier>`", false)
.addField("Ingredient Baseline", "`.inb <ingredientName>`", false)
.addField("Ingredient Lookup", "`.in <ingredientName>`", false)
.addField("Item Baseline", "`.itb <itemName>`", false)
.addField("Item Lookup", "`.it <itemName>`", false)
.addField("Tier Multiplier", "`.mult <level> <rarity>`", false)
.addField("Powder Stats", "`.powder <tier>`", false)
.addField("Recipe Stats", "`.recipe <level> <tier> <itemType>`", false)

// .addBlankField(true)

.addField("Average Base Damage", "`.a <first1> <first2> [second1] [second2] ...`", false)
.addField("Average Calculation", "`.av <n1> <n2> [n3] [n4] ...`", false)
.addField("Division Calculation", "`.d <n1> <n2>`", false)
.addField("Multiplication Calculation", "`.m <n1> <n2> [n3] [n4] ...`", false)
.addField("Percentage Calculation", "`.% <n1> <n2>`", false)
.addField("Submission Score Calculation", "`.score <fives> <fours> <threes> <twos> <ones>`", false)

.setFooter(`made by Major#1005`)
.setTimestamp()
;

message.channel.send(embed);
}

module.exports.help = {
  commandName: "help"
}
