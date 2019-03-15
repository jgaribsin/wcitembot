const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, prefix, ingredients, ingredientNames, message, args) => {

var userNumbers = args;
var average = 0;
var total = 0;

for (i = 0; i < userNumbers.length; i++) {
  total += parseInt(userNumbers[i]);
} // end for loop

average = total / userNumbers.length;

message.channel.send("Average of these numbers is: " + average);

}
module.exports.help = {
  commandName: "av"
}
