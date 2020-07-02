let globals = require('./globals.js');
let random = require('./random.js');

let votekick = {};

votekick.handleVoteKick = function(client, message) {

  if (!votekick.canInitiateKick(message.member)) {

    message.reply('You do not have sufficient permissions!');
    return;
  }

  const mention = message.mentions.members.first();
  const voiceChannel = message.member.voiceChannel;

  if (mention && voiceChannel && mention.voiceChannel && voiceChannel.id === mention.voiceChannel.id) {

    if (votekick.isNotKickable(mention)) {

      message.reply('This user cannot be kicked.');
      return;
    }

    const voteCount = Math.ceil(voiceChannel.members.array().length * 0.5);
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

          message.channel.send(`The vote to kick has succeeded! ${random.getRandomFarewell()} ${mention.displayName}! :wave:`);
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

votekick.canInitiateKick = function(member) {

  return member.roles.find(role => globals.votekickRoles.includes(role.name)) !== null;
}

votekick.isNotKickable = function(member) {

  return member.roles.find(role => globals.unkickableRoles.includes(role.name)) !== null;
}

module.exports = votekick;
