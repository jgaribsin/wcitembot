const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args, botFiles) => {

  var userNumbers = args;

  if ((userNumbers.length % 2) == 1) message.channel.send("Please input an even number of numbers.");
  else {
    var average = 0;
    var total = 0;

    userNumbers.forEach(x => {
      total += parseInt(x);
    });

    average = total / 2.0;
    message.channel.send("Total average of these pairs is: " + average);
  }

}
module.exports.help = {
  commandName: "a"
}
