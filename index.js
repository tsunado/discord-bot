require('dotenv').config();

const discord = require('discord.js');
const globals = require('./globals.js');
const client = new discord.Client();

client.on('ready', function() {

  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', function(message) {

  if (message.content.startsWith('!votekick')) {

    handleVoteKick(message);
    return;
  }

  if (message.content.startsWith('!mystream')) {

    handleStream(message);
    return;
  }
});

function handleVoteKick(message) {

  if (!canInitiateKick(message.member)) {

    message.reply('You do not have sufficient permissions!');
    return;
  }

  const mention = message.mentions.members.first();
  const voiceChannel = message.member.voiceChannel;

  if (mention && voiceChannel && mention.voiceChannel && voiceChannel.id === mention.voiceChannel.id) {

    if (isNotKickable(mention)) {

      message.reply('This user cannot be kicked.');
      return;
    }

    const voteCount = Math.ceil(message.member.voice.channel.members.array().length * 0.5);
    message.channel.send(`<@${message.author.id}> initiated a vote to kick <@${mention.user.id}>. React with :wave: to vote (${voteCount} needed).`)
    .then(function(message) {

      const filter = (reaction, user) => {

        return globals.emojis.wave === reaction.emoji.name && user.id !== message.author.id;
      }

      message.react(globals.emojis.wave);
      message.awaitReactions(filter, {max: voteCount, time: globals.reactionTimeout, errors: ['time']})
      .then(function(collected) {

        const reaction = collected.first();
        mention.kick().then((member) => {

          message.channel.send(`The vote to kick has succeeded! ${getRandomFarewell()} ${mention.displayName}! :wave:`);
        });
      })
      .catch(function(collected) {

        message.channel.send(`The vote to kick <@${mention.user.id}> failed. Received ${collected.size} out of ${voteCount}.`);
      });
    });
  }
  else
    message.reply('You must be in the same voice channel as this user.');
}

function handleStream(member) {

  console.log('Implement this.');
}

function canInitiateKick(member) {

  return member.roles.find(role => globals.votekickRoles.includes(role.name)) !== null;
}

function isNotKickable(member) {

  return member.roles.find(role => globals.unkickableRoles.includes(role.name)) !== null;
}

function getRandomFarewell() {

  return globals.farewells[randomNumber(globals.farewells.length)];
}

function randomNumber(max) {

  return Math.floor(Math.random() * max);
}

client.login(process.env.TOKEN);
