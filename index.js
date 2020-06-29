const discord = require('discord.js');
const globals = require('./globals.js');
const client = new discord.Client();

const token = 'NzI2MjcyNDg0ODAyMDM1ODIz.Xvd35g.I77fRxs4ZgUgZ-po0VdmO7Y6MgM';

client.on('ready', function() {

  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', function(message) {

  if (message.author.id === client.user.id)
    return;

  if (hasRole(message.member, 'Degenerate')) {

    message.reply('You do not have sufficient permissions!');
    return;
  }

  const mention = message.mentions.members.first();
  message.channel.send(`<@${message.author.id}> initiated a vote to kick <@${mention.user.id}>. React with :wave: to vote.`)
  .then(function(message) {

    const wave = client.emojis.find(emoji => emoji.name === 'wave');
    console.log(wave);
    message.react(wave.id);
  }).catch(() => { console.log('here'); });

  // mention.kick().then((member) => {
  //
  //   message.channel.send(`:wave: Goodbye ${mention.displayName}!`);
  // }).catch(() => {
  //
  //   message.channel.send('Unable to kick this user!');
  // });
});

function hasRole(member, rolename) {

  return member.roles.cache.find(role => role.name === rolename) !== undefined;
}

client.login(token);
