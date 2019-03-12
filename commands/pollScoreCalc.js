const Discord = require("discord.js");
var fnc = require("./functions");
module.exports.run = async (client, prefix, ingredients, message, args) => {

  var votesFive = args[0] - 1;
  var votesFour = args[1] - 1;
  var votesThree = args[2] - 1;
  var votesTwo = args[3] - 1;
  var votesOne = args[4] - 1;

  var total = 0;
  var votes = 0;
  votes += votesFive;
  votes += votesFour;
  votes += votesThree;
  votes += votesTwo;
  votes += votesOne;

  for (i = 0; i < votesFive ; i++) {
    total += 5;
  }
  for (i = 0; i < votesFour ; i++) {
    total += 4;
  }
  for (i = 0; i < votesThree ; i++) {
    total += 3;
  }
  for (i = 0; i < votesTwo ; i++) {
    total += 2;
  }
  for (i = 0; i < votesOne ; i++) {
    total += 1;
  }
  var average = total / votes;
  var roundedAvg = Math.round(average*100)/100;
  message.channel.send("Average of `" + votesFive + " 5s`, `" + votesFour + " 4s`, `"  + votesThree + " 3s`, `"  + votesTwo + " 2s` and `"  + votesOne + " 1s `"  + " is: " + roundedAvg);

}

module.exports.help = {
  commandName: "poll"
}
