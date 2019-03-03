const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args) => {

  if (args[0]) var level = parseInt(args[0]);
  if (args[1]) var rarity = args[1].toString();
  if (args[2]) var weaponType = args[2].toString();
  if (args[3]) var atkSpeed = args[3].toString();

  var userNumbers = args;
  var average = 0;
        var total = 0;
  var count = 0;

  for (i = 1; i < userNumbers.length; i++) {
                total += parseInt(userNumbers[i]);
      count++;
  } // end for loop
  average = total / count;
        message.channel.send("Average of these numbers is: " + average);


module.exports.help = {
  commandName: "av"
}
