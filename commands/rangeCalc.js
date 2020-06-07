const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, message, args, botFiles) => {

  var userNumbers = args;

  if (userNumbers.length !== 1)
    message.channel.send("Please input one number.");

  else if (userNumbers == 1 || userNumbers == -1)
    // message.channel.send(`The ${(userNumbers == 1) ? "positive" : "negative"} range of \`${userNumbers}\` is: \`${userNumbers}\` to \`${userNumbers}\``);
    message.channel.send(`Base \`${userNumbers}\` has no range. It is always \`${userNumbers}\`.`);

  else if (userNumbers == 0)
    message.channel.send(`are u an idiot`)

  else if (userNumbers > 0) {
    let minimumValue = Math.round(userNumbers * 0.3);
    let maximumValue = Math.round(userNumbers * 1.3);
    let maxRoll = (1.30 - ((maximumValue - 0.5) / userNumbers)) / 1.01;

    // message.channel.send(`The positive range of \`${userNumbers}\` is: \`${minimumValue}\` to \`${maximumValue}\` (${(maxRoll * 100).toFixed(2)}%)`);
    message.channel.send(`The positive range of \`${userNumbers}\` is: \`${minimumValue}\` to \`${maximumValue}\``);
  }
  else if (userNumbers < 0) {
    let minimumValue = Math.round(userNumbers * 1.3);
    let maximumValue = Math.round(userNumbers * 0.7);
    let maxRoll = (0.60 + ((maximumValue - 0.5) / userNumbers)) / 0.61;

    // message.channel.send(`The negative range of \`${userNumbers}\` is: \`${minimumValue}\` to \`${maximumValue}\` (${(maxRoll * 100).toFixed(2)}%)`);
    message.channel.send(`The negative range of \`${userNumbers}\` is: \`${minimumValue}\` to \`${maximumValue}\``);
  }

}

module.exports.help = {
  commandName: "someonewillneverguessthislol"
}
