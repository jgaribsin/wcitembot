const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args, botFiles) => {

  var userNumbers = args;

  if (userNumbers.length !== 2)
      message.channel.send("Please input two numbers.");
  else
      message.channel.send("The quotient of `" + args[0] + "` and `" + args[1] + "` is: " + (args[0] / args[1]));

}

module.exports.help = {
  commandName: "d"
}
