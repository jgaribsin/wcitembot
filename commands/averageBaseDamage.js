const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, prefix, ingredients, ingredientNames, message, args) => {

var userNumbers = args;

if ( (userNumbers.length % 2) == 1) message.channel.send("Please input an even number of numbers.");

var evenCheck = args.length % 2;
var average = 0;
var total = 0;

for (i = 0; i < args.length; i++) {
  total += parseInt(userNumbers[i]);
}
  average = total / 2.0;
  message.channel.send("Average of these numbers is: " + average);

}
module.exports.help = {
  commandName: "a"
}
