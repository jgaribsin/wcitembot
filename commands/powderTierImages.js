const Discord = require("discord.js");
const { Client, Attachment } = require('discord.js');
var fnc = require("./functions");
module.exports.run = async (client, prefix, ingredients, message, args) => {

  if (args[0]) var level = parseInt(args[0]);
  if (args[1]) var rarity = args[1].toString();
  if (args[2]) var weaponType = args[2].toString();
  if (args[3]) var atkSpeed = args[3].toString();

  switch (level) {
      case 1:
          const powders1 = new Attachment("https://i.imgur.com/XxGqDPo.png");
          message.channel.send(powders1);
          break;
      case 2:
          const powders2 = new Attachment("https://i.imgur.com/sDUIZOU.png");
          message.channel.send(powders2);
          break;
      case 3:
          const powders3 = new Attachment("https://i.imgur.com/pKJog9M.png");
          message.channel.send(powders3);
          break;
      case 4:
          const powders4 = new Attachment("https://i.imgur.com/zF7Y4cC.png");
          message.channel.send(powders4);
          break;
      case 5:
          const powders5 = new Attachment("https://i.imgur.com/5nbNhMv.png");
          message.channel.send(powders5);
          break;
      case 6:
          const powders6 = new Attachment("https://i.imgur.com/KTVFcw9.png");
          message.channel.send(powders6);
          break;
  }

}

module.exports.help = {
  commandName: "powder"
}
