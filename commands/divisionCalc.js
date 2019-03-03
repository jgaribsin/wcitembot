const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args) => {

  var userNumbers = args;

  if (userNumbers.length !== 3)
      message.channel.send("Please input two numbers.");
  else
      message.channel.send("The product of `" + args[1] + "` and `" + args[2] + "` is: " + (args[1] * args[2]));

}

module.exports.help = {
  commandName: "d"
}
