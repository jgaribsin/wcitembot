const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args, botFiles) => {

  var userNumbers = args;

      message.channel.send(`You can fuck a ${args[0]/2 + 7} y/o.`);

}

module.exports.help = {
  commandName: "fuck"
}
