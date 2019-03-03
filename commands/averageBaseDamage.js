const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args) => {

  if (args[0]) var level = parseInt(args[0]);
  if (args[1]) var rarity = args[1].toString();
  if (args[2]) var weaponType = args[2].toString();
  if (args[3]) var atkSpeed = args[3].toString();

  var userNumbers = args;

  var evenCheck = args.length % 2;
  var average = 0;
  var total = 0;

  if (evenCheck === 1) {
      for (i = 1; i < args.length; i++) {
          total += parseInt(userNumbers[i]);
      } // End for loop
      average = total / 2.0;
      message.channel.send("The total of averages of these numbers is: " + average);
  } // End if statement
  else
      message.channel.send("Please input an even number of numbers.");


module.exports.help = {
  commandName: "a"
}
