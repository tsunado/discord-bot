const discord = require('discord.js');
const globals = require('./globals.js');
const client = new discord.Client();

const token = 'NzI2MjcyNDg0ODAyMDM1ODIz.Xvd35g.I77fRxs4ZgUgZ-po0VdmO7Y6MgM';

client.on('ready', function() {

  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', function(message) {

  if (message.content.startsWith('!votekick')) {

    handleVoteKick(message);
  }

  // mention.kick().then((member) => {
  //
  //   message.channel.send(`:wave: Goodbye ${mention.displayName}!`);
  // }).catch(() => {
  //
  //   message.channel.send('Unable to kick this user!');
  // });
});

function handleVoteKick(message) {

  if (!canInitiateKick(message.member)) {

    message.reply('You do not have sufficient permissions!');
    return;
  }

  const mention = message.mentions.members.first();
  const voiceChannel = message.member.voice.channel;

  if (mention && voiceChannel && voiceChannel.id === mention.voice.channel.id) {

    if (isKickable(mention)) {

      message.reply('This user cannot be kicked.');
      return;
    }

    const voteCount = 2; //Math.floor(message.member.voice.channel.members.array().length * 0.5) + 1;
    message.channel.send(`<@${message.author.id}> initiated a vote to kick <@${mention.user.id}>. React with :wave: to vote (${voteCount} needed).`)
    .then(function(message) {

      message.react(globals.emojis.wave);
      message.awaitReactions(reactionFilter, {time: globals.reactionTimeout, errors: ['time']})
      .then(function(collected) {

        message.channel.send(`The vote to kick has succeeded! ${getRandomFarewell()} ${mention.displayName}!`);
        // mention.kick().then((member) => {
        //
        //   message.channel.send(`The vote to kick has succeeded! ${getRandomFarewell()} ${mention.displayName}! :wave:`);
        // });
      })
      .catch(function(collected) {

        message.channel.send(`The vote to kick <@${mention.user.id}> failed. Received ${collected.size} out of ${voteCount}.`);
      });
    });
  }
  else
    message.reply('You must be in the same voice channel as this user.');
}

function canInitiateKick(member) {

  return member.roles.cache.find(role => globals.votekickRoles.includes(role.name)) !== undefined;
}

function isKickable(member) {

  return member.roles.cache.find(role => !globals.unkickableRoles.includes(role.name)) !== undefined;
}

function getRandomFarewell() {

  return globals.farewells[randomNumber(globals.farewells.length)];
}

function reactionFilter(reaction, user) {

  return globals.emojis.wave === reaction.emoji.name;
}

function randomNumber(max) {

  return Math.floor(Math.random() * max);
}

client.login(token);
