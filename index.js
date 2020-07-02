require('dotenv').config();

let discord = require('discord.js');
let globals = require('./globals.js');
let votekick = require('./votekick.js');
let client = new discord.Client();

client.on('ready', function() {

  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', function(message) {

  if (message.content.startsWith('!votekick')) {

    console.log('votekick attempted.');
    votekick.handleVoteKick(client, message);
    return;
  }

  // if (message.content.startsWith('!setstream')) {
  //
  //   console.log('setstream attempted.');
  //   stream.handleSetStream(message);
  //   return;
  // }
});

client.login(process.env.TOKEN);
