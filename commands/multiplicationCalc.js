const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, prefix, ingredients, ingredientNames, commands, items, message, args) => {

  var userNumbers = args;
  var returnValue = 1;
  var returnText = "The product of ";
  args.forEach(number => {
    returnValue *= number;
    if (args.indexOf(number) == args.length - 1) returnText += `and \`${number}\` `;
    else if (args.indexOf(number) == 0) returnText += `\`${number}\``;
    else returnText += `, \`${number}\` `;
  });
  returnText += `is: ${returnValue}`;
  message.channel.send(returnText);

}

module.exports.help = {
  commandName: "m"
}
