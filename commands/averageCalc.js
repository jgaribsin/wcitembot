const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args, botFiles) => {

var userNumbers = args;
var average = 0;
var total = 0;

userNumbers.forEach(x => {
  total += parseInt(x);
});

average = total / userNumbers.length;

message.channel.send("Average of these numbers is: " + average);

}
module.exports.help = {
  commandName: "av"
}
